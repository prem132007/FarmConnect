import { createContext, useContext, useEffect, useState } from "react";
import translations from "../translations/translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("farmconnect-language");

    if (["en", "hi", "mr"].includes(savedLanguage)) {
      return savedLanguage;
    }

    return "en";
  });

  useEffect(() => {
    localStorage.setItem("farmconnect-language", language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (["en", "hi", "mr"].includes(newLanguage)) {
      setLanguage(newLanguage);
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en?.[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};