// Hebrew overlay for the project pages (data/project-pages-content.ts +
// data/project-pages.ts). Same pattern as i18n/content-he.ts: English stays
// the canonical data, this file supplies the Hebrew rendering only.
//
// ===================================================================
// DRAFT — every Hebrew string in this file is NEW (2026-11-04, project
// pages wave 1) and NOT yet approved by the owner. She approves Hebrew
// copy verbatim before anything is deployed (the 2026-09-07 rule).
// Written without em dashes or en dashes as punctuation, on purpose: she
// removed every one from her approved copy. Company and product names stay
// English. NOT translated, by ruling: each project's `tagline` and its own
// quoted `pitch` ("שיווקי זה שיווקי", 2026-09-07), and the `tech` chips.
// ===================================================================

import type { Lang } from './types';
import type { ProjectPage, ProjectShot } from '../data/project-pages';
import type { ProjectPageId, ProjectPagePillar } from '../data/project-pages-content';

type ProjectPageHe = {
  name?: string;
  status: string;
  summary: string;
  pitchSource?: string;
  figureLabels?: string[];
  pillarsTitle?: string;
  pillars?: ProjectPagePillar[];
  facetsTitle?: string;
  /** Keyed by facet id; for Friends World these are the category names from
   *  the project's own src/i18n/he.ts, never a translation of ours. */
  facetLabels?: Record<string, string>;
  worksToday: string[];
  next?: string[];
  linkLabel?: string;
  noLinkNote?: string;
  side?: { title: string; status: string; text: string };
  closing?: string;
  heroCaption: string;
  galleryCaptions: string[];
  sideCaptions?: string[];
};

