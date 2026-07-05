import { motion } from 'framer-motion';
import heroImage from '../../styles/assets/home/gitit.jpg';

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero__text">
        <motion.span
          className="pill"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Full Stack • Frontend Focus
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Hi, I’m Gitit. <br /> I craft thoughtful web experiences.
        </motion.h1>
        <motion.p
          className="lede"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          viewport={{ once: true }}
        >
          I build resilient products with clean, reusable code, tasteful motion, and a pragmatic approach to UX.
        </motion.p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#projects">
            View Projects
          </a>
          <a className="btn btn--ghost" href="#resume">
            Experience
          </a>
        </div>
      </div>
      <motion.div
        className="hero__image"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <img src={heroImage} alt="Gitit Regev" />
      </motion.div>
    </div>
  );
};

export default Hero;
