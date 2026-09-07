# HANDOFF — gititregev.info (site redesign)

> Moved in from thinking-trail/docs/HANDOFF.md on 2026-08-05 (hygiene WP-H1);
> that file keeps only a pointer here.

Purpose: let a NEW session pick up the site redesign with zero other context.
Newest state at top.

## 2026-09-07 (later) — SHIPPED. The 08-22/08-23 work is LIVE, verified in a real browser.

Owner, 2026-09-07: "אז קומיט ודחיפה ופרסום גירסא" + "א - אישרתי עכשיו".

- Gates re-run before pushing: `npm run lint` clean · `npx tsc --noEmit` clean · `npm run build` ok.
- Pushed `redesign/gitit-os` and fast-forwarded `main` (`ab8fc41` → `d6eb9c5`), both on
  `gitit1/gitit-portfolio`. Coolify deploy `hbhelxfmbet6jguaqqqqcv5t` → **finished**, commit
  `d6eb9c5`.
- **LIVE verification (real browser at 1920×945 against `https://gititregev.com`, screenshots
  looked at, not inferred):** section fills EN `how-i-build 0.969 · experience 0.928 ·
  projects 0.964 · ai-native 0.928 · contact 0.928`; HE `how-i-build 0.950`, rest identical —
  **all ≤ 0.98**. `dir` flips to `rtl` on toggle; the method rail renders **6 steps in Hebrew
  after a mid-scroll language switch** (כוונה · תשאול · החלטות · תוכנית · הנחיה · תוצאה,
  opacity 1) — the `1a9566d` bug fix is confirmed live. **0 console errors.** Experience is
  two-column with the newest role top-RIGHT in HE (column-major, correct).
- Shots: scratchpad `…/scratchpad/live/{en,he}-{top,how-i-build,experience,projects,ai-native,contact}.png`.

### Honest finding from looking at the live HE page (widens the open CV-language item)

It is not only the CV. In Hebrew, **`src/data/skills.ts` renders in English too** — the three
capability cards (PRODUCT / ENGINEERING / AI) show English headings and English sentences inside
the Hebrew page, next to `experience.ts`'s English roles and bullets. Owner ruled 2026-09-07:
**company/product names stay English** — the open part is the role lines and the descriptive
sentences, which need her approved wording (never invented here).

### README rewritten (owner: "תחליט אתה")

