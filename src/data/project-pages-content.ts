/**
 * Project pages — the facts for each project's own small marketing page
 * (`/wildhearth`, `/friends-world`, …). Wave 1, 2026-11-04.
 *
 * Same Node-safety split as portfolio-content.ts / portfolio.ts: THIS file
 * holds only text (no asset imports), so the build-time meta generator
 * (scripts/generate-project-meta.mts, plain Node via tsx) can read titles,
 * descriptions and paths. The art (gallery images) lives in
 * data/project-pages.ts, which imports this file and layers the images on.
 *
 * English is canonical here. The Hebrew rendering is an overlay in
 * i18n/project-pages-he.ts (DRAFT copy until the owner approves it). The
 * `tagline` and the project's own quoted `pitch` stay English on the Hebrew
 * page too (owner ruling 2026-09-07: "לא, שיווקי זה שיווקי").
 *
 * Every fact below comes from the project's own code/docs as verified
 * 2026-11-04 and from the approved list (docs/projects-list-2026-11-04.html).
 * Its "לא יוצג" (never shown) lines are hard rules: no server, hosting or
 * password details, no spend or AI-art budgets, no child's age, nothing
 * developmental, no potty or pacifier game. Never add a fact that is not in
 * the project itself.
 *
 * Adding a page (waves 2-4): add an entry here, its gallery in
 * project-pages.ts, its Hebrew in i18n/project-pages-he.ts, and set
 * `caseRoute` on the matching portfolio-content.ts entry if it has a card.
 */

export type ProjectPageId = 'wildhearth' | 'friends-world';

/** Drives the status chip's dot: `live` pulses, `preview` is static. */
export type ProjectPageTone = 'live' | 'preview';

export type ProjectPagePillar = { title: string; text: string };

/** A big number + a small label (e.g. "62" / "games"). */
export type ProjectPageFigure = { value: string; label: string };

/** One labelled count (e.g. a game category and how many games it holds). */
export type ProjectPageFacet = { id: string; label: string; count: number };

export type ProjectPageContent = {
  id: ProjectPageId;
  /** The page's path inside the site, no trailing slash. */
  path: string;
  /** The matching home-page card (portfolio-content.ts `slug`), if any. */
  portfolioSlug?: string;
  name: string;
  /** English in both languages (owner ruling). */
  tagline: string;
  status: { tone: ProjectPageTone; label: string };
  year: string;
  /** What it is — one or two sentences. */
  summary: string;
  /** The project's own words, quoted verbatim (English in both languages). */
  pitch?: { text: string; source: string };
  figures: ProjectPageFigure[];
  pillarsTitle?: string;
  pillars?: ProjectPagePillar[];
  facetsTitle?: string;
  facets?: ProjectPageFacet[];
  worksToday: string[];
  next?: string[];
  tech: string[];
  /** Only when the project is open to anyone, no sign-in, no password. */
  link?: { href: string; label: string };
  /** Shown instead of a link when the project is not public. */
  noLinkNote?: string;
  /** A smaller related piece shown as an "in development" paragraph. */
  side?: { title: string; status: string; text: string };
  closing?: string;
  /** For the static <head> of build/<path>/index.html. */
  meta: { title: string; description: string; ogImage: string; ogAlt: string };
};

