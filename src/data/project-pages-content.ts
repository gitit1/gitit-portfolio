/**
 * Project pages — the facts for each project's own page inside the site
 * (`/wildhearth`, `/friends-world`, …). Wave 1, 2026-11-04. Since the owner's
 * 2026-11-04 ruling these pages become TECHNICAL case studies (see
 * `ProjectCaseStudy` below); /wildhearth is the first, the rest migrate later.
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

// ---- Technical case study (2026-11-04) ----------------------------------
// Owner ruling 2026-11-04: the pages INSIDE gititregev.com are for engineers
// and recruiters and must show how she thinks as an architect, developer and
// AI builder; product marketing belongs on each project's own site. These
// sections are all OPTIONAL so the pages migrate one by one (/wildhearth
// first); a page without `caseStudy` renders exactly as before.
// Hard rules for every entry: only what the project's own repo documents
// (cite the doc in a comment next to it), never money/credits/spend, never
// server/hosting/password details, never internal ports or artifact links.

/** One box in the architecture diagram. `code` is the real module/path name
 *  and stays English in every language; `label` and `note` are translated. */
export type CaseDiagramNode = { id: string; code: string; label: string; note: string };

/**
 * A layered architecture diagram, drawn by the template (no image file):
 * a boundary box holding top-to-bottom `layers` (each a row of nodes, joined
 * by down arrows) and an optional side `lane` inside the boundary, joined to
 * the layers by a two-headed link; an optional `external` node sits outside
 * the boundary, joined to the lane (or the last layer) by a dashed link.
 * Down and two-headed arrows read the same in LTR and RTL, so the diagram
 * never needs a mirrored glyph.
 */
export type CaseDiagram = {
  boundary: string;
  /** `link` labels the arrow INTO this layer from the one above. */
  layers: { link?: string; nodes: CaseDiagramNode[] }[];
  lane?: { title: string; badge?: string; link: string; nodes: CaseDiagramNode[] };
  external?: { link: string; node: CaseDiagramNode };
};

export type CaseDecision = {
  id: string;
  title: string;
  chose: string;
  instead: string[];
  cost: string;
  /** Where the decision is recorded (repo paths; stays English). */
  source: string;
};

export type CaseCourseChange = {
  id: string;
  /** ISO date; formatted per language at render. */
  date: string;
  title: string;
  text: string;
  source: string;
};

export type CaseMetric = {
  id: string;
  value: string;
  label: string;
  /** What exactly the number counts. */
  measures: string;
  /** The command it came from, shown in mono (English in every language). */
  how?: string;
};

export type ProjectCaseStudy = {
  problem: string;
  architecture: { intro: string; diagram: CaseDiagram };
  decisions: CaseDecision[];
  aiWork: { decides: string[]; delegates: string[]; verifies: string[] };
  courseChanges?: CaseCourseChange[];
  metrics?: { asOf: string; items: CaseMetric[] };
  /**
   * The project's own product / marketing site. `url` is OFF until that site
   * is public: set it (and `label`) to turn the note into a link. Never link
   * a site that sits behind a password.
   */
  productSite?: { note: string; url?: string; label?: string };
};

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
  /** Optional since the technical pages (a case study replaces it). */
  worksToday?: string[];
  next?: string[];
  tech: string[];
  /** Only when the project is open to anyone, no sign-in, no password. */
  link?: { href: string; label: string };
  /** Shown instead of a link when the project is not public. */
  noLinkNote?: string;
  /** A smaller related piece shown as an "in development" paragraph. */
  side?: { title: string; status: string; text: string };
  closing?: string;
  /** Set by the Hebrew overlay when it translates the tagline (technical
   *  pages; marketing taglines stay English by ruling). */
  taglineLang?: 'en' | 'he';
  /** The technical sections; when present they replace pitch/pillars/lists. */
  caseStudy?: ProjectCaseStudy;
  /** For the static <head> of build/<path>/index.html. */
  meta: { title: string; description: string; ogImage: string; ogAlt: string };
};

