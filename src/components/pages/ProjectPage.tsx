import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import clsx from 'clsx';
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpLeft,
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { getProjectPage, type ProjectShot } from '../../data/project-pages';
import type { ProjectPageId } from '../../data/project-pages-content';
import { localizeProjectPage } from '../../i18n/project-pages-he';
import { useLang } from '../../i18n/LanguageContext';
import { onInternalLinkClick } from '../../hooks/useRoute';
import { Lightbox } from '../common/Lightbox';
import { CaseStudySections } from './CaseStudy';

// The shared project-page template (wave 1, 2026-11-04). One small marketing
// page per project, in the site's existing visual language: the same slab
// (--surface + border + shadow, like every home section), the same cards
// (--surface-2, one elevation step up), the same chips, eyebrow, fonts and
// accent. Everything on it is data — data/project-pages-content.ts (facts),
// data/project-pages.ts (art), i18n/project-pages-he.ts (Hebrew) — so later
// waves add a page by adding data, never by editing this file.
//
// RTL: layout uses logical properties only (see _project-page.scss). The
// only directional glyphs are the back arrow and the lightbox prev/next
// chevrons; each is SWAPPED per direction (never rotated): in Hebrew "back"
// points right and "next" points left.

const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
};

type ProjectPageProps = { id: ProjectPageId };

