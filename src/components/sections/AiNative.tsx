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
      eyebrow="This site is AI-native"
      title="My resume is machine-readable. Plug me into your agent."
      lead="Most portfolios are for humans. This one also talks to your LLM — connect the MCP server, fetch the JSON, or read the llms.txt."
    >
      <motion.div className="ai-native__chips" variants={revealItem}>
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

      <div className="ai-native">
        <motion.div className="ai-native__card" variants={revealItem}>
          <h3 className="ai-native__card-title">1. Connect the MCP server</h3>
          <p className="ai-native__card-text">
            Add my resume as a live tool in Claude Code (or any MCP client). Then ask it about my
            experience, skills and projects.
          </p>
          <CodeBlock
            label="Claude Code"
            code={`claude mcp add --transport http gitit-resume ${profile.site.mcpUrl}`}
          />
          <p className="ai-native__hint">
            In the Claude.ai app: Settings → Connectors → Add custom connector →{' '}
            <code>{profile.site.mcpUrl}</code>
          </p>
        </motion.div>

        <motion.div className="ai-native__card" variants={revealItem}>
          <h3 className="ai-native__card-title">2. Fetch the structured resume</h3>
          <p className="ai-native__card-text">
            A JSON Resume endpoint — pipe it straight into any tool that consumes structured
            candidate data.
          </p>
          <CodeBlock label="Terminal" code={`curl ${profile.site.resumeJson}`} />
          <p className="ai-native__hint">
            Prefer a guide for LLMs?{' '}
            <a className="text-link" href={profile.site.llmsTxt}>
              /llms.txt <FiExternalLink aria-hidden="true" />
            </a>
          </p>
        </motion.div>

        <motion.div className="ai-native__card ai-native__card--cta" variants={revealItem}>
          <h3 className="ai-native__card-title">3. Just ask</h3>
          <p className="ai-native__card-text">
            A grounded AI assistant that answers questions about me in real time — streamed, like
            you'd expect.
          </p>
          <div className="ai-native__cta-row">
            <button className="btn btn--primary" onClick={onAskAi}>
              <FiMessageSquare aria-hidden="true" /> Ask my AI
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
