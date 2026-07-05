import { motion } from 'framer-motion';
import { FiMail, FiLinkedin, FiGithub, FiCopy, FiCheck, FiDownload } from 'react-icons/fi';
import { Section, revealItem } from '../common/Section';
import { profile } from '../../data/profile';

type ContactProps = {
  onCopyResume: () => void;
  copied: boolean;
};

export function Contact({ onCopyResume, copied }: ContactProps) {
  return (
    <Section id="contact" eyebrow="Contact" title="Let's build something with AI.">
      <motion.div className="contact-card" variants={revealItem}>
        <p className="contact-card__lead">
          Looking for someone who can shape an AI product and ship it? I'd love to hear what you're
          working on.
        </p>

        <div className="contact-card__actions">
          <a className="btn btn--primary" href={profile.links.email.href}>
            <FiMail aria-hidden="true" /> {profile.links.email.handle}
          </a>
          <a className="btn" href={profile.links.linkedin.href} target="_blank" rel="noreferrer">
            <FiLinkedin aria-hidden="true" /> LinkedIn
          </a>
          <a className="btn" href={profile.links.github.href} target="_blank" rel="noreferrer">
            <FiGithub aria-hidden="true" /> GitHub
          </a>
        </div>

        <div className="contact-card__secondary">
          <button className="text-link" onClick={onCopyResume}>
            {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
            {copied ? ' Copied resume for your LLM' : ' Copy my resume for your LLM'}
          </button>
          <a className="text-link" href={profile.site.resumeDoc} download>
            <FiDownload aria-hidden="true" /> Download CV (.docx)
          </a>
        </div>
      </motion.div>

      <footer className="site-footer">
        <span>
          © {profile.name} — built with React, Vite & Claude Code. Try the{' '}
          <kbd>Ctrl/⌘</kbd> + <kbd>K</kbd> palette.
        </span>
      </footer>
    </Section>
  );
}