export function ProjectPage({ id }: ProjectPageProps) {
  const { t, lang } = useLang();
  const rtl = lang === 'he';
  const page = useMemo(() => localizeProjectPage(getProjectPage(id), lang), [id, lang]);

  // Every image on the page, in reading order, so the lightbox can page
  // through all of them from whichever one was opened.
  const shots = useMemo<ProjectShot[]>(
    () => [page.art.hero, ...page.art.gallery, ...(page.art.sideGallery ?? [])],
    [page]
  );
  const galleryOffset = 1;
  const sideOffset = 1 + page.art.gallery.length;
  const [open, setOpen] = useState<number | null>(null);

  const cs = page.caseStudy;
  const productSite = cs?.productSite;

  const techBlock = (
    <motion.section className="pp__block pp__tech" variants={reveal}>
      <h2 className="pp__h2">{t('projectPage.tech')}</h2>
      <ul className="pp__tags">
        {page.tech.map((tech) => (
          <li key={tech} className="pp__tag">
            {tech}
          </li>
        ))}
      </ul>
    </motion.section>
  );

  const BackIcon = rtl ? FiArrowRight : FiArrowLeft;
  // "Leaves the site" points up and away from the reading start: up-left in Hebrew.
  const OutIcon = rtl ? FiArrowUpLeft : FiArrowUpRight;

  return (
    <MotionConfig reducedMotion="user">
      <main className="project-page" id="top">
        <div className="container project-page__slab">
          <motion.article
            className="pp"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          >
            <a className="pp__back" href="/#projects" onClick={onInternalLinkClick}>
              <BackIcon aria-hidden="true" />
              {t('projectPage.back')}
            </a>

            <motion.header className="pp__hero" variants={reveal}>
              <div className="pp__intro">
                <div className="section__eyebrow">{t('projectPage.eyebrow')}</div>
                <h1 className="pp__name">{page.name}</h1>
                {/* English in both languages (owner ruling). <bdi> keeps it
                    reading LTR while the paragraph stays aligned to the
                    page's own start edge. */}
                <p className="pp__tagline">
                  {page.taglineLang === 'he' ? page.tagline : <bdi lang="en">{page.tagline}</bdi>}
                </p>
                <div className="pp__status">
                  <span className="chip">
                    <span
                      className={clsx('chip__dot', page.status.tone === 'live' && 'chip__dot--live')}
                    />
                    {page.status.label}
                  </span>
                  {/* dir=ltr: a range like "2019–2026" must not flip in Hebrew. */}
                  <span className="pp__year" dir="ltr">
                    {page.year}
                  </span>
                </div>
                <p className="pp__summary">{page.summary}</p>
                <div className="pp__cta">
                  {productSite?.url ? (
                    // The project's own product site, once it is public.
                    <a className="btn btn--primary" href={productSite.url} target="_blank" rel="noopener noreferrer">
                      {productSite.label ?? productSite.note}
                      <OutIcon aria-hidden="true" className="pp__ext-icon" />
                      <span className="sr-only"> {t('projectPage.newTab')}</span>
                    </a>
                  ) : productSite ? (
                    <p className="pp__nolink">{productSite.note}</p>
                  ) : page.link ? (
                    <a
                      className="btn btn--primary"
                      href={page.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {page.link.label}
                      <OutIcon aria-hidden="true" className="pp__ext-icon" />
                      <span className="sr-only"> {t('projectPage.newTab')}</span>
                    </a>
                  ) : (
                    page.noLinkNote && <p className="pp__nolink">{page.noLinkNote}</p>
                  )}
                </div>
              </div>
              <ShotButton
                shot={page.art.hero}
                className="pp__hero-art"
                label={t('projectPage.openShot')}
                onOpen={() => setOpen(0)}
                eager
              />
            </motion.header>

            {page.figures && page.figures.length > 0 && (
              <motion.ul
                className={clsx('pp__figures', `pp__figures--${page.figures.length}`)}
                aria-label={t('projectPage.figuresLabel')} variants={reveal}>
                {page.figures.map((f) => (
                  <li key={f.label} className="pp__figure">
                    <span className="pp__figure-value">{f.value}</span>
                    <span className="pp__figure-label">{f.label}</span>
                  </li>
                ))}
              </motion.ul>
            )}

            {page.pitch && (
              <motion.figure className="pp__pitch" variants={reveal}>
                <blockquote lang="en" dir="ltr">
                  <p>{page.pitch.text}</p>
                </blockquote>
                <figcaption>{page.pitch.source}</figcaption>
              </motion.figure>
            )}

            {page.pillars && (
              <motion.section className="pp__block" variants={reveal}>
                <h2 className="pp__h2">{page.pillarsTitle}</h2>
                <ul className={clsx('pp__pillars', page.pillars.length % 3 === 0 ? 'pp__pillars--3' : 'pp__pillars--4')}>
                  {page.pillars.map((p) => (
                    <li key={p.title} className="pp__card pp__pillar">
                      <h3 className="pp__pillar-title">{p.title}</h3>
                      <p className="pp__pillar-text">{p.text}</p>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {page.facets && (
              <motion.section className="pp__block" variants={reveal}>
                <h2 className="pp__h2">{page.facetsTitle}</h2>
                <ul className="pp__facets">
                  {page.facets.map((f) => (
                    <li key={f.id} className="pp__facet">
                      <span className="pp__facet-label">{f.label}</span>
                      <span className="pp__facet-count">{f.count}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Technical pages (2026-11-04): the case study replaces the
                marketing blocks above (their data is simply absent). */}
            {cs && <CaseStudySections cs={cs} />}

            {(!!page.worksToday?.length || !!page.next || !!page.side) && (
              <motion.div className="pp__cols" variants={reveal}>
                {!!page.worksToday?.length && (
                  <section className="pp__card pp__col">
                    <h2 className="pp__h2">{t('projectPage.worksToday')}</h2>
                    <ul className="pp__list">
                      {page.worksToday.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                )}
                {page.next && (
                  <section className="pp__card pp__col pp__col--next">
                    <h2 className="pp__h2">{t('projectPage.next')}</h2>
                    <ul className="pp__list pp__list--next">
                      {page.next.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                )}
                {page.side && (
                  <section className="pp__card pp__col pp__col--next pp__side">
                    <div className="pp__side-head">
                      <span className="chip">
                        <span className="chip__dot" />
                        {page.side.status}
                      </span>
                    </div>
                    <h2 className="pp__h2">{page.side.title}</h2>
                    <p className="pp__side-text">{page.side.text}</p>
                    {page.art.sideGallery && (
                      <ul className="pp__side-shots">
                        {page.art.sideGallery.map((shot, i) => (
                          <li key={shot.src}>
                            <ShotButton
                              shot={shot}
                              className="pp__tile"
                              label={t('projectPage.openShot')}
                              onOpen={() => setOpen(sideOffset + i)}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                )}
              </motion.div>
            )}

            {/* Case-study order (owner-approved outline): stack, then the
                screenshots as evidence. Marketing pages keep gallery first. */}
            {cs && techBlock}

            {page.art.gallery.length > 0 && (
              <motion.section className="pp__block" variants={reveal}>
                <h2 className="pp__h2">{t('projectPage.gallery')}</h2>
                <Gallery
                  shots={page.art.gallery}
                  label={t('projectPage.openShot')}
                  onOpen={(i) => setOpen(galleryOffset + i)}
                />
              </motion.section>
            )}

            {!cs && techBlock}

            <footer className="pp__foot">
              {page.closing && <p className="pp__closing">{page.closing}</p>}
              <a className="btn btn--ghost" href="/#projects" onClick={onInternalLinkClick}>
                <BackIcon aria-hidden="true" />
                {t('projectPage.back')}
              </a>
            </footer>
          </motion.article>
        </div>
      </main>

      <ShotLightbox shots={shots} index={open} onChange={setOpen} title={page.name} />
    </MotionConfig>
  );
}

type GalleryProps = {
  shots: ProjectShot[];
  label: string;
  /** Index into `shots` (the lightbox order stays the flat list). */
  onOpen: (i: number) => void;
};

/**
 * Three layouts, picked by the shots themselves (wave 2, 2026-11-04):
 * - all wide: two columns (three when there are exactly three, so no row is
 *   left half-empty);
 * - all phones: the narrow portrait grid;
 * - mixed (desktop + phone shots of one app): wide shots in two columns and
 *   the phone shots grouped THREE to a cell, because three 9:16 tiles side by
 *   side are about as tall as one 16:9 tile, so the rows stay even.
 */
function Gallery({ shots, label, onOpen }: GalleryProps) {
  const indexed = shots.map((shot, i) => ({ shot, i }));
  const wides = indexed.filter((s) => s.shot.shape === 'wide');
  const phones = indexed.filter((s) => s.shot.shape === 'phone');

  const tile = ({ shot, i }: { shot: ProjectShot; i: number }) => (
    <ShotButton shot={shot} className="pp__tile" label={label} onOpen={() => onOpen(i)} />
  );

  if (wides.length > 0 && phones.length > 0) {
    const trios: (typeof phones)[] = [];
    for (let k = 0; k < phones.length; k += 3) trios.push(phones.slice(k, k + 3));
    return (
      <ul className="pp__gallery pp__gallery--mixed">
        {wides.map((s) => (
          <li key={s.shot.src} className="pp__gallery-item pp__gallery-item--wide">
            {tile(s)}
          </li>
        ))}
        {trios.map((trio) => (
          <li key={trio[0].shot.src} className="pp__gallery-item pp__gallery-item--trio">
            <ul className="pp__trio">
              {trio.map((s) => (
                <li key={s.shot.src}>{tile(s)}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul
      className={clsx(
        'pp__gallery',
        phones.length > 0 && 'pp__gallery--phones',
        phones.length === 0 && shots.length === 3 && 'pp__gallery--three'
      )}
    >
      {indexed.map((s) => (
        <li key={s.shot.src} className={clsx('pp__gallery-item', `pp__gallery-item--${s.shot.shape}`)}>
          {tile(s)}
        </li>
      ))}
    </ul>
  );
}

type ShotButtonProps = {
  shot: ProjectShot;
  className: string;
  label: string;
  onOpen: () => void;
  eager?: boolean;
};

function ShotButton({ shot, className, label, onOpen, eager }: ShotButtonProps) {
  return (
    <figure className={clsx(className, `${className}--${shot.shape}`)}>
      <button type="button" className="pp__shot-btn" onClick={onOpen} aria-label={`${label}: ${shot.caption}`}>
        <img
          src={shot.src}
          alt=""
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className={clsx(shot.pixel && 'pp__img--pixel')}
        />
      </button>
      <figcaption className="pp__caption">{shot.caption}</figcaption>
    </figure>
  );
}

type ShotLightboxProps = {
  shots: ProjectShot[];
  index: number | null;
  onChange: (i: number | null) => void;
  title: string;
};

function ShotLightbox({ shots, index, onChange, title }: ShotLightboxProps) {
  const { t, lang } = useLang();
  const rtl = lang === 'he';
  const total = shots.length;
  const shot = index === null ? null : shots[index];

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onChange((index + delta + total) % total);
    },
    [index, onChange, total]
  );

  // Arrow keys follow the reading direction: in Hebrew the NEXT image is to
  // the left, so ArrowLeft moves forward.
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const forward = e.key === (rtl ? 'ArrowLeft' : 'ArrowRight');
      step(forward ? 1 : -1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, rtl, step]);

  const PrevIcon = rtl ? FiChevronRight : FiChevronLeft;
  const NextIcon = rtl ? FiChevronLeft : FiChevronRight;
  const position = t('projectPage.shotPosition')
    .replace('{n}', String((index ?? 0) + 1))
    .replace('{total}', String(total));

  return (
    <Lightbox open={shot !== null} onClose={() => onChange(null)} label={shot?.caption ?? title}>
      {shot && (
        <div className="pp-lightbox">
          <figure className="lightbox__figure pp-lightbox__figure">
            <img src={shot.src} alt={shot.caption} className={clsx(shot.pixel && 'pp__img--pixel')} />
            <figcaption>{shot.caption}</figcaption>
          </figure>
          {total > 1 && (
            <div className="pp-lightbox__nav">
              <button type="button" className="icon-btn" onClick={() => step(-1)} aria-label={t('projectPage.prevShot')}>
                <PrevIcon aria-hidden="true" />
              </button>
              <span className="pp-lightbox__count" aria-live="polite">
                {position}
              </span>
              <button type="button" className="icon-btn" onClick={() => step(1)} aria-label={t('projectPage.nextShot')}>
                <NextIcon aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}
    </Lightbox>
  );
}
