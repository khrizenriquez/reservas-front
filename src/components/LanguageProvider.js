"use client";

import { createContext, useContext, useState } from "react";
import { textFor } from "@/lib/i18n";

const LanguageContext = createContext(null);
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "es";
    const stored = sessionStorage.getItem("reservas-language");
    return stored === "en" ? "en" : "es";
  });
  const selectLanguage = (next) => { setLanguage(next); sessionStorage.setItem("reservas-language", next); };
  return <LanguageContext value={{ language, selectLanguage, t: (key) => textFor(language, key) }}>{children}</LanguageContext>;
}
export const useLanguage = () => useContext(LanguageContext);
