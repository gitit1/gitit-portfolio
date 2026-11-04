/**
 * Project pages — the art layer over data/project-pages-content.ts (which
 * holds the text and is Node-safe; see that file's header for the split).
 * Browser-only: imported by components/pages/ProjectPage.tsx.
 *
 * Every image here was LOOKED at before it was added (2026-11-04):
 * - Wildhearth: the title art + ten shots from the game's own illustrated
 *   guide (public/guide-img, captured 2026-10-07). Some carry the guide's
 *   numbered call-outs; all show only the game.
 * - Friends World: fresh captures of the public site
 *   https://assaf.gititregev.com (2026-11-04, phone 390x844 @2x and desktop
 *   1440x900), plus two shots of the 3D sorting game in development
 *   (assaf-friends-games-3d/shots). Never the potty or pacifier games.
 * Wave 2 (2026-11-04), each one looked at:
 * - Shipping the Rainbow: brand art ONLY, rendered from the project's own
 *   brand code (str-card.html + one card per gate). No screenshots: every
 *   real one shows TV stills, fic authors, uploaders or list names.
 * - Fanfic OS: one drawn diagram of how its parts connect. No saga text.
 * - Recipes: app-recipes playwright-shots/direction3-2026-10-06 (recipe
 *   titles from public sites only).
 * - My Files: RE-SHOT 2026-11-04 on neutral sample folders (documents,
 *   photos, videos, archive) with invented disk numbers; the app's own shots
 *   show the home server's real share names and the laptop's disk size.
 * - Premarket Lab: synthetic tickers only (SYN*, MKEEP, MEARLY), cropped so
 *   the "your trade" card never shows. Never a settings screen.
 */
import wildhearthTitle from '../styles/assets/portfolio/wildhearth/title-vista.png';
import whCharacter from '../styles/assets/portfolio/wildhearth/gallery/03-character-creation.jpg';
import whFarm from '../styles/assets/portfolio/wildhearth/gallery/05-farm-reveal.jpg';
import whPath from '../styles/assets/portfolio/wildhearth/gallery/06-choose-your-path.jpg';
import whMain from '../styles/assets/portfolio/wildhearth/gallery/08-main-screen.jpg';
import whFishing from '../styles/assets/portfolio/wildhearth/gallery/32-fishing-bite.jpg';
import whBusking from '../styles/assets/portfolio/wildhearth/gallery/41-busking.jpg';
import whField from '../styles/assets/portfolio/wildhearth/gallery/51-field-stages.jpg';
import whCooking from '../styles/assets/portfolio/wildhearth/gallery/62-hearth-cooking.jpg';
import whTalking from '../styles/assets/portfolio/wildhearth/gallery/82-talking.jpg';
import whFurnish from '../styles/assets/portfolio/wildhearth/gallery/171-furnish-mode.jpg';

import fwDesktopHome from '../styles/assets/portfolio/friends-world/d-home.jpg';
import fwHome from '../styles/assets/portfolio/friends-world/m-home.jpg';
import fwNumbers from '../styles/assets/portfolio/friends-world/m-cat-numbers.jpg';
import fwMeet from '../styles/assets/portfolio/friends-world/m-meet.jpg';
import fwFriend from '../styles/assets/portfolio/friends-world/m-friend-7.jpg';
import fwSort from '../styles/assets/portfolio/friends-world/m-game-sort.jpg';
import fwDice from '../styles/assets/portfolio/friends-world/m-game-dice.jpg';
import fw3dNumbers from '../styles/assets/portfolio/friends-world/3d-sort-numbers.jpg';
import fw3dSmiley from '../styles/assets/portfolio/friends-world/3d-sort-smiley.jpg';

import strHero from '../styles/assets/portfolio/mfl/str-hero.jpg';
import strGateFanfic from '../styles/assets/portfolio/mfl/gate-fanfic.jpg';
import strGateOtp from '../styles/assets/portfolio/mfl/gate-otp.jpg';
import strGateVertical from '../styles/assets/portfolio/mfl/gate-vertical.jpg';

import fosDiagram from '../styles/assets/portfolio/fanfic-os/diagram.jpg';

