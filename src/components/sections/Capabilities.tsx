import { motion } from 'framer-motion';
import { Section, revealItem } from '../common/Section';
import { capabilities, groupMeta, type CapabilityGroup } from '../../data/skills';

const ORDER: CapabilityGroup[] = ['ai', 'engineering', 'product'];

export function Capabilities() {
  return (
    <Section
      id="capabilities"
      eyebrow="What I bring"
      title="AI fluency, backed by a decade of shipping."
      lead="Dev skills are the superpower behind the PM thinking — I decide what to build, then build it."
    >
      <div className="cap-grid">
        {ORDER.map((group) => {
          const meta = groupMeta[group];
          const items = capabilities.filter((c) => c.group === group);
          return (
            <motion.div key={group} className={`cap-col cap-col--${group}`} variants={revealItem}>
              <div className="cap-col__head">
                <span className="cap-col__label">{meta.label}</span>
                <span className="cap-col__tagline">{meta.tagline}</span>
              </div>
              <ul className="cap-col__list">
                {items.map((cap) => (
                  <li key={cap.name} className="cap-item">
                    <span className="cap-item__name">{cap.name}</span>
                    <span className="cap-item__blurb">{cap.blurb}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
