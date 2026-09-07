import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';
import { Section, revealItem } from '../common/Section';
import { experiences } from '../../data/experience';
import { localizedExperience } from '../../i18n/content-he';
import { useLang } from '../../i18n/LanguageContext';

export function Experience() {
  const { t, lang } = useLang();
  return (
    <Section id="experience" eyebrow={t('experience.eyebrow')} title={t('experience.title')}>
      <div className="timeline">
        {experiences.map((exp) => {
          // Role, period, bullets and the company line come from
          // i18n/content-he.ts. Real brand names stay English in both
          // languages; only "Independent" is translated (owner ruling).
          const copy = localizedExperience(exp, lang);
          return (
            <motion.article key={exp.theme} className="tl-item" variants={revealItem}>
              <div className="tl-item__marker" aria-hidden="true">
                <span className={`tl-dot${exp.current ? ' tl-dot--current' : ''}`} />
              </div>
              <div className="tl-item__body">
                <div className="tl-item__top">
                  <h3 className="tl-item__role">{copy.role}</h3>
                  <span className="tl-item__period">{copy.period}</span>
                </div>
                <div className="tl-item__company">
                  {exp.link ? (
                    <a href={exp.link} target="_blank" rel="noreferrer">
                      {copy.company} <FiExternalLink aria-hidden="true" />
                    </a>
                  ) : (
                    <span>{copy.company}</span>
                  )}
                </div>
                <ul className="tl-item__bullets">
                  {/* key={i}: the bullet TEXT is translated, so keying by it
                      remounts every <li> on a language switch inside a
                      `whileInView once` parent — the empty-rail bug that hit
                      the method rail (see HowIBuild.tsx). Bullets are a fixed,
                      never-reordered list per role, so the index is stable. */}
                  {copy.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
