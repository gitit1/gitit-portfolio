import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import { profile } from '../../data/profile';
import { useChatStream } from './useChatStream';

type AiChatProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const STARTERS = [
  'What does "AI Product Builder" mean?',
  'What did she build at Browzwear?',
  'Tell me about MFL',
  'What AI skills does she have?',
];

export function AiChat({ open, onOpen, onClose }: AiChatProps) {
  const { messages, streaming, error, send } = useChatStream();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const submit = (text: string) => {
    send(text);
    setInput('');
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(input);
  };

  return (
    <>
      <button
        className={`chat-fab${open ? ' chat-fab--hidden' : ''}`}
        onClick={onOpen}
        aria-label="Ask my AI about me"
      >
        <FiMessageSquare aria-hidden="true" />
        <span>Ask my AI</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            className="chat"
            role="dialog"
            aria-label="AI assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          >
            <header className="chat__head">
              <div className="chat__id">
                <span className="chip__dot chip__dot--live" />
                <div>
                  <strong>Gitit's AI</strong>
                  <span className="chat__sub">grounded in her resume</span>
                </div>
              </div>
              <button className="icon-btn" onClick={onClose} aria-label="Close chat">
                <FiX />
              </button>
            </header>

            <div className="chat__scroll" ref={scrollRef}>
              {messages.length === 0 && (
                <div className="chat__intro">
                  <p>
                    Hi! I'm {profile.name.split(' ')[0]}'s AI assistant. Ask me anything about her
                    work, skills or projects.
                  </p>
                  <div className="chat__starters">
                    {STARTERS.map((s) => (
                      <button key={s} className="chat__starter" onClick={() => submit(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`bubble bubble--${m.role}`}>
                  {m.content}
                  {m.role === 'assistant' &&
                    streaming &&
                    i === messages.length - 1 &&
                    m.content === '' && <span className="bubble__typing">▌</span>}
                </div>
              ))}

              {error && <div className="chat__error">{error}</div>}
            </div>

            <form className="chat__form" onSubmit={onSubmit}>
              <input
                className="chat__input"
                placeholder="Ask about my experience…"
                value={input}
                maxLength={1000}
                onChange={(e) => setInput(e.target.value)}
                disabled={streaming}
              />
              <button
                className="icon-btn chat__send"
                type="submit"
                disabled={streaming || !input.trim()}
                aria-label="Send"
              >
                <FiSend />
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
