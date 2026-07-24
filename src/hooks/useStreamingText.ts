import { useEffect, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Types out each phrase character-by-character like a streaming LLM response,
 * pauses, deletes, and moves to the next. Respects prefers-reduced-motion by
 * showing the first phrase statically, with no typing or cycling at all.
 */
export function useStreamingText(
  phrases: readonly string[],
  { typeMs = 55, deleteMs = 28, holdMs = 1600 } = {}
): string {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return;
    const current = phrases[phraseIndex % phrases.length];

    // Reduced motion: no typing, no cycling — just the first phrase, static.
    if (prefersReducedMotion()) {
      if (text !== phrases[0]) setText(phrases[0]);
      return;
    }

    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), holdMs);
      return () => clearTimeout(t);
    }
    if (deleting && text === '') {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
      return;
    }

    const t = setTimeout(
      () => {
        setText((prev) =>
          deleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)
        );
      },
      deleting ? deleteMs : typeMs
    );
    return () => clearTimeout(t);
  }, [text, deleting, phraseIndex, phrases, typeMs, deleteMs, holdMs]);

  return text;
}
