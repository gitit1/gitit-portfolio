# site-verify — rendered verification for gititregev.info

Moved into this repo 2026-08-05 (hygiene WP-H2) from `thinking-trail/tools/site-verify`,
where it originated; that copy is retired in favor of this one. Run everything
from `gititregev.info` now — see below.

Why this exists: on 2026-07-25 a build agent honestly reported it had no browser,
so every visual claim it made was code reasoning only. A real rendered pass found
**four genuine defects the reasoning had missed** (page-wide horizontal overflow
at every viewport, nav labels wrapping mid-label, a container width "fix" that
changed nothing, and a dark elevation step of 1.10:1 that violated the owner's
standing dark-mode rule). Do not accept visual claims without running this.

## Run it

```sh
# run from gititregev.info (this repo):
# 1. build the site
cd c:/Users/gitit/Git/Workplace/gititregev.info
npm run build                      # output dir is build/, NOT dist/

# 2. serve the production build — port 4012 only (3012 is the owner's)
npx vite preview --port 4012 --strictPort

# 3. in another shell, run the harness
node tools/site-verify/verify-hero.cjs
```

Screenshots land in `./shots/` next to the script. Current state: **34/34 PASS**.

Playwright resolves from the npx cache path hardcoded at the top of the script;
Chromium is already downloaded. If that path ever breaks, repoint `PW` rather
than adding a dependency to the site repo.

## What it asserts

Viewports 1920 (the owner's real Full HD screen), 1440, 390 — each in EN and HE:

- avatar sits inline **beside** the name, same row, and flips to the leading side in RTL
- no project-name tab row and no dots (removed on purpose: does not scale to 20 projects)
- prev/next arrows, an `NN / NN` position counter, a visible All-projects anchor
- nav labels stay single-line (no "How I / build" mid-label wrap); header never overflows
- **no horizontal overflow anywhere** — the defect that was 1501/1440 and 702/390
- container width: `clamp(1120px, 75vw, 1700px)` → widens to 1440px at 1920.
  ⚠️ The 1440 assertion deliberately expects **1120px** — the floor legitimately
  holds there (1120/1440 is already ~78%). That is not a bug; do not "fix" it.
- hero stays raw `.section hero`, full-bleed over the electrons canvas
- all portfolio images actually decode (they resolve through a helper-function
  `new URL()`, which Vite cannot statically analyse — this is the only thing
  proving they are not silently 404ing)
- rotation really fires at ~8s, and really **stops for good** after a deliberate click
- slab-vs-base contrast **≥1.25:1 in both themes** plus a real border/shadow —
  the owner's standing rule is elevation step *plus* border, never instead of
- the two themes produce genuinely different slab and base colours

WP-G4 additions (2026-07-25) — the Projects dual door:

- `#projects` is a real page slab holding EXACTLY the 4 registry projects, in
  registry order, with decoded (lazy) art and capability chips (5,7,6,7)
- honest affordances: only MFL + assaf are links (external); Wildhearth +
  Homebase are plain articles until their case pages ship — and **zero
  `#/case/` anchors anywhere** (no router exists; the LIVE_CASE_ROUTES gate)
- the spotlight's "All projects" anchor really targets `#projects`
- legacy markup (`proj-grid`/`modal`/`swiper`) fully gone
- graph door: visible ≥1200px beside the index, hidden at 390; svg is
  aria-hidden with zero tab-reachable elements (the index is the accessible
  door); 4+14 nodes / 25 edges (the curated evidence-backed data); layout
  identical across reloads (no per-load randomness); hover-sync works in both
  directions (graph node ⇄ index card)
- cards clear the elevation rule one level up: ≥1.1:1 vs the slab + border +
  shadow in both themes
- HE: projects chrome translated; the MFL tagline stays the verbatim English
  quote (owner-locked)
- the old whole-document image check is now scoped to `#home` (hero) because
  card images are `loading="lazy"` below the fold — they get their own
  post-scroll decode checks at every viewport instead (strictly wider coverage)

`build-review.cjs` turns `shots/` into the owner-facing RTL Hebrew review page
(screenshots embedded as data URIs, since the Artifact CSP blocks external hosts).
Republish to the **same** artifact URL recorded in `docs/HANDOFF.md`.

## Rules when extending

Add assertions; never weaken or delete one to make a run go green. If an
assertion fails, the site is wrong until proven otherwise.
