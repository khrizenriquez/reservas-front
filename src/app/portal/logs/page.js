"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createRenderApiClient } from "@/services/render-api";
import { StatusMessage } from "@/components/StatusMessage";
import { LoadingState } from "@/components/LoadingState";
import { Pagination, usePagination } from "@/components/Pagination";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import { AuditMetric, ModuleBars, WeeklyActivityChart, auditIcons } from "@/components/AuditVisuals";
import { addDays, inRange, latestAuditDate, mondayFor, rangeEntries, validateAuditPeriod, weeklyEntries } from "@/lib/audit-periods";

const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];
const field = (item, name) => item.raw?.[name] ?? item[name] ?? "";
const countBy = (items, valueFor) => items.reduce((counts, item) => { const value = valueFor(item) || "—"; counts[value] = (counts[value] ?? 0) + 1; return counts; }, {});
const topEntry = (counts) => Object.entries(counts).sort(([, left], [, right]) => right - left)[0]?.[0];

export default function LogsPage() {
  const { t } = useLanguage();
  const { identity } = useAuth();
  const [userId, setUserId] = useState(() => String(identity.id));
  const [logs, setLogs] = useState(null);
  const [error, setError] = useState(null);
  const [periodError, setPeriodError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState({ mode: "week", week: "", start: "", end: "" });
  const [period, setPeriod] = useState({ mode: "week", week: "", start: "", end: "" });

  const load = useCallback(async (nextUserId) => {
    if (!nextUserId) { setLogs(null); setError("logs.requiredUserId"); return; }
    setLoading(true); setError(null);
    try { setLogs(asList(await createRenderApiClient().listAuditLogs({ userId: nextUserId }))); }
    catch (caught) { setError(caught?.code ?? "api.network"); setLogs(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    let active = true;
    createRenderApiClient().listAuditLogs({ userId: String(identity.id) })
      .then((value) => { if (active) setLogs(asList(value)); })
      .catch((caught) => { if (active) setError(caught?.code ?? "api.network"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [identity.id]);

  const defaultWeek = useMemo(() => mondayFor(latestAuditDate(logs ?? []) ?? "") ?? "", [logs]);
  const selectedWeek = period.week || defaultWeek;
  const activeLogs = useMemo(() => {
    if (!logs || !selectedWeek && period.mode === "week") return [];
    if (period.mode === "range") return inRange(logs, period.start, period.end);
    return inRange(logs, selectedWeek, addDays(selectedWeek, 6));
  }, [logs, period, selectedWeek]);
  const chartEntries = useMemo(() => period.mode === "week" && selectedWeek ? weeklyEntries(activeLogs, selectedWeek, t("logs.weekdays")) : rangeEntries(activeLogs), [activeLogs, period.mode, selectedWeek, t]);
  const moduleCounts = useMemo(() => countBy(activeLogs, (log) => field(log, "umg_modulo")), [activeLogs]);
  const actionCounts = useMemo(() => countBy(activeLogs, (log) => field(log, "umg_accion")), [activeLogs]);
  const moduleEntries = useMemo(() => Object.entries(moduleCounts).sort(([, left], [, right]) => right - left), [moduleCounts]);
  const pagination = usePagination(activeLogs);
  const displayStart = period.mode === "range" ? period.start : selectedWeek;
  const displayEnd = period.mode === "range" ? period.end : selectedWeek ? addDays(selectedWeek, 6) : "";
  const periodDescription = displayStart && displayEnd ? `${displayStart} – ${displayEnd}` : "";

  const submitUser = (event) => { event.preventDefault(); load(userId); };
  const submitPeriod = (event) => {
    event.preventDefault();
    const next = { ...draft, week: draft.week || defaultWeek };
    const validation = validateAuditPeriod(next);
    if (validation) { setPeriodError(validation); return; }
    setPeriodError(null); setPeriod(next);
  };

  return <section className="workflow-page"><header className="page-heading"><p className="eyebrow">{t("logs.eyebrow")}</p><h1>{t("logs.title")}</h1><p>{t("logs.description")}</p></header>
    <form className="workflow-filter" onSubmit={submitUser}><label>{t("logs.userId")}<input name="userId" type="number" min="1" value={userId} onChange={(event) => setUserId(event.target.value)} required /></label><button className="button is-primary" disabled={loading}>{t("logs.load")}</button></form>
    {error ? error === "logs.requiredUserId" ? <p className="notification is-warning" role="alert">{t(error)}</p> : <StatusMessage code={error} onRetry={() => load(userId)} /> : null}
    {loading ? <LoadingState messageKey="loading.logs" /> : null}
    {logs?.length ? <><section className="data-panel weekly-activity-panel" aria-labelledby="weekly-activity-title"><div className="panel-heading-row"><div><p className="eyebrow">{t("logs.weeklyBand")}</p><h2 id="weekly-activity-title">{t("logs.weeklyTitle")}</h2><p>{t("logs.weeklyDescription")}</p></div><strong className="weekly-total">{activeLogs.length}<span>{t("logs.recordsForPeriod")}</span></strong></div><form className="audit-period-controls" onSubmit={submitPeriod} noValidate><label>{t("logs.periodMode")}<select value={draft.mode} onChange={(event) => setDraft((current) => ({ ...current, mode: event.target.value }))}><option value="week">{t("logs.weekMode")}</option><option value="range">{t("logs.rangeMode")}</option></select></label>{draft.mode === "week" ? <label>{t("logs.weekOf")}<input type="date" value={draft.week || defaultWeek} onChange={(event) => setDraft((current) => ({ ...current, week: event.target.value }))} required /></label> : <><label>{t("logs.startDate")}<input type="date" value={draft.start} onChange={(event) => setDraft((current) => ({ ...current, start: event.target.value }))} required /></label><label>{t("logs.endDate")}<input type="date" value={draft.end} onChange={(event) => setDraft((current) => ({ ...current, end: event.target.value }))} required /></label></>}<button className="button is-light">{t("logs.applyPeriod")}</button></form>{periodError ? <p className="notification is-warning period-validation" role="alert">{t(periodError)}</p> : null}<p className="weekly-period" aria-live="polite">{t("logs.selectedPeriod")}: <strong>{periodDescription}</strong></p>{chartEntries.length ? <WeeklyActivityChart entries={chartEntries} label={t("logs.weeklyChartLabel")} /> : <p className="empty-period" role="status">{t("logs.emptyPeriod")}</p>}</section>
      <section className="audit-metrics" aria-label={t("logs.metricsLabel")}><AuditMetric icon={auditIcons.total} label={t("logs.total")} value={activeLogs.length} /><AuditMetric icon={auditIcons.modules} label={t("logs.modules")} value={Object.keys(moduleCounts).length} /><AuditMetric icon={auditIcons.action} label={t("logs.topAction")} value={topEntry(actionCounts) ?? t("logs.noActivity")} /></section>
      <section className="dashboard-grid dashboard-detail"><article className="data-panel"><h2>{t("logs.byModule")}</h2><ModuleBars entries={moduleEntries} label={t("logs.moduleChartLabel")} /></article><article className="data-panel"><h2>{t("logs.byDate")}</h2><ul className="metric-list">{chartEntries.slice().reverse().map((entry) => <li key={entry.date}><span>{entry.label}</span><strong>{entry.count}</strong></li>)}</ul></article></section>
      <section className="data-panel"><ul className="record-list">{pagination.pageItems.map((log) => <li key={log.id} className="record-card"><div><strong>{field(log, "umg_accion")}</strong><p>{field(log, "umg_modulo")} · {field(log, "umg_descripcion")}</p><p>{log.createdAt}</p></div></li>)}</ul>{activeLogs.length === 0 ? <p role="status">{t("logs.emptyPeriod")}</p> : null}<Pagination {...pagination} totalItems={activeLogs.length} labels={t("pagination")} /></section></> : null}
    {logs?.length === 0 ? <p role="status">{t("logs.empty")}</p> : null}
  </section>;
}
