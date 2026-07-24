import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { FiGlobe, FiUser, FiCpu, FiArrowRight, FiBookOpen } from 'react-icons/fi';
import { Section, revealItem } from '../common/Section';
import { howIBuildFeed, type Era, type Quote } from '../../data/how-i-build';

type Lang = 'en' | 'he';

type Resolved = {
  text: string;
  /** true when the text being rendered is Hebrew (whether requested or a fallback) */
  isHebrew: boolean;
  /** true when the requested language was empty and we fell back to the other one */
  pending: boolean;
};

/** Picks the field for the requested language, falling back to the other one
 *  (and flagging it) when the requested field is empty. */
function resolveText(he: string, en: string, lang: Lang): Resolved {
  const primary = lang === 'he' ? he : en;
  const secondary = lang === 'he' ? en : he;
  if (primary && primary.trim().length > 0) {
    return { text: primary, isHebrew: lang === 'he', pending: false };
  }
  if (secondary && secondary.trim().length > 0) {
    return { text: secondary, isHebrew: lang !== 'he', pending: true };
  }
  return { text: '', isHebrew: lang === 'he', pending: false };
}

const countFmt = new Intl.NumberFormat('en-US');
const tokenFmt = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 });

function PendingHint() {
  return <span className="hib-pending"> · תרגום בהמתנה / translation pending</span>;
}

type BilingualProps = {
  he: string;
  en: string;
  lang: Lang;
  tag?: 'p' | 'h3' | 'h4' | 'span';
  className?: string;
};

/** Renders whichever language field has content for `lang`, falling back with a hint. */
function Bilingual({ he, en, lang, tag = 'p', className }: BilingualProps) {
  const resolved = resolveText(he, en, lang);
  if (!resolved.text) return null;
  const Tag = tag;
  return (
    <Tag
      className={clsx('hib-i18n', resolved.isHebrew && 'hib-i18n--he', className)}
      dir={resolved.isHebrew ? 'rtl' : 'ltr'}
    >
      {resolved.text}
      {resolved.pending && <PendingHint />}
    </Tag>
  );
}

function eraStatsLabel(lang: Lang) {
  return {
    sessions: lang === 'he' ? 'שיחות' : 'sessions',
    messages: lang === 'he' ? 'הודעות' : 'messages',
    tokens: lang === 'he' ? 'טוקנים' : 'tokens',
  };
}

function EraCard({ era, lang }: { era: Era; lang: Lang }) {
  const labels = eraStatsLabel(lang);
  return (
    <motion.div className="hib-era" variants={revealItem}>
      <div className="hib-era__years">{era.years}</div>
      <Bilingual he={era.labelHe} en={era.labelEn} lang={lang} tag="h3" className="hib-era__label" />
      {era.stats ? (
        <div className="hib-era__stats">
          <span>
            {countFmt.format(era.stats.sessions)} {labels.sessions}
          </span>
          <span>
            {countFmt.format(era.stats.genuineMessages)} {labels.messages}
          </span>
          <span>
            {tokenFmt.format(era.stats.outputTokens)} {labels.tokens}
          </span>
        </div>
      ) : (
        <div className="hib-era__stats hib-era__stats--none">
          {lang === 'he' ? 'לפני תחילת המעקב' : 'pre-tracking'}
        </div>
      )}
    </motion.div>
  );
}

function DialogueBubble({ quote, lang, keyId }: { quote: Quote; lang: Lang; keyId: string }) {
  const resolved = resolveText(quote.he, quote.en, lang);
  if (!resolved.text) return null;
  const isUser = quote.speaker === 'user';
  return (
    <motion.div
      key={keyId}
      className={clsx('hib-bubble', isUser ? 'hib-bubble--user' : 'hib-bubble--assistant')}
      variants={revealItem}
    >
      <span className="hib-bubble__speaker">
        {isUser ? <FiUser aria-hidden="true" /> : <FiCpu aria-hidden="true" />}
        {isUser ? (lang === 'he' ? 'גיתית' : 'User') : lang === 'he' ? 'עוזר AI' : 'Assistant'}
      </span>
      <p
        className={clsx('hib-bubble__text', resolved.isHebrew && 'hib-bubble__text--he')}
        dir={resolved.isHebrew ? 'rtl' : 'ltr'}
      >
        {resolved.text}
        {resolved.pending && <PendingHint />}
      </p>
    </motion.div>
  );
}

