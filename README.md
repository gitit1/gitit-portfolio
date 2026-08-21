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

### Vercel (alternative)

Import the repo (framework preset **Vite**); [`vercel.json`](vercel.json) sets
the output directory to `build`. Same two env vars. Functions live in `api/`.

The Netlify functions ([`netlify/functions/`](netlify/functions/)) are thin
wrappers that reuse the same handlers in [`api/`](api/) — one implementation,
two hosts. The chat handler streams from Anthropic with per-IP rate limiting and
an origin allowlist ([`api/chat.ts`](api/chat.ts)); the MCP server is
[`api/mcp.ts`](api/mcp.ts).
