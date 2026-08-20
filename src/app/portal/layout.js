"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import { LoadingState } from "@/components/LoadingState";

export default function PortalLayout({ children }) {
  const { t } = useLanguage();
  const { identity, ready, isAdmin, signOut } = useAuth();
  const router = useRouter();
  useEffect(() => { if (ready && !identity) router.replace("/acceso"); }, [identity, ready, router]);
  if (!ready || !identity) return <LoadingState messageKey="loading.session" className="route-loading" />;
  return <div className="portal"><aside><strong>{t("portal.brand")}</strong><p className="session-identity"><span>{identity.name}</span><small>{isAdmin ? t("roles.admin") : t("roles.professor")}</small></p><nav aria-label={t("navigation.primary")}><Link href="/portal">{t("navigation.summary")}</Link><Link href="/portal/disponibilidad">{t("navigation.availability")}</Link><Link href="/portal/reservas">{t("navigation.reservations")}</Link><Link href="/portal/administracion">{t("navigation.administration")}</Link>{isAdmin ? <Link href="/portal/usuarios">{t("navigation.users")}</Link> : null}<Link href="/portal/logs">{t("navigation.logs")}</Link><Link href="/portal/perfil">{t("navigation.profile")}</Link></nav><div className="portal-controls"><LanguageSelector /><ThemeToggle /><button type="button" className="button is-small is-light" onClick={() => { signOut(); router.replace("/acceso"); }}>{t("auth.signOut")}</button></div></aside><main>{children}</main></div>;
}
