import { useCallback, useRef, useState } from 'react';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

const CHAT_ENDPOINT = '/api/chat';

export function useChatStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      setError(null);
      const history = [...messages, { role: 'user' as const, content: trimmed }];
      // Add the user's message and an empty assistant slot we stream into.
      setMessages([...history, { role: 'assistant', content: '' }]);
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(CHAT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const msg =
            res.status === 429
              ? "You've sent a lot of messages — give it a minute and try again."
              : 'Something went wrong reaching the assistant. Please try again.';
          throw new Error(msg);
        }
        if (!res.body) throw new Error('No response stream.');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = '';
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { role: 'assistant', content: acc };
            return next;
          });
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Something went wrong. Please try again.';
        setError(message);
        // Drop the empty assistant bubble on failure.
        setMessages((prev) => {
          const next = [...prev];
          if (next.length && next[next.length - 1].content === '') next.pop();
          return next;
        });
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, streaming]
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
  }, []);

  return { messages, streaming, error, send, reset };
}
