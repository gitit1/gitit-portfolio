# gititregev.com

Personal site for **Gitit Regev — AI Product Builder**. A modern, AI-native
portfolio: a live "Ask my AI about me" chat grounded in the resume, plus a
machine-readable layer (a resume-as-MCP-server, `llms.txt`, and a JSON Resume)
so agents can consume it directly.

Built with **Vite + React + TypeScript + SCSS**, deployed to **Vercel**.

## Develop

```bash
npm install
npm run dev        # http://localhost:3012
npm run build      # runs prebuild (generates llms.txt + resume.json) then vite build -> build/
npm run lint
npm run generate   # regenerate public/llms.txt + public/resume.json on demand
```

The whole site is data-driven from [`src/data/`](src/data/) — edit those files
and the UI, chat prompt, MCP tools, `llms.txt`, and `resume.json` all update:

| File | Purpose |
| --- | --- |
| `src/data/profile.ts` | Identity, positioning, links |
| `src/data/skills.ts` | Capability matrix (AI / engineering / product) |
| `src/data/experience.ts` | Work timeline |
| `src/data/projects.ts` | Projects (add a Homebase app = add one object) |
| `src/data/resume.ts` | Aggregator: Markdown resume, chat system prompt, JSON Resume, llms.txt |

## AI endpoints

| Endpoint | What it is |
| --- | --- |
| `POST /api/chat` | Streaming chat grounded in the resume (Anthropic `claude-haiku-4-5`) |
| `GET /api/mcp` | Remote MCP server — tools: `get_resume`, `get_profile`, `get_experience`, `get_projects`, `get_skills` |
| `/resume.json` | JSON Resume (generated at build) |
| `/llms.txt` | llms.txt guide for LLMs (generated at build) |

Connect the MCP server to Claude Code:

```bash
claude mcp add --transport http gitit-resume https://gititregev.com/api/mcp
```

## Deploy

The app is host-portable: a static Vite build (`build/`) plus web-standard
serverless functions. It ships with config for both Netlify and Vercel, so it
can move between them (or to Cloudflare / a Node server) with little change.

### Netlify (primary)

1. In Netlify: **Add new project → Import an existing project → GitHub**, pick
   this repo. Netlify reads [`netlify.toml`](netlify.toml) (build `npm run build`,
   publish `build`, functions in `netlify/functions/`).
2. Set environment variables (Site configuration → Environment variables):
   - `ANTHROPIC_API_KEY` — Anthropic API key (server-side only)
   - `ALLOWED_ORIGIN` — the site's URL, e.g. `https://gititregev.com` (or the
     `*.netlify.app` URL until the custom domain is attached)
3. Deploy. The functions are routed to `/api/chat` and `/api/mcp` via each
   function's `config.path`.

### Self-hosted (Docker / Coolify)

The repo also ships a plain Node server ([`server/index.ts`](server/index.ts))
that serves `build/` and routes `/api/chat` + `/api/mcp` to the *same* handlers
in [`api/`](api/) through a Node -> web-standard adapter (streaming preserved).
`npm run build:server` bundles it — every dependency inlined — into a single
`dist-server/index.mjs`, and the [`Dockerfile`](Dockerfile) is a two-stage build
whose runtime image contains only `build/` + `dist-server/` (no `node_modules`).

In Coolify: **New resource -> Private Repository**, pick this repo, then

| Setting | Value |
| --- | --- |
| Build pack | `Dockerfile` |
| Dockerfile location | `/Dockerfile` |
| Ports exposes | `3000` |
| Health check path | `/healthz` |
| Static site | off — this is a Node app, not a static bundle |

Environment variables:

- `ANTHROPIC_API_KEY` — **required** for `/api/chat`. Without it the chat
  endpoint answers `500 {"error":"Server not configured"}` and everything else
  on the site still works.
- `ALLOWED_ORIGIN` — optional extra origin for the chat allowlist.
  `gititregev.com`, `www.gititregev.com`, `localhost` and same-origin requests
  are accepted without it.
- `PORT` — optional, defaults to `3000`.

Locally:

```bash
docker build -t gititregev-site .
docker run --rm -p 3000:3000 -e ANTHROPIC_API_KEY=sk-... gititregev-site

# or without Docker
npm run build && npm run build:server && npm start
```

Run it behind a proxy that sets `X-Forwarded-Proto`, `X-Forwarded-Host` and
`X-Forwarded-For` (Coolify's Traefik does): the server derives the public
request URL from them, and the chat rate-limiter keys on `X-Forwarded-For`.
That rate limit is per process, so it resets on every redeploy.

### Vercel (alternative)

Import the repo (framework preset **Vite**); [`vercel.json`](vercel.json) sets
the output directory to `build`. Same two env vars. Functions live in `api/`.

The Netlify functions ([`netlify/functions/`](netlify/functions/)) are thin
wrappers that reuse the same handlers in [`api/`](api/) — one implementation,
two hosts. The chat handler streams from Anthropic with per-IP rate limiting and
an origin allowlist ([`api/chat.ts`](api/chat.ts)); the MCP server is
[`api/mcp.ts`](api/mcp.ts).
