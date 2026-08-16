"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createRenderApiClient } from "@/services/render-api";
import { StatusMessage } from "@/components/StatusMessage";
import { LoadingState } from "@/components/LoadingState";
import { Pagination, usePagination } from "@/components/Pagination";
import { useLanguage } from "@/components/LanguageProvider";

const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];
const field = (item, name) => item.raw?.[name] ?? item[name] ?? "";
const countBy = (items, valueFor) => items.reduce((counts, item) => { const value = valueFor(item) || "—"; counts[value] = (counts[value] ?? 0) + 1; return counts; }, {});
const topEntry = (counts) => Object.entries(counts).sort(([, left], [, right]) => right - left)[0]?.[0];

export default function LogsPage() {
  const { t } = useLanguage();
  const [userId, setUserId] = useState("1"); const [logs, setLogs] = useState(null); const [error, setError] = useState(null); const [loading, setLoading] = useState(true);
  const load = useCallback(async (nextUserId) => {
    if (!nextUserId) { setLogs(null); setError("logs.requiredUserId"); return; }
    setLoading(true); setError(null);
    try { setLogs(asList(await createRenderApiClient().listAuditLogs({ userId: nextUserId }))); }
    catch (caught) { setError(caught?.code ?? "api.network"); setLogs(null); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { let active = true; createRenderApiClient().listAuditLogs({ userId: "1" }).then((value) => { if (active) setLogs(asList(value)); }).catch((caught) => { if (active) setError(caught?.code ?? "api.network"); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  const moduleCounts = useMemo(() => countBy(logs ?? [], (log) => field(log, "umg_modulo")), [logs]);
  const dayCounts = useMemo(() => countBy(logs ?? [], (log) => String(log.createdAt ?? "").slice(0, 10)), [logs]);
  const actionCounts = useMemo(() => countBy(logs ?? [], (log) => field(log, "umg_accion")), [logs]);
  const pagination = usePagination(logs ?? []);
  const submit = (event) => { event.preventDefault(); load(userId); };
  return <section className="workflow-page"><header className="page-heading"><p className="eyebrow">{t("logs.eyebrow")}</p><h1>{t("logs.title")}</h1><p>{t("logs.description")}</p></header>
    <form className="workflow-filter" onSubmit={submit}><label>{t("logs.userId")}<input name="userId" type="number" min="1" value={userId} onChange={(event) => setUserId(event.target.value)} required /></label><button className="button is-primary" disabled={loading}>{t("logs.load")}</button></form>
    {error ? error === "logs.requiredUserId" ? <p className="notification is-warning" role="alert">{t(error)}</p> : <StatusMessage code={error} onRetry={() => load(userId)} /> : null}
    {loading ? <LoadingState messageKey="loading.logs" /> : null}
    {logs?.length ? <><section className="dashboard-grid" aria-label={t("logs.title")}><article className="metric-card"><span>{t("logs.total")}</span><strong>{logs.length}</strong></article><article className="metric-card"><span>{t("logs.modules")}</span><strong>{Object.keys(moduleCounts).length}</strong></article><article className="metric-card"><span>{t("logs.topAction")}</span><strong>{topEntry(actionCounts) ?? t("logs.noActivity")}</strong></article></section>
      <section className="dashboard-grid dashboard-detail"><article className="data-panel"><h2>{t("logs.byModule")}</h2><ul className="metric-list">{Object.entries(moduleCounts).sort(([, left], [, right]) => right - left).map(([module, count]) => <li key={module}><span>{module}</span><strong>{count}</strong></li>)}</ul></article><article className="data-panel"><h2>{t("logs.byDate")}</h2><ul className="metric-list">{Object.entries(dayCounts).sort(([left], [right]) => right.localeCompare(left)).slice(0, 7).map(([date, count]) => <li key={date}><span>{date}</span><strong>{count}</strong></li>)}</ul></article></section>
      <section className="data-panel"><ul className="record-list">{pagination.pageItems.map((log) => <li key={log.id} className="record-card"><div><strong>{field(log, "umg_accion")}</strong><p>{field(log, "umg_modulo")} · {field(log, "umg_descripcion")}</p><p>{log.createdAt}</p></div></li>)}</ul><Pagination {...pagination} totalItems={logs.length} labels={t("pagination")} /></section></> : null}
    {logs?.length === 0 ? <p role="status">{t("logs.empty")}</p> : null}
  </section>;
}
