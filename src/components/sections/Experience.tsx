import { motion } from 'framer-motion';
import { experiences } from '../../data/experience';

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
  viewport: { once: true, amount: 0.35 },
};

const Experience = () => {
  return (
    <div className="experience-grid">
      {experiences.map((exp) => (
        <motion.article
          key={exp.company}
          className={`experience-card ${exp.theme}`}
          initial={{ opacity: 0, y: 30, scale: 0.94, rotate: -1.5 }}
          whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 13, bounce: 0.35 }}
          viewport={{ once: true, amount: 0.35 }}
        >
          <div className="experience-card__header">
            <img src={new URL(`../../styles/assets/resume/${exp.logo}`, import.meta.url).href} alt={exp.company} />
            <div>
              <h3>{exp.company}</h3>
              <p>{exp.role}</p>
              <span className="period">{exp.period}</span>
            </div>
          </div>
          <ul>
            {exp.bullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <a href={exp.link} target="_blank" rel="noreferrer" className="text-link">
            Visit site
          </a>
        </motion.article>
      ))}
    </div>
  );
};

export default Experience;
