# HANDOFF — gititregev.info (site redesign)

> Moved in from thinking-trail/docs/HANDOFF.md on 2026-08-05 (hygiene WP-H1);
> that file keeps only a pointer here.

Purpose: let a NEW session pick up the site redesign with zero other context.
Newest state at top.

## Current state

- Branch `redesign/gitit-os` @ commit `fc18db2`, tree CLEAN, nothing uncommitted.
- Verification harness: **68/68 green** (`verify-hero.cjs`).
- Site is in **PREPARATION mode** until deployed. Owner's ruling (2026-07-25):
  **"בעיקרון כולם מתים עד שאתחיל להעלות לשרת ונקשר לאמת, כרגע רק נכין אותם."**
  → dead links (Wildhearth/Homebase have no case pages yet) are NOT a defect
  to re-flag; severity is deferred until she deploys and wires it to reality.
- Work is PAUSED by the owner since 2026-07-26 — "back in a few days."

## 🔔 THE ONE OPEN ITEM — do this first when she returns

**R5-b awaits her pick.** Open the decision artifact for her before doing
anything else and wait — she asked for this explicitly (2026-07-26):
**"תציץ לי בפעם הבאה שאחזור את הartifact, אני אבחר ומשם נמשיך."**

**Decision artifact:** https://claude.ai/code/artifact/f4dbedf2-880c-434b-9a38-2865f9e8ed34
(phone-openable, RTL Hebrew, real screenshots + measured numbers)

Three options, all really built/measured/screenshotted/reverted (nothing on
the branch — verified clean at `fc18db2`). Target: fill ≤0.98 at her REAL
viewports (below).

| option | how-i-build | experience | projects |
|---|---|---|---|
| baseline | 1.020 / 1.197 | 1.006 / 1.141 | 1.013 / 1.136 |
| **A** dense (2-col) | 0.969 ✅ / 1.169 | **0.915 ✅ / 0.912 ✅** | 0.991 / **1.239 worse** |
| **B** progressive disclosure | 1.091 ✗ / 1.277 ✗ | 0.915 ✅ / 0.912 ✅ | 1.000 ✗ / 1.211 ✗ |
| **C** trim for the 21" only | 0.978 ✅ / 1.151 | 0.951 ✅ / 1.080 | 0.958 ✅ / 1.126 |

(columns are 1920×945 / 1440×765; target ≤0.98)

**Architect's recommendation: A for Experience + C for the other two** — 21"
passes all five sections; laptop's Experience passes too, leaving how-i-build
and projects overflowing ~13–15% there. B is rejected outright (made two
sections WORSE than baseline — what it hid was never the height driver).

⚠️ **THE UNTRIED LEVER — try this first on resume, nobody has measured it
yet:** B's failure revealed the capability GRAPH PANEL sets the Projects
section's height, not the card grid. The graph is already hidden below
1200px width (decorative-nav, index is the accessible door — G4 ruling).
**Raising that hide-breakpoint to also cover the 1440px laptop could bring
Projects under target without hiding any real content.**

Honest limit to restate to her if asked again: ≤0.98 on BOTH screens is not
reachable without either hiding content or breaking the 10px/13px legibility
floors (type scale is exhausted — smallest already 9.9px). If the laptop
matters as much as the 21", something gives — her call, don't pick silently.

Do NOT re-ask her for viewport numbers (derived from her machine, see below).

## Her REAL viewports — derived from her machine 2026-07-26, do not re-ask

The architect read her display config directly; she never had to type
anything.

```
DISPLAY1 (laptop)   2880x1800 physical @ 200% scaling -> 1440x900 CSS, work area 1440x852
DISPLAY2/3 (21")    1920x1080 @ 100%                  -> work area 1920x1032
Chrome              maximized on a 21", bookmarks bar OFF, zoom 100%
                    (no per-host zoom override for the site)
```

| her screen | REAL viewport | reduction needed to reach ≤0.98 |
|---|---|---|
| **21" (primary)** | **1920 × 945** | ~5% |
| **laptop** | **1440 × 765** | ~18% (the hard case) |

