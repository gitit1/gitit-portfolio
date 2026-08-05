// R5-a — WCAG AA contrast audit of every text the site actually renders,
// with the featured surface (--surface-feature) called out separately.
//
// Owner rejected round 4 with "הכחול לא עומד בחוקי נגישות". This measures
// instead of arguing. Deliberately wider than "text on blue", because the
// first pass proved the blue was not the only suspect:
//   * element OPACITY is composited (the graph's `.is-dim` is opacity 0.25 —
//     a 4x reduction that no static token inspection would ever reveal),
//   * ::placeholder is a pseudo-element and has no text node to walk,
//   * icon-only controls carry no text at all and answer to the 3:1 UI rule,
//   * --text-faint is the weakest token and is used off the blue too.
//
// Run: build -> `npx vite preview --port 4012 --strictPort` -> node this file.
// Writes a machine-readable report to ./contrast-report.json next to it.

const fs = require('fs');
const path = require('path');
const PW = 'C:\\Users\\gitit\\AppData\\Local\\npm-cache\\_npx\\e41f203b7505f1fb\\node_modules\\playwright';
const { chromium } = require(PW);

const URL = 'http://localhost:4012/';
const OUT_JSON = path.join(__dirname, 'contrast-report.json');

// ---------------------------------------------------------------- page-side
const PROBE = function probeContrast() {
  const parse = (str) => {
    if (!str) return null;
    const s = String(str);
    if (s === 'none' || s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
    const m = s.match(/[\d.]+/g);
    if (!m || m.length < 3) return null;
    return { r: +m[0], g: +m[1], b: +m[2], a: m.length > 3 ? +m[3] : 1 };
  };
  const key = (c) => `rgb(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)})`;

  const srcOver = (s, d) => {
    const aOut = s.a + d.a * (1 - s.a);
    if (aOut === 0) return { r: 0, g: 0, b: 0, a: 0 };
    const f = (cs, cd) => (cs * s.a + cd * d.a * (1 - s.a)) / aOut;
    return { r: f(s.r, d.r), g: f(s.g, d.g), b: f(s.b, d.b), a: aOut };
  };

  const relLum = (c) => {
    const ch = [c.r, c.g, c.b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const ratio = (a, b) => {
    const l1 = relLum(a) + 0.05;
    const l2 = relLum(b) + 0.05;
    return l1 > l2 ? l1 / l2 : l2 / l1;
  };

  let base = parse(getComputedStyle(document.documentElement).backgroundColor);
  if (!base || base.a < 1) base = parse(getComputedStyle(document.body).backgroundColor);
  if (!base || base.a < 1) base = { r: 255, g: 255, b: 255, a: 1 };
  base = { ...base, a: 1 };

  const chainOf = (el) => {
    const chain = [];
    let n = el;
    while (n && n.nodeType === 1) {
      chain.push(n);
      n = n.parentElement;
    }
    return chain; // [el, parent, ..., html]
  };

  // Exact group-opacity model: opacity applies to an element's whole subtree
  // as a GROUP, composited over what is behind it. Build bottom-up, scaling
  // by each element's opacity as we fold its ancestors' backgrounds in.
  const flatten = (el, seed) => {
    const chain = chainOf(el);
    let layer = seed; // already includes el's own background (and text, if any)
    for (let i = 0; i < chain.length; i++) {
      const cs = getComputedStyle(chain[i]);
      if (i > 0) layer = srcOver(layer, parse(cs.backgroundColor) || { r: 0, g: 0, b: 0, a: 0 });
      const o = parseFloat(cs.opacity);
      if (!Number.isNaN(o) && o < 1) layer = { ...layer, a: layer.a * o };
    }
    return srcOver(layer, base);
  };

  // --- discover the featured surfaces by COMPUTED background, not by name ---
  const featuredToken = getComputedStyle(document.documentElement)
    .getPropertyValue('--surface-feature').trim();
  const probeEl = document.createElement('div');
  probeEl.style.backgroundColor = featuredToken;
  document.body.appendChild(probeEl);
  const featuredRgb = getComputedStyle(probeEl).backgroundColor;
  probeEl.remove();

  const featuredRoots = [...document.querySelectorAll('*')].filter(
    (el) => getComputedStyle(el).backgroundColor === featuredRgb
  );
  const onFeatured = (el) => featuredRoots.some((r) => r === el || r.contains(el));

  const labelOf = (el) => {
    const cls = typeof el.className === 'string'
      ? el.className
      : (el.className && el.className.baseVal) || '';
    return el.tagName.toLowerCase() + (cls ? '.' + cls.trim().split(/\s+/).join('.') : '');
  };
  const surfaceOf = (el) => {
    const r = featuredRoots.find((x) => x === el || x.contains(el));
    if (r) return labelOf(r).split('.')[1] || labelOf(r);
    return '(page)';
  };

  const rows = [];
  const push = (el, kind, fgColor, opts = {}) => {
    const cs = getComputedStyle(el);
    const fg = parse(fgColor);
    if (!fg || fg.a === 0) return;
    const ownBg = parse(cs.backgroundColor) || { r: 0, g: 0, b: 0, a: 0 };
    const textOut = flatten(el, srcOver(fg, ownBg));
    const bgOut = flatten(el, ownBg);
    const cr = ratio(textOut, bgOut);

    const px = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = px >= 24 || (px >= 18.66 && weight >= 700);
    // 1.4.3 body 4.5:1 / large 3:1 ; 1.4.11 non-text UI 3:1.
    // Placeholder text is TEXT — it answers to 1.4.3, not to the 3:1 UI rule.
    const isTextRule = kind === 'text' || kind === 'placeholder';
    const required = opts.required || (isTextRule ? (large ? 3.0 : 4.5) : 3.0);

    let cumOpacity = 1;
    for (const n of chainOf(el)) {
      const o = parseFloat(getComputedStyle(n).opacity);
      if (!Number.isNaN(o)) cumOpacity *= o;
    }
    // Fully transparent = the scroll-reveal gate has not fired for this
    // section yet. Nothing is rendered, so there is nothing to measure —
    // counting it as a contrast failure would be a false positive. A DIMMED
    // element (e.g. the graph's 0.25) is emphatically NOT skipped.
    if (cumOpacity < 0.02) return;

    rows.push({
      kind,
      surface: surfaceOf(el),
      onFeatured: onFeatured(el),
      el: labelOf(el),
      text: (opts.text || '').slice(0, 55),
      colorDeclared: String(fgColor),
      colorRendered: key(textOut),
      bgRendered: key(bgOut),
      fontPx: +px.toFixed(1),
      weight,
      large,
      opacity: +cumOpacity.toFixed(3),
      ratio: +cr.toFixed(2),
      required,
      pass: cr >= required,
    });
  };

  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    // >1px filters sr-only clipped text, which is not rendered to anyone.
    return r.width > 1 && r.height > 1;
  };

  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    const isSvgText = el.tagName === 'text' || el.tagName === 'tspan';

    // 1. text this element OWNS (a direct, non-empty text node)
    const ownText = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(' ')
      .trim();
    if (ownText) push(el, 'text', isSvgText ? cs.fill || cs.color : cs.color, { text: ownText });

    // 2. ::placeholder — a pseudo-element, so it owns no walkable text node
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      const ph = el.getAttribute('placeholder');
      if (ph) {
        const phColor = getComputedStyle(el, '::placeholder').color;
        push(el, 'placeholder', phColor, { text: ph });
      }
      // input border is a UI boundary (1.4.11)
      push(el, 'ui-border', cs.borderTopColor, { text: '(input border)' });
    }

    // 3. icon-only controls: no text at all, so 1.4.3 never fires — 1.4.11 does
    if ((el.tagName === 'BUTTON' || el.tagName === 'A') && !el.textContent.trim()) {
      const svg = el.querySelector('svg');
      if (svg) push(el, 'icon', cs.color, { text: el.getAttribute('aria-label') || '(icon)' });
    }
  }

  // 4. graph geometry — nodes and edges are the only meaning-carrying
  //    non-text marks on the featured surface, and they are what `.is-dim`
  //    actually attacks.
  for (const c of document.querySelectorAll('.projects-graph__node circle')) {
    if (!visible(c)) continue;
    const cs = getComputedStyle(c);
    // A stroked circle is delimited by its STROKE, not its fill — the project
    // nodes deliberately fill with --surface (near the panel's own luminance)
    // and rely on an accent ring. Measuring the fill there would invent a
    // defect that no eye can see.
    const sw = parseFloat(cs.strokeWidth);
    const stroked = cs.stroke && cs.stroke !== 'none' && !Number.isNaN(sw) && sw > 0;
    push(c, 'graph-node', stroked ? cs.stroke : cs.fill,
      { text: stroked ? '(node ring)' : '(node dot)' });
  }

  return { featuredToken, featuredRgb, base: key(base), rows };
};

