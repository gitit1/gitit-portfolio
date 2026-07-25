/**
 * Portfolio registry — the four current public/active projects, art
 * included. Single source of truth for both the rotating hero spotlight
 * (ProjectSpotlight.tsx) and the full Projects index section
 * (components/sections/Projects.tsx). The legacy `src/data/projects.ts`
 * (2019/2020 project write-ups) has been retired — this registry replaced
 * it outright, it doesn't sit alongside it.
 *
 * The plain facts (name/tagline/state/year/links) live in
 * `portfolio-content.ts`, which has no asset imports — see that file's
 * header comment for why. This file only adds one thing on top: real art.
 * Node-safe consumers (data/resume.ts, api/mcp.ts) should import
 * `portfolio-content.ts` directly rather than this file.
 */

// Explicit per-file imports rather than the original `new URL(`...${a}/${b}`,
// import.meta.url)` helper. That helper DID resolve correctly under
// production build (verified: `vite build` emits all four files and the
// generated lookup map keys them right) — the two-dynamic-segment template
// was not actually the landmine it looked like. Switched anyway to the
// more legible, unambiguous form, since it was already suspect enough to
// need a full build+bundle audit once. (Historical note: mfl/hero.jpg used
// to be byte-identical to the legacy Projects section's
// src/styles/assets/projects/mfl/1.JPG, which made Rollup collapse the two
// into one output file under a filename inherited from the other
// reference. Now that the legacy gallery importer (old Projects.tsx) is
// gone — see G4-A2 — nothing references that file anymore, so hero.jpg
// gets its own hash again; verified in a production build.)
import wildhearthArt from '../styles/assets/portfolio/wildhearth/title-vista.png';
import mflArt from '../styles/assets/portfolio/mfl/hero.jpg';
import assafFriendsGamesArt from '../styles/assets/portfolio/assaf-friends-games/icon-512.png';
import homebaseArt from '../styles/assets/portfolio/homebase/icon.png';
import { portfolioContent, type ProjectState, type PortfolioProjectContent } from './portfolio-content';

export type { ProjectState };

export type PortfolioArt = {
  src: string;
  alt: string;
  /**
   * How the art fills its frame. Default is `cover` (scene/screenshot
   * art). Square app icons should crop badly in a wide 16/10 frame, so
   * they opt into `contain` instead — centered at reduced size on a
   * tinted backdrop rather than cropped edge-to-edge.
   */
  fit?: 'cover' | 'contain';
};

export type PortfolioProject = PortfolioProjectContent & {
  art?: PortfolioArt;
};

const art: Partial<Record<string, PortfolioArt>> = {
  wildhearth: {
    src: wildhearthArt,
    alt: "Wildhearth's in-game title screen: a pixel-art farmhouse on a hillside at sunset.",
  },
  mfl: {
    src: mflArt,
    alt: "My Fanfic's Library homepage: fandoms overview and latest-updates dashboard.",
  },
  'assaf-friends-games': {
    src: assafFriendsGamesArt,
    alt: 'App icon for עולם החברים (Friends World): a smiling number-friend character.',
    fit: 'contain',
  },
  homebase: {
    src: homebaseArt,
    alt: 'Homebase Hub app icon: two interlocking rings.',
    fit: 'contain',
  },
};

export const portfolio: PortfolioProject[] = portfolioContent.map((project) => ({
  ...project,
  art: art[project.slug],
}));

export type SpotlightTarget =
  | { kind: 'case'; href: string }
  | { kind: 'external'; href: string }
  | { kind: 'none' };

// Case-study pages are being planned (`caseRoute` below records the plan),
// but there is no hash router anywhere in this app today — verified
// `#/case/*` resolves to nothing at runtime. A case link only renders once
// its route actually ships: add the project's slug here when that happens.
// Until then, `resolveTarget` falls through past `caseRoute` to the
// project's real external link, then to no link at all.
const LIVE_CASE_ROUTES = new Set<string>([]);

// Click target resolution, in order: the project's own case-study page (only
// once its route is live — see LIVE_CASE_ROUTES), else its real external
// link, else no link at all (e.g. Homebase) — never an invented destination.
export function resolveTarget(project: PortfolioProjectContent): SpotlightTarget {
  if (project.caseRoute && LIVE_CASE_ROUTES.has(project.slug)) {
    return { kind: 'case', href: project.caseRoute };
  }
  if (project.externalLink) return { kind: 'external', href: project.externalLink };
  return { kind: 'none' };
}
