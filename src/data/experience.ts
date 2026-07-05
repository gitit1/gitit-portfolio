export type Experience = {
  company: string;
  logo: string;
  role: string;
  period: string;
  bullets: string[];
  link: string;
  theme: 'browzwear' | 'apester' | 'webcollage';
};

export const experiences: Experience[] = [
  {
    company: 'Browzwear',
    logo: 'browzwear.png',
    role: 'Front End Developer',
    period: '2021 - Present',
    bullets: [
      'Design and develop features for websites using React + MobX and TypeScript.',
      'Implement UI for 3D software using JavaScript + React.',
      'Partner closely with Product to iterate quickly on new ideas.',
    ],
    link: 'https://browzwear.com/',
    theme: 'browzwear',
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
