"use client";

import { useState } from "react";
import Link from "next/link";
import { createRenderApiClient } from "@/services/render-api";
import { StatusMessage } from "@/components/StatusMessage";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { LoadingState } from "@/components/LoadingState";

export default function AccessPage() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const router = useRouter();
  const { t } = useLanguage();
  const submit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("loading"); setError(null);
    try { await createRenderApiClient().login({ username: form.get("username"), password: form.get("password") }); router.push("/portal"); }
    catch (caught) { setError(caught?.code || "api.network"); setStatus("idle"); }
  };
  return <main className="section access-page"><div className="access-panel"><Link href="/">{t("access.back")}</Link><h1>{t("access.title")}</h1><p>{t("access.description")}</p><form onSubmit={submit}><label>{t("access.username")}<input name="username" type="email" autoComplete="username" required /></label><label>{t("access.password")}<input name="password" type="password" autoComplete="current-password" required /></label><button className="button is-primary is-fullwidth" disabled={status === "loading"}>{status === "loading" ? t("access.checking") : t("access.submit")}</button></form>{status === "loading" ? <LoadingState messageKey="access.checking" /> : null}<Link className="button is-light is-fullwidth" href="/portal">{t("access.continue")}</Link>{error ? <StatusMessage code={error} /> : null}</div></main>;
}
