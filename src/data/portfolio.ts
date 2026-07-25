/**
 * Portfolio registry — the four current public/active projects, for the
 * rotating project spotlight (built on top of this data in a follow-up
 * work package). This file is additive: it does NOT replace or feed
 * `src/data/projects.ts`, which still powers the existing Projects section.
 */

// Explicit per-file imports rather than the original `new URL(`...${a}/${b}`,
// import.meta.url)` helper. That helper DID resolve correctly under
// production build (verified: `vite build` emits all four files and the
// generated lookup map keys them right) — the two-dynamic-segment template
// was not actually the landmine it looked like. Switched anyway to the
// more legible, unambiguous form, since it was already suspect enough to
// need a full build+bundle audit once. One artifact from that audit worth
// noting for whoever touches this next: mfl/hero.jpg is byte-identical
// (same SHA256) to src/styles/assets/projects/mfl/1.JPG (the legacy
// Projects section's first gallery shot), so Rollup's content hashing
// legitimately collapses them into ONE physical output file — the built
// asset for hero.jpg is served under a filename inherited from the other
// reference (e.g. `1-<hash>.JPG`, not `hero-<hash>.jpg`). Same bytes, same
// image, correct behavior — do not "fix" this if you see it again.
import wildhearthArt from '../styles/assets/portfolio/wildhearth/title-vista.png';
import mflArt from '../styles/assets/portfolio/mfl/hero.jpg';
import assafFriendsGamesArt from '../styles/assets/portfolio/assaf-friends-games/icon-512.png';
import homebaseArt from '../styles/assets/portfolio/homebase/icon.png';

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
      src: wildhearthArt,
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
      src: mflArt,
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
      src: assafFriendsGamesArt,
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
      src: homebaseArt,
      alt: 'Homebase Hub app icon: two interlocking rings.',
    },
  },
];
