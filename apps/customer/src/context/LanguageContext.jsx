import { createContext, useContext, useEffect, useState } from 'react';
import { getTranslation } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (key) => getTranslation(lang, key);
  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'ur' : 'en'));

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
