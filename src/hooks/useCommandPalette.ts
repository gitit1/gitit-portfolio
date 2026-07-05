import { useEffect, useMemo, useState } from 'react';
import { SECTIONS, type SectionId } from '../config/sections';

export type Command = {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
};

type Handlers = {
  onNavigate: (id: SectionId) => void;
  onToggleTheme: () => void;
  onAskAi: () => void;
  onCopyResume: () => void;
};

export function useCommandPalette(handlers: Handlers) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const commands = useMemo<Command[]>(() => {
    const close = () => setOpen(false);
    return [
      {
        id: 'ask',
        label: 'Ask my AI about me',
        hint: 'chat',
        run: () => {
          handlers.onAskAi();
          close();
        },
      },
      {
        id: 'copy',
        label: 'Copy my resume for your LLM',
        hint: 'clipboard',
        run: () => {
          handlers.onCopyResume();
          close();
        },
      },
      {
        id: 'theme',
        label: 'Toggle light / dark theme',
        hint: 'theme',
        run: () => {
          handlers.onToggleTheme();
          close();
        },
      },
      ...SECTIONS.map((s) => ({
        id: `go-${s.id}`,
        label: `Go to ${s.label}`,
        hint: 'nav',
        run: () => {
          handlers.onNavigate(s.id);
          close();
        },
      })),
    ];
  }, [handlers]);

  return { open, setOpen, commands };
}
