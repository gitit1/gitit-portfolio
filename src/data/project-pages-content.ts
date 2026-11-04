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

export type ProjectPageId =
  | 'wildhearth'
  | 'friends-world'
  | 'shipping-the-rainbow'
  | 'fanfic-os'
  | 'recipes'
  | 'files'
  | 'premarket-lab';

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
  /** Only honest, countable facts; omitted when a project has none to show. */
  figures?: ProjectPageFigure[];
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

  // ---- Wave 2 (2026-11-04) ----------------------------------------------
  // Facts from each project's own code/docs (survey R2/R3, 2026-11-04, and a
  // re-check of README / package.json / gates.ts the same day). Hard rules per
  // projects-list-2026-11-04 "לא יוצג" lines: STR never shows fic titles,
  // authors, uploaders, list names, TV stills or story counts; Fanfic OS
  // never names the saga or shows any of its text; files never shows the
  // home server's share names or disk sizes; premarket never shows her
  // tickers, trades or rules.
  {
    id: 'shipping-the-rainbow',
    path: '/shipping-the-rainbow',
    portfolioSlug: 'mfl',
    name: 'Shipping the Rainbow',
    // The portal's own line (client/src/components/brand, gates.ts).
    tagline: 'Be Gay. Ship Girls.',
    status: { tone: 'live', label: 'Live · sign-in only' },
    year: '2019–2026',
    summary:
      'A home for the WLW fandom: one portal that opens onto three gates, a fanfic library, a page for every ship, and short vertical dramas. Hand-built in 2019, rebuilt with AI agents in 2026.',
    pitch: {
      text: "One place to browse, track, and back up everything I read — instead of relying on different sites' bookmarking systems, one of which likes to disappear fics without warning.",
      source: "From the project's README",
    },
    figures: [
      { value: '3', label: 'gates' },
      { value: '2019', label: 'first version' },
      { value: '2026', label: 'rebuilt with agents' },
    ],
    pillarsTitle: 'The three gates',
    // Taglines verbatim from client/src/lib/gates.ts.
    pillars: [
      {
        title: 'Fanfic Rainbow',
        text: 'Browse, track, and back up your fanfic collection.',
      },
      {
        title: 'OTP Rainbow',
        text: 'The home of the gay ships.',
      },
      {
        title: 'Vertical Rainbow',
        text: 'Short vertical WLW dramas — discover, download, watch.',
      },
    ],
    worksToday: [
      'One portal, "Be Gay. Ship Girls.", that opens onto the three gates',
      'A fanfic library to browse, track and back up what I read, with reading lists and stats',
      'A page for every ship, with its own video library',
      'Ship pages are proposed first and go live only once approved',
      'A library of short vertical series, with a page per series, discovery and downloads',
      'An MCP server that lets Claude browse the library and enrich it',
      'Sign-in on every page',
    ],
    tech: ['TypeScript', 'React', 'MUI', 'Node backend', 'MongoDB', 'Socket.IO', 'MCP server'],
    noLinkNote: 'No public link. The site opens on a sign-in screen and has no demo account.',
    meta: {
      title: 'Shipping the Rainbow — a WLW fandom hub · Gitit Regev',
      description:
        'A home for the WLW fandom: one portal, three gates. A fanfic library, a page for every ship, and short vertical dramas. Hand-built in 2019, rebuilt with AI agents in 2026.',
      ogImage: '/og/shipping-the-rainbow.jpg',
      ogAlt: 'The Shipping the Rainbow brand card: a rainbow arc and the three gates.',
    },
  },
  {
    id: 'fanfic-os',
    path: '/fanfic-os',
    name: 'Fanfic OS',
    tagline: 'Plan it, keep it continuous, write it.',
    status: { tone: 'preview', label: 'In development · private' },
    year: '2026',
    summary:
      'A self-hosted system for planning, tracking continuity and writing a long, multi-part saga, so a change can be checked backward and forward across hundreds of chapters.',
    pitch: {
      text: 'A self-hosted, multi-project fiction planning, continuity and writing system.',
      source: "From the project's README",
    },
    pillarsTitle: 'How it works',
    pillars: [
      {
        title: 'The whole story world',
        text: 'Sources, the saga, continuity, ideas and manuscripts, in one system.',
      },
      {
        title: 'Agents through one gateway',
        text: 'AI agents work in it only through its own tool gateway (MCP). ChatGPT reaches the same tools through a GitHub relay.',
      },
      {
        title: 'Every change approved',
        text: 'Proposed changes wait for my approval before they count.',
      },
    ],
    worksToday: [
      'A library of projects',
      'A sources reader',
      'A saga navigator',
      'Continuity tracking',
      'An idea lab',
      'Manuscripts',
      'Owner approvals',
      'Its own tool gateway (MCP) for AI agents',
      'A relay from ChatGPT through GitHub',
    ],
    next: ['A view of canon changes', 'A prose editor'],
    tech: ['TypeScript', 'Next.js', 'React', 'PostgreSQL', 'pgvector', 'Zod', 'MCP server', 'Docker'],
    noLinkNote: 'No public link. What is inside is my own manuscript.',
    side: {
      title: 'Writers Room',
      status: 'Local tool',
      text: 'A separate local tool that QA-checks chapters with a language model running on my own computer. Its interface is in Hebrew, and every fix waits for my approval.',
    },
    meta: {
      title: 'Fanfic OS — planning, continuity and writing for a long saga · Gitit Regev',
      description:
        'A self-hosted system for planning, tracking continuity and writing a long, multi-part saga, so a change can be checked backward and forward across hundreds of chapters. In development, private.',
      ogImage: '/og/fanfic-os.jpg',
      ogAlt: 'A diagram of how the parts of Fanfic OS connect.',
    },
  },
  {
    id: 'recipes',
    path: '/recipes',
    name: 'Recipes',
    tagline: 'A cookbook of links that looks alive.',
    status: { tone: 'preview', label: 'Finished · personal use, private' },
    year: '2026',
    summary:
      'A cookbook of recipe links. Paste a link and, for some sites, the name, description, image and ingredients fill in by themselves.',
    pillarsTitle: 'The idea',
    pillars: [
      {
        title: 'Colour Kitchen',
        text: 'The design is called Colour Kitchen. It was meant to look alive, not like a dashboard.',
      },
      {
        title: 'What can I make with…',
        text: 'Search by ingredient, and see only the recipes that use it.',
      },
      {
        title: 'A week, one list',
        text: 'Plan a week of dinners, if you want to, and get one merged shopping list.',
      },
    ],
    worksToday: [
      'Paste a link: for some sites the name, description, image and ingredients fill in by themselves',
      'Colourful categories, each recipe in its category colour',
      'Search by ingredient: "what can I make with…"',
      '"We loved it" and "to try" marks',
      'An optional week plan with one merged shopping list',
      'Export and import of the whole collection as one file',
      'Hebrew and English, light and dark',
    ],
    tech: ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'Node backend', 'SQLite', 'Hebrew RTL'],
    noLinkNote: 'No public link. It is a personal app.',
    meta: {
      title: 'Recipes — a colourful cookbook of links · Gitit Regev',
      description:
        'A cookbook of recipe links: paste a link and, for some sites, the details fill in by themselves. Colourful categories, search by ingredient, and a week plan with one shopping list.',
      ogImage: '/og/recipes.jpg',
      ogAlt: 'The recipes home screen: "what can I make with…" and colourful category cards.',
    },
  },
  {
    id: 'files',
    path: '/files',
    name: 'My Files',
    tagline: 'A Dropbox of my own, on the home server.',
    status: { tone: 'preview', label: 'In development · started November 2026' },
    year: '2026',
    summary:
      'A Dropbox-like web app over my home server, in Hebrew and comfortable on a phone.',
    worksToday: [
      'Browsing folders, as a list or a grid',
      'Search',
      'Preview of images, video, PDF and text',
      'Download a file, or a whole folder as a zip',
      'Recent files',
      'Sign-in',
    ],
    next: [
      'Big uploads',
      'New folder and rename',
      'Trash',
      'Favourites',
      'Photos from the phone',
      'Share links',
    ],
    tech: ['TypeScript', 'React', 'Vite', 'Node backend', 'SQLite', 'Hebrew RTL'],
    noLinkNote: 'No public link. It opens only the files on my own server.',
    meta: {
      title: 'My Files — a personal Dropbox on the home server · Gitit Regev',
      description:
        'A Dropbox-like web app over my home server, in Hebrew and comfortable on a phone: browse, search, preview, download, recent files. In development.',
      ogImage: '/og/files.jpg',
      ogAlt: 'The My Files home screen on sample folders, with search results.',
    },
  },
  {
    id: 'premarket-lab',
    path: '/premarket-lab',
    name: 'Premarket Lab',
    tagline: 'One hypothesis, tested minute by minute.',
    status: { tone: 'preview', label: 'Research tool · demo data only' },
    year: '2026',
    summary:
      'A research-only tool that tests one hypothesis on minute-level price data: do US stocks that rose after hours and kept the gain through the early pre-market behave differently afterwards than similar stocks that lost it?',
    // package.json "description", verbatim.
    pitch: {
      text: 'Research-only tool: does keeping an After-Hours move into the first 30 minutes of Premarket change what happens next? Never trades, never places orders, never outputs BUY/SELL.',
      source: "From the project's own description",
    },
    pillarsTitle: 'The rules it keeps',
    pillars: [
      {
        title: 'Research only',
        text: 'No trading, no orders, no recommendations.',
      },
      {
        title: 'Against a comparison group',
        text: 'Stocks that kept the gain are measured against similar stocks that lost it, with confidence intervals.',
      },
      {
        title: 'Demo data, said plainly',
        text: 'So far it runs on demo data only. No real market data has gone through it yet.',
      },
    ],
    worksToday: [
      'An explorer that groups after-hours movers by how much of the move they kept',
      'A timeline of one night per stock: the close, after hours, the hidden night and the 04:00–04:30 decision window',
      'A backtester with comparison groups and confidence intervals',
      'CSV import, and CSV export from the explorer',
    ],
    tech: ['TypeScript', 'React', 'Vite', 'Node backend', 'SQLite'],
    noLinkNote: 'No public link. It is a private research tool, on demo data.',
    meta: {
      title: 'Premarket Lab — a research tool on demo data · Gitit Regev',
      description:
        'A research-only tool testing one hypothesis on minute-level price data: does keeping an after-hours move into the early pre-market change what happens next? No trading, no recommendations. Demo data only.',
      ogImage: '/og/premarket-lab.jpg',
      ogAlt: 'The Premarket Lab timeline of one night, on a synthetic ticker.',
    },
  },
];

/** The page for a pathname, or undefined (App then renders the home page). */
export function findProjectPage(pathname: string): ProjectPageContent | undefined {
  const p = pathname.replace(/\/+$/, '') || '/';
  return projectPagesContent.find((page) => page.path === p);
}
