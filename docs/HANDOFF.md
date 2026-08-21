# HANDOFF — gititregev.info (site redesign)

> Moved in from thinking-trail/docs/HANDOFF.md on 2026-08-05 (hygiene WP-H1);
> that file keeps only a pointer here.

Purpose: let a NEW session pick up the site redesign with zero other context.
Newest state at top.

## 2026-08-21 — VERIFIED: site role vs thinking-trail, and the GO-LIVE plan for gititregev.com

Owner (2026-08-21): "thinking-trail אמור עכשיו רק להביא תמונה מוגמרת של
פרויקטים לאתר הזה ולא להכיל את הדשבורד שלו … לפני שנדחף אותו לשרת החדש …
הוא האתר הראשי שאמור לעלות שכותבים gititregev.com". Architect verified
against code + thinking-trail + DNS + Coolify, then re-sequenced the plan.
Owner-facing version (Hebrew RTL): `docs/PLAN-GOLIVE-2026-08-21.html`.

### What was verified (facts, 2026-08-21)

| claim | reality |
|---|---|
| Site contains thinking-trail's dashboard/cockpit | **No.** Repo-wide grep for cockpit/dashboard/5203/thinking-trail/feed in `src api netlify scripts` → zero code hits. The site is public-face only. ✅ already matches the ruling |
| Site consumes a thinking-trail feed | **Never wired.** thinking-trail's `npm run export-feed` writes `data/feed/how-i-build.json` (eras/stories/journal, preview from 2026-07-22, 3 stories/5 journal) inside ITS repo; nothing imports it here. Current `HowIBuild.tsx` is hand-authored from `data/skills.ts`. Confirmed by thinking-trail HANDOFF 2026-08-21 ("that wiring to the site was never built … dashboard role now belongs to the Hub (Wave 6)") |
| thinking-trail's dashboard | Lives in thinking-trail itself (localhost:5203, loopback-bound, token, CORS allowlist) and is being framed into the **Homebase Hub** (Wave 6). Homebase DECISIONS 2026-08-14/21: thinking-trail is a Homebase platform service. So the "site cockpit / phone login" phase-2 idea (DECISIONS 2026-07-23 in thinking-trail, STATUS goal "חיבור לאתר (התחברות מהטלפון)") is **superseded** — needs a one-line correction in thinking-trail's STATUS.md + DECISIONS.md (NOT done here — other repo, owner must say so) |
| `STATUS.md: server: live https://gititregev.info` | **False.** `gititregev.info` has NO DNS at all (no A, no NS) — domain gone/expired. The old site is offline |
| `gititregev.com` | A → 204.168.255.68 (Hetzner hub) + www CNAME, but **no Coolify app bound** to it → visitors get a TLS trust error. Coolify has only `assaf-friends-games` + `shipping-the-rainbow` |
| Deployable on Coolify as-is | **No.** No Dockerfile, no Node server; `api/chat.ts` + `api/mcp.ts` are web-standard handlers packaged only for Netlify/Vercel functions |
| External links in `portfolio-content.ts` | **2 dead:** MFL → `http://www.myfanficslibrary.com` (GoDaddy parking, 114 bytes); Assaf → `assaf-friends-games.netlify.app` (404). Live truth: `https://str.gititregev.com`, `https://assaf.gititregev.com` |
| Hard-coded `gititregev.info` in code | `src/data/profile.ts` (origin/mcpUrl/resumeJson/llmsTxt), `index.html` (canonical, og:url, og:image, twitter:image, JSON-LD url) — all must become `gititregev.com` (canonical-domain decision 2026-07-18) |
| Career data | ✅ current (`experience.ts` has Maccabi via SQLink Oct 2025–Present, Browzwear ended Jan 2025, F5) |
| Owner-content placeholders (memory 2026-07) | still to re-check: AI positioning paragraph + hero phrases (`profile.ts`), skill blurbs (`skills.ts`), Independent bullets, Homebase entries — WP-D3 lists them for her |

### Owner answers (2026-08-21, later the same day) — the ledger below is re-sequenced on them

