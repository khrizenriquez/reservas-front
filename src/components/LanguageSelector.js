"use client";
import { useLanguage } from "./LanguageProvider";
export function LanguageSelector() { const { language, selectLanguage, t } = useLanguage(); return <label className="language-selector">{t("language")}<select aria-label={t("language")} value={language} onChange={(event) => selectLanguage(event.target.value)}><option value="es">{t("spanish")}</option><option value="en">{t("english")}</option></select></label>; }
