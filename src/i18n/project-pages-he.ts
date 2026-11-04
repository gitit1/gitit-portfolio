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
  figureLabels: string[];
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
    figures: page.figures.map((f, i) => ({ ...f, label: he.figureLabels[i] ?? f.label })),
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
