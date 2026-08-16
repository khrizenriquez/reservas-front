"use client";

import { useLanguage } from "./LanguageProvider";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const nextKey = theme === "dark" ? "theme.switchToLight" : "theme.switchToDark";
  return <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={t(nextKey)} title={t(nextKey)}><span aria-hidden="true">{theme === "dark" ? "☾" : "☀"}</span><span>{t(`theme.${theme}`)}</span></button>;
}
