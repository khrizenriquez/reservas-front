"use client";

import { useCallback, useEffect, useState } from "react";
import { createRenderApiClient } from "@/services/render-api";
import { StatusMessage } from "@/components/StatusMessage";
import { LoadingState } from "@/components/LoadingState";
import { Modal } from "@/components/Modal";
import { Pagination, usePagination } from "@/components/Pagination";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";

const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];
const field = (item, name) => item.raw?.[name] ?? item[name] ?? "";

function PageControls({ pagination, count, t }) {
  return <Pagination {...pagination} totalItems={count} labels={t("pagination")} />;
}

export default function AdminPage() {
  const { t } = useLanguage();
  const { identity, isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [editingLab, setEditingLab] = useState(null);
  const [editingCondition, setEditingCondition] = useState(null);
  const [labModal, setLabModal] = useState(false);
  const [conditionModal, setConditionModal] = useState(false);
  const [auditUserId, setAuditUserId] = useState(() => String(identity.id));

  const fetchData = useCallback(async () => {
    const api = createRenderApiClient();
    const results = await Promise.allSettled([api.listLabs(), api.listLabConditions(), api.listAuditLogs({ userId: auditUserId })]);
    const [labs, conditions, logs] = results.map((result) => result.status === "fulfilled" ? asList(result.value) : []);
    const failed = results.find((result) => result.status === "rejected");
    return { value: { labs, conditions, logs }, error: failed?.reason?.code ?? null };
  }, [auditUserId]);

  const load = useCallback(async () => { const next = await fetchData(); setData(next.value); setError(next.error); }, [fetchData]);

  useEffect(() => {
    let active = true;
    fetchData().then((next) => { if (active) { setData(next.value); setError(next.error); } });
    return () => { active = false; };
  }, [fetchData]);

  const labsPagination = usePagination(data?.labs ?? []);
  const conditionsPagination = usePagination(data?.conditions ?? []);
  const logsPagination = usePagination(data?.logs ?? []);
  const run = async (work, success) => {
    setError(null); setStatus(null);
    try { await work(); setStatus(success); await load(); }
    catch (caught) { setError(caught?.code ?? "api.network"); }
  };
  const submitLab = (event) => {
    event.preventDefault();
    if (!isAdmin) return;
    const form = new FormData(event.currentTarget);
    const name = form.get("labName");
    run(() => editingLab ? createRenderApiClient().updateLab({ id: editingLab.id, name, status: Number(form.get("labStatus")) }) : createRenderApiClient().createLab({ name }), editingLab ? "admin.labUpdated" : "admin.labCreated");
    setLabModal(false); setEditingLab(null);
  };
  const conditionPayload = (form) => ({ labId: Number(form.get("conditionLabId")), date: form.get("conditionDate"), startTime: form.get("conditionStart"), endTime: form.get("conditionEnd"), type: form.get("conditionType"), reason: form.get("conditionReason"), status: Number(form.get("conditionStatus")) });
  const submitCondition = (event) => {
    event.preventDefault();
    if (!isAdmin) return;
    const payload = conditionPayload(new FormData(event.currentTarget));
    const createPayload = Object.fromEntries(Object.entries(payload).filter(([key]) => key !== "status"));
    run(() => editingCondition ? createRenderApiClient().updateLabCondition({ id: editingCondition.id, ...payload }) : createRenderApiClient().createLabCondition(createPayload), editingCondition ? "admin.conditionUpdated" : "admin.conditionCreated");
    setConditionModal(false); setEditingCondition(null);
  };

  if (!data) return <LoadingState messageKey="loading.administration" className="workflow-page" />;
  return <section className="workflow-page admin-page"><header className="page-heading"><p className="eyebrow">{t("admin.eyebrow")}</p><h1>{t("admin.title")}</h1><p>{t("admin.description")}</p></header>{error ? <StatusMessage code={error} onRetry={load} /> : null}{status ? <p role="status" className="success-message">{t(status)}</p> : null}
    <section className="data-panel" aria-labelledby="labs-title"><div className="panel-heading-row"><h2 id="labs-title">{t("admin.labs")}</h2>{isAdmin ? <button className="button is-primary" onClick={() => { setEditingLab(null); setLabModal(true); }}>{t("admin.createLab")}</button> : null}</div><ul className="record-list">{labsPagination.pageItems.map((lab) => <li key={lab.id} className="record-card"><div><strong>{lab.name}</strong><span className="status-tag">{lab.status === 1 ? t("common.active") : t("common.inactive")}</span></div>{isAdmin ? <button className="button is-small" onClick={() => { setEditingLab(lab); setLabModal(true); }}>{t("admin.editLab")}</button> : null}</li>)}</ul><PageControls pagination={labsPagination} count={data.labs.length} t={t} /></section>
    <section className="data-panel" aria-labelledby="conditions-title"><div className="panel-heading-row"><h2 id="conditions-title">{t("admin.conditions")}</h2>{isAdmin ? <button className="button is-primary" onClick={() => { setEditingCondition(null); setConditionModal(true); }}>{t("admin.createCondition")}</button> : null}</div><ul className="record-list">{conditionsPagination.pageItems.map((condition) => <li key={condition.id} className="record-card"><div><strong>{condition.type}</strong><p>{condition.labName ?? field(condition, "UMG_Lab_Nombre")} · {condition.date} · {condition.startTime}–{condition.endTime}</p><p>{condition.reason}</p></div>{isAdmin ? <button className="button is-small" onClick={() => { setEditingCondition(condition); setConditionModal(true); }}>{t("admin.editCondition")}</button> : null}</li>)}</ul><PageControls pagination={conditionsPagination} count={data.conditions.length} t={t} /></section>
    <section className="data-panel" aria-labelledby="audit-title"><div className="panel-heading-row"><h2 id="audit-title">{t("admin.audit")}</h2><form className="audit-filter" onSubmit={(event) => { event.preventDefault(); load(); }}><label>{t("admin.auditUserId")}<input type="number" min="1" value={auditUserId} onChange={(event) => setAuditUserId(event.target.value)} required /></label><button className="button is-small">{t("admin.loadAudit")}</button></form></div><ul className="record-list">{logsPagination.pageItems.map((log) => <li key={log.id} className="record-card"><div><strong>{field(log, "umg_accion")}</strong><p>{field(log, "umg_modulo")} · {field(log, "umg_descripcion")}</p><p>{log.createdAt}</p></div></li>)}</ul>{data.logs.length === 0 ? <p role="status">{t("admin.noAudit")}</p> : null}<PageControls pagination={logsPagination} count={data.logs.length} t={t} /></section>
    <Modal isOpen={labModal} onClose={() => { setLabModal(false); setEditingLab(null); }} title={t(editingLab ? "admin.editLab" : "admin.createLab")} closeLabel={t("common.close")}><form onSubmit={submitLab} className="compact-form" key={editingLab?.id ?? "new-lab"}><label>{t("admin.labName")}<input name="labName" defaultValue={editingLab?.name ?? ""} required /></label>{editingLab ? <label>{t("admin.status")}<select name="labStatus" defaultValue={editingLab.status ?? 1}><option value="1">{t("common.active")}</option><option value="0">{t("common.inactive")}</option></select></label> : null}<div className="form-actions"><button className="button is-primary">{t(editingLab ? "admin.saveLab" : "admin.createLab")}</button><button type="button" className="button" onClick={() => { setLabModal(false); setEditingLab(null); }}>{t("common.cancel")}</button></div></form></Modal>
    <Modal isOpen={conditionModal} onClose={() => { setConditionModal(false); setEditingCondition(null); }} title={t(editingCondition ? "admin.editCondition" : "admin.createCondition")} closeLabel={t("common.close")}><form onSubmit={submitCondition} className="workflow-form" key={editingCondition?.id ?? "new-condition"}><label>{t("admin.lab")}<input name="conditionLabId" type="number" defaultValue={editingCondition?.labId ?? ""} required /></label><label>{t("admin.date")}<input name="conditionDate" type="date" defaultValue={editingCondition?.date ?? ""} required /></label><label>{t("admin.start")}<input name="conditionStart" type="time" defaultValue={editingCondition?.startTime ?? ""} required /></label><label>{t("admin.end")}<input name="conditionEnd" type="time" defaultValue={editingCondition?.endTime ?? ""} required /></label><label>{t("admin.type")}<input name="conditionType" defaultValue={editingCondition?.type ?? ""} required /></label><label>{t("admin.reason")}<textarea name="conditionReason" defaultValue={editingCondition?.reason ?? ""} required /></label>{editingCondition ? <label>{t("admin.status")}<select name="conditionStatus" defaultValue={editingCondition.status ?? 1}><option value="1">{t("common.active")}</option><option value="0">{t("common.inactive")}</option></select></label> : null}<div className="form-actions"><button className="button is-primary">{t(editingCondition ? "admin.saveCondition" : "admin.createCondition")}</button><button type="button" className="button" onClick={() => { setConditionModal(false); setEditingCondition(null); }}>{t("common.cancel")}</button></div></form></Modal>
  </section>;
}
