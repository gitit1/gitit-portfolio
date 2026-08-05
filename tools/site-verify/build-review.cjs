// Generates the owner-facing RTL Hebrew review page with the real screenshots
// embedded as data URIs (the Artifact CSP blocks external hosts).
const fs = require('fs');
const path = require('path');

const SHOTS = path.join(__dirname, 'shots');
const OUT = path.join(__dirname, 'site-review-2026-07-25.html');

const img = (file) => {
  const b = fs.readFileSync(path.join(SHOTS, file));
  return `data:image/jpeg;base64,${b.toString('base64')}`;
};

const shot = (file, title, note) => `
      <figure class="shot">
        <img src="${img(file)}" alt="${title}" loading="lazy" />
        <figcaption><b>${title}</b>${note ? ` — ${note}` : ''}</figcaption>
      </figure>`;

// Every row here is a real measurement printed by the Playwright harness.
const measured = [
  ['רוחב התוכן במסך שלך (1920)', '1440px', 'היה 1120px — 58% מהמסך'],
  ['גלילה אופקית · 1920 / 1440 / 390', 'אין', 'היה 1501 / 1483 / 702'],
  ['תוויות התפריט', 'שורה אחת', 'נשברו באמצע מילה'],
  ['מדרגת הכרטיסים · כהה', '1.31:1', 'הייתה 1.10:1'],
  ['מדרגת הכרטיסים · בהיר', '1.34:1', 'הייתה 1.24:1'],
  ['קצב החלפת הזרקור', '8 שניות', 'נמדד בדפדפן'],
  ['עצירה אחרי בחירה מכוונת', 'נעצר', '9.5 שניות ללא זחילה'],
  ['האווטאר ביחס לשם', 'אותה שורה', 'מתהפך נכון בעברית'],
  ['ארבע התמונות בבנייה', 'נטענות', '200, לא 404'],
];

const closed = [
  ['הזרקור חי בתוך העמוד הראשי', 'לא בלוק נפרד מתחתיו — קומפוזיציה אחת עם הזהות'],
  ['התמונה שלך בעיגול ליד השם', 'אותה שורה, גרסה מוקטנת ‎8KB במקום 307KB'],
  ['שורת שמות הפרויקטים הוסרה', 'לא מתרחבת ל-20 פרויקטים, וגם נקודות לא'],
  ['חצים קדימה/אחורה + מונה', '‎01 / 04‎ — אלמנט אחד בכל מספר פרויקטים'],
  ['הקצב הואט', '8 שניות, קבוע אחד בראש הקומפוננטה'],
  ['הרוחב הורחב למסך שלך', 'clamp(1120px, 75vw, 1700px)'],
  ['הגלילה הצידה בוטלה', 'בלוק קוד עם nowrap דחף את כל העמוד'],
  ['הטענה "למה AI תפור עליי"', 'נכנסה כבלוק הפותח של How I build, בשתי השפות'],
  ['ההבזק בטעינת עמוד', 'הערכה נקבעת לפני הציור הראשון'],
];

// Round-2 (WP-G4) additions — every row is a real measurement from the
// extended Playwright harness (56/56).
const measuredG4 = [
  ['כרטיסי האינדקס', '4 · לפי הרישום', 'הסקציה הישנה: 3 פרויקטים מ-2019-2020'],
  ['קישורים כנים בלבד', '2 קישורים · 2 כרטיסים שקטים', 'קישור נמדד רק כשיש יעד אמיתי'],
  ['קישורי ‎#/case/‎ מתים', '0', 'היו 2 (בזרקור) — אין ראוטר באתר'],
  ['עוגן "כל הפרויקטים"', 'מצביע על ‎#projects', 'הסקציה החדשה, לא הישנה'],
  ['הגרף: צמתים וקשתות', '4+14 · 25 קשתות', 'רק יכולות עם ראיית קובץ בריפו אמיתי'],
  ['פריסת הגרף בין טעינות', 'זהה עד 0.1px', 'דטרמיניסטית — בלי אקראיות'],
  ['סנכרון ריחוף גרף⇄כרטיס', 'עובד בשני הכיוונים', 'נמדד בדפדפן'],
  ['מדרגת הכרטיסים מעל הלוח', '1.15:1 כהה · 1.14:1 בהיר', '+ מסגרת + צל, בשתי הערכות'],
  ['שרשרת הנגישות', 'הגרף aria-hidden · 0 ב-Tab', 'האינדקס הוא הדלת הנגישה'],
  ['תרגום כרום הסקציה', 'עברית מלאה', 'שורת ה-MFL נשארת ציטוט באנגלית — נעול'],
];

