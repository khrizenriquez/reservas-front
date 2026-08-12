"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AdminGate } from "@/components/AdminGate";
import { PageHeader } from "@/components/PageHeader";
import { ResourceState } from "@/components/ResourceState";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { messageForError } from "@/lib/api/problem";
import { apiTime, dateAfter, humanDate, humanDateTime, shortTime } from "@/lib/format";
import { useSession } from "@/providers/SessionProvider";

const tabs = [["users", "Usuarios"], ["labs", "Laboratorios"], ["audit", "Auditoría"]];

function AdminContent() {
  const { user: currentUser, legacy, request } = useSession();
  const online = useOnlineStatus();
  const [tab, setTab] = useState("users");
  const [state, setState] = useState({ loading: true, error: "", items: [], labs: [], conditions: [] });
  const [action, setAction] = useState({ busy: "", error: "", success: "" });
  const [auditFilters, setAuditFilters] = useState({ module: "", action: "", userId: "" });

  const load = useCallback(async () => {
    setState((value) => ({ ...value, loading: true, error: "" }));
    try {
      if (tab === "users") {
        const users = await request("listUsers");
        setState({ loading: false, error: "", items: users.items, labs: [], conditions: [] });
      } else if (tab === "labs") {
        const [labs, conditions] = await Promise.all([request("listLabs"), request("listLabConditions")]);
        setState({ loading: false, error: "", items: [], labs, conditions: conditions.items });
      } else {
        const logs = await request("listAuditLogs", { query: auditFilters });
        setState({ loading: false, error: "", items: logs.items, labs: [], conditions: [] });
      }
    } catch (error) {
      setState((value) => ({ ...value, loading: false, error: messageForError(error) }));
    }
  }, [auditFilters, request, tab]);

  useEffect(() => { queueMicrotask(load); }, [load]);

  async function run(key, callback) {
    setAction({ busy: key, error: "", success: "" });
    try {
      await callback();
      setAction({ busy: "", error: "", success: "Cambio guardado correctamente." });
      await load();
      return true;
    } catch (error) {
      setAction({ busy: "", error: messageForError(error), success: "" });
      return false;
    }
  }

  const roles = useMemo(() => {
    const values = new Map();
    state.items.forEach((user) => values.set(user.role.id, user.role));
    return [...values.values()];
  }, [state.items]);

  async function createUser(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const ok = await run("create-user", () => request("createUser", { body: {
      username: String(form.get("username")).trim(), password: String(form.get("password")),
      firstName: String(form.get("firstName")).trim(), lastName: String(form.get("lastName")).trim(),
      roleId: Number(form.get("roleId")),
    } }));
    if (ok) formElement.reset();
  }

  async function createLab(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const ok = await run("create-lab", () => request("createLab", { body: { name: String(form.get("name")).trim() } }));
    if (ok) formElement.reset();
  }

  async function createCondition(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const ok = await run("create-condition", () => request("createLabCondition", { body: {
      labId: Number(form.get("labId")), date: String(form.get("date")),
      startTime: apiTime(String(form.get("startTime"))), endTime: apiTime(String(form.get("endTime"))),
      type: String(form.get("type")), reason: String(form.get("reason")).trim(),
    } }));
    if (ok) formElement.reset();
  }

  return <>
    <PageHeader eyebrow="Configuración y trazabilidad" title="Administración" description="Funciones disponibles en la API Django." />
    {legacy && <div className="notification is-warning is-light">En legacy estos controles no están protegidos por el servidor.</div>}
    <div className="admin-tabs" role="tablist" aria-label="Secciones administrativas">{tabs.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? "is-active" : ""} onClick={() => setTab(id)}>{label}</button>)}</div>
    {action.error && <div className="notification is-danger is-light" role="alert">{action.error}</div>}
    {action.success && <div className="notification is-success is-light" role="status">{action.success}</div>}
    <ResourceState loading={state.loading} error={state.error} onRetry={load}>
      {tab === "users" && <div className="admin-columns">
        <section className="portal-panel"><h2>Usuarios</h2><div className="admin-list">{state.items.map((user) => <article key={user.id}><div className="portal-avatar" aria-hidden="true">{user.firstName?.[0]}{user.lastName?.[0]}</div><div><strong>{user.firstName} {user.lastName}</strong><span>{user.username} · {user.role.name} · {user.active ? "Activo" : "Inactivo"}</span></div>{user.active && user.id !== currentUser.id && <div className="buttons"><button className="button is-light is-small" disabled={!online} type="button" onClick={() => run(`deactivate-${user.id}`, () => request("deactivateUser", { pathParams: { userId: user.id } }))}>Inactivar</button><button className="button is-light is-small" disabled={!online} type="button" onClick={() => { const password = window.prompt("Contraseña temporal (mínimo 6 caracteres)"); if (password) run(`reset-${user.id}`, () => request("resetUserPassword", { pathParams: { userId: user.id }, body: { password } })); }}>Restablecer</button></div>}</article>)}</div></section>
        <section className="portal-panel"><h2>Crear usuario administrativo</h2>{roles.length === 0 ? <p>No hay roles resolubles desde los usuarios existentes.</p> : <form className="stack-form" onSubmit={createUser}><div className="field-pair"><input className="input" aria-label="Nombre" name="firstName" placeholder="Nombre" required /><input className="input" aria-label="Apellido" name="lastName" placeholder="Apellido" required /></div><input className="input" aria-label="Correo" name="username" type="email" placeholder="Correo" required /><input className="input" aria-label="Contraseña temporal" name="password" type="password" minLength={6} placeholder="Contraseña temporal" required /><div className="select is-fullwidth"><select aria-label="Rol" name="roleId">{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></div><button className="button is-primary" disabled={!online || action.busy === "create-user"} type="submit">Crear usuario</button></form>}</section>
      </div>}
      {tab === "labs" && <div className="admin-columns"><div className="admin-form-stack"><section className="portal-panel"><h2>Laboratorios</h2><div className="lab-admin-list">{state.labs.map((lab) => <article key={lab.id}><div><strong>{lab.name}</strong><span>{lab.active ? "Activo" : "Inactivo"}</span></div><button className="button is-light is-small" disabled={!online} type="button" onClick={() => run(`lab-${lab.id}`, () => request("updateLab", { pathParams: { labId: lab.id }, body: { name: lab.name, active: !lab.active } }))}>{lab.active ? "Inactivar" : "Activar"}</button></article>)}</div><form className="stack-form" onSubmit={createLab}><input className="input" aria-label="Nombre del laboratorio" name="name" maxLength={30} required /><button className="button is-light" disabled={!online} type="submit">Crear laboratorio</button></form></section><section className="portal-panel"><h2>Condiciones</h2><div className="condition-list">{state.conditions.map((condition) => <article key={condition.id}><div><strong>{condition.labName} · {condition.type}</strong><span>{humanDate(condition.date)} · {shortTime(condition.startTime)}–{shortTime(condition.endTime)}</span><p>{condition.reason}</p></div></article>)}</div></section></div><section className="portal-panel"><h2>Crear condición</h2><form className="stack-form" onSubmit={createCondition}><div className="select is-fullwidth"><select aria-label="Laboratorio" name="labId">{state.labs.map((lab) => <option key={lab.id} value={lab.id}>{lab.name}</option>)}</select></div><input className="input" aria-label="Fecha" name="date" type="date" defaultValue={dateAfter(1)} required /><div className="field-pair"><input className="input" aria-label="Desde" name="startTime" type="time" defaultValue="07:00" required /><input className="input" aria-label="Hasta" name="endTime" type="time" defaultValue="08:00" required /></div><div className="select is-fullwidth"><select aria-label="Tipo" name="type"><option>Asueto</option><option>Mantenimiento</option><option>Actividad</option></select></div><textarea className="textarea" aria-label="Motivo" name="reason" required /><button className="button is-primary" disabled={!online} type="submit">Crear bloqueo</button></form></section></div>}
      {tab === "audit" && <section className="portal-panel"><h2>Auditoría</h2><form className="audit-filters" onSubmit={(event) => { event.preventDefault(); load(); }}><input className="input" aria-label="Filtrar por módulo" value={auditFilters.module} onChange={(event) => setAuditFilters((value) => ({ ...value, module: event.target.value }))} /><input className="input" aria-label="Filtrar por acción" value={auditFilters.action} onChange={(event) => setAuditFilters((value) => ({ ...value, action: event.target.value }))} /><input className="input" aria-label="Filtrar por usuario" value={auditFilters.userId} onChange={(event) => setAuditFilters((value) => ({ ...value, userId: event.target.value }))} /></form><div className="audit-table-wrap"><table className="table is-fullwidth"><thead><tr><th>Fecha</th><th>Usuario</th><th>Módulo</th><th>Acción</th><th>Detalle</th></tr></thead><tbody>{state.items.map((log) => <tr key={log.id}><td>{humanDateTime(log.createdAt)}</td><td>{log.userId ?? "Sistema"}</td><td>{log.module}</td><td>{log.action}</td><td>{log.description}</td></tr>)}</tbody></table></div></section>}
    </ResourceState>
  </>;
}

export function AdminWorkspace() {
  return <AdminGate><AdminContent /></AdminGate>;
}
