import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="contact">
      <motion.div
        className="contact__card"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        viewport={{ once: true }}
      >
        <p className="pill">Let’s build</p>
        <h3>Looking for a modern, maintainable web app?</h3>
        <p>
          I love pairing smart architecture with playful motion. Drop a note and I’ll get back quickly.
        </p>
        <div className="contact__actions">
          <a className="btn btn--primary" href="mailto:gititregev1@gmail.com">
            Email Me
          </a>
          <a className="btn btn--ghost" href="https://www.linkedin.com/in/gitit-regev-aa6a4961/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
        <div className="contact__hint">
          AI site search coming soon — the layout already has a hook for it.
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
