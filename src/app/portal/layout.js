"use client";

import Link from "next/link";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/components/LanguageProvider";

export default function PortalLayout({ children }) {
  const { t } = useLanguage();
  return <div className="portal"><aside><strong>{t("portal.brand")}</strong><nav aria-label={t("navigation.primary")}><Link href="/portal">{t("navigation.summary")}</Link><Link href="/portal/disponibilidad">{t("navigation.availability")}</Link><Link href="/portal/reservas">{t("navigation.reservations")}</Link><Link href="/portal/administracion">{t("navigation.administration")}</Link><Link href="/portal/logs">{t("navigation.logs")}</Link><Link href="/portal/perfil">{t("navigation.profile")}</Link></nav><div className="portal-controls"><LanguageSelector /><ThemeToggle /></div></aside><main>{children}</main></div>;
}
