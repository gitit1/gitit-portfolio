import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Section, revealItem } from '../common/Section';
import { portfolio, resolveTarget, type PortfolioProject } from '../../data/portfolio';
import { useLang } from '../../i18n/LanguageContext';

// The full Projects index — an honest listing of the portfolio registry
// (data/portfolio.ts), one card per entry, in registry order. Replaces the
// old 2019/2020 project write-ups (card grid + modal + slider gallery, and
// the slider-library dependency that came with it): this section is
// deliberately just an index, nothing more. A capability graph is landing
// beside it in a follow-up work package — not built here.
//
// Card click-target resolution (case-study page vs. external link vs. no
// link at all) is shared with the hero spotlight — see resolveTarget in
// data/portfolio.ts. A card is only ever a real link when a real
// destination exists; otherwise it renders as a plain, non-interactive
// article (never a fake affordance).
export function Projects() {
  const { t, lang } = useLang();
  const arrow = lang === 'he' ? '←' : '→';

  return (
    <Section
      id="projects"
      eyebrow={t('projects.eyebrow')}
      title={t('projects.title')}
      lead={t('projects.lead')}
    >
      <div className="projects-grid">
        {portfolio.map((project) => (
          <ProjectCard key={project.slug} project={project} t={t} arrow={arrow} />
        ))}
      </div>
    </Section>
  );
}

type ProjectCardProps = {
  project: PortfolioProject;
  t: (key: string) => string;
  arrow: string;
};

function ProjectCard({ project, t, arrow }: ProjectCardProps) {
  const target = resolveTarget(project);
  const stateWord = t(`projectMeta.state.${project.state}`);

  const content = (
    <>
      <ProjectCardArt project={project} />
      <div className="project-card__body">
        {/* The card's accessible name (when it's a link) comes from this
            heading leading the content, same as the spotlight panel. */}
        <h3 className="project-card__name">{project.name}</h3>
        {/* Tagline is data, not chrome — rendered from the registry AS-IS,
            never translated or edited (see data/portfolio.ts). */}
        <p className="project-card__tagline">{project.tagline}</p>
        <div className="project-card__meta">
          {/* stateLabel (richer, English) is title-only — the visible chip
              word is the short, translated projectMeta.state.* string. */}
          <span className="chip" title={project.stateLabel}>
            <span className={clsx('chip__dot', project.state === 'live' && 'chip__dot--live')} />
            {stateWord}
          </span>
          <span className="project-card__year">{project.year}</span>
          {target.kind === 'none' ? (
            <span className="project-card__docs">{t('projectMeta.docsOnly')}</span>
          ) : (
            <span className="project-card__cta">
              {target.kind === 'case' ? t('projectMeta.ctaCase') : t('projectMeta.ctaLive')}{' '}
              {arrow}
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (target.kind === 'none') {
    return (
      <motion.article className="project-card" variants={revealItem}>
        {content}
      </motion.article>
    );
  }

  return (
    <motion.a
      className="project-card project-card--link"
      href={target.href}
      variants={revealItem}
      {...(target.kind === 'external' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </motion.a>
  );
}

type ProjectCardArtProps = {
  project: PortfolioProject;
};

/**
 * The card's art frame. Renders the project's real art when the registry
 * has it; otherwise falls back to a typographic tile (project name, on an
 * accent-tinted surface) — never a broken image or invented artwork. Every
 * current registry entry has real art, but the type is optional, so this
 * stays defensive.
 *
 * The fallback repeats the project name already rendered as the card's own
 * `<h3>`, so it's marked `aria-hidden` to avoid announcing it twice.
 */
function ProjectCardArt({ project }: ProjectCardArtProps) {
  if (!project.art) {
    return (
      <div className="project-card__art project-card__art--type" aria-hidden="true">
        <span className="project-card__art-name">{project.name}</span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'project-card__art',
        project.art.fit === 'contain' && 'project-card__art--contain'
      )}
    >
      <img src={project.art.src} alt={project.art.alt} loading="lazy" />
    </div>
  );
}