export function HowIBuild() {
  const [lang, setLang] = useState<Lang>('he');
  const feed = howIBuildFeed;

  const stories = useMemo(() => [...feed.stories].sort((a, b) => a.order - b.order), [feed.stories]);
  const journal = useMemo(
    () => [...feed.journal].sort((a, b) => b.to.localeCompare(a.to)),
    [feed.journal]
  );

  return (
    <Section
      id="how-i-build"
      eyebrow="How I Build"
      title="From hands-on code to directing AI agents."
      lead="A living feed of how my work with AI has evolved — the numbers, the stories, and the day-to-day journal behind it."
      revealAmount="some"
    >
      {feed.mode === 'preview' && (
        <div className="hib-ribbon">טיוטה / preview — not yet published</div>
      )}

      <div className="hib-toolbar">
        <div className="hib-lang-toggle" role="group" aria-label="Language">
          <FiGlobe aria-hidden="true" className="hib-lang-toggle__icon" />
          <button
            type="button"
            className={clsx('hib-lang-btn', lang === 'he' && 'hib-lang-btn--active')}
            onClick={() => setLang('he')}
            aria-pressed={lang === 'he'}
          >
            עברית
          </button>
          <button
            type="button"
            className={clsx('hib-lang-btn', lang === 'en' && 'hib-lang-btn--active')}
            onClick={() => setLang('en')}
            aria-pressed={lang === 'en'}
          >
            EN
          </button>
        </div>
      </div>

      <div className="hib-eras">
        {feed.eras.map((era, idx) => (
          <div className="hib-era-slot" key={era.key}>
            <EraCard era={era} lang={lang} />
            {idx < feed.eras.length - 1 && (
              <FiArrowRight className="hib-era-arrow" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      <div className="hib-stats-row">
        <motion.div className="hib-stat" variants={revealItem}>
          <span className="hib-stat__value">{countFmt.format(feed.totals.sessions)}</span>
          <span className="hib-stat__label">{lang === 'he' ? 'שיחות' : 'Sessions'}</span>
        </motion.div>
        <motion.div className="hib-stat" variants={revealItem}>
          <span className="hib-stat__value">{countFmt.format(feed.totals.genuineMessages)}</span>
          <span className="hib-stat__label">{lang === 'he' ? 'הודעות אמיתיות' : 'Genuine messages'}</span>
        </motion.div>
        <motion.div className="hib-stat" variants={revealItem}>
          <span className="hib-stat__value">{tokenFmt.format(feed.totals.outputTokens)}</span>
          <span className="hib-stat__label">{lang === 'he' ? 'טוקני פלט' : 'Output tokens'}</span>
        </motion.div>
        <motion.div className="hib-stat hib-stat--range" variants={revealItem}>
          <span className="hib-stat__range">
            {feed.totals.from} → {feed.totals.to}
          </span>
        </motion.div>
      </div>

      <div className="hib-stories">
        {stories.map((story) => {
          const typeLabel = resolveText(story.typeLabelHe, story.typeLabelEn, lang).text;
          return (
            <motion.article key={story.slug} className="hib-story" variants={revealItem}>
              <div className="hib-story__meta">
                {typeLabel && <span className="hib-story__type">{typeLabel}</span>}
                {story.status === 'draft' && <span className="hib-story__draft">draft</span>}
              </div>
              <Bilingual he={story.titleHe} en={story.titleEn} lang={lang} tag="h3" className="hib-story__title" />
              <Bilingual
                he={story.narrativeHe}
                en={story.narrativeEn}
                lang={lang}
                tag="p"
                className="hib-story__narrative"
              />
              {story.quotes.length > 0 && (
                <div className="hib-dialogue">
                  {story.quotes.map((q, idx) => (
                    <DialogueBubble
                      key={`${story.slug}-${idx}`}
                      keyId={`${story.slug}-${idx}`}
                      quote={q}
                      lang={lang}
                    />
                  ))}
                </div>
              )}
            </motion.article>
          );
        })}
      </div>

      <div className="hib-journal">
        <h3 className="hib-journal__heading">
          <FiBookOpen aria-hidden="true" /> {lang === 'he' ? 'יומן עבודה' : 'Build journal'}
        </h3>
        <ul className="hib-journal__list">
          {journal.map((entry) => (
            <motion.li key={entry.slug} className="hib-journal__item" variants={revealItem}>
              <div className="hib-journal__dates">
                {entry.from} → {entry.to}
                {entry.status === 'draft' && <span className="hib-story__draft">draft</span>}
              </div>
              <Bilingual
                he={entry.titleHe}
                en={entry.titleEn}
                lang={lang}
                tag="h4"
                className="hib-journal__title"
              />
              <Bilingual
                he={entry.bodyHe}
                en={entry.bodyEn}
                lang={lang}
                tag="p"
                className="hib-journal__body"
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
