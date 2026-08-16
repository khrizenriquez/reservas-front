"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function ProfilePage() { const { t } = useLanguage(); return <section className="workflow-page"><h1>{t("portal.profileTitle")}</h1><p>{t("portal.profileDirect")}</p><p>{t("portal.profileDescription")}</p></section>; }