Decisions taken and why: kept **English** (the repo's readers are recruiters and developers; the
site itself carries the Hebrew); led with the live URL and the AI-native trio (MCP + llms.txt +
grounded chat) because that is the only genuinely differentiating claim; **removed the false
"deployed to Vercel" framing** — the container is how it actually runs, with Netlify/Vercel kept
as the portability story; **described the server generically** ("a private self-hosted server
behind a reverse proxy") — the repo is PUBLIC, and provider/app identifiers buy nothing for the
reader; added the verification harness section (it is evidence of how she works).

## 2026-09-07 — RESUME CHECK (state verified against reality, not memory) + thinking-trail correction

Verified this session by probing/greping, not by reading old notes:

- `redesign/gitit-os` is **7 commits ahead of `origin/main` and of `origin/redesign/gitit-os`**
  (`7550e23 … 6fae23d`). Nothing from 08-22/08-23 is on GitHub. Coolify deploys `main`
  from `gitit1/gitit-portfolio` with **no auto-webhook** → the LIVE site still serves the
  `ab8fc41` build: no R5-b layout, no D7 a11y fixes, and the HE method-rail bug is live.
- Live probes: `https://gititregev.com/` 200 · `/healthz` 200 · `/llms.txt` 200 ·
  `POST /api/chat` with a good Origin → **500 `{"error":"Server not configured"}`**.
  `ANTHROPIC_API_KEY` is STILL absent in Coolify (unchanged since D4, 2026-08-22).
- Repo remotes: `origin` = `gitit1/gitit-portfolio` (public), `old-origin` =
  `gitit1/gititregev.info`. README still calls **Vercel/Netlify the deploy target** and
  never mentions the self-hosted hub that actually serves the site → README rewrite opened
  by the owner 2026-09-07.

### thinking-trail: what changed in Homebase, and what it means HERE

Owner asked (2026-09-07): "הפרדנו את thinking-trail — קיבענו את זה פה?"

What actually happened, read from Homebase's own docs:
1. **2026-08-21 (Homebase WP-5.2)** — thinking-trail's folder MOVED INTO the Homebase
   workspace (`Homebase/thinking-trail`, remote `git-homebase/thinking-trail`). Its
   `config/roots.json` already aliases `gititregev-info` → `gititregev-com`, so renaming
   this folder will NOT split this project's history.
2. **2026-08-26 (Homebase docs HANDOFF, V2 design brief)** — the brief **PROMOTES**
   thinking-trail: it comes OUT of Hub (`Hub → /development`) and becomes its own
   top-level host in the global nav (`מרכז · ניהול הבית · מסלול החשיבה`), and it must not
   be duplicated as a card/summary/widget (the two Center work widgets come off the Life
   board). That is the "separation" — separated from the **Hub**, still inside Homebase.

Consequence for this repo: **none technically.** Re-verified by grep 2026-09-07 — the site
has ZERO code contract with thinking-trail (`src api netlify scripts` → no hits; only prose
in these docs and in `tools/site-verify/README.md`). `export-feed` still writes
`thinking-trail/data/feed/how-i-build.json` (last written 2026-07-22, preview data) and
nothing here consumes it. The load-bearing site rule is unchanged and still recorded above:
**the site never shows the cockpit — it receives an approved story snapshot only (WP-D6).**

Corrected here: the 2026-08-21 line below saying the cockpit "is being framed into the
Homebase Hub (Wave 6)" describes a state that was true on 08-21 and was superseded on
08-26 — the cockpit is being promoted out of Hub into its own Homebase area. WP-D6's
contract (snapshot → site) is unaffected by that move.

## 2026-08-23 — OWNER DECIDED R5-b: option א׳ (calibrate to the 21")

Owner, 2026-08-23, verbatim: **"המלצה א"**. That is the architect's recommendation as
presented in the decision artifact — i.e. the composite:

- `experience` → **option A**, the two-column timeline.
- `how-i-build` and `projects` → **option C**, the measured ~5% vertical trim.
- The laptop (1440×765) is **deliberately allowed to scroll**. It is NOT a gate.
  Nothing is hidden on any screen; that was the whole point of א׳ over ב׳.

Load-bearing fact she should not be surprised by, and which the ledger below reflects:
**A and C do not exist in the code.** The earlier round built, measured, screenshotted and
then REVERTED all three options (artifact footer: "אף אחת משלוש האפשרויות לא נשמרה בענף").
Only their numbers survived. So this is a rebuild against the recorded targets, not a
restore of a saved branch.

### Dispatch ledger — WP-R5b

| WP | deliverable | tier | status |
|---|---|---|---|
| R5b-1 | Rebuild A (experience → 2 columns, column-major so the chronology reads down-then-across, RTL puts column 1 on the right, nothing hidden, single column at 390) + C (measured vertical trim of `how-i-build` and `projects`, spacing only — the type scale is exhausted at 9.9px and no font-size may shrink). Gate: `measure-fills.cjs 1920x945` → **all five sections ≤ 0.98**; 1440 reported but not gated; `verify-hero.cjs` 68/68; `audit-contrast.cjs` 0 failures both themes; lint/tsc/build clean; screenshots of all three sections at 1920×945 in EN and HE | opus | dispatched 2026-08-23 |
| R5b-2 | architect verification: read the diff, re-run every gate independently, LOOK at the six screenshots against the locked design decisions, then commit | architect | ✅ 2026-08-23 commit `ac58f03` |
| R5b-3 | fix: method rail rendered EMPTY in Hebrew after a language switch (found while shooting R5b-1's screenshots, pre-existing) | architect | ✅ 2026-08-23 commit `1a9566d` |

### R5b results — architect-measured, not taken from the agent report

    1920x945 (THE GATE)   how-i-build 0.960 | experience 0.915 | projects 0.954
                          ai-native 0.915 | contact 0.915   -> ALL FIVE <= 0.98 ✅
    1440x765 (reported)   experience 0.912 PASSES TOO (bonus) | ai-native 0.912 |
                          contact 0.912 | how-i-build 1.131 | projects 1.131 (accepted)

Gates re-run by the architect: lint clean · `tsc --noEmit` clean · build ok ·
`verify-hero.cjs` 68/68 · `audit-contrast.cjs` 253 elements/theme, **0 failures both
themes**. Six screenshots at 1920×945 (EN+HE) looked at; column order verified
column-major in both directions (HE puts the newest roles in the RIGHT column).

How it was built: `experience` uses **CSS multicol** (`column-count: 2` on `.timeline`,
gated at `min-width: 1200px`) — NOT a two-track grid, which flows across-then-down and
would scramble the chronology. `break-inside: avoid` on `.tl-item`. `how-i-build` and
`projects` got spacing-only trims; **no font-size changed anywhere** (`git diff | grep
font-size` returns one comment line).

**Honest findings the owner was told about, none of them blocking:**

1. **`experience` now carries visible slack** — headInset 162.5px at 1920. This is the
   locked R5-d whole-block centering behaving exactly as it does on `ai-native` (134px)
   and `contact` (185px), which already passed. Consistent with the rule, but it is the
   most visible aesthetic consequence of option A and the section reads emptier than
   `how-i-build` next to it.
2. **PRE-EXISTING, NOT FIXED — the CV body is English-only in the Hebrew site.**
   `src/data/experience.ts` is monolingual; `Experience.tsx` renders `exp.role`,
   `exp.company` and `exp.bullets` straight from it, and only the eyebrow/title come
   from i18n. So in HE every role title, company and bullet renders in English. This
   **contradicts the locked decision** "current-role wording locked: `מכבי · דרך SQLink
   Group`" — the live HE page shows `Maccabi (via SQLink Group)`. D1b's "Hebrew parity
   … Experience" covered the section chrome only, not the data. Not fixed here: it is
   her copy, and the standing rule is never to invent her words. **Owner decision
   needed** — translate the CV, or accept English CV content inside the Hebrew page as
   deliberate (defensible: role titles and company names are proper nouns).
3. **HANDOFF said "7 roles"; `experience.ts` holds 6** (Maccabi, Independent, Browzwear,
   Apester, Webcollage/Syndigo, F5). The stale count is corrected here. Nothing was
   dropped — all 6 render in both columns, both languages.
4. **`verify-hero.cjs` has one FLAKY assertion**: "nav clicks land the slab flush under
   the header @1920". One run reported `ai-native:548` (scroll had not settled) and two
   immediate re-runs both reported `ai-native:68` and 68/68. Re-run before treating that
   single assertion as a regression.

Deliberately given to ONE agent rather than split per section: the gate is a whole-page
gate (all five sections at once), and two agents would both need port 4012 for
`measure-fills.cjs`, which hard-codes `http://localhost:4012/`.

Explicitly fenced off in the brief: the graph hide-breakpoint stays at 1200px (measured and
rejected 2026-08-22, see below), and the D7 a11y fixes (`ProjectSpotlight` `<h2>`, brand
button with no `aria-label`) must not regress.

## 2026-08-22 (later) — resume after usage-limit stop: a11y follow-ups closed, R5-b lever under measurement

State on resume, verified against reality (not memory):

- `redesign/gitit-os` == `main` == `origin/main` @ `ab8fc41`, tree clean.
- Live probe: `https://gititregev.com/` 200, `/healthz` 200.
- **Chat still unconfigured live** — `POST /api/chat` with a good Origin returns
  `{"error":"Server not configured"}`. `ANTHROPIC_API_KEY` is STILL not set in Coolify.
  This is owner-action #1 and has not moved since D4.

### D7 — a11y follow-ups from the D5 live gate ✅ 2026-08-22, commit `7550e23`

Dispatched to a sonnet agent, then architect-verified independently (diff read, gates
re-run locally, both viewports rendered and LOOKED AT in EN and HE).

| audit | root cause | fix |
|---|---|---|
| `heading-order` | `ProjectSpotlight`'s `<h3 class="spotlight__name">` renders next to the hero `<h1>`, ahead of the first `<h2>` section title in document order → level skip | `<h3>` → `<h2>`. Visually identical by construction: `h1,h2,h3` share one global rule in `global.scss:110`, and the size comes from `.spotlight__name` (`_project-spotlight.scss:99`). Confirmed by rendering, not reasoning |
| `label-content-name-mismatch` | Header brand button had `aria-label={t('goToTop')}` — "Go to top" shares no text with its visible content ("Gitit Regev" / "AI PRODUCT BUILDER") | aria-label dropped; the accessible name now derives from the visible spans. Lang toggle's aria-label now prefixes the visible glyph (`עב — Switch to Hebrew` / `EN — עבור לאנגלית`), covering both dicts through existing `t()` calls with no dict edits |

**Accepted trade-off, recorded so nobody "fixes" it back:** the brand button no longer
announces its purpose to a screen reader — it announces "Gitit Regev AI Product Builder".
Voice control still works on the visible name. `goToTop` is now an ORPHANED dict key in
`en.ts`/`he.ts`/`types.ts:37`; kept deliberately. The strictly-better alternative is
an aria-label built as "name + title + em-dash + goToTop" (passes axe's substring
rule AND announces purpose); it was not taken because the bar was already met and it needs
its own Lighthouse re-verification. Cheap follow-up if anyone touches the header again.

Architect verification (re-run, not trusted from the agent report): `npm run lint` clean ·
`npx tsc --noEmit` clean · `npm run build` ok · `verify-hero.cjs` **68/68** · rendered
1920x945 EN+HE and looked at the shots (RTL mirrors correctly, spotlight name unchanged in
size, nothing clipped) · live DOM outline now `H1 → H2 → H2 → H3 → H3 → H2 → H3 → H3`,
no skips. Agent's local Lighthouse: mobile a11y 0.98 → **1.00**, desktop 0.94 → **0.96**,
both audits FAIL → PASS in both runs. NOT yet re-measured on the live URL — the fix is
committed but **not deployed** (no push, no redeploy this session).

### R5-b — the untried lever is MEASURED and REJECTED (2026-08-22)

The HANDOFF's own warning ("⚠️ THE UNTRIED LEVER — try this first on resume, nobody has
measured it yet") was honoured. Dispatched to a sonnet agent with a measure-only brief;
architect looked at the screenshots and reverted the change (tree clean, nothing committed).

**Lever tested:** raise the capability-graph hide-breakpoint from `1200px` to `1600px`
(`_projects-graph.scss` media gate + the matching comment in `_projects.scss`), so the
panel is hidden at the 1440 laptop and still shown on the 21".

| `#projects` fill | 1920×945 | 1440×765 |
|---|---|---|
| today (baseline, re-measured) | 1.013 | 1.136 |
| with the lever | 1.013 (panel still shown — intended) | **1.103** |
| bar | 0.98 | 0.98 |

**REJECTED — and it also looks worse.** Gain is 0.033 where 0.123 is needed. The reason,
visible in `scratchpad/r5b/lever-projects-1440.png`: with the panel gone, the pre-existing
`repeat(auto-fit, minmax(min(270px,100%), 1fr))` grid reclaims the freed width by going
**2-up → 3-up**, which orphans the 4th card (Homebase) onto a second row that is clipped at
the viewport bottom. The new row eats back nearly all the height the panel's removal saved.

Honest confirmations from the run: **no information is lost** at 1440 with the panel hidden
(all 4 registry projects + their capability chips still render; the panel is aria-hidden
decoration) — so the lever is not *wrong*, just ineffective. `verify-hero.cjs` went 66/68
under the lever; both failures are the two graph-interaction assertions that hard-code
"panel visible at 1440", i.e. expected consequences, not new bugs. They are moot now that
the lever is reverted.

**Do NOT retry this lever.** If anyone wants `projects` under 0.98 at 1440, the remaining
untested idea is forcing a SINGLE row of 4 (lower the `minmax` floor from 270px so auto-fit
picks 4 columns at the ~1120px container) — that touches `.projects-grid`'s column math and
would put cards at ~250px wide, which risks the legibility floors. Not attempted; not
recommended without owner input.

### The reframe this produced — what the R5-b decision ACTUALLY is

Even a perfect `projects` fix does not rescue the laptop: `how-i-build` (1.197) and
`experience` (1.141) at 1440 are the bigger offenders and the graph does not touch them.
The HANDOFF already recorded the honest limit ("≤0.98 on BOTH screens is not reachable
without hiding content or breaking the legibility floors"). So the owner's decision is not
"which technical option" but **which screen must fit**:

- **א׳ calibrate to the 21"** (= the standing A-for-Experience + C-for-the-rest composite)
  — all five sections pass on the 21"; the laptop scrolls ~13–15% on two or three sections;
  nothing hidden anywhere. **Architect's recommendation.**
- **ב׳ make the laptop fit too** — requires hiding content behind a "show more" (option B,
  already measured and failed on its own terms).
- **ג׳ deliberately drop the one-screen bar on the laptop** — do nothing beyond the 21"
  calibration. Practically equivalent to א׳, minus calling it a failure.

Counter-case recorded for her: if she presents herself to recruiters FROM the laptop
(meetings, conferences, away from the desk), the laptop is the screen that matters and the
recommendation flips. Only she knows that.

**Decision artifact updated in place (same URL, per her standing rule):**
https://claude.ai/code/artifact/f4dbedf2-880c-434b-9a38-2865f9e8ed34
Added: the dated "lever measured & rejected" block with both 1440 screenshots, the
which-screen-must-fit reframe with the three plain-Hebrew choices, recommendation +
counter-case + do-nothing outcome; the old "untried lever" note is kept and stamped
✗ נבדק · נפסל rather than deleted; footer records the 2026-08-22 re-measurement.

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
| D0 | docs truth pass: this section, STATUS.md (Hebrew), plan HTML + artifact | architect | ✅ 2026-08-21 (bbde929, 44d8b53) |
| D1 | domain + links truth in code: every `gititregev.info` → `gititregev.com` (`profile.ts`, `index.html`, README); MFL → `https://str.gititregev.com` (**owner confirm, see decisions**); Assaf → `https://assaf.gititregev.com`; `api/chat.ts` same-origin allowlist covers `gititregev.com` + `www`. Gate: `grep -rn "gititregev.info" src api index.html` = 0; `npm run build` + lint clean; `verify-hero.cjs` 68/68 on 4012 | sonnet | ✅ 2026-08-21 commit 084c76f — architect-verified: grep=0, lint/build clean, 68/68 (overlay assertion updated to none,none,ext,none in 44d8b53), screenshots d1-*.png looked at |
| D1b | Hebrew parity: AiNative/Contact/Experience literals moved into the i18n dicts (EN verbatim, HE translated — product names/URLs/code untranslated) | sonnet | ✅ 2026-08-21 commit 2f9f107 — lint/tsc/build clean, 68/68, d1b-*-{en,he}.png looked at (RTL correct, no clipping) |
| D2 | Coolify packaging: `server/index.mjs` (Node 22, zero new deps: `node:http` + global `Request`/`Response`) serving `build/` static + SPA fallback, routing `/api/chat` + `/api/mcp` to the existing handlers through a small Node→web-standard adapter (streaming preserved), `/healthz`; multi-stage `Dockerfile` (node:22-alpine build → runtime, non-root, `PORT` env, default 3000) + `.dockerignore`; `npm run start`. Keep `netlify.toml`/`vercel.json` (portability goal stays). Gate: local `PORT=4012 node server/index.mjs` → page 200, `/healthz` 200, chat streams with `ANTHROPIC_API_KEY` from env, MCP `initialize` answers; `docker build` if Docker exists locally, else on the hub | opus | ✅ 2026-08-21 commit ad8c6b8 — single-file bundle dist-server/index.mjs (2.2 MB), image 239 MB, architect re-ran the smoke on 4012: / 200, /healthz, /resume.json, traversal 404, MCP tools/list = 5 tools, evil-origin chat 403. Chat streaming vs Anthropic NOT verified locally (no key) — verify live in D5 |
| D3 | read-only content pre-flight: list every placeholder/owner-pending copy with file:line + current text, for her to fill or approve as-is (never invent her words) | sonnet (explore) | ✅ 2026-08-21 — result: 7 items; owner delegated the calls ("תחליט אתה"): method-rail step prose → ship step NAMES only (never invent her words); EN-only sections → D1b; profile.ts summary → unchanged (not blocking) |
| D4 | deploy. Architect decisions (owner delegated): deploy from **`main`** — `redesign/gitit-os` was a clean fast-forward of origin/main (33 commits) and main was ff-merged locally 2026-08-21; repo `gitit1/gitit-portfolio` is **PUBLIC** → Coolify "public repository" app, **no deploy key needed** (one owner action fewer). Still hers: (1) the word to **push main**; (2) **`ANTHROPIC_API_KEY`** entered in Coolify UI (app → Environment Variables) — or handed to the architect to set via API. Then architect: Coolify project `gititregev-site` + app (build_pack=dockerfile, is_static=false, port 3000, domains `https://gititregev.com`,`https://www.gititregev.com`, env `ALLOWED_ORIGIN=https://gititregev.com`), deploy via API, watch logs | architect + owner | ✅ 2026-08-22 — owner: "תדחוף יש אישור". Pushed main (875ba18→6dcf270) + redesign/gitit-os to origin. Coolify: project `gititregev-site` uuid `qzqhjk588h9iuzjgtscimrz2` (env production id 3), app uuid `pqai1bbo27tzlawh7lnqa8lb` (public repo `gitit1/gitit-portfolio`, branch main, build_pack dockerfile, /Dockerfile, ports 3000, domains gititregev.com + www), env `ALLOWED_ORIGIN=https://gititregev.com` (uuid iplz7k3h8byy0zvxzkwmo5jf). First deployment `6uhpaps6umha54fqcfk7uofz` finished, healthcheck healthy, rolling update done. **`ANTHROPIC_API_KEY` NOT set** — owner said it is stored in Homebase; the classifier blocked reading `Homebase/hub/.assistant-keys.json`, so she enters it in Coolify UI (app → Environment Variables → add → Redeploy) or hands it over. No auto-deploy webhook (same as Assaf): push, then `POST /api/v1/deploy {uuid}` |
| D5 | live gate | architect | ✅/partial 2026-08-22 — https://gititregev.com + www → 200, Let's Encrypt cert valid (issuer YR2, until 2026-11-20), /healthz /llms.txt /resume.json 200, SPA deep link 200; MCP tools/list live = 5 tools; chat evil-origin 403; chat good-origin → 500 "Server not configured" (expected until the key is set → **chat streaming still unverified live**); Playwright at 1920×945 / 1440×765 / 390: 0 console errors, shots `tools/site-verify/shots/live-*.png` looked at (hero + projects render as locally). Lighthouse 12 on the live URL: mobile perf 94 / a11y 98 / bp 100 / seo 100 (FCP 1.9s, LCP 2.4s, TBT 0, CLS 0.008); desktop perf 100 / a11y 94 / bp 100 / seo 100 — bar (≥90 ×4) MET. a11y follow-ups (not blocking): heading-order, label-content-name-mismatch. STATUS flipped to server: live |
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