const pagesHe: Record<ProjectPageId, ProjectPageHe> = {
  wildhearth: {
    status: 'בפיתוח · תצוגה מוקדמת פרטית',
    summary:
      'משחק חיים וחווה לשחקן יחיד, דו-ממדי ובמבט מלמעלה, שרץ בדפדפן ומתרחש בעולם ישן, לפני המהפכה התעשייתית. אין בו קרבות. מתחילים עם כמה מטבעות וחווה מוזנחת.',
    pitchSource: 'מתוך דף הנחיתה של המשחק',
    figureLabels: ['דרכי פתיחה', 'כישורים שמרוויחים מעשייה', 'תושבים עם שם', 'צרכים לדאוג להם'],
    pillarsTitle: 'העקרונות',
    pillars: [
      { title: 'שום דבר לא בחינם', text: 'כל כלי, חיה וזרע נקנים בכסף שהרווחת בעצמך.' },
      { title: 'חווה שבונים מחדש', text: 'החווה מתחילה מוזנחת. כל תיקון הוא שינוי שרואים, חלק אחרי חלק.' },
      { title: 'כישורים שמרוויחים מעשייה', text: 'כל כישור גדל רק מתוך שימוש, ויש תקרה לכמה אפשר לשלוט בסך הכול.' },
      { title: 'קשרים עמוקים', text: 'לכל אחד מאנשי העיר יש סדר יום וסיפור משלו.' },
      { title: 'תושבים חכמים, לבחירה', text: 'אפשר לתת למודל שפה להפעיל את התושבים, עם מפתח משלך. כבוי כברירת מחדל.' },
      { title: 'אף פעם לא קרבות', text: 'בלי מפלצות, בלי מוות, בלי מכות. המתח בא מכסף, מזמן ומשאיפות.' },
    ],
    worksToday: [
      'ארבע דרכי פתיחה (דייג, חקלאי, מוזיקאי, מגדל חיות) וחמישה חלומות לחיים',
      'עשרה כישורים שגדלים רק כשמשתמשים בהם, ושבעה צרכים',
      '15 תושבים עם שם, סדר יום וקשרים',
      'דיג, ליקוט, נגינה ברחוב, חטיבת עצים, חקלאות והשקיה',
      'חנות, דוכן בשוק, לוח עבודות ודואר',
      'בישול, מלאכה וריהוט',
      'שדרוג הבית ושיפוץ החווה המוזנחת',
      'לוח שנה, עונות, מזג אוויר ופסטיבל',
      'כמה משבצות שמירה, ואבני מסע שמקפיצות בין מקומות',
      'תושבים חכמים לבחירה, כבויים כברירת מחדל, עם מפתח משלך',
    ],
    next: ['העיר שמעבר לכיכר השוק', 'נישואין ומשפחה', 'חיות מחמד', 'מכרות וסירות', 'מפת עולם'],
    noLinkNote: 'עדיין אין קישור פתוח. המשחק בתצוגה מוקדמת פרטית.',
    heroCaption: 'מסך הפתיחה של Wildhearth: בית חווה מצויר בפיקסלים על גבעה בשקיעה.',
    galleryCaptions: [
      'המסך הראשי: החווה, התיק ושבעת הצרכים.',
      'מגיעים לחווה המוזנחת של הדודה רבתא מירה.',
      'יוצרים את הדמות.',
      'בוחרים דרך פתיחה וחלום לחיים.',
      'שדה, מהנבט ועד הקציר.',
      'דג נוגס בפיתיון.',
      'מנגנים ברחוב בכיכר השוק.',
      'מבשלים ליד האח.',
      'משוחחים עם מרן, קונת הדגים.',
      'מרהטים את הבית.',
    ],
  },
  'friends-world': {
    name: 'עולם החברים',
    status: 'חי · פתוח לכולם',
    summary:
      'אתר משחקי למידה בעברית, מימין לשמאל ובנוי קודם כול לטלפון, לילדים שעוד לא קוראים. הוא בנוי סביב 100 ״חברים״ צבעוניים, וכל אחד מהם הוא מספר.',
    figureLabels: ['משחקים', 'קטגוריות', 'חברים, כל אחד מספר'],
    pillarsTitle: 'העקרונות',
    pillars: [
      { title: 'בלי כישלונות', text: 'אין ״המשחק נגמר״. טעות מקבלת רמז עדין, וממשיכים.' },
      { title: 'בלי טיימרים ובלי תחרות', text: 'אף אחד לא רץ נגד השעון, ואף אחד לא מפסיד.' },
      { title: 'רגוע לחושים', text: 'צבעים רכים, בלי הבזקים, ואנימציות קצרות שבאות בעקבות הילד.' },
      { title: 'לילדים שעוד לא קוראים', text: 'הכול תמונות, עם הקראה מוקלטת בעברית.' },
    ],
    facetsTitle: 'המשחקים לפי קטגוריה',
    facetLabels: {
      numbers: 'מספרים',
      fun: 'כיף',
      letters: 'אותיות',
      create: 'יצירה',
      english: 'אנגלית',
      thinking: 'חשיבה',
      sports: 'ספורט',
      growup: 'גדלים',
      music: 'מוזיקה',
    },
    worksToday: [
      'הקראה בעברית בקול מוקלט',
      'מצב רגוע',
      'רמת קושי שגדלה עם הילד',
      'עובד בעברית ובאנגלית',
      'אפשר להתקין אותו כמו אפליקציה',
    ],
    linkLabel: 'לשחק במשחקים',
    side: {
      title: 'משחק מיון בתלת-ממד',
      status: 'בפיתוח',
      text: 'גרסת Unity בתלת-ממד למשחק המיון: גוררים את הכדורים לסלים המתאימים, במצב מספרים ובמצב סמיילים, עם קול שסופר בעברית. היא נבנית לטאבלט, ועוד לא רצה על מכשיר אמיתי.',
    },
    closing: 'פרויקט אישי שנבנה באהבה.',
    heroCaption: 'מסך הבית: החברים וקטגוריות המשחקים.',
    galleryCaptions: [
      'מסך הבית בטלפון.',
      'קטגוריית המספרים.',
      'מכירים את החברים, עשרה בכל פעם.',
      'העולם של אחד החברים.',
      'משחק המיון, במצב סמיילים.',
      'מגלגלים קוביות ומחברים.',
    ],
    sideCaptions: ['משחק המיון בתלת-ממד, במצב מספרים.', 'משחק המיון בתלת-ממד, במצב סמיילים.'],
  },

  // ===================================================================
  // Wave 2 (2026-11-04). DRAFT like everything above: not approved yet.
  // No em or en dashes. Product and gate names stay English.
  // ===================================================================
  'shipping-the-rainbow': {
    status: 'חי · רק עם כניסה',
    summary:
      'בית לפנדום של זוגות נשים: פורטל אחד שנפתח לשלושה שערים. ספריית סיפורים, דף לכל זוג, וסדרות קצרות לטלפון. נבנה ידנית ב-2019, ונבנה מחדש עם סוכני בינה מלאכותית ב-2026.',
    pitchSource: 'מתוך קובץ ה-README של הפרויקט',
    figureLabels: ['שערים', 'הגרסה הראשונה', 'נבנה מחדש עם סוכנים'],
    pillarsTitle: 'שלושת השערים',
    pillars: [
      { title: 'Fanfic Rainbow', text: 'לדפדף, לעקוב ולגבות את אוסף הסיפורים.' },
      { title: 'OTP Rainbow', text: 'הבית של הזוגות.' },
      { title: 'Vertical Rainbow', text: 'סדרות קצרות לטלפון על זוגות נשים: לגלות, להוריד ולצפות.' },
    ],
    worksToday: [
      'פורטל אחד שנפתח לשלושת השערים',
      'ספריית סיפורים לדפדף בה, לעקוב ולגבות את מה שאני קוראת, עם רשימות קריאה וסטטיסטיקות',
      'דף לכל זוג, עם ספריית סרטונים משלו',
      'דף של זוג מוצע קודם, ועולה רק אחרי אישור',
      'ספרייה של סדרות קצרות לטלפון, עם דף לכל סדרה, גילוי של סדרות חדשות והורדות',
      'שרת MCP שמאפשר ל-Claude לדפדף בספרייה ולהעשיר אותה',
      'כל דף דורש כניסה לחשבון',
    ],
    noLinkNote: 'אין קישור פתוח. האתר נפתח על מסך כניסה, ואין חשבון הדגמה.',
    heroCaption: 'הפורטל: קשת בענן, הסיסמה של האתר ושלושת השערים.',
    galleryCaptions: [
      'Fanfic Rainbow, השער של ספריית הסיפורים.',
      'OTP Rainbow, בית לכל זוג.',
      'Vertical Rainbow, השער של הסדרות הקצרות.',
    ],
  },
  'fanfic-os': {
    status: 'בפיתוח · פרטי',
    summary:
      'מערכת שרצה על השרת שלי, לתכנון, למעקב רציפות ולכתיבה של סאגה ארוכה בכמה חלקים, כדי שכל שינוי ייבדק אחורה וקדימה לאורך מאות פרקים.',
    pitchSource: 'מתוך קובץ ה-README של הפרויקט',
    pillarsTitle: 'איך זה עובד',
    pillars: [
      { title: 'כל עולם הסיפור', text: 'מקורות, הסאגה, רציפות, רעיונות וכתבי יד, במערכת אחת.' },
      {
        title: 'סוכנים דרך שער אחד',
        text: 'סוכני בינה מלאכותית עובדים בה רק דרך שער הכלים שלה, שנקרא MCP. גם ChatGPT מגיע לאותם כלים, דרך ממסר ב-GitHub.',
      },
      { title: 'כל שינוי באישור', text: 'שינויים שמוצעים מחכים לאישור שלי לפני שהם נחשבים.' },
    ],
    worksToday: [
      'ספריית פרויקטים',
      'קורא מקורות',
      'ניווט בסאגה',
      'מעקב רציפות',
      'מעבדת רעיונות',
      'כתבי יד',
      'אישורים שלי',
      'שער כלים משלה (MCP) לסוכני בינה מלאכותית',
      'ממסר מ-ChatGPT דרך GitHub',
    ],
    next: ['תצוגה של שינויים בקאנון', 'עורך לכתיבת הפרוזה'],
    noLinkNote: 'אין קישור פתוח. מה שבפנים הוא כתב היד שלי.',
    side: {
      title: 'Writers Room',
      status: 'כלי מקומי',
      text: 'כלי מקומי נפרד שבודק פרקים בעזרת מודל שפה שרץ על המחשב שלי. הממשק שלו בעברית, וכל תיקון מחכה לאישור שלי.',
    },
    heroCaption: 'איך החלקים מתחברים: סוכנים דרך שער הכלים, חלקי המערכת, ואישור שלי.',
    galleryCaptions: [],
  },
  recipes: {
    name: 'המתכונים',
    status: 'גמור · לשימוש אישי, פרטי',
    summary:
      'ספר מתכונים של קישורים. מדביקים קישור, ובחלק מהאתרים השם, התיאור, התמונה והמרכיבים מתמלאים לבד.',
    pillarsTitle: 'הרעיון',
    pillars: [
      { title: 'Colour Kitchen', text: 'העיצוב נקרא ״המטבח הצבעוני״. הוא נועד להיראות חי, ולא כמו לוח בקרה.' },
      { title: 'מה יש לי עם…', text: 'מחפשים לפי מרכיב, ורואים רק את המתכונים שיש בהם אותו.' },
      { title: 'שבוע, רשימה אחת', text: 'אם רוצים, מתכננים שבוע של ארוחות ערב ומקבלים רשימת קניות אחת מאוחדת.' },
    ],
    worksToday: [
      'מדביקים קישור: בחלק מהאתרים השם, התיאור, התמונה והמרכיבים מתמלאים לבד',
      'קטגוריות צבעוניות, וכל מתכון בצבע של הקטגוריה שלו',
      'חיפוש לפי מרכיב: ״מה יש לי עם…״',
      'סימון ״אהבנו״ וסימון ״לנסות״',
      'תכנון שבוע לבחירה, עם רשימת קניות אחת מאוחדת',
      'ייצוא וייבוא של כל האוסף בקובץ אחד',
      'עברית ואנגלית, בהיר וכהה',
    ],
    noLinkNote: 'אין קישור פתוח. זו אפליקציה אישית.',
    heroCaption: 'האוסף: ״מה יש לי עם…״, קטגוריות צבעוניות וכרטיסי מתכונים.',
    galleryCaptions: [
      'חיפוש לפי מרכיב: מה יש לי עם עדשים?',
      'שבעה ערבים: תכנון השבוע, כל ערב בצבע של המנה שלו.',
      'הפעם הראשונה: המטבח עוד ריק, מדביקים קישור.',
      'האוסף בטלפון, במצב כהה.',
      'תכנון השבוע בטלפון.',
      '״אהבנו״ בטלפון.',
    ],
  },
  files: {
    name: 'הקבצים שלי',
    status: 'בפיתוח · התחיל בנובמבר 2026',
    summary: 'אפליקציית רשת בסגנון Dropbox מעל השרת הביתי שלי, בעברית ונוחה מהטלפון.',
    worksToday: [
      'גלישה בתיקיות, כרשימה או כרשת',
      'חיפוש',
      'תצוגה מקדימה של תמונות, וידאו, PDF וטקסט',
      'הורדה של קובץ, או של תיקייה שלמה כקובץ zip',
      'קבצים אחרונים',
      'כניסה לחשבון',
    ],
    next: ['העלאות גדולות', 'תיקייה חדשה ושינוי שם', 'סל מחזור', 'מועדפים', 'תמונות מהטלפון', 'קישורי שיתוף'],
    noLinkNote: 'אין קישור פתוח. היא פותחת רק את הקבצים שבשרת שלי.',
    heroCaption: 'מסך הבית עם חיפוש, על תיקיות לדוגמה.',
    galleryCaptions: [
      'תיקייה כרשימה, במצב כהה.',
      'תצוגה מקדימה של תמונה.',
      'תצוגה מקדימה של סרטון, במצב כהה.',
      'מסך הבית בטלפון.',
      'תיקייה בטלפון, במצב כהה.',
      'חיפוש בטלפון.',
    ],
  },
  'premarket-lab': {
    status: 'כלי מחקר · נתוני דמה בלבד',
    summary:
      'כלי מחקר בלבד, שבודק השערה אחת על נתוני מחיר ברמת הדקה: האם מניות אמריקאיות שעלו אחרי סגירת המסחר ושמרו על העלייה עד תחילת המסחר המוקדם בבוקר, מתנהגות אחר כך אחרת ממניות דומות שאיבדו אותה?',
    pitchSource: 'מתוך התיאור של הפרויקט עצמו',
    pillarsTitle: 'הכללים שהוא שומר',
    pillars: [
      { title: 'מחקר בלבד', text: 'בלי מסחר, בלי פקודות, בלי המלצות.' },
      {
        title: 'מול קבוצת השוואה',
        text: 'מניות ששמרו על העלייה נמדדות מול מניות דומות שאיבדו אותה, עם רווחי סמך.',
      },
      { title: 'נתוני דמה, בגלוי', text: 'עד עכשיו הוא רץ רק על נתוני דמה. עוד לא עברו בו נתוני שוק אמיתיים.' },
    ],
    worksToday: [
      'סייר שמקבץ מניות שזזו אחרי הסגירה לפי כמה מהתנועה הן שמרו',
      'ציר זמן של לילה אחד לכל מניה: הסגירה, המסחר שאחרי הסגירה, הלילה שלא מוצג, וחלון ההחלטה בין 04:00 ל-04:30',
      'בדיקה לאחור עם קבוצות השוואה ורווחי סמך',
      'ייבוא מקובץ CSV, וייצוא ל-CSV מהסייר',
    ],
    noLinkNote: 'אין קישור פתוח. זה כלי מחקר פרטי, על נתוני דמה.',
    heroCaption: 'ציר הזמן של לילה אחד על מניה מומצאת: אחרי הסגירה, הלילה שלא מוצג, וחלון ההחלטה.',
    galleryCaptions: [
      'הסייר: מסננים, ומניות שמקובצות לפי כמה מהתנועה שמרו.',
      'לילה אחד של מניה מומצאת, במצב כהה.',
      'לילה אחרי יום מסחר מקוצר, מסומן כיום קצר.',
      'תוצאות הסייר בטלפון, במצב כהה.',
      'לילה אחד בטלפון.',
      'ציר הזמן בטלפון, במצב כהה.',
    ],
  },
};

