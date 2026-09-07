// Hebrew overlay for the two monolingual data files (data/skills.ts,
// data/experience.ts).
//
// Why an overlay instead of translating the data files: those files are the
// machine contract. api/mcp.ts, data/resume.ts (JSON Resume + llms.txt) and
// the grounded chat all read them, and every one of those consumers must stay
// English — a recruiter's tooling, an agent hitting the MCP server and the
// chat's grounding all expect one canonical language. So English stays the
// source of truth and this file supplies the Hebrew *rendering* only.
//
// Every string below is owner-approved verbatim (approval sheet, 2026-09-07,
// artifact 403d7005). Do not reword them here — re-ask her. Owner rulings that
// shape the wording:
//   · company and product names stay English (Maccabi, Browzwear, React, MCP)
//   · the title "AI Product Builder" stays English in both languages
//   · CV dates ARE translated to Hebrew
//   · she removed every em dash from the proposals — keep it that way

import type { Lang } from './types';
import type { Capability, CapabilityGroup, CapabilityId } from '../data/skills';
import type { Experience } from '../data/experience';

type CapabilityCopy = { name: string; blurb: string };
type GroupCopy = { label: string; tagline: string };
// `company` is an OVERRIDE, present only where the English value is not a
// real company name. Owner ruling 2026-09-07: brand names (Maccabi, Browzwear,
// Apester, Webcollage / Syndigo, F5 Networks) stay English in both languages;
// "Independent" is an English word, not a brand, so it alone gets translated.
type ExperienceCopy = { role: string; period: string; bullets: string[]; company?: string };

const groupMetaHe: Record<CapabilityGroup, GroupCopy> = {
  ai: {
    label: 'AI',
    tagline: 'בנייה עם מודלי שפה, מקצה לקצה.',
  },
  engineering: {
    label: 'הנדסה',
    tagline: 'עשור של פיתוח אפליקציות ווב שעובדות בייצור.',
  },
  product: {
    label: 'מוצר',
    tagline: 'להחליט מה לבנות ולמה.',
  },
};

const capabilityHe: Record<CapabilityId, CapabilityCopy> = {
  agents: {
    name: 'סוכנים ותהליכים אוטונומיים',
    blurb:
      'תכנון והשקה של תהליכי מודל-שפה רב-שלביים וסוכנים שמשתמשים בכלים ועושים עבודה אמיתית.',
  },
  mcp: {
    name: 'שרתי MCP',
    blurb:
      'בניית שרתי Model Context Protocol כדי שסוכנים יוכלו להתחבר בבטחה לנתונים ולכלים, כולל האתר הזה.',
  },
  prompt: {
    name: 'הנדסת פרומפטים',
    blurb: 'פרומפטים מובנים, עיצוב דוגמאות והנדסת הקשר שמחזיקים מעמד בייצור.',
  },
  evals: {
    name: 'מדידה ואיכות',
    blurb:
      'מדידת הפלט של המודל במבחנים ובמעקות בטיחות במקום בתחושת בטן, ושיפור לפי מה שהמספרים מראים.',
  },
  strategy: {
    name: 'אסטרטגיית מוצר עם AI',
    blurb: 'לזהות איפה AI באמת מוסיף ערך, לתחום את זה, ולהוציא גרסה ראשונה מהר.',
  },
  react: {
    name: 'React ו-TypeScript',
    blurb:
      'עשר שנים בפרונטאנד, React, MobX, TypeScript, SCSS, במוצרים אמיתיים שצוותים אמיתיים משתמשים בהם.',
  },
  node: {
    name: 'Node ו-Serverless',
    blurb: 'ממשקי API, שרתי סטרימינג ופונקציות serverless (האתר הזה מריץ כאלה בעצמו).',
  },
  data: {
    name: 'נתונים וגריפה',
    blurb: 'מידול וגריפה של מאגרי נתונים גדולים (MongoDB, MySQL) עבור מוצרים שהיו צריכים אותם.',
  },
  solo: {
    name: 'מוציאה מוצר לאוויר לבד',
    blurb: 'נוח לי להחזיק מוצר מהתיקייה הריקה ועד העלייה לאוויר, כולל הדומיין.',
  },
  'product-thinking': {
    name: 'חשיבת מוצר',
    blurb:
      'שנים של עבודה צמודה עם מחלקת המוצר ב-Browzwear, אני ממסגרת בעיות, לא רק מקבלת משימות.',
  },
  empathy: {
    name: 'אמפתיה למשתמש',
    blurb: 'אני בונה את הדברים שהייתי רוצה שיהיו; הפרויקט הגדול שלי התחיל ככלי לעצמי.',
  },
  roadmap: {
    name: 'מרעיון ועד שחרור',
    blurb: 'לתרגם רעיון מעורפל להיקף עבודה, לאיטרציות ולגרסה שיוצאת לאוויר.',
  },
};

