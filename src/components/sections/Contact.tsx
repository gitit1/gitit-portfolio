import { motion } from 'framer-motion';
import { FiMail, FiLinkedin, FiGithub, FiCopy, FiCheck, FiDownload } from 'react-icons/fi';
import { Section, revealItem } from '../common/Section';
import { profile } from '../../data/profile';
import { useLang } from '../../i18n/LanguageContext';

type ContactProps = {
  onCopyResume: () => void;
  copied: boolean;
};

export function Contact({ onCopyResume, copied }: ContactProps) {
  const { t } = useLang();
  return (
    <Section id="contact" eyebrow={t('contact.eyebrow')} title={t('contact.title')}>
      <motion.div className="contact-card" variants={revealItem}>
        <p className="contact-card__lead">{t('contact.lead')}</p>

        <div className="contact-card__actions">
          <a className="btn btn--primary" href={profile.links.email.href}>
            <FiMail aria-hidden="true" /> {profile.links.email.handle}
          </a>
          <a className="btn" href={profile.links.linkedin.href} target="_blank" rel="noreferrer">
            <FiLinkedin aria-hidden="true" /> {t('socials.linkedin')}
          </a>
          <a className="btn" href={profile.links.github.href} target="_blank" rel="noreferrer">
            <FiGithub aria-hidden="true" /> {t('socials.github')}
          </a>
        </div>

        <div className="contact-card__secondary">
          <button className="text-link" onClick={onCopyResume}>
            {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
            {copied ? ` ${t('copyResume.copied')}` : ` ${t('copyResume.idle')}`}
          </button>
          <a className="text-link" href={profile.site.resumeDoc} download>
            <FiDownload aria-hidden="true" /> {t('contact.downloadCv')}
          </a>
        </div>
      </motion.div>

      <footer className="site-footer">
        <span>
          © {profile.name} — {t('footer.builtWith')} {t('footer.paletteHintPrefix')}{' '}
          <kbd>Ctrl/⌘</kbd> + <kbd>K</kbd> {t('footer.paletteHintSuffix')}
        </span>
      </footer>
    </Section>
  );
}