const closedG4 = [
  ['סקציית Projects נבנתה מהרישום החדש', '4 הפרויקטים האמיתיים עם אמנות אמיתית; TriPick ו-Chat Room (2019-2020) ירדו מהאתר ומקורות החיים המכונתיים'],
  ['הדלת הכפולה', 'אינדקס נגיש + גרף יכולות SVG לצידו; הגרף מוסתר מתחת ל-1200px עד שלב המובייל'],
  ['תגיות יכולות אמיתיות', 'כל תגית גובתה בקובץ בריפו של הפרויקט עצמו (נבדקו מדגמית); שום תגית לא הומצאה'],
  ['קליקים מתים תוקנו', '"צפייה בקייס" הצביע על ראוטר שלא קיים; עכשיו נופל לאתר החי או לצ׳יפ "בתיעוד" עד שדפי הקייס ייבנו'],
  ['המחסנית הישנה נפרשה', 'projects.ts · מודאל · גלריית swiper + התלות עצמה נמחקו; אמנות הגלריה נשמרה בדיסק לדף הקייס של MFL'],
  ['פאנל הגרף דביק בגלילה', 'העמודה של הכרטיסים גבוהה ממנו — בלי דביקות נפער חור ריק (נצפה ברינדור, תוקן ואומת)'],
];

const open = [
  ['מובייל', 'עיצוב נפרד — את קבעת שזה השלב הבא. ההירו נערם ל-1.4 מסכים; נאסף כקלט.', 'next', null],
  ['סקציית Projects', 'צריכה להיבנות מהרישום החדש. העוגן "כל הפרויקטים" מצביע עליה.', 'next',
    'נסגר: 25.07.2026 — נבנתה מהרישום עם הדלת הכפולה (אינדקס + גרף), אומתה 56/56 ברינדור אמיתי.'],
  ['דפי הקייס (Wildhearth · MFL)', 'ה-CTA "צפייה בקייס" יחזור רק כשהדפים ייבנו (שער LIVE_CASE_ROUTES). הסדר מול המובייל — החלטה שלך.', 'next', null],
  ['טקסט ל-6 השלבים', 'המסלול קיים עם שמות בלבד. הפרוזה לכל שלב מחכה לך.', 'wait', null],
  ['assaf-friends-games', 'בפורטפוליו עם קישור אמיתי, אבל עוד לא סומן public רשמית.', 'wait', null],
  ['גיזום שיחת הארכיטקטורה', '34 תורים גולמיים, ואז אישור 8 הטיוטות.', 'wait', null],
  ['‎.npmrc בריפו האתר', 'מקודד לא נכון, npm לא קורא אותו. לא נגעתי.', 'wait', null],
];

