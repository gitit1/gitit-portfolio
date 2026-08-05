// R5-c — why AI-native does not read centred like Contact.
//
// Owner: "המרכוז של AI-native לא נראה כמו Contact — תעשה לעצמך צילומים ותראה".
// So this both MEASURES the vertical gap distribution inside each slab and
// captures matched screenshots of the two sections for a side-by-side look.
//
// The measurement that matters is not "is the body centred" (margin-block:auto
// makes that trivially true) but WHERE THE SLACK SITS: a section reads centred
// only when the void is distributed AROUND the content group, not opened up
// INSIDE it between the head and the first row.

const path = require('path');
const PW = 'C:\\Users\\gitit\\AppData\\Local\\npm-cache\\_npx\\e41f203b7505f1fb\\node_modules\\playwright';
const { chromium } = require(PW);

const OUT = path.join(__dirname, 'shots');
const URL = 'http://localhost:4012/';

// Default to the owner's Chrome viewport as last measured; override from argv
// once she reports her real innerWidth/innerHeight on both screens.
const VIEWPORTS = process.argv[2]
  ? [{ label: 'owner', width: +process.argv[2].split('x')[0], height: +process.argv[2].split('x')[1] }]
  : [{ label: '1920x945', width: 1920, height: 945 }];

(async () => {
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    for (const id of ['ai-native', 'contact']) {
      // Land it the way a nav click does, so what we measure is what she sees.
      await page.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id);
      await page.waitForTimeout(1100);

      const m = await page.evaluate((sid) => {
        const sec = document.getElementById(sid);
        const slab = sec.querySelector(':scope > .container') || sec;
        const head = sec.querySelector('.section__head');
        const body = sec.querySelector('.section__body');
        const r = (el) => {
          if (!el) return null;
          const b = el.getBoundingClientRect();
          return { top: Math.round(b.top), bottom: Math.round(b.bottom), h: Math.round(b.height) };
        };
        // Direct children of the body = the "content group" rows.
        const kids = body
          ? [...body.children].map((c) => ({
              cls: (typeof c.className === 'string' ? c.className : '').split(/\s+/)[0],
              ...r(c),
            }))
          : [];
        const cs = body ? getComputedStyle(body) : null;
        return {
          slab: r(slab),
          head: r(head),
          body: r(body),
          bodyStyle: cs
            ? {
                display: cs.display,
                justifyContent: cs.justifyContent,
                marginBlock: `${cs.marginBlockStart} / ${cs.marginBlockEnd}`,
                gap: cs.rowGap,
              }
            : null,
          kids,
        };
      }, id);

      // Where does the slack actually sit?
      const gapHeadToFirst = m.kids.length ? m.kids[0].top - m.head.bottom : null;
      const gapLastToSlabEnd = m.kids.length ? m.slab.bottom - m.kids[m.kids.length - 1].bottom : null;
      const contentTop = m.kids.length ? m.kids[0].top : null;
      const contentBottom = m.kids.length ? m.kids[m.kids.length - 1].bottom : null;

      console.log(`\n--- ${sid_pad(id)} @ ${vp.width}x${vp.height} ---`);
      console.log(`slab      ${m.slab.top} -> ${m.slab.bottom}  (h=${m.slab.h})`);
      console.log(`head      ${m.head ? `${m.head.top} -> ${m.head.bottom}` : 'none'}`);
      console.log(`body      ${m.body.top} -> ${m.body.bottom}  ${JSON.stringify(m.bodyStyle)}`);
      m.kids.forEach((k, i) =>
        console.log(`  row${i}   ${k.top} -> ${k.bottom}  (h=${k.h})  .${k.cls}`)
      );
      console.log(`GAP head -> first row : ${gapHeadToFirst}px`);
      console.log(`GAP last row -> slab  : ${gapLastToSlabEnd}px`);
      if (gapHeadToFirst != null && gapLastToSlabEnd != null) {
        const inner = m.kids.slice(1).map((k, i) => k.top - m.kids[i].bottom);
        console.log(`GAPS between rows     : ${inner.join(', ')}px`);
        console.log(
          `VERDICT: head->content ${gapHeadToFirst}px vs content->end ${gapLastToSlabEnd}px  ` +
          `(content group ${contentTop} -> ${contentBottom})`
        );
      }

      await page.screenshot({
        path: path.join(OUT, `r5c-${id}-${vp.width}x${vp.height}.jpg`),
        type: 'jpeg',
        quality: 82,
      });
    }
    await ctx.close();
  }
  await browser.close();
  process.exit(0);
})();

function sid_pad(s) {
  return s.padEnd(10);
}

