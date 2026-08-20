"use client";

import { useCallback, useEffect, useState } from "react";
import { createRenderApiClient } from "@/services/render-api";
import { StatusMessage } from "@/components/StatusMessage";
import { LoadingState } from "@/components/LoadingState";
import { Modal } from "@/components/Modal";
import { Pagination, usePagination } from "@/components/Pagination";
import { useOnlineStatus } from "@/components/useOnlineStatus";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";

const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];
const today = () => new Date().toISOString().slice(0, 10);

export default function ReservationsPage() {
  const online = useOnlineStatus();
  const { t } = useLanguage();
  const { identity, isAdmin } = useAuth();
  const [prefill] = useState(() => {
    if (typeof window === "undefined") return {};
    const query = new URLSearchParams(window.location.search);
    return { labId: query.get("labId") ?? "", date: query.get("date") ?? "", startTime: query.get("startTime") ?? "", endTime: query.get("endTime") ?? "" };
  });
  const [reservations, setReservations] = useState([]);
  const [filters, setFilters] = useState({ labId: "", fecha: "" });
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [formOpen, setFormOpen] = useState(() => typeof window !== "undefined" && Boolean(new URLSearchParams(window.location.search).get("labId")));
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const pagination = usePagination(reservations);

  const requestReservations = useCallback((nextFilters) => {
    if (!online) return Promise.resolve(null);
    const query = {};
    if (nextFilters.labId) query.labId = nextFilters.labId;
    if (nextFilters.fecha) query.fecha = nextFilters.fecha;
    return createRenderApiClient().listReservations(query);
  }, [online]);

  const load = useCallback(async (nextFilters = filters) => {
    setLoading(true);
    try { const items = await requestReservations(nextFilters); if (items !== null) setReservations(asList(items)); setError(null); }
    catch (caught) { setError(caught?.code ?? "api.network"); setReservations([]); }
    finally { setLoading(false); }
  }, [filters, requestReservations]);

  useEffect(() => {
    let active = true;
    requestReservations(filters).then((items) => { if (active && items !== null) { setReservations(asList(items)); setError(null); } }).catch((caught) => { if (active) { setError(caught?.code ?? "api.network"); setReservations([]); } }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filters, requestReservations]);

  const formPayload = (form) => ({ userId: isAdmin ? Number(form.get("userId")) : identity.id, labId: Number(form.get("labId")), date: form.get("date"), startTime: form.get("startTime"), endTime: form.get("endTime"), reason: form.get("reason") });
  const submit = async (event) => {
    event.preventDefault();
    if (!online) { setError("api.network"); return; }
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setStatus("loading"); setError(null);
    try { const api = createRenderApiClient(); if (editing) await api.updateReservation({ id: editing.id, ...formPayload(form), requesterId: Number(form.get("userId")) }); else await api.createReservation(formPayload(form)); formElement.reset(); setFormOpen(false); setEditing(null); setStatus(editing ? "updated" : "created"); await load(); }
    catch (caught) { setError(caught?.code ?? "api.network"); setStatus("idle"); }
  };
  const cancel = async () => {
    if (!online || !cancelling) return;
    setError(null);
    try { await createRenderApiClient().cancelReservation({ id: cancelling.id, requesterId: cancelling.userId }); setCancelling(null); setStatus("cancelled"); await load(); }
    catch (caught) { setError(caught?.code ?? "api.network"); }
  };
  const inspect = async (id) => { setError(null); try { setDetail(await createRenderApiClient().getReservation({ id })); } catch (caught) { setError(caught?.code ?? "api.network"); } };
  const applyFilters = (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); setFilters({ labId: form.get("filterLabId"), fecha: form.get("filterDate") }); };
  const canManage = (reservation) => reservation.date >= today() && (isAdmin || reservation.userId === identity.id);

  return <section className="workflow-page"><header className="page-heading"><p className="eyebrow">{t("reservations.eyebrow")}</p><h1>{t("reservations.title")}</h1><p>{t("reservations.description")}</p></header><form className="workflow-filter" onSubmit={applyFilters} aria-label={t("reservations.filterLabel")}><label>{t("reservations.filterLab")}<input name="filterLabId" type="number" value={filters.labId} onChange={(event) => setFilters((current) => ({ ...current, labId: event.target.value }))} /></label><label>{t("reservations.filterDate")}<input name="filterDate" type="date" value={filters.fecha} onChange={(event) => setFilters((current) => ({ ...current, fecha: event.target.value }))} /></label><button className="button is-light" type="submit" disabled={!online}>{t("reservations.filter")}</button></form>{error ? <StatusMessage code={error} onRetry={() => load()} /> : null}<section aria-labelledby="reservation-list-title" className="data-panel"><div className="panel-heading-row"><h2 id="reservation-list-title">{t("reservations.listTitle")}</h2><button className="button is-primary" disabled={!online} onClick={() => { setEditing(null); setFormOpen(true); }}>{t("reservations.newReservation")}</button></div>{loading ? <LoadingState /> : null}{!loading && !error && reservations.length === 0 ? <p role="status">{t("reservations.empty")}</p> : null}<ul className="record-list">{pagination.pageItems.map((item) => <li key={item.id} className="record-card"><div><strong>{item.labName ?? item.name ?? t("reservations.labFallback")}</strong><p>{item.date} · {item.startTime}–{item.endTime}</p><p>{item.reason ?? t("reservations.noReason")}</p><span className="status-tag">{item.status ?? t("reservations.pending")}</span></div><div className="record-actions"><button className="button is-small" onClick={() => inspect(item.id)}>{t("reservations.details")}</button>{canManage(item) ? <><button className="button is-small" disabled={!online} onClick={() => { setEditing(item); setFormOpen(true); }}>{t("reservations.edit")}</button><button className="button is-small is-danger is-light" disabled={!online} onClick={() => setCancelling(item)}>{t("reservations.cancel")}</button></> : null}</div></li>)}</ul><Pagination {...pagination} totalItems={reservations.length} labels={t("pagination")} /></section>
    <Modal isOpen={Boolean(detail)} onClose={() => setDetail(null)} title={t("reservations.detailTitle")} closeLabel={t("common.close")}><p>{detail?.labName ?? detail?.name} · {detail?.date} · {detail?.startTime}–{detail?.endTime}</p></Modal>
    <Modal isOpen={Boolean(cancelling)} onClose={() => setCancelling(null)} title={t("reservations.confirmCancelTitle")} closeLabel={t("common.close")}><p>{t("reservations.confirmCancel")}</p><div className="form-actions"><button className="button is-danger" onClick={cancel}>{t("reservations.cancel")}</button><button className="button" onClick={() => setCancelling(null)}>{t("common.close")}</button></div></Modal>
    <Modal isOpen={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} title={t(editing ? "reservations.editTitle" : "reservations.createTitle")} closeLabel={t("common.close")}><form onSubmit={submit} className="workflow-form" key={editing?.id ?? "new"}><label>{t("reservations.userId")}{isAdmin ? <input name="userId" type="number" defaultValue={editing?.userId ?? ""} required /> : <input name="userId" type="number" value={identity.id} readOnly required />}</label><label>{t("reservations.lab")}<input name="labId" type="number" defaultValue={editing?.labId ?? prefill.labId} required /></label><label>{t("reservations.date")}<input name="date" type="date" defaultValue={editing?.date ?? prefill.date} required /></label><label>{t("reservations.start")}<input name="startTime" type="time" defaultValue={editing?.startTime ?? prefill.startTime} required /></label><label>{t("reservations.end")}<input name="endTime" type="time" defaultValue={editing?.endTime ?? prefill.endTime} required /></label><label>{t("reservations.reason")}<textarea name="reason" defaultValue={editing?.reason ?? ""} required /></label><div className="form-actions"><button className="button is-primary" disabled={status === "loading" || !online}>{t(editing ? "reservations.save" : "reservations.confirm")}</button><button className="button" type="button" onClick={() => { setFormOpen(false); setEditing(null); }}>{t("common.cancel")}</button></div></form>{status === "loading" ? <LoadingState /> : null}</Modal>{status === "created" ? <p role="status" className="success-message">{t("reservations.created")}</p> : null}{status === "updated" ? <p role="status" className="success-message">{t("reservations.updated")}</p> : null}{status === "cancelled" ? <p role="status" className="success-message">{t("reservations.cancelled")}</p> : null}</section>;
}
