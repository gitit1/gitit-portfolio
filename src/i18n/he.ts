import type { Dict } from './types';

export const he: Dict = {
  hero: {
    eyebrow: 'פרופיל ציבורי · קורות חיים אינטראקטיביים',
    name: 'גיתית רגב',
    role: 'AI Product Builder · Senior Frontend — ‏12+ שנים בתחום',
    terminalPrompt: 'gitit@ai:~$',
    receipts: [
      'explain(): 19,092 → 24 docs',
      'bundle: 1,567KB → 10.8KB',
      'React 16 → 19 · −28,465 lines',
      'secret="secret" → httpOnly',
    ],
    receiptsSrLabel: 'קבלות בנייה אחרונות:',
    chips: [
      { value: '2013', label: 'בתחום מאז — 12+ שנים' },
      { value: '4', label: 'פרויקטים ציבוריים' },
      { value: '→', label: 'כל טענה נגמרת בקבלה' },
    ],
  },

  nav: {
    home: 'בית',
    'how-i-build': 'איך אני בונה',
    experience: 'ניסיון',
    projects: 'פרויקטים',
    'ai-native': 'AI-נייטיב',
    contact: 'יצירת קשר',
  },
  navShort: {
    home: 'בית',
    'how-i-build': 'איך אני בונה',
    experience: 'ניסיון',
    projects: 'פרויקטים',
    'ai-native': 'AI-נייטיב',
    contact: 'יצירת קשר',
  },
  askAi: 'שיחה עם ה-AI שלי ↗',
  goToTop: 'חזרה לראש הדף',
  goTo: 'עבור אל',

  howIBuild: {
    eyebrow: 'איך אני בונה',
    title: 'שליטה ב-AI, מגובה בעשור של שילוח מוצרים.',
    lead: 'כישורי הפיתוח הם כוח העל שמאחורי החשיבה המוצרית — אני מחליטה מה לבנות, ואז בונה את זה.',
    bridge: {
      claim: 'אני רואה את התמונה הגדולה ואת הפרט הקטן ביותר בבת אחת.',
      kicker: 'עשור זה נקרא מקצוענות. בעידן הסוכנים — זה נקרא לדעת לנהל אותם.',
    },
    receiptsLabel: 'מה אני מביאה',
    methodLabel: 'השיטה',
    steps: ['כוונה', 'תשאול', 'החלטות', 'תוכנית', 'הנחיה', 'תוצאה'],
  },

  spotlight: {
    eyebrow: 'זרקור פרויקטים',
    prevLabel: 'הפרויקט הקודם',
    nextLabel: 'הפרויקט הבא',
    positionLabel: 'פרויקט {n} מתוך {total}',
    allProjects: 'כל הפרויקטים',
  },

  projectMeta: {
    state: {
      live: 'פעיל',
      'in-development': 'בפיתוח',
      local: 'מקומי',
    },
    ctaCase: 'צפייה בקייס',
    ctaLive: 'ביקור באתר החי',
    docsOnly: 'הקייס נמצא בתיעוד',
  },

  projects: {
    eyebrow: 'פרויקטים',
    title: 'הפרויקטים הפומביים.',
    lead: 'רק עבודה אמיתית — חי, בפיתוח, או מקומי. כל כרטיס אומר בדיוק איפה הוא עומד.',
    graphLabel: 'מה משותף',
    graphHint: 'מעבר עם העכבר על פרויקט או יכולת מסמן את הקשרים.',
    zoomLabel: 'הגדלת תמונה',
    graphExpand: 'הגדלת הגרף',
  },

  socials: {
    github: 'GitHub',
    linkedin: 'LinkedIn',
    email: 'אימייל',
  },

  menu: 'תפריט',

  themeToggle: {
    toLight: 'עבור למצב בהיר',
    toDark: 'עבור למצב כהה',
  },

  langToggle: {
    label: 'EN',
    ariaLabel: 'עבור לאנגלית',
  },

  chatFab: {
    label: 'שיחה עם ה-AI',
    ariaLabel: 'שיחה עם ה-AI שלי עליי',
  },

  copyResume: {
    idle: 'העתקת קורות החיים עבור ה-LLM שלך',
    copied: 'קורות החיים הועתקו',
  },

  lightbox: {
    close: 'סגירה',
  },

  footer: {
    builtWith: 'נבנה עם React, Vite ו-Claude Code.',
    paletteHintPrefix: 'נסו את לוח הפקודות',
    paletteHintSuffix: '.',
  },

  experience: {
    eyebrow: 'ניסיון',
    title: 'שתים עשרה שנים של בניית מוצרים שאנשים משתמשים בהם.',
  },

  aiNative: {
    eyebrow: 'האתר הזה הוא AI-נייטיב',
    title: 'קורות החיים שלי ניתנים לקריאת מכונה. חברו אותי לסוכן ה-AI שלכם.',
    lead: 'רוב תיקי העבודות מיועדים לבני אדם. האתר הזה גם מדבר עם ה-LLM שלך — התחברו לשרת ה-MCP, שלפו את ה-JSON, או קראו את llms.txt.',
    chips: {
      mcpLive: 'שרת MCP פעיל',
      llmsTxt: 'llms.txt',
      resumeJson: 'resume.json',
    },
    cards: {
      mcp: {
        title: '1. התחברות לשרת ה-MCP',
        text: 'הוסיפו את קורות החיים שלי ככלי חי ב-Claude Code (או בכל לקוח MCP אחר). לאחר מכן שאלו אותו על הניסיון, הכישורים והפרויקטים שלי.',
        codeLabel: 'Claude Code',
        hint: 'באפליקציית Claude.ai: Settings → Connectors → Add custom connector →',
      },
      fetch: {
        title: '2. שליפת קורות החיים המובנים',
        text: 'נקודת קצה בפורמט JSON Resume — הזרימו אותה ישירות לכל כלי שצורך נתוני מועמדים מובנים.',
        codeLabel: 'Terminal',
        hintPrefix: 'מעדיפים מדריך ל-LLMs?',
      },
      ask: {
        title: '3. פשוט שאלו',
        text: 'עוזר AI מבוסס עובדות שעונה על שאלות עליי בזמן אמת — בסטרימינג, בדיוק כמו שהייתם מצפים.',
      },
    },
  },

  contact: {
    eyebrow: 'יצירת קשר',
    title: 'בואו נבנה משהו עם AI.',
    lead: 'מחפשים מישהי שיודעת לעצב מוצר AI ולשלח אותו? אשמח לשמוע במה אתם עובדים.',
    downloadCv: 'הורדת קורות חיים (.docx)',
  },
};
