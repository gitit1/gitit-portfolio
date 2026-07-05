// Single source of truth for identity/positioning.
// Node-safe: no browser globals, no asset imports. Consumed by UI, chat prompt,
// MCP tools, resume.json and llms.txt generation.

export type Link = {
  label: string;
  href: string;
  handle?: string;
};

export const profile = {
  name: 'Gitit Regev',
  title: 'AI Product Builder',
  tagline: 'From product strategy to shipped AI agents.',
  // Rotating hero phrases — the streaming-text line cycles through these.
  heroPhrases: [
    'ships AI agents',
    'builds MCP servers',
    'turns specs into products',
    'writes the code and the roadmap',
  ],
  location: 'Israel',
  // Positioning paragraph — used in the hero intro, chat system prompt, and llms.txt summary.
  summary:
    'I am a full-stack developer turned AI Product Builder. After a decade shipping React and Node products, I now design and build with LLMs end to end — agentic workflows, MCP servers, prompt systems and evals — and I still write the code myself. I think like a PM about what to build and why, and I execute like an engineer to make it real.',
  // A tighter one-liner for meta descriptions and cards.
  blurb:
    'AI Product Builder — PM thinking, developer execution. I design and ship LLM products, agents and MCP servers.',
  headshot: 'home/gitit.jpg',
  email: 'gititregev1@gmail.com',
  links: {
    email: {
      label: 'Email',
      href: 'mailto:gititregev1@gmail.com',
      handle: 'gititregev1@gmail.com',
    },
    linkedin: {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/gitit-regev-aa6a4961/',
      handle: 'gitit-regev',
    },
    github: {
      label: 'GitHub',
      href: 'https://github.com/gitit1',
      handle: 'gitit1',
    },
  } satisfies Record<string, Link>,
  // Machine-readable endpoints this site exposes.
  site: {
    origin: 'https://gititregev.info',
    mcpUrl: 'https://gititregev.info/api/mcp',
    resumeJson: 'https://gititregev.info/resume.json',
    llmsTxt: 'https://gititregev.info/llms.txt',
    resumeDoc: '/files/resume-gitit-regev.docx',
  },
} as const;

export type Profile = typeof profile;
