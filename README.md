# gititregev.com

Personal site of **Gitit Regev — AI Product Builder**. Live at
**[gititregev.com](https://gititregev.com)**.

It is a portfolio that is itself an AI product: the resume is a single source of
data that renders the page, grounds a live chat about her work, and is published
back out in machine-readable form — as a **remote MCP server**, an
**[llms.txt](https://gititregev.com/llms.txt)** guide and a
**[JSON Resume](https://gititregev.com/resume.json)** — so an agent can consume
it directly instead of scraping a page.

Bilingual (English / Hebrew with full RTL), light + dark, no CMS and no database:
**Vite + React + TypeScript + SCSS**, served by a small Node server in a
container.

```bash
npm install
npm run dev        # http://localhost:3012
npm run build      # prebuild (llms.txt + resume.json) -> vite build -> build/
npm run lint
```

## Content is data, not markup

Everything visible comes from [`src/data/`](src/data/). Edit a file there and the
UI, the chat's system prompt, the MCP tools, `llms.txt` and `resume.json` all
follow — there is no second copy to keep in sync.

| File | Purpose |
| --- | --- |
| `src/data/profile.ts` | Identity, positioning, links |
| `src/data/skills.ts` | Capability matrix (AI / engineering / product) |
| `src/data/experience.ts` | Work timeline |
| `src/data/projects.ts` | Projects — adding one is adding one object |
| `src/data/resume.ts` | Aggregator: Markdown resume, chat system prompt, JSON Resume, llms.txt |
| `src/i18n/` | The English and Hebrew dictionaries for the page chrome |

## The AI layer

| Endpoint | What it is |
| --- | --- |
| `POST /api/chat` | Streaming chat grounded in the resume (Anthropic `claude-haiku-4-5`), origin-allowlisted and rate-limited |
| `GET /api/mcp` | Remote MCP server — tools: `get_resume`, `get_profile`, `get_experience`, `get_projects`, `get_skills` |
| `/resume.json` | JSON Resume, generated at build time |
| `/llms.txt` | llms.txt guide for LLMs, generated at build time |

Point Claude Code at the live MCP server:

```bash
claude mcp add --transport http gitit-resume https://gititregev.com/api/mcp
```

The chat handler ([`api/chat.ts`](api/chat.ts)) is deliberately narrow: POST only,
requests must come from the site's own origin (or localhost in development),
messages are length-capped, history is truncated, and each IP gets 10 messages a
minute per process. Without an API key it answers
`500 {"error":"Server not configured"}` and every other part of the site keeps
working — the chat is additive, never load-bearing.

## Verification

Visual claims about this site are not accepted from reasoning — they are
rendered and measured. [`tools/site-verify/`](tools/site-verify/) holds the
harness: `verify-hero.cjs` (layout assertions), `measure-fills.cjs` (does each
section fit the viewport), `audit-contrast.cjs` (AA contrast in both themes) and
`audit-centering.cjs`. See [`tools/site-verify/README.md`](tools/site-verify/README.md).

## Running it anywhere

The app is intentionally host-portable: a static Vite build plus web-standard
handlers in [`api/`](api/) that every target reuses — one implementation, three
ways to run it.

### Container (how the live site runs)

[`server/index.ts`](server/index.ts) is a plain Node server that serves `build/`
with SPA fallback, exposes `/healthz`, and routes `/api/chat` + `/api/mcp` to the
same handlers in `api/` through a Node → web-standard adapter (streaming
preserved). `npm run build:server` bundles it — every dependency inlined — into a
single `dist-server/index.mjs`, and the [`Dockerfile`](Dockerfile) is a two-stage
build whose runtime image carries only `build/` + `dist-server/`, no
`node_modules`.

```bash
docker build -t gititregev-site .
docker run --rm -p 3000:3000 -e ANTHROPIC_API_KEY=sk-... gititregev-site

# or without Docker
npm run build && npm run build:server && npm start
```

The live site runs exactly this image on a private self-hosted server behind a
reverse proxy that terminates TLS. Behind a proxy, pass through
`X-Forwarded-Proto`, `X-Forwarded-Host` and `X-Forwarded-For`: the server derives
the public request URL from them, and the chat rate-limiter keys on the client
IP. That rate limit is per process, so it resets on every restart.

Environment:

| Variable | Required | Meaning |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | for the chat | Server-side only, never exposed to the browser |
| `ALLOWED_ORIGIN` | no | One extra allowed origin; `gititregev.com`, `www.` and localhost are always accepted |
| `PORT` | no | Defaults to `3000` |

### Netlify or Vercel

Both are still wired and kept working, so the site can move hosts in an
afternoon. Netlify reads [`netlify.toml`](netlify.toml) (build `npm run build`,
publish `build/`, functions in [`netlify/functions/`](netlify/functions/) — thin
wrappers around the same `api/` handlers). Vercel reads
[`vercel.json`](vercel.json) with the framework preset **Vite** and runs `api/`
as functions directly. Same two environment variables on either.

## Licence

Personal project. The code is public to read; the content — the resume, the
copy, the imagery — is Gitit Regev's.