The only unmeasured number is Chrome's 87px UI height (standard for 100%
zoom, bookmarks bar off); if she ever turns the bookmarks bar on, subtract
~30px from both heights.

## Locked decisions that govern the site

- **Design system:** dark-first + graphite light + electric indigo `#8c9bff`
  accent + `ElectronsField` interactive pointer-reactive background (dots+lines).
  Dark base `#0c0e12`-ish; light = elevated soft graphite, not paper. Both
  "worlds" stay dark-leaning per owner's directive ("גם הבהיר הוא כהה מעודן").
- **Section structure (do not restructure):** `home` · `how-i-build`
  (renamed from `capabilities`) · `experience` · `projects` · `ai-native` ·
  `contact` — `src/config/sections.ts`. Every section reads as a FULL PAGE,
  own slab with elevation step + border/shadow, never bleeds into neighbors.
- **Spotlight-in-hero:** rotating project spotlight lives INSIDE the home
  hero (not a block after it), one project large at a time. Rules: 8s dwell
  (`ROTATE_MS`), crossfade <1s (`TRANSITION_S`, both named constants atop
  `ProjectSpotlight.tsx`), prev/next arrow controls + `NN / NN` position
  counter + one "All projects" anchor to `#projects` — **no name-tabs, no
  dots** (owner: doesn't scale past ~20 projects). Pause on hover/focus, stop
  auto-advance permanently after a deliberate click/keyboard use,
  `prefers-reduced-motion` = static first slide, real `<a>` anchors behind
  the art (not JS-only).
- **Fit-one-screen bar: fill ≤0.98** at her real viewports (1920×945 and
  1440×765) — this is R5-b, still open (see above). >1.0 is overflow; the
  round-4 "≤1.02" tolerance was rejected as still-overflow.
- **WCAG AA enforced and verified:** `audit-contrast.cjs` → 253 elements
  measured/theme, **0 failures both themes** (R5-a, commit `4326e5c`).
  `--text-faint` converged onto `--text-muted`'s value (only way to clear
  4.5:1 on `--surface-feature`); `.is-dim` graph state de-emphasizes by
  colour tier, not opacity (opacity dimming can never pass AA on this
  surface — even pure white at 0.25 only reaches ~2.18:1 vs the 3:1 floor).
- **Centering:** head+body centred as ONE block in every `.section--page`
  slab — slack distributes above the head and below the body, **never
  between them** (R5-d, commit `fc18db2`). Technique: `margin-top: auto` on
  `.section__head` + `margin-bottom: auto` on `.section__body` (the only two
  auto margins on the flex column) — safe by construction, flex auto margins
  never go negative, so an overflowing section falls back to flush-top
  automatically. Contact is the reference model; AI-native now matches it.
- **MFL tagline kept VERBATIM:** `The home of gay women couples' fanfics.`
  — the real `<h1>` from her own pre-renovation MFL code. Never translate in
  HE; it is a quote, shown as English.
- **TriPick + Chat Room DROPPED from the site** (portfolio registry =
  4 public projects only: wildhearth · mfl · assaf-friends-games · homebase).
  Legacy art (`src/styles/assets/projects/**`) kept on disk for a future MFL
  case-page gallery; only the code retired.
- **`LIVE_CASE_ROUTES` gate:** no hash router exists yet; case links
  (`#/case/*`) only activate once a slug is added to this list in
  `portfolio.ts`. Until then MFL falls back to its live external site,
  Wildhearth/Homebase show an honest "case in documentation" chip. This is
  WHY dead links are currently fine (preparation-mode ruling above).
- **Mobile (390px) is explicitly the NEXT dedicated WP** — for now it only
  has to be functional and honest (no overflow/clipping/unreachable
  content); the bespoke mobile design is future work.
- Bilingual EN(default)/HE with RTL; current-role wording locked:
  `מכבי · דרך SQLink Group`.

## Verification harness

