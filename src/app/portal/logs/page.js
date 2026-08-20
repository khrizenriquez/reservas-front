"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createRenderApiClient } from "@/services/render-api";
import { StatusMessage } from "@/components/StatusMessage";
import { LoadingState } from "@/components/LoadingState";
import { Pagination, usePagination } from "@/components/Pagination";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import { AuditMetric, AuditTrend, ModuleBars, auditIcons } from "@/components/AuditVisuals";

const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];
const field = (item, name) => item.raw?.[name] ?? item[name] ?? "";
const countBy = (items, valueFor) => items.reduce((counts, item) => { const value = valueFor(item) || "—"; counts[value] = (counts[value] ?? 0) + 1; return counts; }, {});
const topEntry = (counts) => Object.entries(counts).sort(([, left], [, right]) => right - left)[0]?.[0];

export default function LogsPage() {
  const { t } = useLanguage();
  const { identity } = useAuth();
  const [userId, setUserId] = useState(() => String(identity.id)); const [logs, setLogs] = useState(null); const [error, setError] = useState(null); const [loading, setLoading] = useState(true);
  const load = useCallback(async (nextUserId) => {
    if (!nextUserId) { setLogs(null); setError("logs.requiredUserId"); return; }
    setLoading(true); setError(null);
    try { setLogs(asList(await createRenderApiClient().listAuditLogs({ userId: nextUserId }))); }
    catch (caught) { setError(caught?.code ?? "api.network"); setLogs(null); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { let active = true; const initialId = String(identity.id); createRenderApiClient().listAuditLogs({ userId: initialId }).then((value) => { if (active) setLogs(asList(value)); }).catch((caught) => { if (active) setError(caught?.code ?? "api.network"); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [identity.id]);
  const moduleCounts = useMemo(() => countBy(logs ?? [], (log) => field(log, "umg_modulo")), [logs]);
  const dayCounts = useMemo(() => countBy(logs ?? [], (log) => String(log.createdAt ?? "").slice(0, 10)), [logs]);
  const actionCounts = useMemo(() => countBy(logs ?? [], (log) => field(log, "umg_accion")), [logs]);
  const dailyEntries = useMemo(() => Object.entries(dayCounts).sort(([left], [right]) => left.localeCompare(right)).slice(-7), [dayCounts]);
  const moduleEntries = useMemo(() => Object.entries(moduleCounts).sort(([, left], [, right]) => right - left), [moduleCounts]);
  const pagination = usePagination(logs ?? []);
  const submit = (event) => { event.preventDefault(); load(userId); };
  return <section className="workflow-page"><header className="page-heading"><p className="eyebrow">{t("logs.eyebrow")}</p><h1>{t("logs.title")}</h1><p>{t("logs.description")}</p></header>
    <form className="workflow-filter" onSubmit={submit}><label>{t("logs.userId")}<input name="userId" type="number" min="1" value={userId} onChange={(event) => setUserId(event.target.value)} required /></label><button className="button is-primary" disabled={loading}>{t("logs.load")}</button></form>
    {error ? error === "logs.requiredUserId" ? <p className="notification is-warning" role="alert">{t(error)}</p> : <StatusMessage code={error} onRetry={() => load(userId)} /> : null}
    {loading ? <LoadingState messageKey="loading.logs" /> : null}
    {logs?.length ? <><section className="audit-hero" aria-label={t("logs.title")}><div><p className="eyebrow">{t("logs.activityBand")}</p><h2>{t("logs.activityTitle")}</h2><p>{t("logs.activityDescription")}</p></div><AuditTrend entries={dailyEntries} label={t("logs.trendLabel")} /></section><section className="audit-metrics" aria-label={t("logs.metricsLabel")}><AuditMetric icon={auditIcons.total} label={t("logs.total")} value={logs.length} /><AuditMetric icon={auditIcons.modules} label={t("logs.modules")} value={Object.keys(moduleCounts).length} /><AuditMetric icon={auditIcons.action} label={t("logs.topAction")} value={topEntry(actionCounts) ?? t("logs.noActivity")} /></section>
      <section className="dashboard-grid dashboard-detail"><article className="data-panel"><h2>{t("logs.byModule")}</h2><ModuleBars entries={moduleEntries} label={t("logs.moduleChartLabel")} /></article><article className="data-panel"><h2>{t("logs.byDate")}</h2><ul className="metric-list">{dailyEntries.slice().reverse().map(([date, count]) => <li key={date}><span>{date}</span><strong>{count}</strong></li>)}</ul></article></section>
      <section className="data-panel"><ul className="record-list">{pagination.pageItems.map((log) => <li key={log.id} className="record-card"><div><strong>{field(log, "umg_accion")}</strong><p>{field(log, "umg_modulo")} · {field(log, "umg_descripcion")}</p><p>{log.createdAt}</p></div></li>)}</ul><Pagination {...pagination} totalItems={logs.length} labels={t("pagination")} /></section></> : null}
    {logs?.length === 0 ? <p role="status">{t("logs.empty")}</p> : null}
  </section>;
}
