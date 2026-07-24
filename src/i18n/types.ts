// Shell-level i18n types. Scope is deliberately narrow: chrome/UI strings
// (header, nav, theme/language toggles, chat FAB, footer). Section BODIES
// (headlines, paragraphs, card copy) stay English until those sections are
// rebuilt — see en.ts / he.ts for the exact boundary.

import type { SectionId } from '../config/sections';

export type Lang = 'en' | 'he';

export interface Dict {
  // Header nav — keyed by SectionId so it stays in sync with config/sections.ts.
  nav: Record<SectionId, string>;
  navShort: Record<SectionId, string>; // scroll-rail tooltip labels
  askAi: string; // header "Ask my AI ↗" nav link
  goToTop: string; // brand button aria-label
  goTo: string; // prefix for "Go to <section>" aria-labels (scroll rail)

  socials: {
    github: string;
    linkedin: string;
    email: string;
  };

  menu: string; // mobile nav toggle aria-label

  themeToggle: {
    toLight: string; // aria-label shown while in dark mode (switches to light)
    toDark: string; // aria-label shown while in light mode (switches to dark)
  };

  langToggle: {
    label: string; // visible button text — the language you'd switch TO
    ariaLabel: string;
  };

  chatFab: {
    label: string;
    ariaLabel: string;
  };

  copyResume: {
    idle: string;
    copied: string;
  };

  footer: {
    builtWith: string;
    paletteHintPrefix: string;
    paletteHintSuffix: string;
  };
}
