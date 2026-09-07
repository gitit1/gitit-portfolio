import { motion } from 'framer-motion';
import { Section, revealItem } from '../common/Section';
import { capabilities, groupMeta, type CapabilityGroup } from '../../data/skills';
import { localizedCapability, localizedGroupMeta } from '../../i18n/content-he';
import { useLang } from '../../i18n/LanguageContext';

const GROUP_ORDER: CapabilityGroup[] = ['ai', 'engineering', 'product'];

// Merged section (WP-G3): "What I bring" + "Why AI fits me" + "How I build"
// are one section now. Three stacked blocks:
//   1. the bridge claim   — the "Why AI fits me" argument, owner-approved
//                           copy (howIBuild.bridge), the strongest text here
//   2. the receipts row   — the capability groups from data/skills.ts, with
//                           their Hebrew rendering from i18n/content-he.ts
//   3. the method rail    — the 6-step build method, step names only
//                           (per-step prose is pending owner-approved copy)
export function HowIBuild() {
  const { t, dict, lang } = useLang();
  return (
    <Section id="how-i-build" eyebrow={t('howIBuild.eyebrow')} title={t('howIBuild.title')} lead={t('howIBuild.lead')}>
      <motion.div className="hib-bridge" variants={revealItem}>
        <p className="hib-bridge__claim">{t('howIBuild.bridge.claim')}</p>
        <p className="hib-bridge__kicker">{t('howIBuild.bridge.kicker')}</p>
      </motion.div>

      <div className="hib-block">
        <h3 className="hib-block__label">{t('howIBuild.receiptsLabel')}</h3>
        <div className="hib-receipts">
          {GROUP_ORDER.map((group) => {
            const meta = localizedGroupMeta(group, lang, groupMeta[group]);
            const items = capabilities.filter((c) => c.group === group);
            return (
              <motion.div key={group} className={`hib-col hib-col--${group}`} variants={revealItem}>
                <div className="hib-col__head">
                  <span className="hib-col__label">{meta.label}</span>
                  <span className="hib-col__tagline">{meta.tagline}</span>
                </div>
                <ul className="hib-col__list">
                  {items.map((cap) => {
                    // key={cap.id}, not key={cap.name}: the name is translated,
                    // and keying by translated text remounts the list on a
                    // language switch — the bug documented on the rail below.
                    const copy = localizedCapability(cap, lang);
                    return (
                      <li key={cap.id} className="hib-item">
                        <span className="hib-item__name">{copy.name}</span>
                        <span className="hib-item__blurb">{copy.blurb}</span>
                      </li>
                    );
                  })}
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
            // key={i}, deliberately NOT key={step}: this list is a motion child of a
            // `whileInView once` parent, and the step TEXT is translated. Keying by the
            // text remounts all six <li> on a language switch, and the settled parent
            // never re-fires its reveal — so the whole method rail rendered as an empty
            // bar in Hebrew for anyone who switched language after scrolling past it
            // (reproduced 2026-08-23: 6 of 18 items stuck at opacity 0). The steps are a
            // fixed-length sequence that is never reordered or filtered, so the index is
            // a stable identity here.
            <motion.li key={i} className="hib-rail__step" variants={revealItem}>
              <span className="hib-rail__index">{i + 1}</span>
              <span className="hib-rail__name">{step}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
