// R5-b — the fit-to-viewport measure loop, made permanent.
//
// Round 4 was accepted against fill <= 1.02 at an ASSUMED 1920x945 viewport.
// Both halves of that were wrong: >1.0 is still overflow (the bar is <= 0.98),
// and 1920x945 assumed no browser zoom / Windows display scaling — at 125%,
// very common on a Full HD Windows machine, the effective viewport is about
// 1536x756. Never assume the owner's viewport again: measure at the real
// numbers she reports from `innerWidth + 'x' + innerHeight`.
//
// Usage:
//   node measure-fills.cjs                 # the default probe set
//   node measure-fills.cjs 1536x756        # one real viewport
//   node measure-fills.cjs 1536x756 1920x945 3440x1300
//
// Also checks the R5-d safety invariant: a section that OVERFLOWS must keep
// its head flush-top (auto margins collapsed to 0), never pushed above the
// slab where it cannot be scrolled to.

const PW = 'C:\\Users\\gitit\\AppData\\Local\\npm-cache\\_npx\\e41f203b7505f1fb\\node_modules\\playwright';
const { chromium } = require(PW);

const URL = 'http://localhost:4012/';
const TARGET = 0.98; // owner's bar: a section must FIT, not merely almost fit.

const parseVp = (s) => {
  const [w, h] = s.toLowerCase().split('x').map(Number);
  if (!w || !h) throw new Error(`bad viewport "${s}" — expected WIDTHxHEIGHT`);
  return { width: w, height: h };
};

const VIEWPORTS = process.argv.slice(2).length
  ? process.argv.slice(2).map(parseVp)
  : [
      { width: 1920, height: 945 }, // Full HD, no scaling, Chrome chrome removed
      { width: 1536, height: 756 }, // Full HD at 125% Windows scaling
      { width: 1366, height: 728 }, // common laptop
    ];

(async () => {
  const browser = await chromium.launch();
  let worstOverall = 0;
  const failures = [];

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    const ids = await page.evaluate(() =>
      [...document.querySelectorAll('.section--page')].map((s) => s.id));

    console.log(`\n=== ${vp.width}x${vp.height} ===  (target fill <= ${TARGET})`);
    for (const id of ids) {
      await page.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id);
      await page.waitForTimeout(700);
      const m = await page.evaluate((sid) => {
        const sec = document.getElementById(sid);
        const slab = sec.querySelector(':scope > .container') || sec;
        const head = sec.querySelector('.section__head');
        const hh = document.querySelector('.header').getBoundingClientRect().height;
        const sb = slab.getBoundingClientRect();
        const hb = head ? head.getBoundingClientRect() : null;
        // Smallest rendered text in the slab — the legibility floor that must
        // never be traded away to make something fit.
        let minPx = Infinity;
        for (const el of slab.querySelectorAll('*')) {
          const t = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
          if (!t) continue;
          const r = el.getBoundingClientRect();
          if (r.width < 1 || r.height < 1) continue;
          minPx = Math.min(minPx, parseFloat(getComputedStyle(el).fontSize));
        }
        return {
          fill: +(sb.height / (innerHeight - hh)).toFixed(3),
          headInset: hb ? +(hb.top - sb.top).toFixed(1) : null,
          minFontPx: Number.isFinite(minPx) ? +minPx.toFixed(1) : null,
        };
      }, id);

      const over = m.fill > TARGET;
      const unsafe = m.headInset != null && m.headInset < -0.5;
      if (over) failures.push({ vp: `${vp.width}x${vp.height}`, id, fill: m.fill });
      worstOverall = Math.max(worstOverall, m.fill);
      console.log(
        `${over ? 'OVER' : 'ok  '} ${id.padEnd(12)} fill=${String(m.fill).padStart(6)}  ` +
        `minFont=${String(m.minFontPx).padStart(5)}px  headInset=${String(m.headInset).padStart(7)}px` +
        `${unsafe ? '  <-- UNSAFE: head pushed above slab' : ''}`
      );
    }
    await ctx.close();
  }

  console.log(`\nworst fill across all viewports: ${worstOverall}  (bar ${TARGET})`);
  if (failures.length) {
    console.log(`OVERFLOWING (${failures.length}):`);
    for (const f of failures) console.log(`  ${f.vp}  ${f.id}  ${f.fill}`);
  } else {
    console.log('every section fits every measured viewport.');
  }
  await browser.close();
  process.exit(0);
})();