Lives in THIS repo as of WP-H2 (same hygiene session): `tools/site-verify/`
— `verify-hero.cjs` (68/68), `audit-contrast.cjs`, `audit-centering.cjs`,
`measure-fills.cjs`, `build-review.cjs`, README.md, `shots/`.

Run order:
```sh
npm run build                                  # output dir is build/, not dist/
npx vite preview --port 4012 --strictPort      # serve production build
node tools/site-verify/verify-hero.cjs         # in another shell
```

Claude tests ONLY on port 4012 — **3012 is the owner's**, never touch it.

⚠️ The 1440px assertion in `verify-hero.cjs` deliberately expects
`containerWidth == 1120` there — the floor legitimately holds at that width
(1120/1440 is already ~78%). **Don't "fix" it**; the "does it widen" check
lives in the 1920 block (`clamp(1120px, 75vw, 1700px)` → 1440px at 1920).

Rule when extending any of these tools: add assertions, never weaken or
delete one to make a run go green.

## Review artifact (status board — republish to the SAME url)

https://claude.ai/code/artifact/5cd236dd-c104-4dda-8436-45ec7c03defe

Still OWED (first admin task whenever work resumes): a round-5 section, plus
green ✔ נסגר tags for R5-a / R5-c / R5-d (all closed — see below). Regenerate
with `tools/site-verify/build-review.cjs` (embeds `shots/` as data URIs,
since the Artifact CSP blocks external hosts) and republish to the same URL,
never a new one.

## What's already closed (context, not action items)

- **R5-a (AA contrast)** — ✅ closed, commit `4326e5c`. See "WCAG AA" above.
- **R5-c (AI-native centering)** — ✅ superseded/closed by R5-d. Diagnosis
  was that raw margin numbers were misleading (AI-native was arithmetically
  *better* centred than Contact already); the real defect was perceptual —
  fixed properly by R5-d's whole-block centering.
- **R5-d (centre head+body as one block)** — ✅ closed, commit `fc18db2`,
  `global.scss` only. Verified safe against overflow at 1920×768/864/945
  across all five sections (head inset stays a normal +29…+33px, never
  negative).
- **R5-b (whole-screen fit)** — ⏸ the only open item, see top of this file.
- WP-G0 through WP-G7 (portfolio registry, section separation, how-i-build
  merge, spotlight-in-hero, projects dual-door with capability graph,
  lightbox/featured-surface, fluid fit-to-viewport, nav-landing fix) are all
  ✅ done and architect-verified. Full detail (commit hashes, per-round
  measurements) lives in thinking-trail's git history if ever needed — not
  reproduced here to keep this file lean.

## Next after R5-b (owner-set order, roughly)

1. Mobile WP (dedicated bespoke 390px design — deferred from every round so far).
2. Case pages: Wildhearth (game-native world, real font+assets already
   identified) and MFL (dossier, full arc — stat strip + accordion). Unlocks
   the case CTAs via `LIVE_CASE_ROUTES`.
3. Step-ג: classify `assaf-friends-games` as `public` in thinking-trail's
   project classification (currently in the portfolio registry with its real
   URL but not formally flipped) + map its ChatGPT conversations.

## Gotchas for a fresh session

- Site repo work happens ONLY on `redesign/gitit-os`. Never push. Never touch
  port 3012 (owner's dev server) — Claude/agents test on 4012 only.
- No visual claim is trustworthy from code-reasoning alone — a 2026-07-25
  incident found 4 real defects (page-wide overflow, nav wrap, a container
  fix that did nothing, under-target dark elevation) that pure reasoning had
  missed and called done. Always render + run the harness before reporting
  a visual change finished.
- `gititregev.info/.npmrc` is mis-encoded (UTF-16) — npm can't parse
  `legacy-peer-deps` and warns on every run. Known, reported to owner, NOT
  fixed — awaiting her go-ahead, not urgent.
- An orphan `vite preview` may still hold port 4012 from a prior session —
  harmless (serves `build/` from disk) but kill it if a fresh
  `--strictPort` preview is needed and the port is busy.
