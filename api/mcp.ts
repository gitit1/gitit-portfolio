// Vercel serverless function: remote MCP server exposing Gitit's resume as
// tools. Streamable HTTP transport, stateless (SSE disabled -> no Redis needed).
// Served at /api/mcp.
import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';
import { profile } from '../src/data/profile';
import { experiences } from '../src/data/experience';
import { projects, type ProjectCategory } from '../src/data/projects';
import { capabilities, groupMeta } from '../src/data/skills';
import { buildMarkdownResume } from '../src/data/resume';

const text = (value: string) => ({ content: [{ type: 'text' as const, text: value }] });

const handler = createMcpHandler(
  (server) => {
    server.tool(
      'get_resume',
      "Get Gitit Regev's full resume as Markdown (experience, skills, projects, contact).",
      {},
      async () => text(buildMarkdownResume())
    );

    server.tool(
      'get_profile',
      "Get Gitit Regev's headline, positioning summary, location and links.",
      {},
      async () =>
        text(
          JSON.stringify(
            {
              name: profile.name,
              title: profile.title,
              tagline: profile.tagline,
              summary: profile.summary,
              location: profile.location,
              links: profile.links,
            },
            null,
            2
          )
        )
    );

    server.tool(
      'get_experience',
      "Get Gitit Regev's work experience as structured data.",
      {},
      async () =>
        text(
          JSON.stringify(
            experiences.map((e) => ({
              company: e.company,
              role: e.role,
              period: e.period,
              current: e.current ?? false,
              highlights: e.bullets,
              link: e.link,
            })),
            null,
            2
          )
        )
    );

    server.tool(
      'get_projects',
      "Get Gitit Regev's projects. Optionally filter by category: ai, web, or homebase.",
      { category: z.enum(['ai', 'web', 'homebase']).optional() },
      async ({ category }: { category?: ProjectCategory }) => {
        const list = category ? projects.filter((p) => p.category === category) : projects;
        return text(
          JSON.stringify(
            list.map((p) => ({
              name: p.name,
              category: p.category,
              summary: p.summary,
              year: p.year,
              technologies: p.technologies,
              features: p.features,
              link: p.link,
              source: p.gitLink,
              builtWith: p.builtWith,
            })),
            null,
            2
          )
        );
      }
    );

    server.tool(
      'get_skills',
      "Get Gitit Regev's capability matrix (AI, engineering, product).",
      {},
      async () =>
        text(
          JSON.stringify(
            capabilities.map((c) => ({
              group: groupMeta[c.group].label,
              name: c.name,
              blurb: c.blurb,
            })),
            null,
            2
          )
        )
    );
  },
  {
    serverInfo: { name: 'gitit-resume', version: '1.0.0' },
  },
  {
    basePath: '/api',
    disableSse: true,
    verboseLogs: false,
  }
);

export default handler;
