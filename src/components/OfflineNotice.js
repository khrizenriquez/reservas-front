"use client";

import { useLanguage } from "./LanguageProvider";
import { useOnlineStatus } from "./useOnlineStatus";

export function OfflineNotice() {
  const online = useOnlineStatus();
  const { t } = useLanguage();
  if (online) return null;
  return <aside className="offline-notice" role="status" aria-live="polite">{t("connection.offline")}</aside>;
}