1. **Order: go live FIRST, R5-b after** ("ההמלצה שלך").
2. **gititregev.info is no longer hers — not renewing.** Everything moves to
   .com, and the LOCAL FOLDER renames `gititregev.info` → `gititregev.com`
   (owner: "תשנה גם את שם התיקיה"). Rename attempt from this session failed
   ("Device or resource busy" — folder open in VS Code/session). **Owner runs
   after closing the window:**
   `Rename-Item C:\Users\gitit\Git\Workplace\gititregev.info gititregev.com`
   Already prepared for it: thinking-trail `config/roots.json` alias
   `gititregev-info → gititregev-com` (history stays one row); dev-ports
   registry entry updated. After the rename: copy the Claude memory dir
   `~/.claude/projects/c--Users-gitit-Git-Workplace-gititregev-info/memory`
   to the `...-gititregev-com` sibling (new sessions key on cwd).
3. **MFL link: NONE for now.** "str קיבל שינוי צורה" — the rebuilt fanfic site
   changed shape; the only project she considers ready to go up *as a
   project* right now is **assaf-friends-games**. So D1: MFL card keeps its
   verbatim tagline, loses the external link, state = in-development with an
   honest label; Assaf → `https://assaf.gititregev.com`.
4. **thinking-trail docs fixed** (her "תתקן"): commit `e8b904f` there
   (STATUS goal, DECISIONS 2026-08-21 entry, HANDOFF note, roots alias).

### CORRECTED division of roles (owner: "thinking-trail אמור לספר עליי ועל דרך החשיבה שלי ולהזריק זאת באתרי נחיתה לכל פרויקט")

My first write-up ("finished picture of projects" = project cards) was too
narrow. What was agreed, and stands:

- **gititregev.com (this repo)** = the public face ONLY. No dashboard, no
  status board, no private route, ever. Shows projects only as approved
  portfolio entries (DECISIONS 2026-07-23 in thinking-trail: "all project
  status PRIVATE").
- **thinking-trail** = private producer of HER STORY: approved, curated
  content only (journal + showcase stories + the per-project method arc
  "intent → interrogation → decisions → plan → direction → result", each
  step anchored to a real artifact — DECISIONS 2026-07-20/22/23/24 in
  thinking-trail). Delivered as a build-time JSON snapshot the site copies
  in (`npm run export-feed` already exists; today it writes
  `data/feed/how-i-build.json`, preview, 3 stories / 5 journal). The site
  renders it in TWO places: (a) the How-I-Build section, (b) **every PROJECT
  LANDING PAGE** ("what it is → how it was built → receipts", skinned in the
  project's own world per the 2026-07-24 landing-page decision). No status,
  no waiting-items, no dashboard. Contract + wiring = WP-D6 (after go-live);
  first landing page = **Assaf's games** (2026-07-23 opener, reconfirmed
  2026-08-21). Until then `portfolio-content.ts` stays hand-maintained.
- **Homebase Hub** = where the dashboard/cockpit is viewed (Wave 6).

### GO-LIVE plan — dispatch ledger (architect plans/verifies; agents build)

Bar for "live": `https://gititregev.com` + `www` answer 200 with a valid
Let's Encrypt cert · chat streams · `/api/mcp` initialize + 5 tools ·
`/llms.txt` + `/resume.json` served · Lighthouse ≥90 ×4 (mobile+desktop) ·
zero dead links on the live page (each CTA reaches a live target or shows
the honest chip) · screenshots at 1920×945 / 1440×765 / 390 match the
local build · `verify-hero.cjs` 68/68 on the prod build.

| WP | deliverable | tier | status |
|---|---|---|---|
| D0 | docs truth pass: this section, STATUS.md (Hebrew), plan HTML + artifact | architect | ✅ 2026-08-21 |
| D1 | domain + links truth in code: every `gititregev.info` → `gititregev.com` (`profile.ts`, `index.html`, README); MFL → `https://str.gititregev.com` (**owner confirm, see decisions**); Assaf → `https://assaf.gititregev.com`; `api/chat.ts` same-origin allowlist covers `gititregev.com` + `www`. Gate: `grep -rn "gititregev.info" src api index.html` = 0; `npm run build` + lint clean; `verify-hero.cjs` 68/68 on 4012 | sonnet | pending |
| D2 | Coolify packaging: `server/index.mjs` (Node 22, zero new deps: `node:http` + global `Request`/`Response`) serving `build/` static + SPA fallback, routing `/api/chat` + `/api/mcp` to the existing handlers through a small Node→web-standard adapter (streaming preserved), `/healthz`; multi-stage `Dockerfile` (node:22-alpine build → runtime, non-root, `PORT` env, default 3000) + `.dockerignore`; `npm run start`. Keep `netlify.toml`/`vercel.json` (portability goal stays). Gate: local `PORT=4012 node server/index.mjs` → page 200, `/healthz` 200, chat streams with `ANTHROPIC_API_KEY` from env, MCP `initialize` answers; `docker build` if Docker exists locally, else on the hub | opus | pending |
| D3 | read-only content pre-flight: list every placeholder/owner-pending copy with file:line + current text, for her to fill or approve as-is (never invent her words) | sonnet (explore) | pending |
| D4 | deploy: **push needs her word** (branch `redesign/gitit-os` → decide: merge to `main` or deploy the branch); Coolify project `gititregev-site`, app from `gitit1/gitit-portfolio`, build_pack=dockerfile, `is_static=false`, domains `https://gititregev.com` + `https://www.gititregev.com`, env `ANTHROPIC_API_KEY` (**hers**), `ALLOWED_ORIGIN=https://gititregev.com`; deploy key registration = **her script run** (classifier blocks key files, see hub-server skill); trigger deploy via API | architect + owner | pending |
| D5 | live gate (the bar above) + screenshots + Lighthouse; then flip `STATUS.md` to `server: live https://gititregev.com` | architect | pending |
| D6 | AFTER live: thinking-trail → site **story feed wiring** — (a) extend/confirm the feed contract (`how-i-build.json`: eras/stories/journal + per-project slices with the method arc + receipts, approved-only, he+en); (b) site consumer: How-I-Build section reads the feed (replacing the hand-authored blocks where approved content exists), and the **Assaf's-games landing page** (first `LIVE_CASE_ROUTES` entry, hash route, skinned in the game's world) renders its project slice; (c) curation: owner approves the 8 pending drafts + Assaf's ChatGPT-era mapping (thinking-trail step ג). Then R5-b pick, Mobile WP, Wildhearth/MFL landing pages when she calls them ready | later | not started |

