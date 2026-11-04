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
 *
 * LANGUAGE POLICY — owner ruling 2026-09-07, verbatim: "לא, שיווקי זה שיווקי".
 * The `tagline` of every project stays ENGLISH on the Hebrew page too. It was
 * offered for translation alongside the CV and capability copy and she declined:
 * these are marketing lines, and she wants them to read as marketing lines in
 * one voice. This is now a DECISION, not an untranslated gap — earlier notes in
 * i18n/types.ts asserted "English by design" with nothing behind it. Do not add
 * these to i18n/content-he.ts, and do not re-open it without asking her.
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
  /**
   * The project's own page inside this site, as a plain path (e.g.
   * `/wildhearth`). Only set once that page really exists — see
   * data/project-pages-content.ts (wave 1, 2026-11-04). The old
   * `#/case/<slug>` plan is retired: there is no hash router.
   */
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
    stateLabel: 'In development — private preview (password-protected)',
    year: '2026',
    caseRoute: '/wildhearth',
    capabilities: ['TypeScript', 'AI-agent workflow', 'Browser automation', 'Canvas rendering', 'AI pixel art'],
  },
  {
    slug: 'mfl',
    // 2026-11-04: shown under its real brand. "MFL" (My Fanfic's Library) was
    // the 2019 name; the site is "Shipping the Rainbow" since 2026-08-18
    // (repo my_fanfic_lybrary_site, client/src/lib/gates.ts). Slug stays.
    name: 'Shipping the Rainbow',
    tagline: "The home of gay women couples' fanfics.",
    state: 'in-development',
    stateLabel: 'Live, sign-in only: hand-coded original (2019), rebuilt with AI agents (2026)',
    year: '2019–2026',
    // Wave 2 (2026-11-04): its own page inside the site. No external link:
    // the live site is sign-in only with no demo account.
    caseRoute: '/shipping-the-rainbow',
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
    // 2026-11-04: the old line named the child's age. Owner rule for this
    // project (projects-list-2026-11-04): never his age, nothing developmental.
    tagline: "Hebrew learning games for kids who can't read yet — no clocks, no failure states.",
    state: 'live',
    stateLabel: 'Live — open to everyone',
    year: '2026',
    externalLink: 'https://assaf.gititregev.com',
    caseRoute: '/friends-world',
    capabilities: ['TypeScript', 'React', 'AI-agent workflow', 'PWA', 'Hebrew RTL', 'Three.js 3D'],
  },
  {
    slug: 'homebase',
    name: 'Homebase',
    // 2026-11-04: "family debt tracking" dropped from the tagline. It was a
    // separate app until July 2026, then became the debts module inside the
    // finance app (archived 2026-09-26). The CV bullet in experience.ts that
    // names it is historical and stays.
    tagline: 'Personal Hebrew apps — budget, tasks, recipes, media — one sign-in, one design system.',
    state: 'local',
    stateLabel: 'Personal use — not open to the public',
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
