import { motion } from 'framer-motion';
import { FiMessageSquare, FiCopy, FiCheck } from 'react-icons/fi';
import { useStreamingText } from '../../hooks/useStreamingText';
import { useLang } from '../../i18n/LanguageContext';

type HeroProps = {
  onAskAi: () => void;
  onCopyResume: () => void;
  copied: boolean;
};

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.08, type: 'spring', stiffness: 120, damping: 18 },
  }),
};

export function Hero({ onAskAi, onCopyResume, copied }: HeroProps) {
  const { t, dict } = useLang();
  const streamed = useStreamingText(dict.hero.receipts);

  return (
    <section id="home" className="section hero">
      <div className="container hero__inner">
        <motion.div
          className="hero__eyebrow"
          custom={0}
          variants={fade}
          initial="hidden"
          animate="show"
        >
          {t('hero.eyebrow')}
        </motion.div>

        <motion.h1 className="hero__name" custom={1} variants={fade} initial="hidden" animate="show">
          {t('hero.name')}
        </motion.h1>

        <motion.p className="hero__role" custom={2} variants={fade} initial="hidden" animate="show">
          {t('hero.role')}
        </motion.p>

        <motion.div
          className="hero__terminal"
          custom={3}
          variants={fade}
          initial="hidden"
          animate="show"
        >
          <div className="hero__terminal-line" dir="ltr" aria-hidden="true">
            <span className="hero__terminal-prompt">{dict.hero.terminalPrompt}</span>
            <span className="hero__terminal-text">{streamed}</span>
            <span className="cursor" aria-hidden="true">
              █
            </span>
          </div>
          <span className="sr-only">
            {t('hero.receiptsSrLabel')} {dict.hero.receipts.join(', ')}
          </span>
        </motion.div>

        <motion.div className="hero__facts" custom={4} variants={fade} initial="hidden" animate="show">
          {dict.hero.chips.map((chip) => (
            <div className="hero__fact" key={chip.label}>
              <span className="hero__fact-value" dir="ltr">
                {chip.value}
              </span>
              <span className="hero__fact-label">{chip.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div className="hero__cta" custom={5} variants={fade} initial="hidden" animate="show">
          <button className="btn btn--primary" onClick={onAskAi}>
            <FiMessageSquare aria-hidden="true" /> {t('chatFab.ariaLabel')}
          </button>
          <button className="btn" onClick={onCopyResume}>
            {copied ? (
              <>
                <FiCheck aria-hidden="true" /> {t('copyResume.copied')}
              </>
            ) : (
              <>
                <FiCopy aria-hidden="true" /> {t('copyResume.idle')}
              </>
            )}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
