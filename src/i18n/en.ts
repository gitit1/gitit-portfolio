import type { Dict } from './types';

export const en: Dict = {
  hero: {
    eyebrow: 'Public profile · interactive résumé',
    name: 'Gitit Regev',
    role: 'AI Product Builder · Senior Frontend Developer — 12+ years in the field',
    terminalPrompt: 'gitit@ai:~$',
    receipts: [
      'explain(): 19,092 → 24 docs',
      'bundle: 1,567KB → 10.8KB',
      'React 16 → 19 · −28,465 lines',
      'secret="secret" → httpOnly',
    ],
    receiptsSrLabel: 'Recent build receipts:',
    chips: [
      { value: '2013', label: 'In the field since — 12+ years' },
      { value: '4', label: 'Public projects' },
      { value: '→', label: 'Every claim ends in a receipt' },
    ],
  },

  nav: {
    home: 'Home',
    capabilities: 'What I bring',
    experience: 'Experience',
    projects: 'Projects',
    'ai-native': 'AI-native',
    contact: 'Contact',
  },
  navShort: {
    home: 'Home',
    capabilities: 'Capabilities',
    experience: 'Experience',
    projects: 'Projects',
    'ai-native': 'AI-native',
    contact: 'Contact',
  },
  askAi: 'Ask my AI ↗',
  goToTop: 'Go to top',
  goTo: 'Go to',

  socials: {
    github: 'GitHub',
    linkedin: 'LinkedIn',
    email: 'Email',
  },

  menu: 'Menu',

  themeToggle: {
    toLight: 'Switch to light mode',
    toDark: 'Switch to dark mode',
  },

  langToggle: {
    label: 'עב',
    ariaLabel: 'Switch to Hebrew',
  },

  chatFab: {
    label: 'Ask my AI',
    ariaLabel: 'Ask my AI about me',
  },

  copyResume: {
    idle: 'Copy my resume for your LLM',
    copied: 'Copied resume for your LLM',
  },

  footer: {
    builtWith: 'built with React, Vite & Claude Code.',
    paletteHintPrefix: 'Try the',
    paletteHintSuffix: 'palette.',
  },
};
