/**
 * Portfolio registry — the four current public/active projects, for the
 * rotating project spotlight (built on top of this data in a follow-up
 * work package). This file is additive: it does NOT replace or feed
 * `src/data/projects.ts`, which still powers the existing Projects section.
 */

export type ProjectState = 'live' | 'in-development' | 'local';

export type PortfolioProject = {
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
  art?: { src: string; alt: string };
};

function artUrl(slug: string, file: string): string {
  return new URL(`../styles/assets/portfolio/${slug}/${file}`, import.meta.url).href;
}

export const portfolio: PortfolioProject[] = [
  {
    slug: 'wildhearth',
    name: 'Wildhearth',
    tagline: 'A little farm, a whole life.',
    state: 'in-development',
    stateLabel: 'In development — playable build, local only',
    year: '2026',
    caseRoute: '#/case/wildhearth',
    art: {
      src: artUrl('wildhearth', 'title-vista.png'),
      alt: "Wildhearth's in-game title screen: a pixel-art farmhouse on a hillside at sunset.",
    },
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
    art: {
      src: artUrl('mfl', 'hero.jpg'),
      alt: "My Fanfic's Library homepage: fandoms overview and latest-updates dashboard.",
    },
  },
  {
    slug: 'assaf-friends-games',
    name: "Assaf's Friends World",
    tagline: 'Hebrew learning games for a 4-year-old — no clocks, no failure states.',
    state: 'live',
    stateLabel: 'Live — mid-renovation',
    year: '2026',
    externalLink: 'https://assaf-friends-games.netlify.app',
    art: {
      src: artUrl('assaf-friends-games', 'icon-512.png'),
      alt: 'App icon for עולם החברים (Friends World): a smiling number-friend character.',
    },
  },
  {
    slug: 'homebase',
    name: 'Homebase',
    tagline: 'A local suite of Hub-integrated apps — finance, family debt tracking, and shared components.',
    state: 'local',
    stateLabel: 'Local — internal app suite, no public deployment',
    year: '2026',
    art: {
      src: artUrl('homebase', 'icon.png'),
      alt: 'Homebase Hub app icon: two interlocking rings.',
    },
  },
];
