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
    'how-i-build': 'How I build',
    experience: 'Experience',
    projects: 'Projects',
    'ai-native': 'AI-native',
    contact: 'Contact',
  },
  navShort: {
    home: 'Home',
    'how-i-build': 'How I build',
    experience: 'Experience',
    projects: 'Projects',
    'ai-native': 'AI-native',
    contact: 'Contact',
  },
  askAi: 'Ask my AI ↗',
  goToTop: 'Go to top',
  goTo: 'Go to',

  howIBuild: {
    eyebrow: 'How I build',
    title: 'AI fluency, backed by a decade of shipping.',
    lead: 'Dev skills are the superpower behind the PM thinking — I decide what to build, then build it.',
    bridge: {
      claim: 'I see the whole picture and the smallest detail at the same time.',
      kicker:
        "For a decade that was called professionalism. In the age of agents, it's called knowing how to direct them.",
    },
    receiptsLabel: 'What I bring',
    methodLabel: 'The method',
    steps: ['Intent', 'Interrogation', 'Decisions', 'Plan', 'Direction', 'Result'],
  },

  spotlight: {
    eyebrow: 'Project spotlight',
    prevLabel: 'Previous project',
    nextLabel: 'Next project',
    positionLabel: 'Project {n} of {total}',
    allProjects: 'All projects',
  },

  projectMeta: {
    state: {
      live: 'Live',
      'in-development': 'In development',
      local: 'Local',
    },
    ctaCase: 'View the case',
    ctaLive: 'Visit the live site',
    docsOnly: 'Case in documentation',
  },

  projects: {
    eyebrow: 'Projects',
    title: 'The public projects.',
    lead: 'Real work only — live, in development, or local. Each card says exactly where it stands.',
    graphLabel: 'What they share',
    graphHint: 'Hover a project or a capability to trace the connections.',
    zoomLabel: 'Enlarge image',
    graphExpand: 'Enlarge the graph',
  },

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

  lightbox: {
    close: 'Close',
  },

  footer: {
    builtWith: 'built with React, Vite & Claude Code.',
    paletteHintPrefix: 'Try the',
    paletteHintSuffix: 'palette.',
  },

  experience: {
    eyebrow: 'Experience',
    title: 'Twelve years building products people use.',
  },

  aiNative: {
    eyebrow: 'This site is AI-native',
    title: 'My resume is machine-readable. Plug me into your agent.',
    lead: 'Most portfolios are for humans. This one also talks to your LLM — connect the MCP server, fetch the JSON, or read the llms.txt.',
    chips: {
      mcpLive: 'MCP server live',
      llmsTxt: 'llms.txt',
      resumeJson: 'resume.json',
    },
    cards: {
      mcp: {
        title: '1. Connect the MCP server',
        text: 'Add my resume as a live tool in Claude Code (or any MCP client). Then ask it about my experience, skills and projects.',
        codeLabel: 'Claude Code',
        hint: 'In the Claude.ai app: Settings → Connectors → Add custom connector →',
      },
      fetch: {
        title: '2. Fetch the structured resume',
        text: 'A JSON Resume endpoint — pipe it straight into any tool that consumes structured candidate data.',
        codeLabel: 'Terminal',
        hintPrefix: 'Prefer a guide for LLMs?',
      },
      ask: {
        title: '3. Just ask',
        text: "A grounded AI assistant that answers questions about me in real time — streamed, like you'd expect.",
      },
    },
  },

  contact: {
    eyebrow: 'Contact',
    title: "Let's build something with AI.",
    lead: "Looking for someone who can shape an AI product and ship it? I'd love to hear what you're working on.",
    downloadCv: 'Download CV (.docx)',
  },
};
