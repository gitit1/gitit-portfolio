import { useCallback, useEffect, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import clsx from 'clsx';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { portfolio, resolveTarget, type PortfolioProject } from '../../data/portfolio';
import { useLang } from '../../i18n/LanguageContext';
import { ProjectSpotlightArt } from './ProjectSpotlightArt';

// Rotating one-project-at-a-time showcase, embedded directly inside the
// hero (see Hero.tsx) — the owner's explicit call: her identity and the
// spotlight share the same first screen, not identity-then-scroll. Only
// one project is on screen at a time (showing all four at once crowds the
// page), auto-changing to spark interest — click through to that project.
//
// No named tabs (reverted per owner feedback: a tab row of project names
// does not scale — with 20 projects it would be endless, and dots have the
// same problem). Instead: prev/next arrow controls that wrap at both ends,
// a "NN / total" position counter (stays one small element at any project
// count), and one clearly-visible "All projects" link to the full Projects
// section — with names and tabs gone, that link is the only thing keeping
// projects 2..n reachable for a visitor who never touches an arrow, so it
// must read as a real affordance, not a whisper (styled as a .btn).
//
// Renders a labelled region, not a <section> — it's a component nested
// inside the hero's own `<section id="home">`, not a landmark of its own.
// Not wrapped in <Section>/config/sections.ts on purpose either way: this
// is part of the home page, not a nav/rail-tracked section (see task brief).
// No .container/.section here — the hero supplies both; this renders only
// the spotlight's own content so Hero.tsx can lay it out as one grid column
// alongside the identity column.

// Owner-tuned cadence (live feedback, 2026-07-25): the first pass rotated
// too fast. Dwell lengthened and the crossfade itself slowed slightly so a
// change reads as a calm dissolve — still comfortably under a second so it
// never feels sluggish. Tune here; nothing else needs to change.
const ROTATE_MS = 8000;
const TRANSITION_S = 0.55;

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

// SpotlightTarget + resolveTarget now live in data/portfolio.ts — shared
// with the Projects index section, which needs the exact same click-target
// resolution (case-study page once live, else the real external link, else
// no link at all).

const pad2 = (n: number) => String(n).padStart(2, '0');

export function ProjectSpotlight() {
  const { t, lang } = useLang();
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const total = portfolio.length;
  const isRtl = lang === 'he';

  // Auto-advance: off entirely under reduced motion, and paused (not
  // stopped) on hover/focus-within. `index` is intentionally not a
  // dependency — the updater below reads it functionally so the interval
  // isn't torn down and rebuilt every tick.
  useEffect(() => {
    if (reducedMotion || !autoAdvance || paused || total <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, autoAdvance, paused, total]);

  // Respect a deliberate choice: once the user operates a control (arrow
  // click or key), auto-advance stops for good — never yank the view away
  // from what they chose to look at.
  const goTo = useCallback((next: number) => {
    setIndex(next);
    setAutoAdvance(false);
  }, []);

  const goPrev = useCallback(() => {
    goTo((index - 1 + total) % total);
  }, [goTo, index, total]);

  const goNext = useCallback(() => {
    goTo((index + 1) % total);
  }, [goTo, index, total]);

  // Keyboard support on the nav controls themselves (attaching this to the
  // outer non-interactive region would trip jsx-a11y — and it's also just
  // more precise: arrow keys act when a spotlight control has focus).
  // Physical arrow keys map to visual/reading direction, not semantic
  // prev/next — the same mirroring the buttons themselves get (see the RTL
  // icon flip in _project-spotlight.scss). In RTL, "next" reads leftward.
  const onNavKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (isRtl) goPrev();
        else goNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (isRtl) goNext();
        else goPrev();
      }
    },
    [isRtl, goPrev, goNext]
  );

  const active = portfolio[index];
  const arrow = lang === 'he' ? '←' : '→';
  const positionText = `${pad2(index + 1)} / ${pad2(total)}`;
  const positionAriaLabel = t('spotlight.positionLabel')
    .replace('{n}', String(index + 1))
    .replace('{total}', String(total));

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
          screen reader on a timer. The active project's own heading (in
          SpotlightPanel) is enough for a screen-reader user to identify
          what's showing when they choose to look. */}
      <MotionConfig reducedMotion="user">
        <div className="spotlight__stage">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.slug}
              role="group"
              aria-label={active.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: TRANSITION_S, ease: [0.22, 1, 0.36, 1] }}
            >
              <SpotlightPanel project={active} t={t} arrow={arrow} />
            </motion.div>
          </AnimatePresence>
        </div>
      </MotionConfig>

      <div className="spotlight__controls">
        <button
          type="button"
          className="icon-btn spotlight__nav-btn"
          aria-label={t('spotlight.prevLabel')}
          onClick={goPrev}
          onKeyDown={onNavKeyDown}
        >
          <FiChevronLeft className="spotlight__nav-icon" aria-hidden="true" />
        </button>
        <span className="spotlight__counter" dir="ltr" aria-label={positionAriaLabel}>
          {positionText}
        </span>
        <button
          type="button"
          className="icon-btn spotlight__nav-btn"
          aria-label={t('spotlight.nextLabel')}
          onClick={goNext}
          onKeyDown={onNavKeyDown}
        >
          <FiChevronRight className="spotlight__nav-icon" aria-hidden="true" />
        </button>
        <a href="#projects" className="btn btn--ghost spotlight__all-link">
          {t('spotlight.allProjects')}
        </a>
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
  const stateWord = t(`projectMeta.state.${project.state}`);

  const meta = (
    <div className="spotlight__meta">
      <h3 className="spotlight__name">{project.name}</h3>
      <p className="spotlight__tagline">{project.tagline}</p>
      <div className="spotlight__row">
        {/* stateLabel (richer, English) is title-only per the brief — the
            visible chip word is the short, translated projectMeta.state.* string. */}
        <span className="chip" title={project.stateLabel}>
          <span className={clsx('chip__dot', project.state === 'live' && 'chip__dot--live')} />
          {stateWord}
        </span>
        {target.kind === 'none' ? (
          <span className="spotlight__docs">{t('projectMeta.docsOnly')}</span>
        ) : (
          <span className="spotlight__cta">
            {target.kind === 'case' ? t('projectMeta.ctaCase') : t('projectMeta.ctaLive')} {arrow}
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