### Owner decisions opened by this verification — ALL ANSWERED 2026-08-21 (see "Owner answers" above; kept for the record)

1. **Order:** go live FIRST with the current build (R5-b polish after) — architect's recommendation; or finish R5-b first. Counter-case: she explicitly wanted to pick R5-b "ומשם נמשיך"; but today `gititregev.com` shows an error page, and R5-b changes nothing a visitor would call broken.
2. **gititregev.info:** does she still own it? If yes → renew + 301 to .com (hub Traefik or registrar forward). If no → nothing; all references move to .com regardless (D1).
3. **MFL link target:** `https://str.gititregev.com` now (live), switch to `myfanficslibrary.com` once that domain is connected; or wait. Recommendation: str now.
4. **Push + key + deploy key:** three actions only she can authorize/run (push to GitHub; her `ANTHROPIC_API_KEY` in Coolify = paid usage; deploy-key script).
5. **thinking-trail doc mirror:** approve a one-line correction in thinking-trail STATUS.md goal + DECISIONS (site gets snapshot only; dashboard = Hub). Done in a thinking-trail session, not here.

## Current state

- Branch `redesign/gitit-os` @ commit `b4d1f4c` (+ the 2026-08-21 docs commit); tree clean after it. For DEPLOY work read the 2026-08-21 section above first — it supersedes the "preparation mode" framing below.
- Verification harness: **68/68 green** (`verify-hero.cjs`).
- Site is in **PREPARATION mode** until deployed. Owner's ruling (2026-07-25):
  **"בעיקרון כולם מתים עד שאתחיל להעלות לשרת ונקשר לאמת, כרגע רק נכין אותם."**
  → dead links (Wildhearth/Homebase have no case pages yet) are NOT a defect
  to re-flag; severity is deferred until she deploys and wires it to reality.
- Work is PAUSED by the owner since 2026-07-26 — "back in a few days."

## 🔔 R5-b — open owner pick (as of 2026-08-21 sequenced AFTER go-live, see decision 1 above)

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
