"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import { createRenderApiClient } from "@/services/render-api";
import { StatusMessage } from "@/components/StatusMessage";

export default function ProfilePage() {
  const { t } = useLanguage();
  const { identity, isAdmin } = useAuth();
  const [error, setError] = useState(null); const [saved, setSaved] = useState(false);
  const submit = async (event) => { event.preventDefault(); const form = event.currentTarget; const password = new FormData(form).get("password"); setError(null); setSaved(false); try { await createRenderApiClient().changePassword({ userId: identity.id, newPassword: password }); form.reset(); setSaved(true); } catch (caught) { setError(caught?.code ?? "api.network"); } };
  return <section className="workflow-page"><header className="page-heading"><p className="eyebrow">{t("profile.eyebrow")}</p><h1>{t("profile.title")}</h1><p>{t("profile.description")}</p></header><section className="data-panel profile-card"><h2>{identity.name}</h2><p>{identity.email}</p><span className="status-tag">{isAdmin ? t("roles.admin") : t("roles.professor")}</span></section><section className="data-panel"><h2>{t("profile.changePassword")}</h2><p>{t("profile.passwordDescription")}</p><form className="compact-form" onSubmit={submit}><label>{t("profile.newPassword")}<input name="password" type="password" autoComplete="new-password" required /></label><button className="button is-primary">{t("profile.savePassword")}</button></form>{saved ? <p className="success-message" role="status">{t("profile.passwordUpdated")}</p> : null}{error ? <StatusMessage code={error} /> : null}</section></section>;
}
