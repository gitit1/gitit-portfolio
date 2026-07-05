import { useCallback, useRef, useState } from 'react';
import { buildMarkdownResume } from '../data/resume';

/** Copies the Markdown resume to the clipboard, with a transient "copied" flag. */
export function useCopyResume() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildMarkdownResume());
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard blocked (insecure context / permissions) — no-op.
    }
  }, []);

  return { copied, copy };
}
