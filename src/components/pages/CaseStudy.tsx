import { Fragment } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type {
  CaseDiagram,
  CaseDiagramNode,
  ProjectCaseStudy,
} from '../../data/project-pages-content';
import { useLang } from '../../i18n/LanguageContext';

// The technical case-study sections of a project page (2026-11-04, owner
// ruling: the pages inside the site show how she thinks as an architect,
// developer and AI builder). Rendered by ProjectPage.tsx when a page has
// `caseStudy`; every later page uses the same sections by adding data.
//
// RTL: logical CSS only (_project-page.scss). The diagram uses no glyph
// arrows at all: its connectors are CSS lines with arrowheads that point
// DOWN or BOTH ways, so they read the same in Hebrew and English and never
// need swapping. Module names (`code`) are wrapped in an LTR <bdi> so a
// path like "interact.ts · affordances.ts" keeps its order in Hebrew.

const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
};

/** "2026-07-15" → "15 July 2026" / "15 ביולי 2026" (UTC, so no day shift). */
function formatDate(iso: string, lang: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat(lang === 'he' ? 'he-IL' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

export function CaseStudySections({ cs }: { cs: ProjectCaseStudy }) {
  const { t, lang } = useLang();

  return (
    <>
      <motion.section className="pp__block pp-case__problem" variants={reveal}>
        <h2 className="pp__h2">{t('projectPage.caseProblem')}</h2>
        <p className="pp-case__lead">{cs.problem}</p>
      </motion.section>

      <motion.section className="pp__block" variants={reveal}>
        <h2 className="pp__h2">{t('projectPage.caseArchitecture')}</h2>
        <p className="pp-case__text">{cs.architecture.intro}</p>
        <ArchitectureDiagram diagram={cs.architecture.diagram} label={t('projectPage.caseDiagramLabel')} />
      </motion.section>

      <motion.section className="pp__block" variants={reveal}>
        <h2 className="pp__h2">{t('projectPage.caseDecisions')}</h2>
        <ol className="pp-case__decisions">
          {cs.decisions.map((d, i) => (
            <li key={d.id} className="pp__card pp-case__decision">
              <h3 className="pp-case__decision-title">
                <span className="pp-case__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {d.title}
              </h3>
              <dl className="pp-case__dl">
                <dt>{t('projectPage.caseChose')}</dt>
                <dd>{d.chose}</dd>
                <dt>{t('projectPage.caseInstead')}</dt>
                <dd>
                  <ul className="pp-case__instead">
                    {d.instead.map((alt) => (
                      <li key={alt}>{alt}</li>
                    ))}
                  </ul>
                </dd>
                <dt>{t('projectPage.caseCost')}</dt>
                <dd>{d.cost}</dd>
              </dl>
              <p className="pp-case__source">
                <span>{t('projectPage.caseSource')}</span>
                <bdi dir="ltr">{d.source}</bdi>
              </p>
            </li>
          ))}
        </ol>
      </motion.section>

      <motion.section className="pp__block" variants={reveal}>
        <h2 className="pp__h2">{t('projectPage.caseAiWork')}</h2>
        <div className="pp-case__ai">
          {(
            [
              ['caseAiDecides', cs.aiWork.decides],
              ['caseAiDelegates', cs.aiWork.delegates],
              ['caseAiVerifies', cs.aiWork.verifies],
            ] as const
          ).map(([key, items]) => (
            <section key={key} className="pp__card pp__col">
              <h3 className="pp-case__h3">{t(`projectPage.${key}`)}</h3>
              <ul className="pp__list">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </motion.section>

      {cs.courseChanges && cs.courseChanges.length > 0 && (
        <motion.section className="pp__block" variants={reveal}>
          <h2 className="pp__h2">{t('projectPage.caseCourse')}</h2>
          <ol className="pp-case__timeline">
            {cs.courseChanges.map((c) => (
              <li key={c.id} className="pp-case__event">
                <time className="pp-case__date" dateTime={c.date}>
                  {formatDate(c.date, lang)}
                </time>
                <h3 className="pp-case__h3">{c.title}</h3>
                <p className="pp-case__text">{c.text}</p>
                <p className="pp-case__source">
                  <span>{t('projectPage.caseSource')}</span>
                  <bdi dir="ltr">{c.source}</bdi>
                </p>
              </li>
            ))}
          </ol>
        </motion.section>
      )}

      {cs.metrics && (
        <motion.section className="pp__block" variants={reveal}>
          <h2 className="pp__h2">{t('projectPage.caseNumbers')}</h2>
          <ul className="pp-case__metrics">
            {cs.metrics.items.map((m) => (
              <li key={m.id} className="pp-case__metric">
                <span className="pp__figure-value">{m.value}</span>
                <span className="pp-case__metric-label">{m.label}</span>
                <span className="pp-case__metric-measures">{m.measures}</span>
                {m.how && (
                  <code className="pp-case__metric-how" dir="ltr">
                    {m.how}
                  </code>
                )}
              </li>
            ))}
          </ul>
          <p className="pp-case__asof">{cs.metrics.asOf}</p>
        </motion.section>
      )}
    </>
  );
}

function DiagramNode({ node }: { node: CaseDiagramNode }) {
  return (
    <li className="pp-arch__node">
      <span className="pp-arch__code">
        <bdi dir="ltr">{node.code}</bdi>
      </span>
      <span className="pp-arch__label">{node.label}</span>
      <span className="pp-arch__note">{node.note}</span>
    </li>
  );
}

type LinkKind = 'down' | 'both' | 'bridge' | 'out';

/** A connector: a CSS line with arrowheads that point down or both ways. */
function Link({ kind, label }: { kind: LinkKind; label?: string }) {
  return (
    <div className={clsx('pp-arch__link', `pp-arch__link--${kind}`)} aria-hidden="true">
      <span className="pp-arch__line" />
      {label && <span className="pp-arch__link-label">{label}</span>}
    </div>
  );
}

/**
 * The layered architecture diagram, drawn from data (no image file). The
 * boundary holds the layers (joined by down arrows) and the optional side
 * lane (joined by a two-headed bridge); the external node sits outside the
 * boundary, joined by a dashed two-headed link. On phones every part stacks
 * into one column and the bridge turns vertical.
 */
function ArchitectureDiagram({ diagram, label }: { diagram: CaseDiagram; label: string }) {
  // The text alternative reads the diagram in order, for screen readers.
  const all = [
    ...diagram.layers.flatMap((l) => l.nodes),
    ...(diagram.lane?.nodes ?? []),
    ...(diagram.external ? [diagram.external.node] : []),
  ];
  return (
    <figure className={clsx('pp-arch', diagram.external && 'pp-arch--external')} aria-label={label}>
      <div className="pp-arch__boundary">
        <span className="pp-arch__boundary-label">{diagram.boundary}</span>
        <div className={clsx('pp-arch__body', diagram.lane && 'pp-arch__body--lane')}>
          <div className="pp-arch__main">
            {diagram.layers.map((layer, i) => (
              <Fragment key={layer.nodes[0]?.id ?? i}>
                {i > 0 && <Link kind="down" label={layer.link} />}
                <ul className={clsx('pp-arch__layer', `pp-arch__layer--${layer.nodes.length}`)}>
                  {layer.nodes.map((n) => (
                    <DiagramNode key={n.id} node={n} />
                  ))}
                </ul>
              </Fragment>
            ))}
          </div>
          {diagram.lane && (
            <>
              <Link kind="bridge" label={diagram.lane.link} />
              <div className="pp-arch__lane">
                <div className="pp-arch__lane-head">
                  <span className="pp-arch__lane-title">{diagram.lane.title}</span>
                  {diagram.lane.badge && <span className="pp-arch__badge">{diagram.lane.badge}</span>}
                </div>
                <ul className="pp-arch__lane-nodes">
                  {diagram.lane.nodes.map((n, i) => (
                    <Fragment key={n.id}>
                      {i > 0 && (
                        <li className="pp-arch__lane-link" aria-hidden="true">
                          <Link kind="down" />
                        </li>
                      )}
                      <DiagramNode node={n} />
                    </Fragment>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
      {diagram.external && (
        <div className="pp-arch__out">
          <div className="pp-arch__out-col">
            <Link kind="out" label={diagram.external.link} />
            <ul className="pp-arch__layer pp-arch__layer--1 pp-arch__ext">
              <DiagramNode node={diagram.external.node} />
            </ul>
          </div>
        </div>
      )}
      <figcaption className="sr-only">{all.map((n) => `${n.label} (${n.code}): ${n.note}`).join('. ')}</figcaption>
    </figure>
  );
}
