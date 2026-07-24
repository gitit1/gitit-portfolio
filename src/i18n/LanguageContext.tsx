import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Dict, Lang } from './types';
import { en } from './en';
import { he } from './he';

const STORAGE_KEY = 'gr-lang';

const DICTS: Record<Lang, Dict> = { en, he };

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'he') return stored;
  return 'en';
}

/** Reads a dot-path key out of the active Dict, e.g. t('themeToggle.toLight'). */
function readKey(dict: Dict, key: string): string {
  const value = key.split('.').reduce<unknown>((node, part) => {
    if (node && typeof node === 'object' && part in node) {
      return (node as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
  return typeof value === 'string' ? value : key;
}

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
  dict: Dict;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((l) => (l === 'en' ? 'he' : 'en'));
  }, []);

  const dict = DICTS[lang];
  const t = useCallback((key: string) => readKey(dict, key), [dict]);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, toggleLang, t, dict }),
    [lang, toggleLang, t, dict]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within a LanguageProvider');
  return ctx;
}
