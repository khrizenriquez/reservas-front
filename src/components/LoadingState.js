"use client";

import { useLanguage } from "./LanguageProvider";

export function LoadingState({ messageKey = "common.loading", className = "" }) {
  const { t } = useLanguage();
  return <div className={`loading-state ${className}`.trim()} role="status" aria-live="polite"><span className="loading-spinner" aria-hidden="true" /><span>{t(messageKey)}</span></div>;
}