// ---------------------------------------------------------------- driver
const STATES = [
  {
    name: 'base',
    async setup(page) {
      // Walk every section so the scroll-reveal gate fires everywhere —
      // otherwise whole sections sit at opacity 0 and go unmeasured.
      const ids = await page.evaluate(() =>
        [...document.querySelectorAll('section[id]')].map((s) => s.id));
      for (const id of [...ids, 'ai-native', 'projects']) {
        await page.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id);
        await page.waitForTimeout(700);
      }
    },
    async teardown() {},
  },
  // Reduced motion pins the hero spotlight to its first project, so the other
  // three would never be measured. Step through them DELIBERATELY (the arrow
  // is a real control and settles instantly here) rather than waiting on the
  // 8s auto-advance, which is what made this audit nondeterministic.
  ...[2, 3, 4].map((n) => ({
    name: `hero spotlight slide ${n}`,
    async setup(page) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      await page.locator('.spotlight__nav-btn').last().click();
      await page.waitForTimeout(900);
    },
    async teardown() {},
  })),
  {
    // The state the first pass missed entirely: hovering a project dims every
    // unrelated node to opacity 0.25 ON the featured surface.
    name: 'graph hover (is-dim/is-lit)',
    async setup(page) {
      await page.evaluate(() => document.getElementById('projects')?.scrollIntoView());
      await page.waitForTimeout(800);
      await page.locator('.projects-graph__node--project').first().hover();
      await page.waitForTimeout(600);
    },
    async teardown(page) {
      await page.mouse.move(5, 5);
      await page.waitForTimeout(400);
    },
  },
  {
    name: 'graph lightbox open',
    async setup(page) {
      await page.evaluate(() => document.getElementById('projects')?.scrollIntoView());
      await page.waitForTimeout(700);
      await page.locator('.projects-graph-panel__expand').first().click();
      await page.waitForTimeout(700);
    },
    async teardown(page) {
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(1300);
    },
  },
  {
    name: 'image lightbox open',
    async setup(page) {
      await page.evaluate(() => document.getElementById('projects')?.scrollIntoView());
      await page.waitForTimeout(700);
      await page.locator('.project-card__zoom').first().click();
      await page.waitForTimeout(700);
    },
    async teardown(page) {
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(1300);
    },
  },
  {
    name: "Gitit's AI chat panel open",
    async setup(page) {
      await page.locator('.chat-fab').click();
      await page.waitForTimeout(900);
    },
    async teardown(page) {
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(500);
    },
  },
];

