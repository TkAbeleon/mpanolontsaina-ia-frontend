import { createContext, useContext, ReactNode } from "react";
import { translations, defaultLanguage, Language } from "./translations";

interface I18nContextValue {
  t: (key: string) => string;
  lang: Language;
  setLang: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export { I18nContext };
