// Architect's rendered verification of WP-G2 (the agent could not render).
// Checks the owner's actual asks against a real browser, then captures
// screenshots she can review from her phone.
const path = require('path');
const PW = 'C:\\Users\\gitit\\AppData\\Local\\npm-cache\\_npx\\e41f203b7505f1fb\\node_modules\\playwright';
const { chromium } = require(PW);

const OUT = require('path').join(__dirname, 'shots'); // portable: shots/ next to this script
const URL = 'http://localhost:4012/';
const results = [];
const ok = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}  ${detail}`);
};

async function box(page, sel) {
  const el = await page.$(sel);
  if (!el) return null;
  return el.boundingBox();
}

// Shared nav-wrap probe: every .nav__link must render as a single line
// (no mid-label wrap, e.g. "How I" / "build" split across two lines).
async function checkNavWrap(page) {
  return page.evaluate(() => {
    const links = [...document.querySelectorAll('.nav__link')];
    const heights = links.map((el) => el.getBoundingClientRect().height);
    const singleLineMax = Math.min(...heights) * 1.5; // >1.5x the shortest = wrapped
    return {
      count: links.length,
      heights: heights.map((h) => Math.round(h)),
      wrapped: heights.filter((h) => h > singleLineMax).length,
      headerRight: Math.round(document.querySelector('.header').getBoundingClientRect().right),
      clientW: document.documentElement.clientWidth,
    };
  });
}

function relLum(rgb) {
  const m = rgb.match(/[\d.]+/g).map(Number);
  const [r, g, b] = m.map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastRatio(a, b) { const L1 = relLum(a) + 0.05, L2 = relLum(b) + 0.05; return L1 > L2 ? L1 / L2 : L2 / L1; }

(async () => {
  const browser = await chromium.launch();

  // ---------- desktop EN dark ----------
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const dir0 = await page.getAttribute('html', 'dir');
  const theme0 = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || getComputedStyle(document.body).backgroundColor);
  console.log(`baseline dir=${dir0} theme=${theme0}`);

  // 1. avatar sits BESIDE the name, not above it
  const av = await box(page, '.hero__avatar');
  const nm = await box(page, '.hero__name');
  if (av && nm) {
    const avCy = av.y + av.height / 2, nmCy = nm.y + nm.height / 2;
    const sameRow = Math.abs(avCy - nmCy) <= nm.height * 0.5;
    const sideBySide = av.x + av.width <= nm.x + 4 || nm.x + nm.width <= av.x + 4;
    const notAbove = !(av.y + av.height <= nm.y + 2);
    ok('avatar beside name (same row)', sameRow && sideBySide && notAbove,
      `avatarCy=${avCy.toFixed(0)} nameCy=${nmCy.toFixed(0)} avX=[${av.x.toFixed(0)},${(av.x+av.width).toFixed(0)}] nameX=[${nm.x.toFixed(0)},${(nm.x+nm.width).toFixed(0)}] avSize=${av.width.toFixed(0)}px`);
  } else ok('avatar beside name (same row)', false, `avatar=${!!av} name=${!!nm}`);

  // 2. no name-tab row anywhere
  const tabCount = await page.evaluate(() =>
    document.querySelectorAll('[class*="spotlight"][role="tab"], .spotlight__tabs, .spotlight__dots').length);
  ok('no name-tab / dot row', tabCount === 0, `matched=${tabCount}`);

  // 3. prev/next controls + scalable counter + All-projects anchor
  const navBtns = await page.locator('.spotlight__nav-btn').count();
  const counterTxt = (await page.locator('.spotlight__counter').first().textContent() || '').trim();
  const allLink = await box(page, '.spotlight__all-link');
  ok('prev/next arrows present', navBtns === 2, `buttons=${navBtns}`);
  ok('position counter scales (NN / NN)', /^\d{2}\s*\/\s*\d{2}$/.test(counterTxt), `text="${counterTxt}"`);
  ok('All-projects anchor visible', !!allLink && allLink.width > 40, allLink ? `${allLink.width.toFixed(0)}x${allLink.height.toFixed(0)}px` : 'missing');

  // 3b. header nav labels stay on one line each (no mid-label wrap, e.g.
  // "How I" / "build" split across two lines) and the header itself doesn't
  // overflow the viewport at 1440.
  const navWrap1440 = await checkNavWrap(page);
  ok('nav labels single-line @1440 (no mid-label wrap)', navWrap1440.wrapped === 0 && navWrap1440.count > 0,
    `heights=[${navWrap1440.heights.join(',')}]`);
  ok('header fits viewport @1440 (no header overflow)',
    navWrap1440.headerRight <= navWrap1440.clientW + 1,
    `headerRight=${navWrap1440.headerRight} clientW=${navWrap1440.clientW}`);

  // 4. no horizontal overflow at 1440
  const ov1440 = await page.evaluate(() => {
    const d = document.documentElement;
    return { scroll: d.scrollWidth, client: d.clientWidth };
  });
  ok('no horizontal overflow @1440', ov1440.scroll <= ov1440.client + 1, `scrollW=${ov1440.scroll} clientW=${ov1440.client}`);

  // 5. --maxw = clamp(1120px, 75vw, 1700px): at 1440 that's 75vw=1080px,
  // under the 1120px floor, so the floor legitimately holds here. The
  // "does it actually widen" assertion belongs at 1920 (her real screen),
  // checked in the Full-HD block below ג€” this just confirms 1440 wasn't
  // regressed by that change.
  const maxw = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--maxw').trim());
  const contW = await page.evaluate(() => {
    const c = document.querySelector('.container');
    return c ? Math.round(c.getBoundingClientRect().width) : null;
  });
  ok('container floor holds @1440 (== 1120px, not widened here)', contW === 1120, `--maxw="${maxw}" containerWidth=${contW}px`);

  // 6. hero still full-bleed (no page-slab class) over the electrons field
  const heroCls = await page.getAttribute('#home', 'class');
  const hasField = await page.evaluate(() => !!document.querySelector('canvas'));
  ok('hero raw + electrons field behind', !!heroCls && !heroCls.includes('section--page') && hasField, `class="${heroCls}" canvas=${hasField}`);

  // 7. hero images actually load (no 404 / broken img). Scoped to #home on
  // purpose (NOT weakened): the WP-G4 Projects cards below the fold use
  // loading="lazy", so before any scroll they are legitimately unfetched —
  // they get their own dedicated post-scroll decode check in the Projects
  // block below. Coverage is strictly wider than the old whole-document check.
  const imgState = await page.evaluate(async () => {
    const imgs = [...document.querySelectorAll('#home img')];
    return imgs.map(i => ({ src: i.currentSrc.split('/').pop(), complete: i.complete, w: i.naturalWidth }));
  });
  const broken = imgState.filter(i => !i.complete || i.w === 0);
  ok('hero images decoded', imgState.length > 0 && broken.length === 0, `imgs=${imgState.map(i => i.src + ':' + i.w).join(', ')}`);

  await page.screenshot({ path: path.join(OUT, '01-desktop-en-dark-hero.jpg'), type: 'jpeg', quality: 72 });

  // 8. rotation cadence: really 8s, and really stops after a deliberate click
  const c0 = (await page.locator('.spotlight__counter').first().textContent()).trim();
  await page.waitForTimeout(9000);
  const c1 = (await page.locator('.spotlight__counter').first().textContent()).trim();
  ok('auto-advance rotates within ~8s', c0 !== c1, `"${c0}" -> "${c1}"`);

  await page.locator('.spotlight__nav-btn').last().click();
  const c2 = (await page.locator('.spotlight__counter').first().textContent()).trim();
  await page.waitForTimeout(9500);
  const c3 = (await page.locator('.spotlight__counter').first().textContent()).trim();
  ok('auto-advance STOPS after a deliberate click', c2 === c3, `after-click="${c2}" 9.5s-later="${c3}"`);

  // ---------- Projects section (WP-G4): index door + graph door ----------
  await page.evaluate(() => document.getElementById('projects')?.scrollIntoView());
  await page.waitForTimeout(1800); // reveal animation + lazy image decode

  const proj = await page.evaluate(() => {
    const sec = document.getElementById('projects');
    const cards = [...document.querySelectorAll('.project-card')];
    return {
      exists: !!sec,
      isSlab: !!sec && sec.className.includes('section--page'),
      cardCount: cards.length,
      names: cards.map(c => (c.querySelector('.project-card__name')?.textContent || '').trim()),
      // G6-L link-overlay contract: cards are ALL non-interactive <article>s;
      // the real link, when a destination exists, is a same-size sibling
      // <a.project-card__overlay> inside the .project-card-slot wrapper (flat
      // siblings — never interactive-inside-interactive).
      cardTags: cards.map(c => c.tagName.toLowerCase()),
      overlayHrefs: [...document.querySelectorAll('.project-card-slot')].map(s => {
        const a = s.querySelector('a.project-card__overlay');
        return a ? a.getAttribute('href') : null;
      }),
      overlayNested: document.querySelectorAll('.project-card__overlay button, .project-card__overlay a, a .project-card__zoom').length,
      deadCase: document.querySelectorAll('a[href^="#/case/"]').length,
      legacy: document.querySelectorAll('.proj-grid, .proj-card, .modal, .swiper').length,
      allLinkHref: document.querySelector('.spotlight__all-link')?.getAttribute('href') || null,
      imgs: [...document.querySelectorAll('.project-card__art img')].map(i => ({ complete: i.complete, w: i.naturalWidth })),
      tagChipCounts: cards.map(c => c.querySelectorAll('.project-card__tags > *').length),
    };
  });
  ok('#projects exists and is a page slab', proj.exists && proj.isSlab, `exists=${proj.exists} slab=${proj.isSlab}`);
  ok('index = exactly the 4 registry projects, registry order',
    proj.cardCount === 4 && JSON.stringify(proj.names) === JSON.stringify(['Wildhearth', 'MFL', "Assaf's Friends World", 'Homebase']),
    `names=[${proj.names.join(' | ')}]`);
  // honest affordances: mfl+assaf get a link overlay (external), wildhearth+
  // homebase get none until their case pages ship (LIVE_CASE_ROUTES gate);
  // every card element itself is a plain <article>, and no interactive
  // element nests inside another (the G6-L overlay pattern).
  ok('only real destinations get link overlays (order: none,ext,ext,none; no nesting)',
    proj.cardTags.every(t2 => t2 === 'article') &&
    proj.overlayHrefs.length === 4 &&
    proj.overlayHrefs[0] === null && proj.overlayHrefs[3] === null &&
    /^https?:\/\//.test(proj.overlayHrefs[1] || '') && /^https?:\/\//.test(proj.overlayHrefs[2] || '') &&
    proj.overlayNested === 0,
    `tags=[${proj.cardTags.join(',')}] overlays=[${proj.overlayHrefs.join(' | ')}] nested=${proj.overlayNested}`);
  ok('no dead #/case/ links anywhere (no router exists yet)', proj.deadCase === 0, `deadCaseAnchors=${proj.deadCase}`);
  ok('legacy projects markup fully retired', proj.legacy === 0, `legacyMatches=${proj.legacy}`);
  ok('spotlight All-projects anchor targets #projects', proj.allLinkHref === '#projects' && proj.exists, `href=${proj.allLinkHref}`);
  ok('project card images decoded after scroll (lazy)', proj.imgs.length === 4 && proj.imgs.every(i => i.complete && i.w > 0),
    `imgs=${proj.imgs.map(i => i.w).join(',')}`);
  ok('capability chips per card = registry capabilities (5,7,6,7)',
    JSON.stringify(proj.tagChipCounts) === JSON.stringify([5, 7, 6, 7]), `chips=[${proj.tagChipCounts.join(',')}]`);

  // graph door: visible at >=1200px, decorative-nav (aria-hidden, nothing
  // tab-reachable — the index is the accessible door), honest node counts
  const graph = await page.evaluate(() => {
    const panel = document.querySelector('.projects-graph-panel');
    const svg = panel ? panel.querySelector('svg') : null;
    return {
      panelVisible: !!panel && panel.offsetParent !== null,
      ariaHidden: svg ? svg.getAttribute('aria-hidden') : null,
      projNodes: document.querySelectorAll('.projects-graph__node--project').length,
      capNodes: document.querySelectorAll('.projects-graph__node--cap').length,
      edges: document.querySelectorAll('.projects-graph__edge').length,
      focusables: svg ? svg.querySelectorAll('a:not([tabindex="-1"]), [tabindex="0"]').length : -1,
    };
  });
  ok('graph door visible @1440', graph.panelVisible, `panelVisible=${graph.panelVisible}`);
  ok('graph svg is decorative-nav (aria-hidden, zero tab-reachable)',
    graph.ariaHidden === 'true' && graph.focusables === 0, `aria-hidden=${graph.ariaHidden} focusables=${graph.focusables}`);
  ok('graph = 4 projects + 14 capabilities + 25 edges (the real curated data)',
    graph.projNodes === 4 && graph.capNodes === 14 && graph.edges === 25,
    `proj=${graph.projNodes} caps=${graph.capNodes} edges=${graph.edges}`);

  // deterministic layout: same capability node position across a full reload
  async function capNodePos(p) {
    return p.evaluate(() => {
      const n = document.querySelector('.projects-graph__node--cap[data-cap="TypeScript"]');
      const panelEl = document.querySelector('.projects-graph-panel');
      if (!n || !panelEl) return null;
      const r = n.getBoundingClientRect();
      const panel = panelEl.getBoundingClientRect();
      return { x: +(r.x - panel.x).toFixed(1), y: +(r.y - panel.y).toFixed(1) };
    });
  }
  const pos1 = await capNodePos(page);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('projects')?.scrollIntoView());
  await page.waitForTimeout(1200);
  const pos2 = await capNodePos(page);
  ok('graph layout deterministic across reloads (no per-load randomness)',
    !!pos1 && !!pos2 && Math.abs(pos1.x - pos2.x) <= 0.5 && Math.abs(pos1.y - pos2.y) <= 0.5,
    `pos1=${JSON.stringify(pos1)} pos2=${JSON.stringify(pos2)}`);

  // hover sync, both directions
  await page.hover('.projects-graph__node--project[data-slug="mfl"]', { force: true }).catch(() => {});
  await page.waitForTimeout(250);
  const traced = await page.evaluate(() => !!document.querySelector('.project-card--traced'));
  ok('graph-node hover traces the matching index card', traced, `tracedCardFound=${traced}`);
  // Hover the SLOT wrapper, not .project-card: the G6-L link overlay sits
  // above the card and intercepts the pointer, so Playwright's hit-target
  // check only passes on an element the overlay descends from.
  await page.hover('.project-card-slot >> nth=1');
  await page.waitForTimeout(350);
  const litFromCard = await page.evaluate(() => document.querySelectorAll('.projects-graph .is-lit').length);
  ok('card hover lights the graph', litFromCard > 0, `litElements=${litFromCard}`);
  await page.mouse.move(5, 5);
  await page.waitForTimeout(200);

  await page.screenshot({ path: path.join(OUT, '11-projects-en-dark.jpg'), type: 'jpeg', quality: 74 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  // ---------- light theme ----------
  const themeBtn = page.locator('button[aria-label*="light" i], button[aria-label*="dark" i]').first();
  if (await themeBtn.count()) {
    await themeBtn.click();
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(OUT, '02-desktop-en-light-hero.jpg'), type: 'jpeg', quality: 72 });
    const surf = await page.evaluate(() => {
      const s = document.querySelector('.section--page') || document.querySelector('.section');
      return { page: getComputedStyle(document.body).backgroundColor, sec: s ? getComputedStyle(s).backgroundColor : null };
    });
    ok('light theme renders (captured)', true, `body=${surf.page} section=${surf.sec}`);

    // Real slab measurement (Defect 4): a genuine .section--page > .container
    // slab (NOT the hero, NOT the loose first .section match), tagged by the
    // ACTUAL data-theme attribute rather than assumed click order, plus the
    // owner's surface-vs-base contrast requirement.
    async function measureSlab() {
      return page.evaluate(() => {
        const slab = document.querySelector('.section--page > .container');
        const card = document.querySelector('.project-card');
        return {
          theme: document.documentElement.getAttribute('data-theme'),
          bodyBg: getComputedStyle(document.body).backgroundColor,
          slabBg: slab ? getComputedStyle(slab).backgroundColor : null,
          slabBorder: slab ? getComputedStyle(slab).borderTopWidth + ' ' + getComputedStyle(slab).borderTopColor : null,
          slabShadow: slab ? getComputedStyle(slab).boxShadow !== 'none' : false,
          cardBg: card ? getComputedStyle(card).backgroundColor : null,
          cardBorder: card ? parseFloat(getComputedStyle(card).borderTopWidth) > 0 : false,
          cardShadow: card ? getComputedStyle(card).boxShadow !== 'none' : false,
        };
      });
    }
    const stateA = await measureSlab();
    await themeBtn.click();
    await page.waitForTimeout(900);
    const stateB = await measureSlab();
    const cA = stateA.slabBg ? contrastRatio(stateA.bodyBg, stateA.slabBg) : 0;
    const cB = stateB.slabBg ? contrastRatio(stateB.bodyBg, stateB.slabBg) : 0;
    ok('page-slab found (.section--page > .container, not hero)', !!stateA.slabBg && !!stateB.slabBg,
      `A(theme=${stateA.theme})=${stateA.slabBg} B(theme=${stateB.theme})=${stateB.slabBg}`);
    ok('light vs dark themes produce genuinely different slab/base colors', stateA.bodyBg !== stateB.bodyBg && stateA.slabBg !== stateB.slabBg,
      `theme=${stateA.theme}: body=${stateA.bodyBg} slab=${stateA.slabBg} | theme=${stateB.theme}: body=${stateB.bodyBg} slab=${stateB.slabBg}`);
    ok('slab has a perceptible border/shadow in both themes (owner elevation rule)',
      !!stateA.slabBorder && stateA.slabShadow && !!stateB.slabBorder && stateB.slabShadow,
      `A border=${stateA.slabBorder} shadow=${stateA.slabShadow} | B border=${stateB.slabBorder} shadow=${stateB.slabShadow}`);
    ok('dark-mode slab elevation step is genuinely visible (>=1.25:1, owner standing rule)',
      (stateA.theme === 'dark' ? cA : cB) >= 1.25,
      `dark slab-vs-base contrast=${(stateA.theme === 'dark' ? cA : cB).toFixed(2)}:1`);
    ok('light-mode slab elevation step is genuinely visible (>=1.25:1, owner standing rule)',
      (stateA.theme === 'light' ? cA : cB) >= 1.25,
      `light slab-vs-base contrast=${(stateA.theme === 'light' ? cA : cB).toFixed(2)}:1`);
    console.log(`  [theme contrast] ${stateA.theme}: slab-vs-base contrast=${cA.toFixed(2)}:1 | ${stateB.theme}: slab-vs-base contrast=${cB.toFixed(2)}:1`);

    // WP-G4: the Projects cards sit ON the slab — same elevation rule one
    // level up (a real step ABOVE --surface, plus border+shadow, both themes).
    const cardA = stateA.cardBg ? contrastRatio(stateA.slabBg, stateA.cardBg) : 0;
    const cardB = stateB.cardBg ? contrastRatio(stateB.slabBg, stateB.cardBg) : 0;
    ok('project cards step above the slab in BOTH themes (>=1.1:1 + border + shadow)',
      cardA >= 1.1 && cardB >= 1.1 && stateA.cardBorder && stateA.cardShadow && stateB.cardBorder && stateB.cardShadow,
      `${stateA.theme}: card-vs-slab=${cardA.toFixed(2)}:1 border=${stateA.cardBorder} shadow=${stateA.cardShadow} | ${stateB.theme}: ${cardB.toFixed(2)}:1 border=${stateB.cardBorder} shadow=${stateB.cardShadow}`);
    // stateB (the click just above) already returned us to the original
    // theme this page load started in ג€” no extra toggle needed here.
  } else ok('light theme toggle found', false, 'no theme button matched');

  // ---------- Hebrew RTL ----------
  const langBtn = page.locator('button[aria-label*="Hebrew" i]').first();
  if (await langBtn.count()) {
    await langBtn.click();
    await page.waitForTimeout(1200);
    const dir = await page.getAttribute('html', 'dir');
    const avH = await box(page, '.hero__avatar');
    const nmH = await box(page, '.hero__name');
    const flipped = avH && nmH ? avH.x > nmH.x : null;
    ok('HE is RTL', dir === 'rtl', `dir=${dir}`);
    ok('avatar flips to the leading side in HE', flipped === true,
      `avatarX=${avH ? avH.x.toFixed(0) : '?'} nameX=${nmH ? nmH.x.toFixed(0) : '?'} (RTL leading = larger x)`);
    const ovHe = await page.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
    ok('no horizontal overflow in HE @1440', ovHe.s <= ovHe.c + 1, `scrollW=${ovHe.s} clientW=${ovHe.c}`);
    const navWrapHe = await checkNavWrap(page);
    ok('nav labels single-line in HE @1440 (no mid-label wrap)', navWrapHe.wrapped === 0 && navWrapHe.count > 0,
      `heights=[${navWrapHe.heights.join(',')}]`);
    // WP-G4: projects chrome actually translated in HE (title + graph hint
    // carry Hebrew), while taglines stay data (the MFL line is a locked
    // English quote — never translated).
    const projHe = await page.evaluate(() => {
      const sec = document.getElementById('projects');
      const title = sec ? (sec.querySelector('.section__title')?.textContent || '') : '';
      const hint = document.querySelector('.projects-graph-panel')?.textContent || '';
      const mflTagline = [...document.querySelectorAll('.project-card__tagline')].map(e => e.textContent.trim())
        .find(t => t.includes('fanfics')) || null;
      return { title, hintHasHebrew: /[֐-׿]/.test(hint), mflTagline };
    });
    ok('projects chrome translated in HE', /[֐-׿]/.test(projHe.title) && projHe.hintHasHebrew,
      `title="${projHe.title}" hintHebrew=${projHe.hintHasHebrew}`);
    ok('MFL tagline stays the verbatim English quote in HE',
      projHe.mflTagline === "The home of gay women couples' fanfics.", `tagline="${projHe.mflTagline}"`);
    await page.evaluate(() => document.getElementById('projects')?.scrollIntoView());
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(OUT, '12-projects-he-dark.jpg'), type: 'jpeg', quality: 74 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, '03-desktop-he-dark-hero.jpg'), type: 'jpeg', quality: 72 });
    await page.screenshot({ path: path.join(OUT, '04-desktop-he-dark-full.jpg'), type: 'jpeg', quality: 62, fullPage: true });
    await langBtn.click().catch(() => {});
    await page.waitForTimeout(600);
  } else ok('HE toggle found', false, 'no lang button matched');

  await page.screenshot({ path: path.join(OUT, '05-desktop-en-dark-full.jpg'), type: 'jpeg', quality: 62, fullPage: true });
  await ctx.close();

  // ---------- Full HD 1920x1080 ג€” the owner's actual primary screen ----------
  const hdCtx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const hdPage = await hdCtx.newPage();
  await hdPage.goto(URL, { waitUntil: 'networkidle' });
  await hdPage.waitForTimeout(1200);

  const hdContainer = await hdPage.evaluate(() => {
    const c = document.querySelector('.container');
    return {
      maxw: getComputedStyle(document.documentElement).getPropertyValue('--maxw').trim(),
      contW: c ? Math.round(c.getBoundingClientRect().width) : null,
    };
  });
  ok('container widens @1920 (her real screen ג€” 75vw=1440px)',
    hdContainer.contW !== null && hdContainer.contW > 1120 && Math.abs(hdContainer.contW - 1440) <= 2,
    `--maxw="${hdContainer.maxw}" containerWidth=${hdContainer.contW}px (expected ~1440px)`);

  const ovHd = await hdPage.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
  ok('no horizontal overflow @1920', ovHd.s <= ovHd.c + 1, `scrollW=${ovHd.s} clientW=${ovHd.c}`);

  const navWrapHd = await checkNavWrap(hdPage);
  ok('nav labels single-line @1920 (no mid-label wrap)', navWrapHd.wrapped === 0 && navWrapHd.count > 0,
    `heights=[${navWrapHd.heights.join(',')}]`);
  ok('header fits viewport @1920 (no header overflow)',
    navWrapHd.headerRight <= navWrapHd.clientW + 1,
    `headerRight=${navWrapHd.headerRight} clientW=${navWrapHd.clientW}`);

  await hdPage.screenshot({ path: path.join(OUT, '08-desktop-1920-fullhd-en-dark-hero.jpg'), type: 'jpeg', quality: 78 });

  // WP-G4 @1920: both doors on the owner's real screen — graph visible
  // beside the index, everything decoded
  await hdPage.evaluate(() => document.getElementById('projects')?.scrollIntoView());
  await hdPage.waitForTimeout(1500);
  const projHd = await hdPage.evaluate(() => {
    const panel = document.querySelector('.projects-graph-panel');
    const grid = document.querySelector('.projects-grid');
    const sideBySide = panel && grid
      ? Math.abs(panel.getBoundingClientRect().top - grid.getBoundingClientRect().top) < 200
      : false;
    return {
      graphVisible: !!panel && panel.offsetParent !== null,
      sideBySide,
      imgsOk: [...document.querySelectorAll('.project-card__art img')].every(i => i.complete && i.naturalWidth > 0),
    };
  });
  ok('@1920 graph door visible beside the index (dual door, one screen)',
    projHd.graphVisible && projHd.sideBySide, `visible=${projHd.graphVisible} sideBySide=${projHd.sideBySide}`);
  ok('@1920 card images decoded', projHd.imgsOk, `allDecoded=${projHd.imgsOk}`);
  await hdPage.screenshot({ path: path.join(OUT, '14-projects-1920-en-dark.jpg'), type: 'jpeg', quality: 78 });
  await hdPage.evaluate(() => window.scrollTo(0, 0));
  await hdPage.waitForTimeout(400);

  // ---------- WP-G6 @1920: nav landing, fit-one-screen, lightbox, featured surface ----------
  // Nav clicks must land the visible SLAB flush under the fixed header (the
  // scroll-padding+scroll-margin double-offset defect, fixed 9ee9e83).
  // Contact is exempt from exactness: the document simply ends there.
  const NAV_LABELS = { 'how-i-build': 'How I build', experience: 'Experience', projects: 'Projects', 'ai-native': 'AI-native', contact: 'Contact' };
  const headerH1920 = await hdPage.evaluate(() => Math.round(document.querySelector('.header').getBoundingClientRect().height));
  const landings = [];
  for (const [secId, label] of Object.entries(NAV_LABELS)) {
    await hdPage.locator('.nav__link', { hasText: label }).first().click();
    await hdPage.waitForTimeout(900);
    const top = await hdPage.evaluate((sid) => {
      const sec = document.getElementById(sid);
      const slab = sec.querySelector(':scope > .container') || sec;
      return Math.round(slab.getBoundingClientRect().top);
    }, secId);
    landings.push({ secId, top });
  }
  const badLandings = landings.filter(l =>
    l.secId === 'contact' ? l.top > headerH1920 + 60 : Math.abs(l.top - headerH1920) > 10);
  ok('nav clicks land the slab flush under the header @1920', badLandings.length === 0,
    landings.map(l => `${l.secId}:${l.top}`).join(' ') + ` (header=${headerH1920})`);

  // Fit-one-screen (owner ask): each slab <= 1.15x the visible area under
  // the header at Full HD. Expected to FAIL until the fluid-typography WP
  // lands — a red here is the honest current state, not a harness bug.
  const fills1920 = await hdPage.evaluate((hh) => {
    const out = [];
    for (const sec of document.querySelectorAll('.section--page')) {
      const slab = sec.querySelector(':scope > .container');
      if (!slab) continue;
      out.push({ id: sec.id, fill: +(slab.getBoundingClientRect().height / (innerHeight - hh)).toFixed(2) });
    }
    return out;
  }, headerH1920);
  const overfull = fills1920.filter(f => f.fill > 1.05);
  ok('sections fit one screen @1920x1080 (fill <= 1.05x)', overfull.length === 0,
    fills1920.map(f => `${f.id}:${f.fill}x`).join(' '));

  // Lightbox: card-art zoom opens a real dialog, Esc closes, focus returns.
  await hdPage.evaluate(() => document.getElementById('projects')?.scrollIntoView());
  await hdPage.waitForTimeout(900);
  const zoomBtnCount = await hdPage.locator('.project-card__zoom').count();
  ok('every card has an image-zoom control', zoomBtnCount === 4, `zoomButtons=${zoomBtnCount}`);
  if (zoomBtnCount > 0) {
    await hdPage.locator('.project-card__zoom').first().click();
    await hdPage.waitForTimeout(500);
    const dlg = await hdPage.evaluate(() => {
      const d = document.querySelector('.lightbox');
      return d ? {
        modal: d.getAttribute('aria-modal'),
        hasImg: !!d.querySelector('img'),
        focusInside: d.contains(document.activeElement),
      } : null;
    });
    ok('image lightbox opens as a modal dialog with focus inside',
      !!dlg && dlg.modal === 'true' && dlg.hasImg && dlg.focusInside,
      JSON.stringify(dlg));
    await hdPage.keyboard.press('Escape');
    // The dialog's spring exit animation runs ~800ms before AnimatePresence
    // unmounts it — poll rather than snapshot too early.
    let closed = false;
    for (let t = 0; t < 2200 && !closed; t += 200) {
      await hdPage.waitForTimeout(200);
      closed = await hdPage.evaluate(() => !document.querySelector('.lightbox'));
    }
    ok('Escape closes the lightbox', closed, `closedAfterEsc=${closed}`);
  }
  // Graph expand: opens the interactive constellation large in the popup.
  const expandCount = await hdPage.locator('.projects-graph-panel__expand').count();
  if (expandCount > 0) {
    await hdPage.locator('.projects-graph-panel__expand').first().click();
    await hdPage.waitForTimeout(500);
    const gdlg = await hdPage.evaluate(() => {
      const d = document.querySelector('.lightbox');
      return d ? {
        caps: d.querySelectorAll('.projects-graph__node--cap').length,
        projs: d.querySelectorAll('.projects-graph__node--project').length,
      } : null;
    });
    ok('graph expands interactive in the lightbox (4+14 nodes)',
      !!gdlg && gdlg.projs === 4 && gdlg.caps === 14, JSON.stringify(gdlg));
    await hdPage.keyboard.press('Escape');
    await hdPage.waitForTimeout(400);
  } else {
    ok('graph expand control present', false, 'no .projects-graph-panel__expand found');
  }

  // Featured surface: popupless check — the graph panel and the AI-native
  // "Just ask" card share a surface DISTINCT from the generic card surface.
  const featured = await hdPage.evaluate(() => {
    const panel = document.querySelector('.projects-graph-panel');
    const card = document.querySelector('.project-card');
    const aiCards = [...document.querySelectorAll('[class*="ai-native__card"]')];
    const featuredAi = aiCards.map(c => getComputedStyle(c).backgroundColor);
    return {
      panelBg: panel ? getComputedStyle(panel).backgroundColor : null,
      cardBg: card ? getComputedStyle(card).backgroundColor : null,
      aiBgs: featuredAi,
    };
  });
  ok('featured surface distinct from generic cards (graph panel != project card bg)',
    !!featured.panelBg && !!featured.cardBg && featured.panelBg !== featured.cardBg,
    `panel=${featured.panelBg} card=${featured.cardBg}`);
  ok('AI-native Just-ask card carries the featured surface',
    featured.aiBgs.includes(featured.panelBg), `aiCardBgs=[${featured.aiBgs.join(' | ')}]`);

  // The "Gitit's AI" chat panel is the family member the owner explicitly
  // named — open it via the FAB and confirm it sits on the featured surface.
  await hdPage.locator('.chat-fab').click();
  await hdPage.waitForTimeout(600);
  const chatBg = await hdPage.evaluate(() => {
    const c = document.querySelector('.chat');
    return c ? getComputedStyle(c).backgroundColor : null;
  });
  ok("Gitit's AI chat panel carries the featured surface",
    !!chatBg && chatBg === featured.panelBg, `chatBg=${chatBg} panelBg=${featured.panelBg}`);
  await hdPage.keyboard.press('Escape').catch(() => {});
  await hdPage.locator('.chat [aria-label*="lose" i], .chat button:has-text("×")').first().click().catch(() => {});
  await hdPage.waitForTimeout(300);
  await hdPage.evaluate(() => window.scrollTo(0, 0));
  await hdPage.waitForTimeout(400);

  const hdThemeBtn = hdPage.locator('button[aria-label*="light" i], button[aria-label*="dark" i]').first();
  if (await hdThemeBtn.count()) {
    await hdThemeBtn.click();
    await hdPage.waitForTimeout(900);
    await hdPage.screenshot({ path: path.join(OUT, '09-desktop-1920-fullhd-en-light-hero.jpg'), type: 'jpeg', quality: 78 });
    await hdThemeBtn.click();
    await hdPage.waitForTimeout(700);
  }

  const hdLangBtn = hdPage.locator('button[aria-label*="Hebrew" i]').first();
  if (await hdLangBtn.count()) {
    await hdLangBtn.click();
    await hdPage.waitForTimeout(1200);
    const dirHd = await hdPage.getAttribute('html', 'dir');
    ok('HE is RTL @1920', dirHd === 'rtl', `dir=${dirHd}`);
    const ovHdHe = await hdPage.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
    ok('no horizontal overflow @1920 in HE', ovHdHe.s <= ovHdHe.c + 1, `scrollW=${ovHdHe.s} clientW=${ovHdHe.c}`);
    const navWrapHdHe = await checkNavWrap(hdPage);
    ok('nav labels single-line @1920 in HE (no mid-label wrap)', navWrapHdHe.wrapped === 0 && navWrapHdHe.count > 0,
      `heights=[${navWrapHdHe.heights.join(',')}]`);
    await hdPage.screenshot({ path: path.join(OUT, '10-desktop-1920-fullhd-he-dark-hero.jpg'), type: 'jpeg', quality: 78 });
    await hdLangBtn.click().catch(() => {});
    await hdPage.waitForTimeout(600);
  }

  await hdCtx.close();

  // ---------- Fit-one-screen at real desktop viewports ----------
  // Round-4 ceilings (owner, 2026-07-25): a section fits a WHOLE screen.
  // 1920x945 = her actual Chrome viewport (Full HD minus browser chrome) —
  // the primary bar. Looser ceilings as screens shrink (legibility floors
  // outrank cramming).
  for (const [w, h, ceil] of [[1920, 945, 1.02], [1536, 864, 1.15], [1366, 768, 1.25]]) {
    const c = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const p = await c.newPage();
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1000);
    const hh = await p.evaluate(() => Math.round(document.querySelector('.header').getBoundingClientRect().height));
    const fills = await p.evaluate((hhh) => {
      const out = [];
      for (const sec of document.querySelectorAll('.section--page')) {
        const slab = sec.querySelector(':scope > .container');
        if (!slab) continue;
        out.push({ id: sec.id, fill: +(slab.getBoundingClientRect().height / (innerHeight - hhh)).toFixed(2) });
      }
      return out;
    }, hh);
    const over = fills.filter(f => f.fill > ceil);
    ok(`sections fit one screen @${w}x${h} (fill <= ${ceil}x)`, over.length === 0,
      fills.map(f => `${f.id}:${f.fill}x`).join(' '));
    await c.close();
  }

  // ---------- mobile 390 (functional only ג€” bespoke design is a later stage) ----------
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mp = await mctx.newPage();
  await mp.goto(URL, { waitUntil: 'networkidle' });
  await mp.waitForTimeout(1200);
  const ovM = await mp.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
  ok('no horizontal overflow @390', ovM.s <= ovM.c + 1, `scrollW=${ovM.s} clientW=${ovM.c}`);
  const mNav = await mp.locator('.spotlight__nav-btn').count();
  const mAv = await box(mp, '.hero__avatar');
  const mNm = await box(mp, '.hero__name');
  ok('@390 arrows still usable', mNav === 2, `buttons=${mNav}`);
  if (mAv && mNm) {
    const sameRow = Math.abs((mAv.y + mAv.height / 2) - (mNm.y + mNm.height / 2)) <= mNm.height * 0.6;
    ok('@390 avatar still beside name', sameRow, `avatarCy=${(mAv.y+mAv.height/2).toFixed(0)} nameCy=${(mNm.y+mNm.height/2).toFixed(0)}`);
  }
  const heroH = await mp.evaluate(() => { const h = document.querySelector('#home'); return h ? Math.round(h.getBoundingClientRect().height) : null; });
  ok('@390 hero height measured (input for the mobile stage)', true, `heroHeight=${heroH}px = ${(heroH/844).toFixed(1)} screens`);

  // WP-G4 @390: graph door hidden (narrow design is a later stage — the index
  // is the whole story), cards stack single-column, no clipped card content
  await mp.evaluate(() => document.getElementById('projects')?.scrollIntoView());
  await mp.waitForTimeout(1500);
  // Lazy card images can take a moment on a busy machine — poll up to 4s
  // for decode instead of snapshotting once (a false red here otherwise).
  let imgsOk390 = false;
  for (let t = 0; t < 4000 && !imgsOk390; t += 500) {
    imgsOk390 = await mp.evaluate(() => {
      const imgs = [...document.querySelectorAll('.project-card__art img')];
      return imgs.length === 4 && imgs.every(i => i.complete && i.naturalWidth > 0);
    });
    if (!imgsOk390) await mp.waitForTimeout(500);
  }
  const projM = await mp.evaluate(() => {
    const panel = document.querySelector('.projects-graph-panel');
    const grid = document.querySelector('.projects-grid');
    const cards = [...document.querySelectorAll('.project-card')];
    return {
      graphHidden: !panel || panel.offsetParent === null,
      gridW: grid ? Math.round(grid.getBoundingClientRect().width) : null,
      cardWs: cards.map(c => Math.round(c.getBoundingClientRect().width)),
    };
  });
  projM.imgsOk = imgsOk390;
  ok('@390 graph door hidden (mobile stage comes later)', projM.graphHidden, `hidden=${projM.graphHidden}`);
  ok('@390 cards single-column at full grid width', projM.gridW !== null && projM.cardWs.length === 4 && projM.cardWs.every(w => Math.abs(w - projM.gridW) <= 5),
    `gridW=${projM.gridW} cardWs=[${projM.cardWs.join(',')}]`);
  ok('@390 card images decoded', projM.imgsOk, `allDecoded=${projM.imgsOk}`);
  await mp.screenshot({ path: path.join(OUT, '13-projects-mobile-390.jpg'), type: 'jpeg', quality: 70 });
  await mp.evaluate(() => window.scrollTo(0, 0));
  await mp.waitForTimeout(400);
  await mp.screenshot({ path: path.join(OUT, '06-mobile-390-en-dark.jpg'), type: 'jpeg', quality: 72 });
  await mp.screenshot({ path: path.join(OUT, '07-mobile-390-en-dark-full.jpg'), type: 'jpeg', quality: 58, fullPage: true });
  await mctx.close();

  await browser.close();

  const failed = results.filter(r => !r.pass);
  console.log(`\n===== ${results.length - failed.length}/${results.length} PASSED =====`);
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(` - ${f.name}: ${f.detail}`)); }
})().catch(e => { console.error('SCRIPT ERROR', e); process.exit(1); });

