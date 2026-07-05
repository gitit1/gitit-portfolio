// Registry of page sections — drives the header nav, the scroll rail, and the
// IntersectionObserver active-section tracking. Order = on-page order.

export type SectionId =
  | 'home'
  | 'capabilities'
  | 'experience'
  | 'projects'
  | 'ai-native'
  | 'contact';

export type SectionDef = {
  id: SectionId;
  label: string; // header nav label
  short: string; // rail tooltip
};

export const SECTIONS: SectionDef[] = [
  { id: 'home', label: 'Home', short: 'Home' },
  { id: 'capabilities', label: 'What I bring', short: 'Capabilities' },
  { id: 'experience', label: 'Experience', short: 'Experience' },
  { id: 'projects', label: 'Projects', short: 'Projects' },
  { id: 'ai-native', label: 'AI-native', short: 'AI-native' },
  { id: 'contact', label: 'Contact', short: 'Contact' },
];