const html = `<title>האתר החדש — סבב 25.07.2026</title>
<style>
  :root {
    --bg: #eaecf3;      --paper: #fbfcfe;   --line: #cdd2e0;
    --ink: #171a22;     --ink-soft: #4d556b; --ink-faint: #6f7893;
    --accent: #4a5bd4;  --accent-soft: #e6e9fb;
    --good: #1f8a5f;    --good-bg: #dff2e8;
    --wait: #96631a;    --wait-bg: #faeed6;
    --shadow: 0 1px 2px rgba(23,26,34,.06), 0 8px 24px rgba(23,26,34,.07);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #0c0e12;    --paper: #232833;   --line: #39404f;
      --ink: #eef0f6;   --ink-soft: #b3bacd; --ink-faint: #8b93a9;
      --accent: #8c9bff; --accent-soft: #262c45;
      --good: #5fd39d;  --good-bg: #17342a;
      --wait: #e2b45f;  --wait-bg: #33290f;
      --shadow: 0 1px 2px rgba(0,0,0,.5), 0 10px 30px rgba(0,0,0,.45);
    }
  }
  :root[data-theme="dark"] {
    --bg: #0c0e12;      --paper: #232833;   --line: #39404f;
    --ink: #eef0f6;     --ink-soft: #b3bacd; --ink-faint: #8b93a9;
    --accent: #8c9bff;  --accent-soft: #262c45;
    --good: #5fd39d;    --good-bg: #17342a;
    --wait: #e2b45f;    --wait-bg: #33290f;
    --shadow: 0 1px 2px rgba(0,0,0,.5), 0 10px 30px rgba(0,0,0,.45);
  }
  :root[data-theme="light"] {
    --bg: #eaecf3;      --paper: #fbfcfe;   --line: #cdd2e0;
    --ink: #171a22;     --ink-soft: #4d556b; --ink-faint: #6f7893;
    --accent: #4a5bd4;  --accent-soft: #e6e9fb;
    --good: #1f8a5f;    --good-bg: #dff2e8;
    --wait: #96631a;    --wait-bg: #faeed6;
    --shadow: 0 1px 2px rgba(23,26,34,.06), 0 8px 24px rgba(23,26,34,.07);
  }

  html { direction: rtl; }
  body {
    background: var(--bg); color: var(--ink);
    font-family: "Segoe UI", "Noto Sans Hebrew", Arial, sans-serif;
    font-size: 17px; line-height: 1.65;
    -webkit-font-smoothing: antialiased;
  }
  .mono {
    font-family: "Cascadia Mono", Consolas, "Courier New", monospace;
    font-variant-numeric: tabular-nums;
  }
  .wrap { max-width: 60rem; margin: 0 auto; padding: clamp(1.5rem, 4vw, 3.5rem) clamp(1rem, 4vw, 2rem) 5rem; }

  header.top { display: flex; flex-direction: column; gap: .5rem; padding-bottom: 1.5rem; border-bottom: 2px solid var(--ink); margin-bottom: 2.5rem; }
  .eyebrow { font-size: .74rem; letter-spacing: .13em; text-transform: uppercase; color: var(--accent); font-weight: 700; }
  h1 { font-size: clamp(1.7rem, 5vw, 2.5rem); line-height: 1.2; font-weight: 800; letter-spacing: -.02em; text-wrap: balance; }
  .sub { color: var(--ink-soft); max-width: 60ch; }
  .facts { display: flex; flex-wrap: wrap; gap: .4rem .5rem; margin-top: .6rem; }
  .fact { font-size: .78rem; padding: .2rem .55rem; border: 1px solid var(--line); border-radius: 999px; color: var(--ink-soft); background: var(--paper); }

  section { margin-bottom: 3rem; }
  h2 { font-size: 1.35rem; font-weight: 800; letter-spacing: -.01em; margin-bottom: .35rem; }
  h2 + .lede { color: var(--ink-soft); max-width: 62ch; margin-bottom: 1.4rem; }

  .shots { display: grid; gap: 1.6rem; }
  .shot { background: var(--paper); border: 1px solid var(--line); border-radius: 10px; box-shadow: var(--shadow); overflow: hidden; }
  .shot img { display: block; width: 100%; height: auto; }
  .shot figcaption { padding: .7rem .9rem; font-size: .85rem; color: var(--ink-soft); border-top: 1px solid var(--line); }
  .shot figcaption b { color: var(--ink); font-weight: 700; }
  .shot--narrow img { max-width: 380px; margin-inline: auto; border-inline: 1px solid var(--line); }

  .tablewrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 10px; background: var(--paper); box-shadow: var(--shadow); }
  table { width: 100%; border-collapse: collapse; font-size: .9rem; }
  th, td { text-align: right; padding: .6rem .9rem; border-bottom: 1px solid var(--line); vertical-align: top; }
  thead th { font-size: .72rem; letter-spacing: .09em; text-transform: uppercase; color: var(--ink-faint); font-weight: 700; white-space: nowrap; }
  tbody tr:last-child td { border-bottom: 0; }
  td.now { font-weight: 700; color: var(--good); white-space: nowrap; }
  td.was { color: var(--ink-faint); font-size: .84rem; }

  ul.items { list-style: none; display: grid; gap: .1rem; }
  ul.items li { display: grid; grid-template-columns: auto 1fr; gap: .6rem; align-items: start; padding: .7rem .2rem; border-bottom: 1px solid var(--line); }
  ul.items li:last-child { border-bottom: 0; }
  .tag { font-size: .72rem; font-weight: 700; padding: .15rem .5rem; border-radius: 999px; white-space: nowrap; margin-top: .15rem; }
  .tag--done { color: var(--good); background: var(--good-bg); }
  .tag--next { color: var(--accent); background: var(--accent-soft); }
  .tag--wait { color: var(--wait); background: var(--wait-bg); }
  .items .what { font-weight: 700; }
  .items .why { color: var(--ink-soft); font-size: .9rem; }

  .callout { background: var(--paper); border: 1px solid var(--line); border-inline-start: 3px solid var(--accent); border-radius: 8px; padding: 1rem 1.1rem; box-shadow: var(--shadow); }
  .callout p + p { margin-top: .6rem; }
  footer { margin-top: 3rem; padding-top: 1.2rem; border-top: 1px solid var(--line); color: var(--ink-faint); font-size: .85rem; }
  @media (prefers-reduced-motion: no-preference) { .shot { transition: box-shadow .2s ease; } }
</style>

<div class="wrap">
  <header class="top">
    <span class="eyebrow">gititregev.info · redesign/gitit-os</span>
    <h1>האתר החדש — מה שבנוי כרגע</h1>
    <p class="sub">כל התמונות כאן הן צילומים אמיתיים מהאתר שרץ מקומית, לא מוקאפים. שום דבר לא פורסם ולא נדחף לגיט המרוחק.</p>
    <div class="facts">
      <span class="fact mono">25.07.2026 · סבב רביעי</span>
      <span class="fact mono">17 קומיטים</span>
      <span class="fact mono">68/68 בדיקות</span>
      <span class="fact">מקומי בלבד</span>
    </div>
  </header>

  <section>
    <h2>המסך שלך — Full HD</h2>
    <p class="lede">זה מה שנפתח אצלך. הזהות והפרויקט המתחלף חולקים מסך אחד, התמונה שלך צמודה לשם, ומתחת לכרטיס יש חצים ומונה מיקום במקום שורת שמות.</p>
    <div class="shots">
${shot('08-desktop-1920-fullhd-en-dark-hero.jpg', 'ערכה כהה · 1920', 'רוחב התוכן 1440px — היה 1120px')}
${shot('09-desktop-1920-fullhd-en-light-hero.jpg', 'ערכה בהירה · 1920', 'הגרפיט שאישרת, עם מדרגה נראית לעין')}
${shot('10-desktop-1920-fullhd-he-dark-hero.jpg', 'עברית · RTL', 'האווטאר והחצים מתהפכים לצד הנכון')}
    </div>
  </section>

  <section>
    <h2>העמוד במלואו</h2>
    <p class="lede">כל סקציה היא עכשיו לוח נפרד עם הפרדה נראית — לא רצף שנדבק. פירוק לגלילה אחת:</p>
    <div class="shots">
${shot('05-desktop-en-dark-full.jpg', 'העמוד כולו · דסקטופ', 'הירו · How I build · ניסיון · פרויקטים · AI-native · קשר')}
    </div>
  </section>

  <section>
    <h2>מובייל — עובד, עוד לא מעוצב</h2>
    <p class="lede">לפי מה שקבעת, מובייל הוא השלב הבא ולא טופל עכשיו. מה שכן נדרש: שיהיה תקין וכנה — בלי גלילה הצידה ובלי תוכן חתוך. ההירו נערם ל-1.4 מסכים, וזה נרשם כקלט לשלב ההוא.</p>
    <div class="shots">
      <figure class="shot shot--narrow">
        <img src="${img('06-mobile-390-en-dark.jpg')}" alt="מובייל 390" loading="lazy" />
        <figcaption><b>390px</b> — תקין: אין גלילה אופקית, החצים שמישים, האווטאר צמוד לשם</figcaption>
      </figure>
    </div>
  </section>

  <section>
    <h2>סבב רביעי — ההערות מהמסך החי</h2>
    <p class="lede">שלוש ההערות טופלו: Gitit's AI (חלון הצ'אט עצמו) קיבל את משטח האינדיגו; היעד הוחמר ל"מסך שלם" ונמדד על חלון הכרום האמיתי שלך (‎1920×945‎, אחרי סרגלי הדפדפן); ו-AI-native התמרכז כמו Contact — הדוגמה שנתת.</p>
    <div class="tablewrap">
      <table>
        <thead><tr><th>מה ביקשת</th><th>עכשיו · נמדד ב-‎1920×945</th><th>קודם</th></tr></thead>
        <tbody>
          <tr><td>"לא שינית את Gitit's AI"</td><td class="now mono">חלון הצ'אט על משטח האינדיגו</td><td class="was">פירשתי לא נכון — שיניתי את הכרטיס בסקציה במקום את הצ'אט</td></tr>
          <tr><td>"שיכנסו במסך שלם"</td><td class="now mono">How-I-build 1.02× · ניסיון 1.01× · פרויקטים 1.01×</td><td class="was">1.2×-1.3× בחלון האמיתי (מדדתי קודם על 1080 מלא)</td></tr>
          <tr><td>"AI-native טיפה למרכז"</td><td class="now mono">הכותרת למעלה, התוכן מתמרכז</td><td class="was">נערם למעלה עם חור ריק למטה; Contact = המודל</td></tr>
          <tr><td>רצפת קריאוּת</td><td class="now mono">טקסט רץ ≥13.0px — נשמר</td><td class="was">ניסיון נכנס במסך בדחיסת ריווח בלבד, בלי שתי עמודות</td></tr>
        </tbody>
      </table>
    </div>
    <div class="shots" style="margin-top:1.4rem">
${shot('18-experience-945.jpg', 'ניסיון — מסך שלם ב-‎945', 'כל ששת התפקידים על מסך אחד, קריא')}
${shot('17-projects-945.jpg', 'פרויקטים — מסך שלם ב-‎945', 'ארבעה כרטיסים + הגרף')}
${shot('19-ainative-945.jpg', 'AI-native ממורכז', 'הכותרת למעלה, הכרטיסים באמצע השטח שנשאר')}
    </div>
  </section>

  <section>
    <h2>סבב שלישי — ההערות שלך מהצילומים</h2>
    <p class="lede">ארבע ההערות טופלו ואומתו במדידה: כל סקציה נכנסת במסך, הניווט נוחת בדיוק על העמוד, יש זום לתמונות, ולגרף/פופ-אפ/Gitit's AI יש רקע משלהם.</p>
    <div class="tablewrap">
      <table>
        <thead><tr><th>מה ביקשת</th><th>עכשיו</th><th>קודם</th></tr></thead>
        <tbody>
          <tr><td>ניווט נוחת בדיוק על העמוד</td><td class="now mono">68px = גובה ההדר, מדויק</td><td class="was">היסט כפול ‎~136px — נחת "טיפה למעלה"</td></tr>
          <tr><td>כל סקציה נכנסת במסך · ‎1920×1080</td><td class="now mono">1.05× · 1.10× · 1.12× · 0.92× · 0.92×</td><td class="was">עד 1.38×; והסלאב היה מוכרח להיות גבוה ממסך (min-height:100svh)</td></tr>
          <tr><td>גם במסכים קטנים · ‎1366×768</td><td class="now mono">כולן ≤1.35×</td><td class="was">Projects היה 3.93× (עמודה אחת)</td></tr>
          <tr><td>גודל טקסט דינמי</td><td class="now mono">שורש הפונט נגזר מרוחב+גובה המסך</td><td class="was">רצפת קריאוּת: טקסט רץ ≥13px — נמדד, לא ירדנו ממנה</td></tr>
          <tr><td>זום לתמונות</td><td class="now mono">כפתור בכל כרטיס + Esc סוגר</td><td class="was">דיאלוג נגיש מלא (פוקוס נלכד וחוזר)</td></tr>
          <tr><td>הגרף נפתח בגדול</td><td class="now mono">אינטראקטיבי גם בפופ-אפ</td><td class="was">כפתור הגדלה בפינת הפאנל</td></tr>
          <tr><td>רקע שונה לגרף / פופ-אפ / Gitit's AI</td><td class="now mono">משטח אינדיגו משותף לשלושתם</td><td class="was">היו על אותו רקע כמו הקופסאות</td></tr>
        </tbody>
      </table>
    </div>
    <div class="shots" style="margin-top:1.4rem">
${shot('16-projects-1366-fit.jpg', 'מסך קטן ‎1366×768', 'שתי עמודות שרדו, זום בכל כרטיס, הפאנל המיוחד בולט')}
${shot('15-hib-1366-fit.jpg', 'How I build ב-‎1366', 'הטקסט התכווץ אבל נשאר מעל רצפת הקריאוּת')}
    </div>
  </section>

  <section>
    <h2>חדש היום — סקציית Projects: הדלת הכפולה</h2>
    <p class="lede">העוגן "כל הפרויקטים" מוביל עכשיו לסקציה שנבנתה מהרישום האמיתי: אינדקס של 4 הפרויקטים (כרטיסים כנים — קישור רק כשיש יעד אמיתי) ולצידו גרף היכולות. כל תגית בגרף גובתה בקובץ אמיתי בריפו של הפרויקט — שום דבר לא הומצא.</p>
    <div class="shots">
${shot('14-projects-1920-en-dark.jpg', 'הדלת הכפולה · 1920', 'אינדקס + גרף על מסך אחד; ריחוף על יכולת מדליק את הפרויקטים שחולקים אותה')}
${shot('11-projects-en-dark.jpg', '‎1440 · הפאנל הדביק', 'הגרף נשאר לצידך גם כשגוללים לאורך הכרטיסים')}
${shot('12-projects-he-dark.jpg', 'עברית · RTL', 'הגרף עובר לצד השני; שורת ה-MFL נשארת ציטוט באנגלית — נעול')}
      <figure class="shot shot--narrow">
        <img src="${img('13-projects-mobile-390.jpg')}" alt="פרויקטים במובייל 390" loading="lazy" />
        <figcaption><b>390px</b> — עמודה אחת, הגרף מוסתר בכוונה עד שלב המובייל</figcaption>
      </figure>
    </div>
  </section>

  <section>
    <h2>מה נמדד בסבב Projects</h2>
    <div class="tablewrap">
      <table>
        <thead><tr><th>מה נמדד</th><th>עכשיו</th><th>הערה</th></tr></thead>
        <tbody>
${measuredG4.map(([k, now, was]) => `          <tr><td>${k}</td><td class="now mono">${now}</td><td class="was">${was}</td></tr>`).join('\n')}
        </tbody>
      </table>
    </div>
  </section>

  <section>
    <h2>מה נסגר בסבב Projects</h2>
    <ul class="items">
${closedG4.map(([w, y]) => `      <li><span class="tag tag--done">✔ נסגר</span><span><span class="what">${w}</span><br /><span class="why">${y}</span></span></li>`).join('\n')}
    </ul>
  </section>

  <section>
    <h2>מה נמדד בדפדפן אמיתי</h2>
    <p class="lede">האייג'נט שבנה אמר בכנות שאין לו דפדפן, ולכן כל טענה חזותית שלו הייתה היגיון בלבד. בניתי בדיקה שמריצה את האתר ומודדת. היא מצאה ארבע תקלות אמיתיות שההיגיון פספס — כולן תוקנו.</p>
    <div class="tablewrap">
      <table>
        <thead><tr><th>מה נמדד</th><th>עכשיו</th><th>קודם</th></tr></thead>
        <tbody>
${measured.map(([k, now, was]) => `          <tr><td>${k}</td><td class="now mono">${now}</td><td class="was mono">${was}</td></tr>`).join('\n')}
        </tbody>
      </table>
    </div>
  </section>

  <section>
    <h2>מה נסגר בסבב הזה</h2>
    <ul class="items">
${closed.map(([w, y]) => `      <li><span class="tag tag--done">✔ נסגר</span><span><span class="what">${w}</span><br /><span class="why">${y}</span></span></li>`).join('\n')}
    </ul>
  </section>

  <section>
    <h2>מה פתוח</h2>
    <ul class="items">
${open.map(([w, y, t, closedNote]) => `      <li><span>${closedNote ? `<span class="tag tag--done">✔ נסגר</span> ` : ''}<span class="tag tag--${t}">${t === 'next' ? 'הבא בתור' : 'מחכה לך'}</span></span><span><span class="what">${w}</span><br /><span class="why">${y}</span>${closedNote ? `<br /><span class="why" style="color: var(--good); font-weight: 600;">${closedNote}</span>` : ''}</span></li>`).join('\n')}
    </ul>
  </section>

  <section>
    <h2>דבר אחד שאני חייב לומר</h2>
    <div class="callout">
      <p>מצאתי שכפתורי "צפייה בקייס" (בזרקור: MFL ו-Wildhearth) הצביעו על נתיב ראוטר שלא קיים באתר — קליק מת. תיקנתי לכנות: קישור קייס יופיע רק כשדף הקייס באמת ייבנה; עד אז MFL מוביל לאתר החי שלו, ו-Wildhearth מציג "הקייס בתיעוד". המשמעות: <b>ל-Wildhearth ול-Homebase אין כרגע שום עמוד לחיץ</b> — דפי הקייס הם מה שפותח את זה.</p>
      <p>ועוד אחד שצריך להיאמר: המעבר לרישום החדש הוריד את TriPick ואת Chat Room גם מהאתר וגם מקורות החיים המכונתיים (resume.json / llms.txt / כלי ה-MCP). אם תרצי אותם בחזרה — זו החלטת תוכן שלך, לא טכנית.</p>
    </div>
  </section>

  <footer>
    <p>ענף <span class="mono">redesign/gitit-os</span> · לא נדחף · נבדק על פורט 4012 (3012 נשאר שלך). התיעוד המלא ב-<span class="mono">docs/HANDOFF.md (גם ב-gititregev.info)</span>.</p>
  </footer>
</div>
`;

fs.writeFileSync(OUT, html, 'utf8');
console.log(`wrote ${OUT}  (${(fs.statSync(OUT).size / 1024 / 1024).toFixed(2)} MB)`);