import rcHome from '../styles/assets/portfolio/recipes/home-desktop-light.jpg';
import rcSearch from '../styles/assets/portfolio/recipes/search-desktop-dark.jpg';
import rcWeek from '../styles/assets/portfolio/recipes/week-desktop-light.jpg';
import rcFirstRun from '../styles/assets/portfolio/recipes/firstrun-desktop-light.jpg';
import rcHomePhone from '../styles/assets/portfolio/recipes/home-phone-dark.jpg';
import rcWeekPhone from '../styles/assets/portfolio/recipes/week-phone-light.jpg';
import rcLovedPhone from '../styles/assets/portfolio/recipes/favorites-phone-light.jpg';

import flSearch from '../styles/assets/portfolio/files/search-desktop-light.jpg';
import flFolder from '../styles/assets/portfolio/files/folder-desktop-dark.jpg';
import flImage from '../styles/assets/portfolio/files/preview-image-desktop-light.jpg';
import flVideo from '../styles/assets/portfolio/files/preview-video-desktop-dark.jpg';
import flHomePhone from '../styles/assets/portfolio/files/home-phone-light.jpg';
import flFolderPhone from '../styles/assets/portfolio/files/folder-phone-dark.jpg';
import flSearchPhone from '../styles/assets/portfolio/files/search-phone-light.jpg';

import pmTimeline from '../styles/assets/portfolio/premarket-lab/timeline-light.jpg';
import pmExplorer from '../styles/assets/portfolio/premarket-lab/explorer-desktop-light.jpg';
import pmNight from '../styles/assets/portfolio/premarket-lab/night-desktop-dark.jpg';
import pmEarly from '../styles/assets/portfolio/premarket-lab/early-close-desktop-light.jpg';
import pmExplorerPhone from '../styles/assets/portfolio/premarket-lab/explorer-phone-dark.jpg';
import pmNightPhone from '../styles/assets/portfolio/premarket-lab/night-phone-light.jpg';
import pmTimelinePhone from '../styles/assets/portfolio/premarket-lab/timeline-phone-dark.jpg';

import {
  projectPagesContent,
  type ProjectPageContent,
  type ProjectPageId,
} from './project-pages-content';

/** `phone` shots are tall (portrait) and get a narrower tile. */
export type ProjectShot = {
  src: string;
  /** English canonical caption; Hebrew via i18n/project-pages-he.ts by index. */
  caption: string;
  shape: 'wide' | 'phone';
  /** Pixel art keeps hard edges when scaled. */
  pixel?: boolean;
};

export type ProjectPageArt = {
  hero: ProjectShot;
  /** May be empty: the template then shows no Screenshots section. */
  gallery: ProjectShot[];
  sideGallery?: ProjectShot[];
};

