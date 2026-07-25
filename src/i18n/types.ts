// Shell-level i18n types. Scope is deliberately narrow: chrome/UI strings
// (header, nav, theme/language toggles, chat FAB, footer), plus any section
// BODY that has been rebuilt for the redesign (currently: hero). Other
// section bodies (headlines, paragraphs, card copy) stay English until they
// are rebuilt too — see en.ts / he.ts for the exact boundary.

import type { SectionId } from '../config/sections';
import type { ProjectState } from '../data/portfolio';

export type Lang = 'en' | 'he';

/** A fact chip in the hero: a big mono value + a small muted label. */
export interface HeroFactChip {
  value: string;
  label: string;
}

export interface Dict {
  hero: {
    eyebrow: string;
    name: string;
    role: string;
    // Terminal prompt + rotating "receipts" — technical strings, identical
    // in both languages by design (kept LTR wherever they're rendered).
    terminalPrompt: string;
    receipts: string[];
    // Lead-in for the screen-reader-only text that lists every receipt
    // (the rotating terminal display itself is aria-hidden).
    receiptsSrLabel: string;
    chips: [HeroFactChip, HeroFactChip, HeroFactChip];
  };

  // Header nav — keyed by SectionId so it stays in sync with config/sections.ts.
  nav: Record<SectionId, string>;
  navShort: Record<SectionId, string>; // scroll-rail tooltip labels
  askAi: string; // header "Ask my AI ↗" nav link
  goToTop: string; // brand button aria-label
  goTo: string; // prefix for "Go to <section>" aria-labels (scroll rail)

  // "How I build" section — the bridge claim, the capability receipts row
  // (data itself stays in data/skills.ts, English-only) and the 6-step
  // method rail. Step copy is names-only for now; per-step prose is pending
  // owner approval.
  howIBuild: {
    eyebrow: string;
    title: string;
    lead: string;
    receiptsLabel: string; // small heading above the capability groups
    methodLabel: string; // small heading above the step rail
    steps: [string, string, string, string, string, string]; // intent → interrogation → decisions → plan → direction → result
  };

  // Rotating project spotlight — embedded in the home hero. Chrome strings
  // only: per-project `name`/`tagline` stay in data/portfolio.ts
  // (English-only, verbatim — see that file's header comment). No tab-row
  // labels — the spotlight uses prev/next controls + a position counter
  // instead (doesn't scale to a name-per-tab if the registry grows).
  spotlight: {
    eyebrow: string; // the region's accessible name (not rendered visibly)
    ctaCase: string; // affordance text when the target is a case-study page
    ctaLive: string; // affordance text when the target is an external live site
    docsOnly: string; // honest, non-clickable state when neither exists (e.g. Homebase)
    state: Record<ProjectState, string>; // short chip word per project state
    prevLabel: string; // aria-label for the previous-project control
    nextLabel: string; // aria-label for the next-project control
    // Position counter's accessible name, e.g. "Project {n} of {total}" —
    // {n} and {total} are replaced at render time.
    positionLabel: string;
    allProjects: string; // link text to the full Projects section
  };

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