export const projectPagesContent: ProjectPageContent[] = [
  {
    // TECHNICAL case study (2026-11-04, owner ruling: engineers' page, not
    // marketing). Pillars, the "works today" list and the landing-page pitch
    // were removed on purpose; the game is described in one line only.
    // Every fact below was read from the Wildhearth repo (branch v1-rebuild,
    // HEAD b4d755e0, 2026-11-02) on 2026-11-04; the source doc is cited next
    // to each entry. The repo README's "no asset files" line is out of date
    // (974 PixelLab PNGs are tracked) and is not used.
    id: 'wildhearth',
    path: '/wildhearth',
    portfolioSlug: 'wildhearth',
    name: 'Wildhearth',
    tagline: 'A code-first simulation with an optional AI layer.',
    status: { tone: 'preview', label: 'In development · private preview' },
    year: '2026',
    // docs/VISION.md "One-liner" + "Era & world tone".
    summary:
      'A single-player, top-down 2D life-sim and farm game that runs entirely in the browser, set in a pre-industrial world with no combat.',
    tech: [
      'TypeScript (strict)',
      'Vite',
      'No framework',
      'Canvas 2D',
      'DOM window manager',
      'localStorage saves',
      'PixelLab sprites',
      'Anthropic API (optional, own key)',
      'puppeteer-core',
    ],
    caseStudy: {
      // docs/VISION.md ("One-liner", "Design principle zero", the documented
      // pitfalls of shipped LLM-NPC games) + docs/AI_ARCHITECTURE.md §0.
      problem:
        "Wildhearth combines three kinds of game: The Sims' people and relationships, Ultima Online's skills, economy and open world, and a rundown farm you renovate. The engineering problem sits under the townsfolk. They can be driven by a language model that thinks and remembers, but shipped LLM-NPC games show that players go looking for the seams and that call costs get out of hand. So the governing rule (the design's \"principle zero\") is: the simulation is plain code and complete with the AI off, everything runs in the browser, and the AI only ever adds a layer on top.",
      architecture: {
        // CLAUDE.md "Architecture map"; src/main.ts (tick → draw, depth sort
        // of `ents` by y); docs/AI_ARCHITECTURE.md §0 rule 1 (never on the
        // tick path, discrete moments, an await that never blocks rendering).
        intro:
          'Everything runs in one browser tab, with no game server. One loop in main.ts updates the systems, resolves interactions and draws a depth-sorted canvas frame; the windows are DOM on top of it. The AI path sits beside the loop, never inside it: it is called only at meaningful moments, such as opening a conversation or a day rollover, behind an await that never blocks a frame.',
        diagram: {
          boundary: "The player's browser · no game server",
          layers: [
            {
              nodes: [
                // src/engine/input.ts
                { id: 'input', code: 'engine/input.ts', label: 'Input', note: 'Keyboard, mouse and touch' },
              ],
            },
            {
              link: 'every frame',
              nodes: [
                // src/main.ts tick(): update → interactions → draw
                { id: 'loop', code: 'main.ts', label: 'Game loop', note: 'Update, interactions, draw' },
              ],
            },
            {
              link: 'update · interact',
              nodes: [
                // 108 .ts files in src/systems (excluding src/systems/ai), measured 2026-11-04
                {
                  id: 'systems',
                  code: 'src/systems',
                  label: 'Systems',
                  note: '108 rule modules: economy, skills, needs, farming, weather, schedules, quests',
                },
                // src/systems/interact.ts INTERACTABLES + affordances.ts (docs/AFFORDANCE_ENGINE.md §2)
                {
                  id: 'interact',
                  code: 'interact.ts · affordances.ts',
                  label: 'Interactions',
                  note: 'What each thing can do, and why a verb is greyed out',
                },
                // src/world (zones, collision, pathfind, ground) + src/entities
                {
                  id: 'world',
                  code: 'src/world · src/entities',
                  label: 'World and entities',
                  note: 'Zones, collision, pathfinding; player, NPC and animal state',
                },
                // CLAUDE.md hard rule 3: tuning in config.ts, never inline
                {
                  id: 'data',
                  code: 'src/data · config.ts',
                  label: 'Data and tuning',
                  note: 'Authored tables and every tuning value',
                },
              ],
            },
            {
              link: 'draw · save',
              nodes: [
                // CLAUDE.md hard rule 1 (dual path) + main.ts draw() depth sort
                {
                  id: 'render',
                  code: 'src/art · assets/pixellab',
                  label: 'Renderer',
                  note: 'Canvas 2D sorted by depth; a PixelLab sprite when loaded, the code painter otherwise',
                },
                // docs/WINDOW_SYSTEM.md: every player-facing surface is a window, layout persisted
                {
                  id: 'windows',
                  code: 'src/ui/windows',
                  label: 'Windows',
                  note: 'DOM windows over the canvas; the layout is saved',
                },
                // src/systems/saves.ts: one versioned record per store, GAME_KEYS
                {
                  id: 'save',
                  code: 'systems/saves.ts',
                  label: 'Saves',
                  note: 'One versioned record per system in localStorage',
                },
              ],
            },
          ],
          // docs/AI_ARCHITECTURE.md §1-2; src/systems/aiSettings.ts (master
          // switch default off); src/systems/ai/provider.ts (anthropic · mock · none).
          lane: {
            title: 'Optional AI path',
            badge: 'off by default',
            link: 'snapshot out · validated action back',
            nodes: [
              {
                id: 'context',
                code: 'worldContext.ts',
                label: 'World snapshot',
                note: 'Read-only: time, weather, the NPC and what they remember',
              },
              {
                id: 'ai',
                code: 'src/systems/ai',
                label: 'AI layer',
                note: 'Prompts, cache, rate limits, anti-repetition; every reply checked against a closed action set',
              },
              { id: 'provider', code: 'ai/provider.ts', label: 'Provider', note: 'anthropic · mock · none' },
            ],
          },
          external: {
            link: "player's own key",
            node: {
              id: 'api',
              code: 'api.anthropic.com',
              label: 'Anthropic API',
              note: "Called with the player's own key, never per frame",
            },
          },
        },
      },
      decisions: [
        // docs/VISION.md "Design principle zero"; docs/AI_ARCHITECTURE.md §0
        // (three hard rules), §1 ("Not the source of truth"), §2 (BYOK,
        // browser-direct, the documented security note, the optional relay
        // "not v1"); src/systems/ai/provider.ts header (plain fetch, NOT the
        // SDK: "keeps the bundle lean").
        {
          id: 'ai-layer',
          title: 'AI is a layer, not a foundation',
          chose:
            'The simulation (skills, economy, farming, needs, schedules, authored dialogue) is plain code with zero AI calls. The optional AI layer reads a snapshot of the world and returns structured JSON, checked against a closed set of actions; the game applies only what passes. The player brings her own Anthropic key, and calls go straight from the browser.',
          instead: [
            'AI-driven townsfolk as the core of the game',
            'A server relay that holds the key (kept as a later option, not v1)',
            'The Anthropic SDK in the bundle (plain fetch instead, to keep the bundle lean)',
          ],
          cost: "Every AI feature needs a full authored fallback, not a stub. The key lives in the player's own browser storage, which the settings screen says plainly, and the browser call needs Anthropic's explicit direct-browser opt-in header.",
          source: 'docs/VISION.md · docs/AI_ARCHITECTURE.md §0-2 · src/systems/ai/provider.ts',
        },
        // docs/AFFORDANCE_ENGINE.md §0-2 (owner rulings 2026-10-02, "AI
        // proposes, the engine decides", code parser with AI off);
        // docs/DECISIONS.md "The AFFORDANCE ENGINE" (flips AI_ARCHITECTURE's
        // "no natural-language command interpretation"; gate: design doc +
        // owner approval before code; first slice = taming).
        {
          id: 'affordances',
          title: 'AI proposes, the engine decides',
          chose:
            'Actions come from the properties of things and the context (skill, gear, weather, trust, memory), registered in an affordance catalog, instead of a fixed menu per object. A typed line can be mapped by the model to a structured intent, chosen from candidates the engine supplies; the engine alone validates and executes it, or explains why not and offers a near alternative. With AI off, a code parser serves the same catalog.',
          instead: [
            'Hand-coded verbs per object (the existing interaction model)',
            'Letting the model resolve outcomes from free text',
          ],
          cost: 'It reversed an earlier written rule (no natural-language command interpretation), and as a new architecture it had to pass a design document and owner review before any game code. Taming was built first, as the one vertical slice.',
          source: 'docs/AFFORDANCE_ENGINE.md · docs/DECISIONS.md (2026-10-02)',
        },
        // CLAUDE.md hard rule 1 (code-drawn OR PixelLab, dual path, zero PNGs
        // must boot, no asset packs); docs/SCALING_DECISION.md (Path A vs
        // Path B kept "first-class"; isometric "would touch ~230 files and
        // reverse a four-doc decision — rejected"; "The REAL cost is review
        // time"; batched per-category gates).
        {
          id: 'dual-path',
          title: 'Every sprite keeps a code-drawn fallback',
          chose:
            'Art is either drawn in code or generated with PixelLab, nothing else. Every sprite-backed visual keeps its code painter as a runtime fallback, so the game boots and plays with zero image files. The camera stays flat top-down.',
          instead: [
            'Code-drawn art only ("Path B", kept open as a first-class option)',
            'Third-party asset packs (ruled out)',
            'Converting the world to isometric: about 230 files and the reversal of a decision recorded in four documents; rejected',
          ],
          cost: 'Two implementations for every visual. The real constraint turned out to be review time: every generated image is looked at for drift before it ships, in batches per category.',
          source: 'CLAUDE.md (hard rule 1) · docs/SCALING_DECISION.md',
        },
        // docs/specs/ENGINE-BIGWORLD-PLAN.md on branch new-world (§0 purpose
        // and "the bar"; §1 "Today, measured": one ground canvas, path lattice
        // 14.4 MB today vs 1.04 GB at ×72, linear collision lists, NPCs all
        // updated every frame); STATUS.md 2026-10-20 (steps verified, nothing
        // deployed); HANDOFF START HERE 2026-11-01 ("verified, never deployed").
        {
          id: 'big-world',
          title: 'Grow the world 72×, change nothing on screen',
          chose:
            "The planned world is 72 times today's map. The engine assumed one canvas for the whole ground, one path lattice for the whole world, linear collision lists and NPCs that are always simulated. It is being replaced in six steps, each one commit behind its own flag, against a bar: at today's map size the ground must be pixel-identical, collision verdicts and routes identical, and every old save must still load.",
          instead: ['Scaling the existing structures: the path lattice alone would grow from 14.4 MB to about 1 GB'],
          cost: "Engine work the player never sees, checked by equivalence tests against a baseline of today's game. It lives on its own branch and has not shipped yet.",
          source: 'docs/specs/ENGINE-BIGWORLD-PLAN.md (branch new-world)',
        },
      ],
      aiWork: {
        decides: [
          // CLAUDE.md hard rule 2; docs/OWNER_RULES.md "Working with the owner"; docs/DECISIONS.md (dated rulings)
          'Gitit is the product owner and the agents implement. Every design question reaches her as a choice, and her rulings are written into docs/DECISIONS.md with dates.',
          // docs/OWNER_RULES.md "Quality bar" (2026-10-10)
          'Spec first: no production wave starts before she has approved the written spec in full.',
          // docs/HANDOFF.md 2026-10-25/26 (world-map window: pictures from the real game, then her answers, then code)
          'Pictures before code: a new screen is shown first as screenshots or a mock from the real game, and is built only after she has looked.',
          // docs/HANDOFF.md 2026-10-18/20; docs/bible/ (chapters + answers logs)
          'The game bible is written chapter by chapter, each one approved, before building resumes.',
        ],
        delegates: [
          // CLAUDE.md "Token budget" + docs/HANDOFF.md "Sync protocol" (claim a wave in the Session log); docs/WORKBOARD.json
          "Work runs as waves on a work board, one wave at a time, each claimed in the handoff's session log.",
          // docs/SCALING_DECISION.md "Method": three parallel feasibility agents
          'Before a big call, agents probe feasibility: three parallel investigations (cost math, camera projection, live probes) decided the art direction.',
          // CLAUDE.md "Commit & push workflow"
          'Agents write the code, generate and integrate sprites, and update docs/WORKLOG.md in the same commit as the change.',
          // CLAUDE.md "FIRST, every session"; docs/OWNER_RULES.md (mirrored rules, docs/agent-memory/)
          'Local and cloud sessions share state only through the repo: a START HERE handoff, a mirrored rules file and a memory folder.',
        ],
        verifies: [
          // verify/lib.mjs header (own Vite server, refuses a port that already answers, headless Edge via puppeteer-core); counts measured 2026-11-04
          '77 scripted checks in verify/; 69 drive headless Edge through puppeteer-core, and each brings its own dev server and refuses a stale one.',
          // verify/save-compat.mjs header (fixtures/v1-save.json, "a REAL day-2 playthrough dump")
          'A save-compatibility check seeded from a real day-2 playthrough: every version must still load it.',
          // docs/OWNER_RULES.md "Quality bar"
          'Visual work is not done until it is rendered, screenshotted and compared with the plan by eye; green checks do not count as looking.',
          // CLAUDE.md hard rule 4; docs/OWNER_RULES.md "Quality bar"
          'TypeScript strict and npm run build must pass before any commit that claims done.',
        ],
      },
      courseChanges: [
        // docs/DECISIONS.md "Art medium division" (2026-07-10) and "FINAL FLIP" (2026-07-11)
        {
          id: 'characters',
          date: '2026-07-11',
          title: 'Characters: from a code rig to a sprite matrix, in a day',
          text: 'On 10 July the characters moved to a parametric code rig, because PixelLab cannot split a character into hair and outfit layers. A day later, after playing it, Gitit reversed the call: the side-profile nose read too long, men and women looked alike, and long hair drew in front of the body. Characters became a curated sprite matrix (2 genders × 5 hairstyles × 5 outfits in the first body size) with runtime hair recolouring, and the rig stayed as the fallback.',
          source: 'docs/DECISIONS.md',
        },
        // docs/ART_PIVOT_UO.md (owner's words, W0 rejected, W0.5 projection fix, COMPOSITION_RULES.md "the 25-rule constitution", owner approval)
        {
          id: 'art-pivot',
          date: '2026-07-15',
          title: 'A full art pivot',
          text: 'The bright, cosy look was not what she wanted; she wanted something closer to Ultima Online, and her diagnosis was that everything looked placed rather than part of one scene. The first mock was rejected. Instead of re-rolling the same recipe, the cause was traced to camera projection and grounding, written down as a 25-rule composition guide, and the mock rebuilt until she approved the direction.',
          source: 'docs/ART_PIVOT_UO.md · docs/COMPOSITION_RULES.md',
        },
        // docs/HANDOFF.md "Sync protocol" (BRANCHES from 2026-10-10); docs/OWNER_RULES.md "Quality bar" + "Git / deploy" (2026-10-10)
        {
          id: 'rebuild',
          date: '2026-10-10',
          title: 'A rebuild on a fresh branch',
          text: 'The work was reset into a new v1 on its own branch, taking from the old game whatever was useful; the old game was frozen to hotfixes for the live preview. A new rule came with it: no production before a complete, approved spec.',
          source: 'docs/HANDOFF.md · docs/OWNER_RULES.md',
        },
        // docs/HANDOFF.md START HERE 2026-10-18 (night, "DELIBERATE PAUSE ON ALL BUILDING"; 3 incompatible "version" meanings; "the 27-chapter bible doesn't work" → one chapter at a time)
        {
          id: 'bible',
          date: '2026-10-18',
          title: 'Stop building, write the bible',
          text: 'Plans were spread over several roadmaps that used the word "version" in three incompatible ways, so all building paused until a full game bible existed. A first 27-chapter draft did not work, and it was rebuilt one chapter at a time: questions about every item first, then the chapter, then her approval.',
          source: 'docs/HANDOFF.md · docs/bible/',
        },
      ],
      // Measured 2026-11-04 in C:/Users/gitit/Git/Workplace/Games/Wildhearth,
      // branch v1-rebuild, git-tracked files only:
      //   git rev-list --count HEAD → 1079; first/last commit 2026-07-03 / 2026-11-02
      //   git ls-files src | grep .ts$ → 343 files; | xargs cat | wc -l → 72088
      //   git ls-files src/systems | grep .ts$ | grep -v /ai/ → 108 (+16 in src/systems/ai)
      //   git ls-files src/assets/pixellab | grep .png$ → 974
      //   git ls-files verify | grep .mjs$ → 77; of them using lib.mjs/puppeteer → 69, calling screenshot( → 63
      //   git log --format='%(trailers:key=Co-Authored-By,valueonly)' | grep -ci claude → 947
      metrics: {
        asOf: 'Measured on 4 November 2026 from git and the source tree (branch v1-rebuild, tracked files only).',
        items: [
          { id: 'commits', value: '1,079', label: 'commits', measures: 'From 3 July to 2 November 2026', how: 'git rev-list --count HEAD' },
          { id: 'lines', value: '72,088', label: 'lines of TypeScript', measures: '343 files in src/, comments and blank lines included', how: 'wc -l' },
          { id: 'systems', value: '108', label: 'system modules', measures: 'Files in src/systems, plus 16 more in the AI layer' },
          { id: 'sprites', value: '974', label: 'PixelLab images', measures: 'PNG sprites, sheets and tiles in src/assets/pixellab' },
          { id: 'checks', value: '77', label: 'verification scripts', measures: 'In verify/; 69 drive a headless browser and 63 take screenshots. No unit-test framework.' },
          { id: 'co-authored', value: '947', label: 'commits co-authored with Claude', measures: 'Commits whose message carries a Co-Authored-By: Claude trailer' },
        ],
      },
      // The landing at https://wildhearth.gititregev.com/ goes public in the
      // same deploy as this page (owner, 2026-11-05: both approved); the game
      // behind it stays password-locked, and the landing says so itself.
      productSite: {
        note: 'Has its own product site.',
        url: 'https://wildhearth.gititregev.com',
        label: "See the game's own site",
      },
    },
    meta: {
      title: 'Wildhearth — how a browser life-sim is built · Gitit Regev',
      description:
        'A technical case study of Wildhearth: a code-first life-sim in the browser with an optional AI layer that never runs per frame, dual-path art, a 72× world engine, and how it is built and verified with AI agents.',
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

/**
 * The pages that are actually published (2026-11-05). A page goes in here
 * only once the owner approved it in its TECHNICAL form (her 2026-11-04
 * ruling); the wave 1+2 marketing-style drafts stay in the code but are not
 * routed, not linked from the home cards and get no static head, so a deploy
 * never publishes an unapproved page. Add an id here when she approves it.
 */
export const PUBLISHED_PAGE_IDS: ReadonlySet<ProjectPageId> = new Set<ProjectPageId>(['wildhearth']);

export const publishedProjectPages: ProjectPageContent[] = projectPagesContent.filter((page) =>
  PUBLISHED_PAGE_IDS.has(page.id)
);

/** The published page for a pathname, or undefined (App then renders the home page). */
export function findProjectPage(pathname: string): ProjectPageContent | undefined {
  const p = pathname.replace(/\/+$/, '') || '/';
  return publishedProjectPages.find((page) => page.path === p);
}
