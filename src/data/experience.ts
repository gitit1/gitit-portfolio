export type Experience = {
  company: string;
  logo?: string;
  role: string;
  period: string;
  bullets: string[];
  link?: string;
  theme: 'independent' | 'browzwear' | 'apester' | 'webcollage';
  current?: boolean;
};

export const experiences: Experience[] = [
  {
    company: 'Independent',
    role: 'AI Product Builder',
    period: '2024 - Present',
    bullets: [
      'Design and ship LLM products end to end — agentic workflows, MCP servers, prompt systems and evals.',
      'Built a suite of personal apps (finance, family debt tracker, media library, a games hub) with Claude Code, owning product and engineering.',
      'This very site is AI-native: a live grounded chat, a resume-as-MCP-server, llms.txt and a machine-readable resume.',
    ],
    theme: 'independent',
    current: true,
  },
  {
    company: 'Browzwear',
    logo: 'browzwear.png',
    role: 'Front End Developer',
    period: '2021 - Present',
    bullets: [
      'Design and develop features for websites using React + MobX and TypeScript.',
      'Implement UI for 3D fashion-design software using JavaScript + React.',
      'Partner closely with Product to iterate quickly on new ideas.',
    ],
    link: 'https://browzwear.com/',
    theme: 'browzwear',
    current: true,
  },
  {
    company: 'Apester',
    logo: 'apester.png',
    role: 'Full Stack Developer',
    period: '2020',
    bullets: [
      'Built product components such as the Player and SDK.',
      'Delivered website projects end-to-end.',
      'Worked across React, TypeScript, AngularJS, SCSS, JavaScript, NodeJS depending on the project.',
    ],
    link: 'https://apester.com/',
    theme: 'apester',
  },
  {
    company: 'Webcollage / Syndigo',
    logo: 'webcollage.png',
    role: 'Web Developer',
    period: '2015 - 2019',
    bullets: [
      'Created internal system to generate landing pages with React and NodeJS.',
      'Designed, coded, and modified websites for diverse clients.',
      'Delivered consistent, cross-browser web experiences.',
    ],
    link: 'https://syndigo.com/',
    theme: 'webcollage',
  },
];
