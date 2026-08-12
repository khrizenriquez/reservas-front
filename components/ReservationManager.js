"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/PageHeader";
import { ResourceState } from "@/components/ResourceState";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { apiTime, humanDate, shortTime, statusLabel, toIsoDate } from "@/lib/format";
import { messageForError } from "@/lib/api/problem";
import { useSession } from "@/providers/SessionProvider";

export function ReservationManager() {
  const { request } = useSession();
  const online = useOnlineStatus();
  const [filters, setFilters] = useState({ dateFrom: toIsoDate(), status: "" });
  const [state, setState] = useState({ loading: true, error: "", reservations: [], labs: [] });
  const [editing, setEditing] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [action, setAction] = useState({ busy: false, error: "", success: "" });

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: "" }));
    try {
      const [page, labs] = await Promise.all([
        request("listReservations", { query: { limit: 50, ...filters } }),
        request("listLabs"),
      ]);
      setState({ loading: false, error: "", reservations: page.items, labs });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: messageForError(error) }));
    }
  }, [filters, request]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  const labNames = useMemo(
    () => Object.fromEntries(state.labs.map((lab) => [lab.id, lab.name])),
    [state.labs],
  );

  function startEditing(reservation) {
    setCancellingId(null);
    setAction({ busy: false, error: "", success: "" });
    setEditing({
      id: reservation.id,
      labId: String(reservation.labId),
      date: reservation.date,
      startTime: shortTime(reservation.startTime),
      endTime: shortTime(reservation.endTime),
      reason: reservation.reason,
    });
  }

  async function updateReservation(event) {
    event.preventDefault();
    setAction({ busy: true, error: "", success: "" });
    try {
      await request("updateReservation", {
        pathParams: { reservationId: editing.id },
        body: {
          labId: Number(editing.labId),
          date: editing.date,
          startTime: apiTime(editing.startTime),
          endTime: apiTime(editing.endTime),
          reason: editing.reason.trim(),
        },
      });
      setEditing(null);
      setAction({ busy: false, error: "", success: "La reserva fue actualizada." });
      await load();
    } catch (error) {
      setAction({ busy: false, error: messageForError(error), success: "" });
    }
  }

  async function cancelReservation(reservationId) {
    setAction({ busy: true, error: "", success: "" });
    try {
      await request("cancelReservation", { pathParams: { reservationId } });
      setCancellingId(null);
      setAction({ busy: false, error: "", success: "La reserva fue cancelada." });
      await load();
    } catch (error) {
      setAction({ busy: false, error: messageForError(error), success: "" });
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Historial y seguimiento"
        title="Reservas"
        description="Consulta, modifica o cancela las reservas que aún no han iniciado."
        action={<Link className="button is-primary" href="/portal/disponibilidad">Nueva reserva</Link>}
      />

      <form className="filter-bar" aria-label="Filtros de reservas" onSubmit={(event) => { event.preventDefault(); load(); }}>
        <div className="field">
          <label className="label" htmlFor="reservation-from">Desde</label>
          <input className="input" id="reservation-from" type="date" value={filters.dateFrom} onChange={(event) => setFilters((current) => ({ ...current, dateFrom: event.target.value }))} />
        </div>
        <div className="field">
          <label className="label" htmlFor="reservation-status">Estado</label>
          <div className="select">
            <select id="reservation-status" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              <option value="">Todos</option>
              <option value="ACTIVE">Activas</option>
              <option value="CANCELLED">Canceladas</option>
              <option value="COMPLETED">Completadas</option>
            </select>
          </div>
        </div>
      </form>

      {action.error && <div className="notification is-danger is-light" role="alert">{action.error}</div>}
      {action.success && <div className="notification is-success is-light" role="status">{action.success}</div>}

      <ResourceState loading={state.loading} error={state.error} empty={!state.reservations.length} onRetry={load}>
        <div className="reservation-list">
          {state.reservations.map((reservation) => (
            <article key={reservation.id} className="reservation-card">
              <div className="reservation-card__date">
                <time dateTime={reservation.date}>{humanDate(reservation.date)}</time>
                <strong>{shortTime(reservation.startTime)}–{shortTime(reservation.endTime)}</strong>
              </div>
              <div className="reservation-card__body">
                <div>
                  <h2>{labNames[reservation.labId] ?? `Laboratorio ${reservation.labId}`}</h2>
                  <p>{reservation.reason}</p>
                </div>
                <span className={`status-tag status-tag--${reservation.status.toLowerCase()}`}>{statusLabel(reservation.status)}</span>
              </div>
              {reservation.status === "ACTIVE" && (
                <div className="reservation-card__actions">
                  {cancellingId === reservation.id ? (
                    <div className="inline-confirm" role="alert">
                      <span>¿Cancelar esta reserva?</span>
                      <button className="button is-danger is-small" type="button" disabled={action.busy} onClick={() => cancelReservation(reservation.id)}>Sí, cancelar</button>
                      <button className="button is-light is-small" type="button" onClick={() => setCancellingId(null)}>Conservar</button>
                    </div>
                  ) : (
                    <>
                      <button className="button is-light is-small" type="button" disabled={!online} onClick={() => startEditing(reservation)}>Modificar</button>
                      <button className="button is-ghost is-small has-text-danger" type="button" disabled={!online} onClick={() => { setEditing(null); setCancellingId(reservation.id); }}>Cancelar</button>
                    </>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </ResourceState>

      {editing && (
        <section className="portal-panel edit-reservation" aria-labelledby="edit-title">
          <div className="portal-panel__heading">
            <div><p className="eyebrow">Reserva #{editing.id}</p><h2 id="edit-title">Modificar horario</h2></div>
            <button className="button is-light is-small" type="button" onClick={() => setEditing(null)}>Cerrar</button>
          </div>
          <form className="edit-reservation__form" onSubmit={updateReservation}>
            <div className="field">
              <label className="label" htmlFor="edit-lab">Laboratorio</label>
              <div className="select is-fullwidth"><select id="edit-lab" value={editing.labId} onChange={(event) => setEditing((current) => ({ ...current, labId: event.target.value }))} required>{state.labs.filter((lab) => lab.active && lab.reservable).map((lab) => <option key={lab.id} value={lab.id}>{lab.name}</option>)}</select></div>
            </div>
            <div className="field">
              <label className="label" htmlFor="edit-date">Fecha</label>
              <input className="input" id="edit-date" type="date" min={toIsoDate()} value={editing.date} onChange={(event) => setEditing((current) => ({ ...current, date: event.target.value }))} required />
            </div>
            <div className="field">
              <label className="label" htmlFor="edit-start">Desde</label>
              <input className="input" id="edit-start" type="time" min="07:00" max="21:30" step="1800" value={editing.startTime} onChange={(event) => setEditing((current) => ({ ...current, startTime: event.target.value }))} required />
            </div>
            <div className="field">
              <label className="label" htmlFor="edit-end">Hasta</label>
              <input className="input" id="edit-end" type="time" min="07:30" max="22:00" step="1800" value={editing.endTime} onChange={(event) => setEditing((current) => ({ ...current, endTime: event.target.value }))} required />
            </div>
            <div className="field edit-reservation__reason">
              <label className="label" htmlFor="edit-reason">Motivo</label>
              <textarea className="textarea" id="edit-reason" rows={2} maxLength={150} value={editing.reason} onChange={(event) => setEditing((current) => ({ ...current, reason: event.target.value }))} required />
            </div>
            <button className={`button is-primary${action.busy ? " is-loading" : ""}`} type="submit" disabled={action.busy || !online}>Guardar cambios</button>
          </form>
        </section>
      )}
    </>
  );
}
