"use client";

import { useCallback, useEffect, useState } from "react";
import { createRenderApiClient } from "@/services/render-api";
import { StatusMessage } from "@/components/StatusMessage";

const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];
const field = (item, name) => item.raw?.[name] ?? item[name] ?? "";

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [editingLab, setEditingLab] = useState(null);
  const [editingCondition, setEditingCondition] = useState(null);
  const [resettingUser, setResettingUser] = useState(null);

  const fetchData = useCallback(async () => {
    const api = createRenderApiClient();
    const results = await Promise.allSettled([api.listLabs(), api.listLabConditions(), api.listUsers(), api.listAuditLogs()]);
    const [labs, conditions, users, logs] = results.map((result) => result.status === "fulfilled" ? asList(result.value) : []);
    const failed = results.find((result) => result.status === "rejected");
    return { value: { labs, conditions, users, logs }, error: failed?.reason?.code ?? null };
  }, []);

  const load = useCallback(async () => {
    const next = await fetchData();
    setData(next.value);
    setError(next.error);
  }, [fetchData]);

  useEffect(() => {
    let active = true;
    fetchData().then((next) => {
      if (!active) return;
      setData(next.value);
      setError(next.error);
    });
    return () => { active = false; };
  }, [fetchData]);

  const run = async (work, success) => {
    setError(null);
    setStatus(null);
    try { await work(); setStatus(success); await load(); }
    catch (caught) { setError(caught?.code ?? "api.network"); }
  };

  if (!data) return <p role="status">Cargando administración…</p>;

  const submitLab = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("labName");
    run(() => editingLab ? createRenderApiClient().updateLab({ id: editingLab.id, name, status: Number(form.get("labStatus")) }) : createRenderApiClient().createLab({ name }), editingLab ? "Laboratorio actualizado." : "Laboratorio creado.");
    event.currentTarget.reset();
    setEditingLab(null);
  };

  const conditionPayload = (form) => ({ labId: Number(form.get("conditionLabId")), date: form.get("conditionDate"), startTime: form.get("conditionStart"), endTime: form.get("conditionEnd"), type: form.get("conditionType"), reason: form.get("conditionReason"), status: Number(form.get("conditionStatus")) });
  const submitCondition = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = conditionPayload(form);
    const createPayload = Object.fromEntries(Object.entries(payload).filter(([key]) => key !== "status"));
    run(() => editingCondition ? createRenderApiClient().updateLabCondition({ id: editingCondition.id, ...payload }) : createRenderApiClient().createLabCondition(createPayload), editingCondition ? "Condición actualizada." : "Condición creada.");
    event.currentTarget.reset();
    setEditingCondition(null);
  };

  const submitUser = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    run(() => createRenderApiClient().createUser({ username: form.get("username"), password: form.get("password"), name: form.get("firstName"), lastName: form.get("lastName"), roleId: Number(form.get("roleId")) }), "Usuario creado.");
    event.currentTarget.reset();
  };

  const submitReset = (event) => {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get("temporaryPassword");
    run(() => createRenderApiClient().resetUserPassword({ id: resettingUser.id, temporaryPassword: password }), "Contraseña temporal establecida.");
    event.currentTarget.reset();
    setResettingUser(null);
  };

  return <section className="workflow-page admin-page">
    <header className="page-heading"><p className="eyebrow">Operación institucional</p><h1>Administración</h1><p>Gestiona los recursos publicados por Render.</p></header>
    {error ? <StatusMessage code={error} onRetry={load} /> : null}
    {status ? <p role="status" className="success-message">{status}</p> : null}
    <section className="data-panel" aria-labelledby="labs-title"><h2 id="labs-title">Laboratorios</h2>
      <form onSubmit={submitLab} className="compact-form" key={editingLab?.id ?? "new-lab"}><h3>{editingLab ? "Editar laboratorio" : "Crear laboratorio"}</h3><label>Nombre de laboratorio<input name="labName" defaultValue={editingLab?.name ?? ""} required /></label>{editingLab ? <label>Estado<select name="labStatus" defaultValue={editingLab.status ?? 1}><option value="1">Activo</option><option value="0">Inactivo</option></select></label> : null}<div className="form-actions"><button className="button is-primary">{editingLab ? "Guardar laboratorio" : "Crear laboratorio"}</button>{editingLab ? <button type="button" className="button" onClick={() => setEditingLab(null)}>Cancelar edición</button> : null}</div></form>
      <ul className="record-list">{data.labs.map((lab) => <li key={lab.id} className="record-card"><div><strong>{lab.name}</strong><span className="status-tag">{lab.status === 1 ? "Activo" : "Inactivo"}</span></div><button className="button is-small" onClick={() => setEditingLab(lab)}>Editar laboratorio</button></li>)}</ul>
    </section>
    <section className="data-panel" aria-labelledby="conditions-title"><h2 id="conditions-title">Condiciones</h2>
      <form onSubmit={submitCondition} className="workflow-form" key={editingCondition?.id ?? "new-condition"}><h3>{editingCondition ? "Editar condición" : "Crear condición"}</h3><label>Laboratorio<input name="conditionLabId" type="number" defaultValue={editingCondition?.labId ?? ""} required /></label><label>Fecha<input name="conditionDate" type="date" defaultValue={editingCondition?.date ?? ""} required /></label><label>Inicio<input name="conditionStart" type="time" defaultValue={editingCondition?.startTime ?? ""} required /></label><label>Fin<input name="conditionEnd" type="time" defaultValue={editingCondition?.endTime ?? ""} required /></label><label>Tipo<input name="conditionType" defaultValue={editingCondition?.type ?? ""} required /></label><label>Motivo<textarea name="conditionReason" defaultValue={editingCondition?.reason ?? ""} required /></label>{editingCondition ? <label>Estado<select name="conditionStatus" defaultValue={editingCondition.status ?? 1}><option value="1">Activo</option><option value="0">Inactivo</option></select></label> : null}<div className="form-actions"><button className="button is-primary">{editingCondition ? "Guardar condición" : "Crear condición"}</button>{editingCondition ? <button type="button" className="button" onClick={() => setEditingCondition(null)}>Cancelar edición</button> : null}</div></form>
      <ul className="record-list">{data.conditions.map((condition) => <li key={condition.id} className="record-card"><div><strong>{condition.type}</strong><p>{condition.labName ?? field(condition, "UMG_Lab_Nombre")} · {condition.date} · {condition.startTime}–{condition.endTime}</p><p>{condition.reason}</p></div><button className="button is-small" onClick={() => setEditingCondition(condition)}>Editar condición</button></li>)}</ul>
    </section>
    <section className="data-panel" aria-labelledby="users-title"><h2 id="users-title">Usuarios</h2>
      <form onSubmit={submitUser} className="workflow-form"><h3>Crear usuario</h3><label>Correo institucional<input name="username" type="email" required /></label><label>Contraseña<input name="password" type="password" required /></label><label>Nombres<input name="firstName" required /></label><label>Apellidos<input name="lastName" required /></label><label>ID de rol<input name="roleId" type="number" required /></label><button className="button is-primary">Crear usuario</button></form>
      {resettingUser ? <form onSubmit={submitReset} className="compact-form"><h3>Restablecer contraseña de {resettingUser.email}</h3><label>Contraseña temporal<input name="temporaryPassword" type="password" required /></label><div className="form-actions"><button className="button is-primary">Guardar contraseña temporal</button><button type="button" className="button" onClick={() => setResettingUser(null)}>Cancelar</button></div></form> : null}
      <ul className="record-list">{data.users.map((user) => <li key={user.id} className="record-card"><div><strong>{user.name}</strong><p>{user.email} · {user.roleName ?? "Sin rol"}</p><span className="status-tag">{user.status === 1 ? "Activo" : "Inactivo"}</span></div><div className="record-actions"><button className="button is-small" onClick={() => setResettingUser(user)}>Restablecer contraseña</button><button className="button is-small is-danger is-light" disabled={user.status !== 1} onClick={() => { if (window.confirm(`¿Inactivar a ${user.email}?`)) run(() => createRenderApiClient().deactivateUser({ id: user.id }), "Usuario inactivado."); }}>Inactivar usuario</button></div></li>)}</ul>
    </section>
    <section className="data-panel" aria-labelledby="audit-title"><h2 id="audit-title">Auditoría</h2><ul className="record-list">{data.logs.map((log) => <li key={log.id} className="record-card"><div><strong>{field(log, "umg_accion")}</strong><p>{field(log, "umg_modulo")} · {field(log, "umg_descripcion")}</p><p>{log.createdAt}</p></div></li>)}</ul>{data.logs.length === 0 ? <p role="status">No hay registros de auditoría.</p> : null}</section>
  </section>;
}
