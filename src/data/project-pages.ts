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
