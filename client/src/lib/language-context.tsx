import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, Translations, LANGUAGES } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isLanguageSelected: boolean;
  selectLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'wow-agent-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru');
  const [isLanguageSelected, setIsLanguageSelected] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (stored === 'ru' || stored === 'en' || stored === 'de' || stored === 'es')) {
      setLanguageState(stored as Language);
      setIsLanguageSelected(true);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsLanguageSelected(true);
  };

  const t = translations[language] as Translations;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLanguageSelected, selectLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export { LANGUAGES };
