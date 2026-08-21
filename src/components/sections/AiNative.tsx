import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck, FiMessageSquare, FiExternalLink } from 'react-icons/fi';
import { Section, revealItem } from '../common/Section';
import { profile } from '../../data/profile';
import { useLang } from '../../i18n/LanguageContext';

type AiNativeProps = {
  onCopyResume: () => void;
  copied: boolean;
  onAskAi: () => void;
};

function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="codeblock">
      <div className="codeblock__label">{label}</div>
      <div className="codeblock__row">
        <code>{code}</code>
        <button className="codeblock__copy" onClick={copy} aria-label="Copy command">
          {copied ? <FiCheck /> : <FiCopy />}
        </button>
      </div>
    </div>
  );
}

export function AiNative({ onCopyResume, copied, onAskAi }: AiNativeProps) {
  const { t } = useLang();
  return (
    <Section
      id="ai-native"
      eyebrow={t('aiNative.eyebrow')}
      title={t('aiNative.title')}
      lead={t('aiNative.lead')}
    >
      <motion.div className="ai-native__chips" variants={revealItem}>
        <a className="chip" href={profile.site.mcpUrl}>
          <span className="chip__dot chip__dot--live" /> {t('aiNative.chips.mcpLive')}
        </a>
        <a className="chip" href={profile.site.llmsTxt}>
          <span className="chip__dot" /> {t('aiNative.chips.llmsTxt')}
        </a>
        <a className="chip" href={profile.site.resumeJson}>
          <span className="chip__dot" /> {t('aiNative.chips.resumeJson')}
        </a>
      </motion.div>

      <div className="ai-native">
        <motion.div className="ai-native__card" variants={revealItem}>
          <h3 className="ai-native__card-title">{t('aiNative.cards.mcp.title')}</h3>
          <p className="ai-native__card-text">{t('aiNative.cards.mcp.text')}</p>
          <CodeBlock
            label={t('aiNative.cards.mcp.codeLabel')}
            code={`claude mcp add --transport http gitit-resume ${profile.site.mcpUrl}`}
          />
          <p className="ai-native__hint">
            {t('aiNative.cards.mcp.hint')} <code>{profile.site.mcpUrl}</code>
          </p>
        </motion.div>

        <motion.div className="ai-native__card" variants={revealItem}>
          <h3 className="ai-native__card-title">{t('aiNative.cards.fetch.title')}</h3>
          <p className="ai-native__card-text">{t('aiNative.cards.fetch.text')}</p>
          <CodeBlock label={t('aiNative.cards.fetch.codeLabel')} code={`curl ${profile.site.resumeJson}`} />
          <p className="ai-native__hint">
            {t('aiNative.cards.fetch.hintPrefix')}{' '}
            <a className="text-link" href={profile.site.llmsTxt}>
              /llms.txt <FiExternalLink aria-hidden="true" />
            </a>
          </p>
        </motion.div>

        <motion.div className="ai-native__card ai-native__card--cta" variants={revealItem}>
          <h3 className="ai-native__card-title">{t('aiNative.cards.ask.title')}</h3>
          <p className="ai-native__card-text">{t('aiNative.cards.ask.text')}</p>
          <div className="ai-native__cta-row">
            <button className="btn btn--primary" onClick={onAskAi}>
              <FiMessageSquare aria-hidden="true" /> {t('chatFab.label')}
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
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
