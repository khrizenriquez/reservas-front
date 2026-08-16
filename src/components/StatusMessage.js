"use client";
import { useLanguage } from "./LanguageProvider";
export function StatusMessage({ code, onRetry }) { const { t } = useLanguage(); return <div className="notification is-danger" role="alert" aria-live="assertive"><p>{t(code)}</p>{onRetry ? <button className="button is-light" onClick={onRetry}>{t("common.retry")}</button> : null}</div>; }
