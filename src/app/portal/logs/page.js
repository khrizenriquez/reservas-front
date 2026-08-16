"use client";

import { useEffect, useState } from "react";
import { createRenderApiClient } from "@/services/render-api";
import { StatusMessage } from "@/components/StatusMessage";
import { LoadingState } from "@/components/LoadingState";
import { useLanguage } from "@/components/LanguageProvider";

const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];
const field = (item, name) => item.raw?.[name] ?? item[name] ?? "";

export default function LogsPage() {
  const { t } = useLanguage(); const [logs, setLogs] = useState(null); const [error, setError] = useState(null);
  useEffect(() => { createRenderApiClient().listAuditLogs().then((value) => setLogs(asList(value))).catch((caught) => setError(caught?.code ?? "api.network")); }, []);
  return <section className="workflow-page"><header className="page-heading"><p className="eyebrow">{t("logs.eyebrow")}</p><h1>{t("logs.title")}</h1><p>{t("logs.description")}</p></header>{error ? <StatusMessage code={error} /> : null}{logs === null && !error ? <LoadingState messageKey="loading.logs" /> : null}{logs?.length === 0 ? <p role="status">{t("logs.empty")}</p> : null}{logs?.length ? <section className="data-panel"><ul className="record-list">{logs.map((log) => <li key={log.id} className="record-card"><div><strong>{field(log, "umg_accion")}</strong><p>{field(log, "umg_modulo")} · {field(log, "umg_descripcion")}</p><p>{log.createdAt}</p></div></li>)}</ul></section> : null}</section>;
}
