import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import en from './en.json';
import id from './id.json';

// ─── Language ────────────────────────────────────────────────────────────────

export type Language = 'en' | 'id';

const TRANSLATIONS = { en, id } as const;
const LANG_KEY = 'algo-i18n-lang';

type I18nCtx = {
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nCtx>({
  language: 'en',
  setLanguage: () => {},
  t: (k) => k,
});

function getNestedValue(obj: unknown, parts: string[]): string | undefined {
  let cur: unknown = obj;
  for (const part of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === 'string' ? cur : undefined;
}

// ─── Theme ───────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark';

const THEME_KEY = 'algo-theme';

type ThemeCtx = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeCtx>({
  theme: 'light',
  toggleTheme: () => {},
});

// ─── Providers ───────────────────────────────────────────────────────────────

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches)
        return 'dark';
    } catch {
      // ignore
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    []
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(LANG_KEY);
      if (stored === 'en' || stored === 'id') return stored;
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = useCallback((l: Language) => {
    setLang(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      const parts = key.split('.');
      return (
        getNestedValue(TRANSLATIONS[language], parts) ??
        getNestedValue(TRANSLATIONS['en'], parts) ??
        key
      );
    },
    [language]
  );

  return (
    <ThemeProvider>
      <I18nContext.Provider value={{ language, setLanguage, t }}>
        {children}
      </I18nContext.Provider>
    </ThemeProvider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Returns t(key) when a translation exists, fallback otherwise.
// Avoids calling t() twice in the common "translate or use registered value" pattern.
export function tOr(
  translate: (k: string) => string,
  key: string,
  fallback: string
): string {
  const val = translate(key);
  return val === key ? fallback : val;
}
