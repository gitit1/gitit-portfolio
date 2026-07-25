import { useCallback, useLayoutEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'gr-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  return prefersLight ? 'light' : 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // useLayoutEffect (not useEffect): this app is CSR-only (no SSR, so no
  // hydration-mismatch cost to worry about). A plain useEffect runs after
  // the browser has already painted, so on first load — before this runs —
  // <html> has no [data-theme] attribute and matches the bare `:root`
  // selector, which is the DARK palette. Any visitor whose resolved theme
  // is "light" would see a one-frame flash of dark before this corrects
  // it. useLayoutEffect runs synchronously after DOM mutation but before
  // the browser paints, so the attribute is set before anything is shown.
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggle };
}
