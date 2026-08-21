/**
 * Portfolio content — the honest project facts (name, tagline, state, year,
 * links), with NO asset imports. This split exists purely for Node safety:
 * `data/resume.ts` carries a hard rule (see its own header comment) to stay
 * loadable under plain Node — it runs in the build-time static generator
 * (scripts/generate-static.mts, via `tsx`, no Vite asset pipeline) and in
 * Vercel serverless functions (api/mcp.ts, api/chat.ts). A static image
 * import at module scope (`import x from '*.png'`) is fine under Vite but
 * throws under plain Node/tsx (`ERR_UNKNOWN_FILE_EXTENSION`) — confirmed
 * while wiring resume.ts to the new registry.
 *
 * `data/portfolio.ts` is the one true registry for every browser-rendered
 * component (ProjectSpotlight.tsx, Projects.tsx) — it imports this file and
 * layers the real art on top. Node-safe consumers (resume.ts, api/mcp.ts)
 * should import THIS file directly instead, since they only need the facts
 * below, never the art.
 */

export type ProjectState = 'live' | 'in-development' | 'local';

export type PortfolioProjectContent = {
  /** Stable identifier, also used as the art sub-folder name. */
  slug: string;
  name: string;
  /** One short line — what the project is. */
  tagline: string;
  state: ProjectState;
  /** Honest, human-readable version of `state` for display. */
  stateLabel: string;
  year: string;
  /** Only set when a real, public URL exists. */
  externalLink?: string;
  /** Only set for projects that have a case-study page planned. */
  caseRoute?: string;
  /**
   * The real capabilities this project exercises — evidence-verified
   * against the actual repos (see G4-B1 read-only sweep), not aspirational
   * copy. Strings match character-for-character across projects on purpose:
   * a shared string (e.g. "TypeScript") is what lets the capability graph
   * (components/sections/ProjectsGraph.tsx) draw one shared node with edges
   * to every project that uses it, instead of near-duplicate nodes. Not
   * wired into resume.ts / api/mcp.ts yet — flagged separately as a
   * follow-up, not part of this work package.
   */
  capabilities: string[];
};

export const portfolioContent: PortfolioProjectContent[] = [
  {
    slug: 'wildhearth',
    name: 'Wildhearth',
    tagline: 'A little farm, a whole life.',
    state: 'in-development',
    stateLabel: 'In development — playable build, local only',
    year: '2026',
    caseRoute: '#/case/wildhearth',
    capabilities: ['TypeScript', 'AI-agent workflow', 'Browser automation', 'Canvas rendering', 'AI pixel art'],
  },
  {
    slug: 'mfl',
    name: 'MFL',
    tagline: "The home of gay women couples' fanfics.",
    state: 'in-development',
    stateLabel: 'In renovation — hand-coded original (2019/2020), AI-managed rebuild underway (2026)',
    year: '2019–2026',
    caseRoute: '#/case/mfl',
    capabilities: [
      'TypeScript',
      'React',
      'AI-agent workflow',
      'MCP server',
      'Browser automation',
      'Node backend',
      'MongoDB',
    ],
  },
  {
    slug: 'assaf-friends-games',
    name: "Assaf's Friends World",
    tagline: 'Hebrew learning games for a 4-year-old — no clocks, no failure states.',
    state: 'live',
    stateLabel: 'Live — mid-renovation',
    year: '2026',
    externalLink: 'https://assaf.gititregev.com',
    capabilities: ['TypeScript', 'React', 'AI-agent workflow', 'PWA', 'Hebrew RTL', 'Three.js 3D'],
  },
  {
    slug: 'homebase',
    name: 'Homebase',
    tagline: 'A local suite of Hub-integrated apps — finance, family debt tracking, and shared components.',
    state: 'local',
    stateLabel: 'Local — internal app suite, no public deployment',
    year: '2026',
    capabilities: [
      'TypeScript',
      'React',
      'AI-agent workflow',
      'MCP server',
      'Node backend',
      'Next.js',
      'OIDC auth',
    ],
  },
];
