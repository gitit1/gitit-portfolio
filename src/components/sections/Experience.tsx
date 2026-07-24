import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';
import { Section, revealItem } from '../common/Section';
import { experiences } from '../../data/experience';

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Twelve years building products people use."
    >
      <div className="timeline">
        {experiences.map((exp) => (
          <motion.article key={exp.company} className="tl-item" variants={revealItem}>
            <div className="tl-item__marker" aria-hidden="true">
              <span className={`tl-dot${exp.current ? ' tl-dot--current' : ''}`} />
            </div>
            <div className="tl-item__body">
              <div className="tl-item__top">
                <h3 className="tl-item__role">{exp.role}</h3>
                <span className="tl-item__period">{exp.period}</span>
              </div>
              <div className="tl-item__company">
                {exp.link ? (
                  <a href={exp.link} target="_blank" rel="noreferrer">
                    {exp.company} <FiExternalLink aria-hidden="true" />
                  </a>
                ) : (
                  <span>{exp.company}</span>
                )}
              </div>
              <ul className="tl-item__bullets">
                {exp.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