function withCaptions(shots: ProjectShot[], captions: string[] | undefined): ProjectShot[] {
  return shots.map((shot, i) => ({ ...shot, caption: captions?.[i] ?? shot.caption }));
}

/**
 * The page in the active language. English returns the data as-is; Hebrew
 * overlays every translatable field and leaves tagline, pitch text, tech,
 * figures' values and links untouched.
 */
export function localizeProjectPage(page: ProjectPage, lang: Lang): ProjectPage {
  if (lang !== 'he') return page;
  const he = pagesHe[page.id];
  return {
    ...page,
    name: he.name ?? page.name,
    status: { ...page.status, label: he.status },
    summary: he.summary,
    pitch: page.pitch && { ...page.pitch, source: he.pitchSource ?? page.pitch.source },
    figures: page.figures?.map((f, i) => ({ ...f, label: he.figureLabels?.[i] ?? f.label })),
    pillarsTitle: he.pillarsTitle ?? page.pillarsTitle,
    pillars: he.pillars ?? page.pillars,
    facetsTitle: he.facetsTitle ?? page.facetsTitle,
    facets: page.facets?.map((f) => ({ ...f, label: he.facetLabels?.[f.id] ?? f.label })),
    worksToday: he.worksToday,
    next: he.next ?? page.next,
    link: page.link && { ...page.link, label: he.linkLabel ?? page.link.label },
    noLinkNote: he.noLinkNote ?? page.noLinkNote,
    side: he.side ?? page.side,
    closing: he.closing ?? page.closing,
    art: {
      hero: { ...page.art.hero, caption: he.heroCaption },
      gallery: withCaptions(page.art.gallery, he.galleryCaptions),
      sideGallery: page.art.sideGallery && withCaptions(page.art.sideGallery, he.sideCaptions),

    },
  };
}
