# gititregev.info

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
claude mcp add --transport http gitit-resume https://gititregev.info/api/mcp
```

## Deploy (Vercel)

1. Push to GitHub and import the repo in Vercel (framework preset: **Vite**).
   `vercel.json` sets the output directory to `build`.
2. Set environment variables:
   - `ANTHROPIC_API_KEY` — Anthropic API key (server-side only)
   - `ALLOWED_ORIGIN` — `https://gititregev.info`
3. Add the custom domain `gititregev.info` (+ `www` redirect) and point DNS at
   Vercel.

The chat function streams from a Node serverless function
([`api/chat.ts`](api/chat.ts)) with per-IP rate limiting and an origin
allowlist; the MCP server is [`api/mcp.ts`](api/mcp.ts).
