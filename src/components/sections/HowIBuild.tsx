import { motion } from 'framer-motion';
import { Section, revealItem } from '../common/Section';
import { capabilities, groupMeta, type CapabilityGroup } from '../../data/skills';
import { useLang } from '../../i18n/LanguageContext';

const GROUP_ORDER: CapabilityGroup[] = ['ai', 'engineering', 'product'];

// Merged section (WP-G3): "What I bring" + "Why AI fits me" + "How I build"
// are one section now. Three stacked blocks:
//   1. the bridge claim   — Section's own eyebrow/title/lead (below)
//   2. the receipts row   — the capability groups from data/skills.ts
//   3. the method rail    — the 6-step build method, step names only
//                           (per-step prose is pending owner-approved copy)
export function HowIBuild() {
  const { t, dict } = useLang();
  return (
    <Section id="how-i-build" eyebrow={t('howIBuild.eyebrow')} title={t('howIBuild.title')} lead={t('howIBuild.lead')}>
      <div className="hib-block">
        <h3 className="hib-block__label">{t('howIBuild.receiptsLabel')}</h3>
        <div className="hib-receipts">
          {GROUP_ORDER.map((group) => {
            const meta = groupMeta[group];
            const items = capabilities.filter((c) => c.group === group);
            return (
              <motion.div key={group} className={`hib-col hib-col--${group}`} variants={revealItem}>
                <div className="hib-col__head">
                  <span className="hib-col__label">{meta.label}</span>
                  <span className="hib-col__tagline">{meta.tagline}</span>
                </div>
                <ul className="hib-col__list">
                  {items.map((cap) => (
                    <li key={cap.name} className="hib-item">
                      <span className="hib-item__name">{cap.name}</span>
                      <span className="hib-item__blurb">{cap.blurb}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="hib-block">
        <h3 className="hib-block__label">{t('howIBuild.methodLabel')}</h3>
        <ol className="hib-rail">
          {dict.howIBuild.steps.map((step, i) => (
            <motion.li key={step} className="hib-rail__step" variants={revealItem}>
              <span className="hib-rail__index">{i + 1}</span>
              <span className="hib-rail__name">{step}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