const art: Record<ProjectPageId, ProjectPageArt> = {
  wildhearth: {
    hero: {
      src: wildhearthTitle,
      caption: "Wildhearth's title art: a pixel-art farmhouse on a hillside at sunset.",
      shape: 'wide',
      pixel: true,
    },
    gallery: [
      { src: whMain, caption: 'The main screen: the farm, the backpack and the seven needs.', shape: 'wide' },
      { src: whFarm, caption: "Arriving at great-aunt Mirra's rundown farm.", shape: 'wide' },
      { src: whCharacter, caption: 'Creating your character.', shape: 'wide' },
      { src: whPath, caption: 'Choosing a starting path and a life dream.', shape: 'wide' },
      { src: whField, caption: 'A field from seedling to harvest.', shape: 'wide' },
      { src: whFishing, caption: 'A bite while fishing.', shape: 'wide' },
      { src: whBusking, caption: 'Busking in the market square.', shape: 'wide' },
      { src: whCooking, caption: 'Cooking at the hearth.', shape: 'wide' },
      { src: whTalking, caption: 'Talking with Maren, the fish-buyer.', shape: 'wide' },
      { src: whFurnish, caption: 'Furnishing the house.', shape: 'wide' },
    ],
  },
  'friends-world': {
    hero: {
      src: fwDesktopHome,
      caption: 'The home screen: the friends and the game categories.',
      shape: 'wide',
    },
    gallery: [
      { src: fwHome, caption: 'The home screen on a phone.', shape: 'phone' },
      { src: fwNumbers, caption: 'The numbers category.', shape: 'phone' },
      { src: fwMeet, caption: 'Meeting the friends, ten at a time.', shape: 'phone' },
      { src: fwFriend, caption: "A friend's own world.", shape: 'phone' },
      { src: fwSort, caption: 'The sorting game, smiley mode.', shape: 'phone' },
      { src: fwDice, caption: 'Rolling dice and adding them up.', shape: 'phone' },
    ],
    sideGallery: [
      { src: fw3dNumbers, caption: 'The 3D sorting game, numbers mode.', shape: 'wide' },
      { src: fw3dSmiley, caption: 'The 3D sorting game, smiley mode.', shape: 'wide' },
    ],
  },
  'shipping-the-rainbow': {
    hero: {
      src: strHero,
      caption: 'The portal: a rainbow arc, "Be Gay. Ship Girls." and the three gates.',
      shape: 'wide',
    },
    gallery: [
      { src: strGateFanfic, caption: 'Fanfic Rainbow, the fanfic library gate.', shape: 'wide' },
      { src: strGateOtp, caption: 'OTP Rainbow, a home for every ship.', shape: 'wide' },
      { src: strGateVertical, caption: 'Vertical Rainbow, the short vertical dramas gate.', shape: 'wide' },
    ],
  },
  'fanfic-os': {
    hero: {
      src: fosDiagram,
      caption: 'How the parts connect: agents through the tool gateway, the parts of the system, and owner approval.',
      shape: 'wide',
    },
    gallery: [],
  },
  recipes: {
    hero: {
      src: rcHome,
      caption: 'The collection: "what can I make with…", colourful categories and recipe cards.',
      shape: 'wide',
    },
    gallery: [
      { src: rcSearch, caption: 'Searching by ingredient: what can I make with lentils?', shape: 'wide' },
      { src: rcWeek, caption: 'Seven evenings: the week plan, each evening in its dish colour.', shape: 'wide' },
      { src: rcFirstRun, caption: 'The first run: the kitchen is still empty, paste a link.', shape: 'wide' },
      { src: rcHomePhone, caption: 'The collection on a phone, dark mode.', shape: 'phone' },
      { src: rcWeekPhone, caption: 'The week plan on a phone.', shape: 'phone' },
      { src: rcLovedPhone, caption: '"We loved it" on a phone.', shape: 'phone' },
    ],
  },
  files: {
    hero: {
      src: flSearch,
      caption: 'The home screen with a search, on sample folders.',
      shape: 'wide',
    },
    gallery: [
      { src: flFolder, caption: 'A folder as a list, in dark mode.', shape: 'wide' },
      { src: flImage, caption: 'Previewing an image.', shape: 'wide' },
      { src: flVideo, caption: 'Previewing a video, in dark mode.', shape: 'wide' },
      { src: flHomePhone, caption: 'The home screen on a phone.', shape: 'phone' },
      { src: flFolderPhone, caption: 'A folder on a phone, dark mode.', shape: 'phone' },
      { src: flSearchPhone, caption: 'Search on a phone.', shape: 'phone' },
    ],
  },
  'premarket-lab': {
    hero: {
      src: pmTimeline,
      caption: 'The timeline of one night on a synthetic ticker: after hours, the hidden night and the decision window.',
      shape: 'wide',
    },
    gallery: [
      { src: pmExplorer, caption: 'The explorer: filters, and movers grouped by how much they kept.', shape: 'wide' },
      { src: pmNight, caption: 'One night of a synthetic stock, in dark mode.', shape: 'wide' },
      { src: pmEarly, caption: 'A night after an early close, marked as a short day.', shape: 'wide' },
      { src: pmExplorerPhone, caption: 'Explorer results on a phone, dark mode.', shape: 'phone' },
      { src: pmNightPhone, caption: 'One night on a phone.', shape: 'phone' },
      { src: pmTimelinePhone, caption: 'The timeline on a phone, dark mode.', shape: 'phone' },
    ],
  },
};

export type ProjectPage = ProjectPageContent & { art: ProjectPageArt };

export const projectPages: ProjectPage[] = projectPagesContent.map((page) => ({
  ...page,
  art: art[page.id],
}));

export function getProjectPage(id: ProjectPageId): ProjectPage {
  const page = projectPages.find((p) => p.id === id);
  if (!page) throw new Error(`Unknown project page: ${id}`);
  return page;
}
