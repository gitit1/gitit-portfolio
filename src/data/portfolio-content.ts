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
  },
  {
    slug: 'mfl',
    name: 'MFL',
    tagline: "The home of gay women couples' fanfics.",
    state: 'live',
    stateLabel: 'Live — hand-coded original (2019/2020), AI-managed rebuild underway (2026)',
    year: '2019–2026',
    externalLink: 'http://www.myfanficslibrary.com',
    caseRoute: '#/case/mfl',
  },
  {
    slug: 'assaf-friends-games',
    name: "Assaf's Friends World",
    tagline: 'Hebrew learning games for a 4-year-old — no clocks, no failure states.',
    state: 'live',
    stateLabel: 'Live — mid-renovation',
    year: '2026',
    externalLink: 'https://assaf-friends-games.netlify.app',
  },
  {
    slug: 'homebase',
    name: 'Homebase',
    tagline: 'A local suite of Hub-integrated apps — finance, family debt tracking, and shared components.',
    state: 'local',
    stateLabel: 'Local — internal app suite, no public deployment',
    year: '2026',
  },
];