// Keyed by `theme`, which is a closed union and unique per role — unlike the
// company name, which is display copy.
const experienceHe: Record<Experience['theme'], ExperienceCopy> = {
  maccabi: {
    role: 'מפתחת פרונטאנד בכירה',
    period: 'אוקטובר 2025 – היום',
    bullets: ['פיתוח פרונטאנד בכיר במכבי, בהשמה דרך SQLink Group.'],
  },
  independent: {
    company: 'עצמאית',
    // Owner ruling 2026-09-07: this title stays English in both languages.
    role: 'AI Product Builder',
    period: '2024 – היום',
    bullets: [
      'מתכננת ומוציאה לאוויר מוצרי מודלי-שפה מקצה לקצה - תהליכי סוכנים, שרתי MCP, מערכות פרומפטים ומבחני איכות.',
      'בניתי מערכת של אפליקציות אישיות (כספים, מעקב חובות משפחתי, ספריית מדיה, מרכז משחקים) עם Claude Code, באחריות מלאה על המוצר ועל ההנדסה.',
      'האתר הזה עצמו הוא AI-native: צ׳אט חי המעוגן בקורות החיים, קורות חיים כשרת MCP, קובץ llms.txt וקורות חיים קריאים למכונה.',
    ],
  },
  browzwear: {
    role: 'מפתחת פרונטאנד',
    period: 'פברואר 2021 – ינואר 2025',
    bullets: [
      'תכנון ופיתוח של יכולות לאתרים ב-React + MobX ו-TypeScript.',
      'מימוש ממשק משתמש לתוכנת עיצוב אופנה תלת-ממדית ב-JavaScript + React.',
      'עבודה צמודה עם מחלקת המוצר כדי לייצר איטרציות מהירות על רעיונות חדשים.',
    ],
  },
  apester: {
    role: 'מפתחת פול-סטאק',
    period: 'אוקטובר 2019 – יוני 2020',
    bullets: [
      'בניתי רכיבי מוצר כמו הנגן וה-SDK.',
      'הובלתי פרויקטי אתרים מקצה לקצה.',
      'עבדתי ב-React, TypeScript, AngularJS, SCSS, JavaScript ו-NodeJS, לפי הפרויקט.',
    ],
  },
  webcollage: {
    role: 'מפתחת ווב',
    period: 'דצמבר 2015 – אפריל 2019',
    bullets: [
      'בניתי מערכת פנימית ליצירת דפי נחיתה ב-React וב-NodeJS.',
      'עיצבתי, כתבתי ותחזקתי אתרים ללקוחות מגוונים.',
      'סיפקתי חוויית ווב עקבית בכל הדפדפנים.',
    ],
  },
  f5: {
    role: 'אנליסטית אבטחת מידע וחוקרת נוזקות',
    period: 'נובמבר 2013 – יוני 2015',
    bullets: [
      'איתרתי, ניטרתי והסרתי אתרי פישינג, אזורי איסוף נתונים גנובים וסקריפטים זדוניים, להגנת הלקוחות.',
    ],
  },
};

/** Group label + tagline in the active language. */
export function localizedGroupMeta(
  group: CapabilityGroup,
  lang: Lang,
  fallback: GroupCopy
): GroupCopy {
  return lang === 'he' ? groupMetaHe[group] : fallback;
}

/** Capability name + blurb in the active language. */
export function localizedCapability(cap: Capability, lang: Lang): CapabilityCopy {
  return lang === 'he' ? capabilityHe[cap.id] : { name: cap.name, blurb: cap.blurb };
}

/**
 * Role, period, bullets and the company LINE in the active language. The
 * company falls back to the English value unless the overlay overrides it —
 * only "Independent" does (owner ruling 2026-09-07: real brand names stay
 * English, an English common noun does not).
 */
export function localizedExperience(
  exp: Experience,
  lang: Lang
): Required<Pick<ExperienceCopy, 'role' | 'period' | 'bullets' | 'company'>> {
  if (lang !== 'he') {
    return { role: exp.role, period: exp.period, bullets: exp.bullets, company: exp.company };
  }
  const he = experienceHe[exp.theme];
  return { ...he, company: he.company ?? exp.company };
}
