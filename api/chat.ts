// Vercel serverless function: streaming "Ask my AI about me" chat.
// Web-standard Request -> Response(ReadableStream). Runs on the Node runtime.
import Anthropic from '@anthropic-ai/sdk';
import { buildChatSystemPrompt } from '../src/data/resume';

export const config = { maxDuration: 60 };

const MODEL = 'claude-haiku-4-5';
const MAX_TOKENS = 1024;
const MAX_MESSAGE_CHARS = 1000;
const MAX_HISTORY_TURNS = 8;

// Best-effort per-IP rate limit (per warm instance). Upstash is the upgrade path.
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; start: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(ip, { count: 1, start: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

// Canonical production hosts. Accepted even when ALLOWED_ORIGIN is unset, so
// production works out of the box on the real domain.
const PRODUCTION_HOSTS = new Set(['gititregev.com', 'www.gititregev.com']);

function originAllowed(req: Request): boolean {
  const origin = req.headers.get('origin') || req.headers.get('referer') || '';
  if (!origin) return false;

  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }

  // Local development.
  if (host.startsWith('localhost') || host.startsWith('127.0.0.1')) return true;

  // Canonical production domain, explicit — works even without ALLOWED_ORIGIN set.
  if (PRODUCTION_HOSTS.has(host)) return true;

  // Same-origin: the request came from the site that serves this function.
  // Works out of the box on *.netlify.app, a custom domain, or any host —
  // no env var required.
  const self = req.headers.get('host');
  if (self && host === self) return true;

  // Optional explicit allowlist (e.g. to permit an additional origin).
  const allowed = process.env.ALLOWED_ORIGIN;
  if (allowed) {
    try {
      if (host === new URL(allowed).host) return true;
    } catch {
      /* ignore malformed ALLOWED_ORIGIN */
    }
  }

  return false;
}

type IncomingMessage = { role: 'user' | 'assistant'; content: string };

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!originAllowed(req)) return json({ error: 'Forbidden' }, 403);

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) return json({ error: 'Rate limited' }, 429);

  let body: { messages?: IncomingMessage[] };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const messages = incoming
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_HISTORY_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));

  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return json({ error: 'A user message is required' }, 400);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json({ error: 'Server not configured' }, 500);

  const client = new Anthropic({ apiKey });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: buildChatSystemPrompt(),
          messages,
        });
        anthropicStream.on('text', (text) => {
          controller.enqueue(encoder.encode(text));
        });
        await anthropicStream.finalMessage();
        controller.close();
      } catch (err) {
        controller.enqueue(
          encoder.encode('\n[The assistant is unavailable right now. Please try again.]')
        );
        controller.close();
        // eslint-disable-next-line no-console
        console.error('chat error', err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-accel-buffering': 'no',
    },
  });
}
