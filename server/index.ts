/**
 * Self-hosted Node server (Coolify / Docker / any plain Node host).
 *
 * Serves the static Vite build in `build/` with an SPA fallback, and routes
 * `/api/chat` + `/api/mcp` to the SAME web-standard handlers that Netlify and
 * Vercel use (`api/chat.ts`, `api/mcp.ts`) through a small Node -> fetch
 * adapter. Those handlers stay host-agnostic: nothing here is imported by them.
 *
 * Zero runtime dependencies beyond what the handlers already pull in — this
 * file only uses `node:*` builtins plus the global `Request`/`Response`.
 *
 * Build: `npm run build:server` bundles this + the handlers into a single
 * `dist-server/index.mjs`. Run: `npm start` (or `node dist-server/index.mjs`).
 */
import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';

import chatHandler from '../api/chat';
import mcpHandler from '../api/mcp';

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

// `build/` sits next to this file's parent in both layouts:
//   repo/server/index.ts      -> repo/build
//   repo/dist-server/index.mjs -> repo/build   (and /app/build in the image)
const BUILD_DIR = resolve(
  process.env.BUILD_DIR || join(dirname(fileURLToPath(import.meta.url)), '..', 'build')
);

const MAX_BODY_BYTES = 1024 * 1024; // 1 MB is plenty for chat + MCP JSON-RPC.

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

// Hop-by-hop headers must not be forwarded into the fetch Request.
const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

function contentTypeFor(filePath: string): string {
  return CONTENT_TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream';
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
    'cache-control': 'no-store',
  });
  res.end(payload);
}

function sendText(res: ServerResponse, status: number, body: string): void {
  res.writeHead(status, {
    'content-type': 'text/plain; charset=utf-8',
    'content-length': Buffer.byteLength(body),
  });
  res.end(body);
}

/* ------------------------------------------------------------------ static */

/**
 * Resolve a URL pathname to an absolute path inside BUILD_DIR, or null when it
 * escapes the root (path traversal), contains a NUL byte, or is undecodable.
 */
function safeResolve(pathname: string): string | null {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  if (decoded.includes('\0')) return null;

  // Normalize away `.`/`..` segments and backslashes, then re-anchor at root.
  const normalized = normalize(decoded.replace(/\\/g, '/'));
  const target = resolve(join(BUILD_DIR, normalized));
  if (target !== BUILD_DIR && !target.startsWith(BUILD_DIR + sep)) return null;
  return target;
}

function cacheControlFor(pathname: string, filePath: string): string {
  if (pathname.startsWith('/assets/')) return 'public, max-age=31536000, immutable';
  if (extname(filePath).toLowerCase() === '.html') return 'no-cache';
  return 'public, max-age=3600';
}

async function statFile(filePath: string): Promise<{ size: number; mtimeMs: number } | null> {
  try {
    const info = await stat(filePath);
    return info.isFile() ? { size: info.size, mtimeMs: info.mtimeMs } : null;
  } catch {
    return null;
  }
}

async function serveFile(
  req: IncomingMessage,
  res: ServerResponse,
  filePath: string,
  pathname: string,
  status = 200
): Promise<boolean> {
  const info = await statFile(filePath);
  if (!info) return false;

  const etag = `W/"${info.size.toString(16)}-${Math.floor(info.mtimeMs).toString(16)}"`;
  const headers: Record<string, string> = {
    'content-type': contentTypeFor(filePath),
    'content-length': String(info.size),
    'cache-control': cacheControlFor(pathname, filePath),
    etag,
    'last-modified': new Date(info.mtimeMs).toUTCString(),
    'x-content-type-options': 'nosniff',
  };

  if (status === 200 && req.headers['if-none-match'] === etag) {
    res.writeHead(304, { etag, 'cache-control': headers['cache-control'] });
    res.end();
    return true;
  }

  if (req.method === 'HEAD') {
    res.writeHead(status, headers);
    res.end();
    return true;
  }

  res.writeHead(status, headers);
  try {
    await pipeline(createReadStream(filePath), res);
  } catch {
    res.destroy();
  }
  return true;
}

