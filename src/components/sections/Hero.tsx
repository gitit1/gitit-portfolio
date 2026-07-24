import { motion } from 'framer-motion';
import { FiMessageSquare, FiCopy, FiCheck } from 'react-icons/fi';
import heroImage from '../../styles/assets/home/gitit.jpg';
import { profile } from '../../data/profile';
import { useStreamingText } from '../../hooks/useStreamingText';
import { NodeCanvas } from '../common/NodeCanvas';
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
  const streamed = useStreamingText(profile.heroPhrases);
  const { t } = useLang();

  return (
    <section id="home" className="section hero">
      <NodeCanvas className="hero__canvas" />
      <div className="container hero__inner">
        <div className="hero__copy">
          <motion.div
            className="hero__available"
            custom={0}
            variants={fade}
            initial="hidden"
            animate="show"
          >
            <span className="chip">
              <span className="chip__dot chip__dot--live" />
              Open to AI Product & AI Engineering roles
            </span>
          </motion.div>

          <motion.h1
            className="hero__title"
            custom={1}
            variants={fade}
            initial="hidden"
            animate="show"
          >
            Hi, I'm Gitit. I'm an <span className="accent">AI Product Builder</span>.
          </motion.h1>

          <motion.p
            className="hero__stream"
            custom={2}
            variants={fade}
            initial="hidden"
            animate="show"
            aria-live="polite"
          >
            <span className="prompt">gitit@ai:~$</span>
            {streamed}
            <span className="cursor" aria-hidden="true">
              █
            </span>
          </motion.p>

          <motion.p
            className="hero__summary"
            custom={3}
            variants={fade}
            initial="hidden"
            animate="show"
          >
            {profile.summary}
          </motion.p>

          <motion.div
            className="hero__cta"
            custom={4}
            variants={fade}
            initial="hidden"
            animate="show"
          >
            <button className="btn btn--primary" onClick={onAskAi}>
              <FiMessageSquare aria-hidden="true" /> Ask my AI about me
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

          <motion.div
            className="hero__chips"
            custom={5}
            variants={fade}
            initial="hidden"
            animate="show"
          >
            <a className="chip" href={profile.site.mcpUrl}>
              <span className="chip__dot chip__dot--live" /> MCP server live
            </a>
            <a className="chip" href={profile.site.llmsTxt}>
              <span className="chip__dot" /> llms.txt
            </a>
            <a className="chip" href={profile.site.resumeJson}>
              <span className="chip__dot" /> resume.json
            </a>
          </motion.div>
        </div>

        <motion.div
          className="hero__portrait"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 90, damping: 16 }}
        >
          <img src={heroImage} alt={profile.name} />
        </motion.div>
      </div>
    </section>
  );
}