(async () => {
  const browser = await chromium.launch();
  const report = { url: URL, themes: {} };

  for (const theme of ['dark', 'light']) {
    // reducedMotion is what makes this audit DETERMINISTIC. Without it the
    // hero spotlight auto-advances every 8s and the probe can land mid
    // crossfade, where a slide sits at ~0.52 opacity and every label in it
    // reads as a contrast failure that no steady state ever shows. (It also
    // made the measured element count drift run to run, because which project
    // is on screen decides which optional rows exist.) Reduced motion pins the
    // spotlight to a static first slide and settles the reveal gate.
    const ctx = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.evaluate((t) => {
      document.documentElement.setAttribute('data-theme', t);
      try { localStorage.setItem('gr-theme', t); } catch (e) { /* ignore */ }
    }, theme);
    await page.waitForTimeout(500);
    const applied = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));

    const all = [];
    let meta = null;
    for (const st of STATES) {
      await st.setup(page);
      const res = await page.evaluate(PROBE);
      meta = meta || { featuredToken: res.featuredToken, featuredRgb: res.featuredRgb, base: res.base };
      for (const r of res.rows) all.push({ state: st.name, ...r });
      await st.teardown(page);
    }

    // Same element seen in several states: keep the WORST measurement.
    const uniq = new Map();
    for (const r of all) {
      const k = `${r.kind}|${r.surface}|${r.el}|${r.text}`;
      if (!uniq.has(k) || uniq.get(k).ratio > r.ratio) uniq.set(k, r);
    }
    const rows = [...uniq.values()].sort((a, b) => a.ratio - b.ratio);
    report.themes[theme] = { applied, ...meta, rows };

    const fails = rows.filter((r) => !r.pass);
    console.log(`\n===== THEME ${theme.toUpperCase()} (applied=${applied}) =====`);
    console.log(`--surface-feature = ${meta.featuredToken} -> ${meta.featuredRgb}   pageBase=${meta.base}`);
    console.log(`${rows.length} measured, ${fails.length} FAIL\n`);
    console.log('RATIO  NEED  FEAT  OPAC  PX/W      KIND        ELEMENT                              TEXT');
    for (const r of fails) {
      console.log(
        `${String(r.ratio).padStart(5)}  ${String(r.required).padStart(4)}  ` +
        `${r.onFeatured ? 'BLUE' : '    '}  ${String(r.opacity).padStart(5)}  ` +
        `${String(r.fontPx).padStart(4)}/${String(r.weight).padEnd(3)}  ${r.kind.padEnd(11)} ` +
        `${r.el.slice(0, 36).padEnd(36)} ${JSON.stringify(r.text).slice(0, 40)}`
      );
    }
    await ctx.close();
  }

  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));
  const allFails = Object.values(report.themes).flatMap((t) => t.rows.filter((r) => !r.pass));
  const onBlue = allFails.filter((r) => r.onFeatured).length;
  console.log(`\nreport -> ${OUT_JSON}`);
  console.log(`TOTAL FAILURES both themes: ${allFails.length}  (on the featured blue: ${onBlue})`);
  await browser.close();
  process.exit(0);
})();