export const projectPagesContent: ProjectPageContent[] = [
  {
    id: 'wildhearth',
    path: '/wildhearth',
    portfolioSlug: 'wildhearth',
    name: 'Wildhearth',
    tagline: 'A little farm, a whole life.',
    status: { tone: 'preview', label: 'In development · private preview' },
    year: '2026',
    summary:
      'A single-player, top-down 2D life-sim and farm game that runs in the browser, set in an old, pre-industrial world. There is no combat. You start with a few coins and a rundown farm.',
    pitch: {
      text: 'A single-player, old-world life-sim. You start with a few coins and a rundown farm, and build your way to a full life — living characters and relationships, real skills and an earned economy, a home you renovate with your own two hands.',
      source: "From the game's own landing page",
    },
    figures: [
      { value: '4', label: 'starting paths' },
      { value: '10', label: 'skills, earned by use' },
      { value: '15', label: 'named townsfolk' },
      { value: '7', label: 'needs to look after' },
    ],
    pillarsTitle: 'The pillars',
    pillars: [
      {
        title: 'Nothing Is Free',
        text: 'Every tool, animal and seed is bought with money you earned yourself.',
      },
      {
        title: 'A Farm You Rebuild',
        text: 'The farm starts rundown. Each repair is something you can see change, piece by piece.',
      },
      {
        title: 'Skills You Earn By Doing',
        text: 'Every skill grows only through use, and there is a cap on how much you can master.',
      },
      {
        title: 'Relationships That Run Deep',
        text: 'The people in town each have their own schedule and story.',
      },
      {
        title: 'AI Townsfolk, Optional',
        text: 'Townsfolk can be driven by a language model, with your own key. Off by default.',
      },
      {
        title: 'No Combat, Ever',
        text: 'No monsters, no death, no fighting. The tension is money, time and ambition.',
      },
    ],
    worksToday: [
      'Four starting paths (Fisher, Farmer, Musician, Animal-Keeper) and five life dreams',
      'Ten skills that grow only as you use them, and seven needs',
      'Fifteen named townsfolk with daily schedules and relationships',
      'Fishing, foraging, busking, chopping, farming and watering',
      'A shop, a market stall, a job board and mail',
      'Cooking, crafting and furnishing',
      'Upgrading the house and renovating the neglected farm',
      'A calendar, seasons, weather and a festival',
      'Save slots and waystones',
      'Optional AI townsfolk, off by default, with your own key',
    ],
    next: [
      'The town beyond the market square',
      'Marriage and family',
      'Pets',
      'Mining and boats',
      'A world map',
    ],
    tech: ['TypeScript', 'Vite', 'No framework', 'Canvas rendering', 'Pixel art'],
    noLinkNote: 'No public link yet. The game is in a private preview.',
    meta: {
      title: 'Wildhearth — a browser life-sim in development · Gitit Regev',
      description:
        'A single-player, old-world life-sim and farm game in the browser. No combat. You start with a few coins and a rundown farm. In development, private preview.',
      ogImage: '/og/wildhearth.jpg',
      ogAlt: 'Wildhearth title art: a pixel-art farmhouse on a hillside at sunset.',
    },
  },
  {
    id: 'friends-world',
    path: '/friends-world',
    portfolioSlug: 'assaf-friends-games',
    name: "Assaf's Friends World",
    tagline: "Hebrew learning games for kids who can't read yet — no clocks, no failure states.",
    status: { tone: 'live', label: 'Live · open to everyone' },
    year: '2026',
    summary:
      'A Hebrew, right-to-left, mobile-first site of learning games for children who can\'t read yet, built around 100 colourful "friends", each one a number.',
    figures: [
      { value: '62', label: 'games' },
      { value: '9', label: 'categories' },
      { value: '100', label: 'number friends' },
    ],
    pillarsTitle: 'The principles',
    pillars: [
      {
        title: 'No failure',
        text: 'No game over. A mistake gets a gentle hint, and play goes on.',
      },
      {
        title: 'No timers, no competition',
        text: 'Nothing races the clock, and nobody loses.',
      },
      {
        title: 'Calm for the senses',
        text: 'Soft colours, no flashes, short animations that follow the child.',
      },
      {
        title: 'Made for pre-readers',
        text: 'Everything is pictures, with recorded Hebrew narration.',
      },
    ],
    facetsTitle: 'Games by category',
    // Display names and counts read from the project's own registry
    // (assaf-friends-games src/games/registry.ts + src/i18n/en.ts), 2026-11-04.
    facets: [
      { id: 'numbers', label: 'Numbers', count: 14 },
      { id: 'fun', label: 'Fun', count: 11 },
      { id: 'letters', label: 'Letters', count: 9 },
      { id: 'create', label: 'Create', count: 7 },
      { id: 'english', label: 'English', count: 6 },
      { id: 'thinking', label: 'Thinking', count: 5 },
      { id: 'sports', label: 'Sports', count: 4 },
      { id: 'growup', label: 'Growing Up', count: 4 },
      { id: 'music', label: 'Music', count: 2 },
    ],
    worksToday: [
      'Recorded Hebrew voice narration',
      'A calm mode',
      'Difficulty that grows with the child',
      'Works in Hebrew and in English',
      'Installable like an app',
    ],
    tech: ['React', 'TypeScript', 'Vite', 'PWA', 'Hebrew RTL', 'three.js'],
    link: { href: 'https://assaf.gititregev.com', label: 'Play the games' },
    side: {
      title: 'A 3D sorting game',
      status: 'In development',
      text: 'A Unity 3D version of the sorting game: drag the balls into the matching baskets, in a numbers mode and a smiley mode, with a Hebrew counting voice. It is being built for a tablet and has not run on a real device yet.',
    },
    closing: 'A personal project, built with love.',
    meta: {
      title: "Assaf's Friends World — Hebrew learning games · Gitit Regev",
      description:
        'A Hebrew, mobile-first site of 62 learning games for children who can\'t read yet, built around 100 colourful number friends. No failure, no timers, no competition.',
      ogImage: '/og/friends-world.jpg',
      ogAlt: 'The Friends World home screen: colourful category tiles and the number friends.',
    },
  },
];

/** The page for a pathname, or undefined (App then renders the home page). */
export function findProjectPage(pathname: string): ProjectPageContent | undefined {
  const p = pathname.replace(/\/+$/, '') || '/';
  return projectPagesContent.find((page) => page.path === p);
}
