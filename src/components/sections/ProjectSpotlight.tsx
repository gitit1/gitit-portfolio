import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import clsx from 'clsx';
import { portfolio, type PortfolioProject } from '../../data/portfolio';
import { useLang } from '../../i18n/LanguageContext';
import { ProjectSpotlightArt } from './ProjectSpotlightArt';

// Rotating one-project-at-a-time showcase, embedded directly inside the
// hero (see Hero.tsx) — the owner's explicit call: her identity and the
// spotlight share the same first screen, not identity-then-scroll. Only
// one project is on screen at a time (showing all four at once crowds the
// page), auto-changing to spark interest — click through to that project.
// To keep all four reachable despite the single-project view (field data
// shows auto-rotating carousels bury slides 2..n), the four project names
// are ALWAYS visible as named tabs below the art — a second,
// always-available door to every project, not mute dots.
//
// Renders a labelled region, not a <section> — it's a component nested
// inside the hero's own `<section id="home">`, not a landmark of its own.
// Not wrapped in <Section>/config/sections.ts on purpose either way: this
// is part of the home page, not a nav/rail-tracked section (see task brief).
// No .container/.section here — the hero supplies both; this renders only
// the spotlight's own content so Hero.tsx can lay it out as one grid column
// alongside the identity column.

const ROTATE_MS = 6000;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

type SpotlightTarget =
  | { kind: 'case'; href: string }
  | { kind: 'external'; href: string }
  | { kind: 'none' };

// Click target resolution, in order: the project's own case-study page,
// else its real external link, else no link at all (e.g. Homebase) — never
// an invented destination.
function resolveTarget(project: PortfolioProject): SpotlightTarget {
  if (project.caseRoute) return { kind: 'case', href: project.caseRoute };
  if (project.externalLink) return { kind: 'external', href: project.externalLink };
  return { kind: 'none' };
}

export function ProjectSpotlight() {
  const { t, lang } = useLang();
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Auto-advance: off entirely under reduced motion, and paused (not
  // stopped) on hover/focus-within. `index` is intentionally not a
  // dependency — the updater below reads it functionally so the interval
  // isn't torn down and rebuilt every tick.
  useEffect(() => {
    if (reducedMotion || !autoAdvance || paused || portfolio.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % portfolio.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, autoAdvance, paused]);

  // Respect a deliberate choice: once the user picks a tab, auto-advance
  // stops for good — never yank the view away from what they selected.
  const selectTab = useCallback((next: number) => {
    setIndex(next);
    setAutoAdvance(false);
  }, []);

  const onTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
      let next = -1;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        next = (i + 1) % portfolio.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        next = (i - 1 + portfolio.length) % portfolio.length;
      } else if (event.key === 'Home') {
        next = 0;
      } else if (event.key === 'End') {
        next = portfolio.length - 1;
      }
      if (next >= 0) {
        event.preventDefault();
        selectTab(next);
        tabRefs.current[next]?.focus();
      }
    },
    [selectTab]
  );

  const active = portfolio[index];
  const arrow = lang === 'he' ? '←' : '→';

  return (
    <div
      className="spotlight"
      role="region"
      aria-label={t('spotlight.eyebrow')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      {/* spotlight.eyebrow carries the region's accessible name (above) but
          isn't rendered as visible chrome here — this block already sits
          right next to the identity column, so a text label is redundant;
          cutting it keeps the shared hero screen breathing (owner's call:
          cut chrome, not content, if the combined composition gets dense). */}

      {/* No aria-live here by design — auto-rotation must not spam a
          screen reader on a timer. The tablist below carries the real,
          user-driven a11y story (aria-selected + roving tabindex). */}
      <MotionConfig reducedMotion="user">
        <div className="spotlight__stage">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.slug}
              id="spotlight-panel"
              role="tabpanel"
              aria-labelledby={`spotlight-tab-${active.slug}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <SpotlightPanel project={active} t={t} arrow={arrow} />
            </motion.div>
          </AnimatePresence>
        </div>
      </MotionConfig>

      <div className="spotlight__tabs" role="tablist" aria-label={t('spotlight.tabsLabel')}>
        {portfolio.map((project, i) => (
          <button
            key={project.slug}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            id={`spotlight-tab-${project.slug}`}
            role="tab"
            type="button"
            aria-selected={i === index}
            aria-controls="spotlight-panel"
            tabIndex={i === index ? 0 : -1}
            className={clsx('spotlight__tab', i === index && 'spotlight__tab--active')}
            onClick={() => selectTab(i)}
            onKeyDown={(event) => onTabKeyDown(event, i)}
          >
            {project.name}
          </button>
        ))}
      </div>
    </div>
  );
}

type SpotlightPanelProps = {
  project: PortfolioProject;
  t: (key: string) => string;
  arrow: string;
};

function SpotlightPanel({ project, t, arrow }: SpotlightPanelProps) {
  const target = resolveTarget(project);
  const stateWord = t(`spotlight.state.${project.state}`);

  const meta = (
    <div className="spotlight__meta">
      <h3 className="spotlight__name">{project.name}</h3>
      <p className="spotlight__tagline">{project.tagline}</p>
      <div className="spotlight__row">
        {/* stateLabel (richer, English) is title-only per the brief — the
            visible chip word is the short, translated spotlight.state.* string. */}
        <span className="chip" title={project.stateLabel}>
          <span className={clsx('chip__dot', project.state === 'live' && 'chip__dot--live')} />
          {stateWord}
        </span>
        {target.kind === 'none' ? (
          <span className="spotlight__docs">{t('spotlight.docsOnly')}</span>
        ) : (
          <span className="spotlight__cta">
            {target.kind === 'case' ? t('spotlight.ctaCase') : t('spotlight.ctaLive')} {arrow}
          </span>
        )}
      </div>
    </div>
  );

  if (target.kind === 'none') {
    return (
      <div className="spotlight__panel">
        <ProjectSpotlightArt project={project} />
        {meta}
      </div>
    );
  }

  return (
    <a
      className="spotlight__panel spotlight__panel--link"
      href={target.href}
      {...(target.kind === 'external' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <ProjectSpotlightArt project={project} />
      {meta}
    </a>
  );
}