/* ----------------------------------------------------------------- adapter */

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolvePromise, rejectPromise) => {
    const chunks: Buffer[] = [];
    let total = 0;
    req.on('data', (chunk: Buffer) => {
      total += chunk.length;
      if (total > MAX_BODY_BYTES) {
        rejectPromise(new Error('Request body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolvePromise(Buffer.concat(chunks)));
    req.on('error', rejectPromise);
  });
}

function firstHeader(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/** Build a web-standard Request from the Node request (body buffered). */
async function toWebRequest(req: IncomingMessage): Promise<Request> {
  const forwardedProto = firstHeader(req.headers['x-forwarded-proto'])?.split(',')[0]?.trim();
  const forwardedHost = firstHeader(req.headers['x-forwarded-host'])?.split(',')[0]?.trim();
  const proto = forwardedProto || 'http';
  const host = forwardedHost || req.headers.host || `localhost:${PORT}`;
  const url = `${proto}://${host}${req.url || '/'}`;

  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (name.startsWith(':') || HOP_BY_HOP.has(name)) continue;
    if (Array.isArray(value)) for (const v of value) headers.append(name, v);
    else headers.set(name, value);
  }

  // The chat rate-limiter reads x-forwarded-for; behind Traefik/Coolify the
  // proxy sets it. Direct hits (or a proxy that doesn't) fall back to the peer.
  if (!headers.has('x-forwarded-for') && req.socket.remoteAddress) {
    headers.set('x-forwarded-for', req.socket.remoteAddress);
  }
  // `host` must reflect the public host: api/chat.ts compares Origin against it.
  headers.set('host', host);

  const method = (req.method || 'GET').toUpperCase();
  const init: RequestInit = { method, headers };
  if (method !== 'GET' && method !== 'HEAD') {
    const body = await readBody(req);
    if (body.length > 0) init.body = body;
  }
  return new Request(url, init);
}

/** Write a web-standard Response to the Node response, streaming the body. */
async function writeWebResponse(res: ServerResponse, response: Response): Promise<void> {
  const headers: Record<string, string | string[]> = {};
  response.headers.forEach((value, key) => {
    if (key === 'set-cookie') return;
    headers[key] = value;
  });
  const setCookie =
    typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : [];
  if (setCookie.length > 0) headers['set-cookie'] = setCookie;

  res.writeHead(response.status, headers);
  res.flushHeaders();

  if (!response.body) {
    res.end();
    return;
  }

  const reader = response.body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value && value.byteLength > 0) {
        // One flush per chunk keeps the chat stream token-by-token.
        res.write(Buffer.from(value.buffer, value.byteOffset, value.byteLength));
      }
    }
    res.end();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[server] stream error', err);
    res.destroy();
  } finally {
    reader.releaseLock?.();
  }
}

type WebHandler = (req: Request) => Promise<Response> | Response;

async function handleApi(
  req: IncomingMessage,
  res: ServerResponse,
  handler: WebHandler
): Promise<void> {
  let webRequest: Request;
  try {
    webRequest = await toWebRequest(req);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[server] request adapt error', err);
    sendJson(res, 413, { error: 'Request body too large' });
    return;
  }

  try {
    const response = await handler(webRequest);
    await writeWebResponse(res, response);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[server] api handler error', err);
    if (!res.headersSent) sendJson(res, 500, { error: 'Internal server error' });
    else res.destroy();
  }
}

/* ------------------------------------------------------------------ router */

async function route(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const rawUrl = req.url || '/';
  const pathname = rawUrl.split('?')[0].split('#')[0];
  const method = (req.method || 'GET').toUpperCase();

  if (pathname === '/healthz') {
    if (method !== 'GET' && method !== 'HEAD') {
      sendJson(res, 405, { error: 'Method not allowed' });
      return;
    }
    sendJson(res, 200, { ok: true });
    return;
  }

  if (pathname === '/api/chat') {
    await handleApi(req, res, chatHandler);
    return;
  }
  if (pathname === '/api/mcp') {
    await handleApi(req, res, mcpHandler as unknown as WebHandler);
    return;
  }
  if (pathname === '/api' || pathname.startsWith('/api/')) {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }

  if (method !== 'GET' && method !== 'HEAD') {
    sendText(res, 405, 'Method Not Allowed');
    return;
  }

  const target = safeResolve(pathname);
  if (target === null) {
    sendText(res, 400, 'Bad Request');
    return;
  }

  // Exact file first (also handles `/dir/` -> `/dir/index.html`).
  const candidate = pathname.endsWith('/') ? join(target, 'index.html') : target;
  if (await serveFile(req, res, candidate, pathname)) return;

  // SPA fallback: extensionless paths render the app shell.
  if (extname(pathname) === '') {
    if (await serveFile(req, res, join(BUILD_DIR, 'index.html'), '/index.html')) return;
  }

  sendText(res, 404, 'Not Found');
}

/* ------------------------------------------------------------------ server */

const server = createServer((req, res) => {
  route(req, res).catch((err) => {
    // eslint-disable-next-line no-console
    console.error('[server] unhandled', err);
    if (!res.headersSent) sendJson(res, 500, { error: 'Internal server error' });
    else res.destroy();
  });
});

server.keepAliveTimeout = 65_000;
server.headersTimeout = 70_000;
// Long-lived streaming responses (chat) must not be cut by the default timeout.
server.requestTimeout = 0;

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(
    `[server] gititregev.com listening on http://${HOST}:${PORT} — static ${BUILD_DIR} — health /healthz`
  );
});

function shutdown(signal: string): void {
  // eslint-disable-next-line no-console
  console.log(`[server] ${signal} received, closing`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.error('[server] unhandledRejection', err);
});
