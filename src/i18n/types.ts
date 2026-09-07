// Shell-level i18n types. Scope is deliberately narrow: chrome/UI strings
// (header, nav, theme/language toggles, chat FAB, footer), plus any section
// BODY that has been rebuilt for the redesign (currently: hero). Other
// section bodies (headlines, paragraphs, card copy) stay English until they
// are rebuilt too — see en.ts / he.ts for the exact boundary.
//
// Separately: the two monolingual DATA files (data/skills.ts,
// data/experience.ts) stay English because MCP/JSON Resume/chat read them;
// their Hebrew rendering lives in i18n/content-he.ts, not here.

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
  // (the capability data itself stays in data/skills.ts, English-canonical;
  // its Hebrew rendering lives in i18n/content-he.ts) and the 6-step method
  // rail. Step copy is names-only for now; per-step prose is pending owner
  // approval.
  howIBuild: {
    eyebrow: string;
    title: string;
    lead: string;
    // The "Why AI fits me" argument — the section's opening claim, rendered
    // above the receipts row. Owner-approved copy, verbatim (see en.ts/he.ts).
    bridge: {
      claim: string;
      kicker: string;
    };
    receiptsLabel: string; // small heading above the capability groups
    methodLabel: string; // small heading above the step rail
    steps: [string, string, string, string, string, string]; // intent → interrogation → decisions → plan → direction → result
  };

  // Rotating project spotlight — embedded in the home hero. Chrome strings
  // only: per-project `name`/`tagline` stay in data/portfolio.ts
  // (English-only, verbatim — see that file's header comment). No tab-row
  // labels — the spotlight uses prev/next controls + a position counter
  // instead (doesn't scale to a name-per-tab if the registry grows).
  // CTA/state/docs-only strings live in `projectMeta` below — shared with
  // the Projects index section, which needs the exact same vocabulary.
  spotlight: {
    eyebrow: string; // the region's accessible name (not rendered visibly)
    prevLabel: string; // aria-label for the previous-project control
    nextLabel: string; // aria-label for the next-project control
    // Position counter's accessible name, e.g. "Project {n} of {total}" —
    // {n} and {total} are replaced at render time.
    positionLabel: string;
    allProjects: string; // link text to the full Projects section
  };

  // Shared project-card vocabulary — used by both the hero spotlight and the
  // full Projects index section, so the two never drift into different
  // wording for the same states/affordances.
  projectMeta: {
    state: Record<ProjectState, string>; // short chip word per project state
    ctaCase: string; // affordance text when the target is a case-study page
    ctaLive: string; // affordance text when the target is an external live site
    docsOnly: string; // honest, non-clickable state when neither exists (e.g. Homebase)
  };

  // Projects index section — the full registry, one card per portfolio
  // entry. Card-level copy (name/tagline/state/year) is per-project data
  // from data/portfolio.ts; these are just the section chrome strings.
  projects: {
    eyebrow: string;
    title: string;
    lead: string;
    // Capability graph panel (the index's second door) — see
    // components/sections/ProjectsGraph.tsx. The graph's own labels (project
    // names, capability names) are data, rendered as-is, no i18n; these two
    // are the panel's chrome only.
    graphLabel: string; // small heading above the graph
    graphHint: string; // one-line muted usage hint below it
    // Click-to-enlarge popups (G6-L) — aria-labels for the card art zoom
    // button and the graph panel's expand button. Both open a Lightbox (see
    // components/common/Lightbox.tsx); the graph popup reuses graphLabel
    // above as its dialog aria-label rather than adding a third string.
    zoomLabel: string;
    graphExpand: string;
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

  // Generic modal dialog (G6-L) — see components/common/Lightbox.tsx.
  lightbox: {
    close: string; // aria-label for the close button
  };

  footer: {
    builtWith: string;
    paletteHintPrefix: string;
    paletteHintSuffix: string;
  };

  // Experience section — timeline chrome only. Per-role data stays in
  // data/experience.ts, English-canonical (it feeds MCP + JSON Resume);
  // role/period/bullets get their Hebrew from i18n/content-he.ts, while
  // company names stay English in both (owner ruling 2026-09-07).
  experience: {
    eyebrow: string;
    title: string;
  };

  // AI-native section — the pitch that this site itself talks to LLMs.
  // Product/protocol names (MCP, JSON Resume, llms.txt, Claude Code, Claude.ai)
  // and the code/URL snippets stay untranslated in both languages.
  aiNative: {
    eyebrow: string;
    title: string;
    lead: string;
    chips: {
      mcpLive: string;
      llmsTxt: string; // filename, identical in both langs by design
      resumeJson: string; // filename, identical in both langs by design
    };
    cards: {
      mcp: {
        title: string;
        text: string;
        codeLabel: string; // CodeBlock label, e.g. "Claude Code" — a product name
        hint: string; // ends right before the embedded <code>{mcpUrl}</code>
      };
      fetch: {
        title: string;
        text: string;
        codeLabel: string; // CodeBlock label, e.g. "Terminal"
        hintPrefix: string; // ends right before the embedded "/llms.txt" link
      };
      ask: {
        title: string;
        text: string;
      };
    };
  };

  // Contact section — the closing pitch + contact affordances. LinkedIn/
  // GitHub labels are shared with `socials` above rather than duplicated.
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    downloadCv: string;
  };
}
