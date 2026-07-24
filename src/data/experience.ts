export type Experience = {
  company: string;
  logo?: string;
  role: string;
  period: string;
  bullets: string[];
  link?: string;
  theme: 'maccabi' | 'independent' | 'browzwear' | 'apester' | 'webcollage' | 'f5';
  current?: boolean;
};

export const experiences: Experience[] = [
  {
    company: 'Maccabi (via SQLink Group)',
    role: 'Senior Frontend Developer',
    period: 'Oct 2025 - Present',
    bullets: [
      'Senior frontend development at Maccabi, placed via SQLink Group.',
    ],
    theme: 'maccabi',
    current: true,
  },
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
    role: 'Frontend Developer',
    period: 'Feb 2021 - Jan 2025',
    bullets: [
      'Design and develop features for websites using React + MobX and TypeScript.',
      'Implement UI for 3D fashion-design software using JavaScript + React.',
      'Partner closely with Product to iterate quickly on new ideas.',
    ],
    link: 'https://browzwear.com/',
    theme: 'browzwear',
  },
  {
    company: 'Apester',
    logo: 'apester.png',
    role: 'Full Stack Developer',
    period: 'Oct 2019 - Jun 2020',
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
    period: 'Dec 2015 - Apr 2019',
    bullets: [
      'Created internal system to generate landing pages with React and NodeJS.',
      'Designed, coded, and modified websites for diverse clients.',
      'Delivered consistent, cross-browser web experiences.',
    ],
    link: 'https://syndigo.com/',
    theme: 'webcollage',
  },
  {
    company: 'F5 Networks',
    role: 'Information Security Analyst & Malware Researcher',
    period: 'Nov 2013 - Jun 2015',
    bullets: [
      "Identified, monitored and removed phishing sites, drop zones and malicious scripts for the clients' protection.",
    ],
    theme: 'f5',
  },
];
