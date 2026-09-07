// Capability matrix — the "What I bring" section.
// Node-safe. Grouped so the UI can render columns and the chat/MCP layer can
// describe strengths without parsing prose.
//
// English is the source of truth here: api/mcp.ts, data/resume.ts (JSON Resume
// + llms.txt) and the grounded chat all read this file and must stay English.
// The Hebrew rendering of `name`/`blurb` lives in i18n/content-he.ts, keyed by
// `id` below.

export type CapabilityGroup = 'ai' | 'engineering' | 'product';

/**
 * Stable, language-independent identity for a capability. Used as the React
 * key and as the key into the Hebrew overlay, so the union is exhaustive:
 * adding a capability here fails the build until i18n/content-he.ts has its
 * Hebrew — which is the point. Never derive it from `name` (that is copy).
 */
export type CapabilityId =
  | 'agents'
  | 'mcp'
  | 'prompt'
  | 'evals'
  | 'strategy'
  | 'react'
  | 'node'
  | 'data'
  | 'solo'
  | 'product-thinking'
  | 'empathy'
  | 'roadmap';

export type Capability = {
  id: CapabilityId;
  group: CapabilityGroup;
  name: string;
  blurb: string;
};

export const groupMeta: Record<CapabilityGroup, { label: string; tagline: string }> = {
  ai: {
    label: 'AI',
    tagline: 'Building with LLMs, end to end.',
  },
  engineering: {
    label: 'Engineering',
    tagline: 'A decade of shipping production web apps.',
  },
  product: {
    label: 'Product',
    tagline: 'Deciding what to build and why.',
  },
};

export const capabilities: Capability[] = [
  // AI
  {
    id: 'agents',
    group: 'ai',
    name: 'Agents & agentic workflows',
    blurb: 'Design and ship multi-step LLM workflows and tool-using agents that do real work.',
  },
  {
    id: 'mcp',
    group: 'ai',
    name: 'MCP servers',
    blurb: 'Build Model Context Protocol servers so agents can safely plug into data and tools — including this site.',
  },
  {
    id: 'prompt',
    group: 'ai',
    name: 'Prompt engineering',
    blurb: 'Structured system prompts, few-shot design and context engineering that hold up in production.',
  },
  {
    id: 'evals',
    group: 'ai',
    name: 'Evals & quality',
    blurb: 'Measure LLM output with evals and guardrails instead of vibes, and iterate on what the numbers show.',
  },
  {
    id: 'strategy',
    group: 'ai',
    name: 'LLM product strategy',
    blurb: 'Spot where AI actually adds value, scope it, and ship a first version fast.',
  },
  // Engineering
  {
    id: 'react',
    group: 'engineering',
    name: 'React & TypeScript',
    blurb: 'Ten years of frontend — React, MobX, TypeScript, SCSS — on real products used by real teams.',
  },
  {
    id: 'node',
    group: 'engineering',
    name: 'Node & serverless',
    blurb: 'APIs, streaming backends and serverless functions (this site runs its own).',
  },
  {
    id: 'data',
    group: 'engineering',
    name: 'Data & scraping',
    blurb: 'Modelled and scraped large datasets (MongoDB, MySQL) for products that needed them.',
  },
  {
    id: 'solo',
    group: 'engineering',
    name: 'Ships solo',
    blurb: 'Comfortable owning a product from empty repo to deployed, domain and all.',
  },
  // Product
  {
    id: 'product-thinking',
    group: 'product',
    name: 'Product thinking',
    blurb: 'Years partnering with Product at Browzwear — I frame problems, not just tickets.',
  },
  {
    id: 'empathy',
    group: 'product',
    name: 'User empathy',
    blurb: 'I build the things I wish existed; my biggest project started as a tool for myself.',
  },
  {
    id: 'roadmap',
    group: 'product',
    name: 'Roadmap to release',
    blurb: 'Translate a fuzzy idea into scope, iterations and a shipped release.',
  },
];
