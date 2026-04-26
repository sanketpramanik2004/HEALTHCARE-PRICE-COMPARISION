import { createContext, useContext, useState } from "react";
import { translations } from "./translations";

const I18nContext = createContext(null);
const STORAGE_KEY = "appLanguage";

function getByPath(object, path) {
  return path.split(".").reduce((current, segment) => current?.[segment], object);
}

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem(STORAGE_KEY) || "en");

  const setLanguage = (nextLanguage) => {
    const safeLanguage = translations[nextLanguage] ? nextLanguage : "en";
    localStorage.setItem(STORAGE_KEY, safeLanguage);
    setLanguageState(safeLanguage);
  };

  const t = (key, fallback = key) => {
    return (
      getByPath(translations[language], key) ??
      getByPath(translations.en, key) ??
      fallback
    );
  };

  const value = {
    language,
    setLanguage,
    t,
    languages: [
      { code: "en", label: t("lang.en", "English") },
      { code: "hi", label: t("lang.hi", "Hindi") },
      { code: "bn", label: t("lang.bn", "Bengali") },
    ],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}
