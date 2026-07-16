import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, defaultLanguage, type Language } from './translations';

type TranslationTree = typeof translations.fr;

interface I18nContextValue {
  t: (key: string) => string;
  lang: Language;
  setLang: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'mpanolontsaina_lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    return stored === 'fr' || stored === 'mg' ? stored : defaultLanguage;
  });

  const changeLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    document.documentElement.lang = newLang;
  };

  const t = (key: string): string => {
    const parts = key.split('.');
    let value: unknown = translations[lang] as TranslationTree;
    for (const p of parts) {
      value = (value as Record<string, unknown> | undefined)?.[p];
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ t, lang, setLang: changeLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
