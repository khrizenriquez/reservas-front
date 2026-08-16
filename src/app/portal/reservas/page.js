"use client";

import { useCallback, useEffect, useState } from "react";
import { createRenderApiClient } from "@/services/render-api";
import { StatusMessage } from "@/components/StatusMessage";
import { useSession } from "@/components/SessionProvider";
import { useOnlineStatus } from "@/components/useOnlineStatus";

const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];
const today = () => new Date().toISOString().slice(0, 10);

export default function ReservationsPage() {
  const { session } = useSession() ?? {};
  const sessionId = session?.id;
  const online = useOnlineStatus();
  const [prefill] = useState(() => {
    if (typeof window === "undefined") return {};
    const query = new URLSearchParams(window.location.search);
    return { labId: query.get("labId") ?? "", date: query.get("date") ?? "", startTime: query.get("startTime") ?? "", endTime: query.get("endTime") ?? "" };
  });
  const [reservations, setReservations] = useState([]);
  const [filters, setFilters] = useState({ labId: "", fecha: "" });
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const requestReservations = useCallback((nextFilters) => {
    if (!online) return Promise.resolve(null);
    const query = { userId: sessionId };
    if (nextFilters.labId) query.labId = nextFilters.labId;
    if (nextFilters.fecha) query.fecha = nextFilters.fecha;
    return createRenderApiClient().listReservations(query);
  }, [online, sessionId]);

  const load = useCallback(async (nextFilters = filters) => {
    try {
      const items = await requestReservations(nextFilters);
      if (items !== null) setReservations(asList(items));
      setError(null);
    } catch (caught) {
      setError(caught?.code ?? "api.network");
      setReservations([]);
    }
  }, [filters, requestReservations]);

  useEffect(() => {
    let active = true;
    requestReservations(filters).then((items) => {
      if (!active || items === null) return;
      setReservations(asList(items));
      setError(null);
    }).catch((caught) => {
      if (!active) return;
      setError(caught?.code ?? "api.network");
      setReservations([]);
    });
    return () => { active = false; };
  }, [filters, requestReservations]);

  const formPayload = (form) => ({
    userId: session?.id,
    labId: Number(form.get("labId")),
    date: form.get("date"),
    startTime: form.get("startTime"),
    endTime: form.get("endTime"),
    reason: form.get("reason")
  });

  const submit = async (event) => {
    event.preventDefault();
    if (!online) { setError("api.network"); return; }
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setStatus("loading");
    setError(null);
    try {
      const api = createRenderApiClient();
      if (editing) await api.updateReservation({ id: editing.id, ...formPayload(form), requesterId: session?.id });
      else await api.createReservation(formPayload(form));
      formElement.reset();
      setEditing(null);
      setStatus(editing ? "updated" : "created");
      await load();
    } catch (caught) {
      setError(caught?.code ?? "api.network");
      setStatus("idle");
    }
  };

  const cancel = async (id) => {
    if (!online || !window.confirm("¿Cancelar esta reserva?")) return;
    setError(null);
    try {
      await createRenderApiClient().cancelReservation({ id, requesterId: session?.id });
      setStatus("cancelled");
      await load();
    } catch (caught) {
      setError(caught?.code ?? "api.network");
    }
  };

  const inspect = async (id) => {
    setError(null);
    try { setDetail(await createRenderApiClient().getReservation({ id })); }
    catch (caught) { setError(caught?.code ?? "api.network"); }
  };

  const applyFilters = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = { labId: form.get("filterLabId"), fecha: form.get("filterDate") };
    setFilters(next);
    load(next);
  };

  const canManage = (reservation) => String(reservation.userId) === String(session?.id) && reservation.date >= today();

  return <section className="workflow-page">
    <header className="page-heading"><p className="eyebrow">Operación académica</p><h1>Reservas</h1><p>Consulta, crea y administra tus reservas activas.</p></header>
    <form className="workflow-filter" onSubmit={applyFilters} aria-label="Filtrar reservas">
      <label>Laboratorio para filtrar<input name="filterLabId" type="number" value={filters.labId} onChange={(event) => setFilters((current) => ({ ...current, labId: event.target.value }))} /></label>
      <label>Fecha para filtrar<input name="filterDate" type="date" value={filters.fecha} onChange={(event) => setFilters((current) => ({ ...current, fecha: event.target.value }))} /></label>
      <button className="button is-light" type="submit" disabled={!online}>Filtrar</button>
    </form>
    {error ? <StatusMessage code={error} onRetry={() => load()} /> : null}
    <section aria-labelledby="reservation-list-title" className="data-panel">
      <h2 id="reservation-list-title">Mis reservas</h2>
      {!error && reservations.length === 0 ? <p role="status">No hay reservas para los filtros seleccionados.</p> : null}
      <ul className="record-list">{reservations.map((item) => <li key={item.id} className="record-card">
        <div><strong>{item.labName ?? item.name ?? "Laboratorio"}</strong><p>{item.date} · {item.startTime}–{item.endTime}</p><p>{item.reason ?? "Sin motivo registrado"}</p><span className="status-tag">{item.status ?? "Pendiente"}</span></div>
        <div className="record-actions"><button className="button is-small" onClick={() => inspect(item.id)}>Ver detalle</button>{canManage(item) ? <><button className="button is-small" disabled={!online} onClick={() => setEditing(item)}>Modificar</button><button className="button is-small is-danger is-light" disabled={!online} onClick={() => cancel(item.id)}>Cancelar</button></> : null}</div>
      </li>)}</ul>
      {detail ? <aside className="record-detail" aria-live="polite"><h3>Detalle de reserva</h3><p>{detail.labName ?? detail.name} · {detail.date} · {detail.startTime}–{detail.endTime}</p><button className="button is-small" onClick={() => setDetail(null)}>Cerrar detalle</button></aside> : null}
    </section>
    <section className="data-panel" aria-labelledby="reservation-form-title">
      <h2 id="reservation-form-title">{editing ? "Modificar reserva" : "Crear reserva"}</h2>
      <form onSubmit={submit} className="workflow-form" key={editing?.id ?? "new"}>
        <label>Laboratorio<input name="labId" type="number" defaultValue={editing?.labId ?? prefill.labId} required /></label>
        <label>Fecha<input name="date" type="date" defaultValue={editing?.date ?? prefill.date} required /></label>
        <label>Inicio<input name="startTime" type="time" defaultValue={editing?.startTime ?? prefill.startTime} required /></label>
        <label>Fin<input name="endTime" type="time" defaultValue={editing?.endTime ?? prefill.endTime} required /></label>
        <label>Motivo<textarea name="reason" defaultValue={editing?.reason ?? ""} required /></label>
        <div className="form-actions"><button className="button is-primary" disabled={status === "loading" || !online}>{editing ? "Guardar cambios" : "Confirmar reserva"}</button>{editing ? <button className="button" type="button" onClick={() => setEditing(null)}>Cancelar edición</button> : null}</div>
      </form>
      {status === "created" ? <p role="status">Reserva creada.</p> : null}
      {status === "updated" ? <p role="status">Reserva modificada.</p> : null}
      {status === "cancelled" ? <p role="status">Reserva cancelada.</p> : null}
    </section>
  </section>;
}
