"use client";

import Link from "next/link";
import { useState } from "react";

import { PageHeader } from "@/components/PageHeader";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { apiTime, dateAfter, humanDate, shortTime, toIsoDate } from "@/lib/format";
import { messageForError } from "@/lib/api/problem";
import { useSession } from "@/providers/SessionProvider";

const initialQuery = { date: dateAfter(1), startTime: "08:00", endTime: "09:00" };

export function AvailabilityWorkspace() {
  const { request } = useSession();
  const online = useOnlineStatus();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(null);
  const [selectedLab, setSelectedLab] = useState(null);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState({ busy: false, error: "", success: "" });

  function updateQuery(event) {
    setQuery((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function search(event) {
    event.preventDefault();
    setStatus({ busy: true, error: "", success: "" });
    setSelectedLab(null);
    try {
      const labs = await request("getLabAvailability", {
        query: {
          date: query.date,
          startTime: apiTime(query.startTime),
          endTime: apiTime(query.endTime),
        },
      });
      setResults(labs);
      setStatus({ busy: false, error: "", success: "" });
    } catch (error) {
      setResults(null);
      setStatus({ busy: false, error: messageForError(error), success: "" });
    }
  }

  async function reserve(event) {
    event.preventDefault();
    setStatus({ busy: true, error: "", success: "" });
    try {
      const reservation = await request("createReservation", {
        headers: { "Idempotency-Key": crypto.randomUUID() },
        body: {
          labId: selectedLab.id,
          date: query.date,
          startTime: apiTime(query.startTime),
          endTime: apiTime(query.endTime),
          reason: reason.trim(),
        },
      });
      setSelectedLab(null);
      setReason("");
      setStatus({
        busy: false,
        error: "",
        success: `Reserva #${reservation.id} creada correctamente.`,
      });
    } catch (error) {
      setStatus({ busy: false, error: messageForError(error), success: "" });
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Planifica con datos actuales"
        title="Disponibilidad"
        description="Consulta un intervalo y reserva uno de los laboratorios habilitados."
      />

      <section className="portal-panel availability-search" aria-labelledby="search-title">
        <div className="portal-panel__heading">
          <div>
            <p className="eyebrow">Paso 1</p>
            <h2 id="search-title">Define el horario</h2>
          </div>
          <span className="policy-note">07:00–22:00 · Máximo 4 horas</span>
        </div>
        <form className="availability-form" onSubmit={search}>
          <div className="field">
            <label className="label" htmlFor="availability-date">Fecha</label>
            <input className="input" id="availability-date" name="date" type="date" min={toIsoDate()} value={query.date} onChange={updateQuery} required />
          </div>
          <div className="field">
            <label className="label" htmlFor="availability-start">Desde</label>
            <input className="input" id="availability-start" name="startTime" type="time" min="07:00" max="21:30" step="1800" value={query.startTime} onChange={updateQuery} required />
          </div>
          <div className="field">
            <label className="label" htmlFor="availability-end">Hasta</label>
            <input className="input" id="availability-end" name="endTime" type="time" min="07:30" max="22:00" step="1800" value={query.endTime} onChange={updateQuery} required />
          </div>
          <button className={`button is-primary${status.busy ? " is-loading" : ""}`} type="submit" disabled={status.busy || !online}>Consultar</button>
        </form>
      </section>

      {status.error && <div className="notification is-danger is-light" role="alert">{status.error}</div>}
      {status.success && (
        <div className="notification is-success is-light" role="status">
          {status.success} <Link href="/portal/reservas">Ver mis reservas</Link>
        </div>
      )}

      {results && (
        <section className="availability-results" aria-labelledby="results-title">
          <div className="portal-panel__heading">
            <div>
              <p className="eyebrow">Paso 2</p>
              <h2 id="results-title">Laboratorios disponibles</h2>
              <p>{humanDate(query.date)} · {query.startTime}–{query.endTime}</p>
            </div>
            <span className="status-pill status-pill--available">{results.length} disponibles</span>
          </div>
          {results.length === 0 ? (
            <div className="resource-state"><strong>No hay espacios en ese intervalo</strong><p>Prueba una hora o fecha diferente.</p></div>
          ) : (
            <div className="available-lab-grid">
              {results.map((lab, index) => (
                <article key={lab.id} className={selectedLab?.id === lab.id ? "is-selected" : ""}>
                  <span className="available-lab__number">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{lab.name}</h3>
                  <p><span className="availability-dot" /> Disponible de {shortTime(apiTime(query.startTime))} a {shortTime(apiTime(query.endTime))}</p>
                  <button className="button is-light" type="button" onClick={() => setSelectedLab(lab)}>Elegir laboratorio</button>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {selectedLab && (
        <section className="portal-panel reservation-confirm" aria-labelledby="confirm-title">
          <div>
            <p className="eyebrow">Paso 3</p>
            <h2 id="confirm-title">Confirma la reserva</h2>
            <p><strong>{selectedLab.name}</strong> · {humanDate(query.date)} · {query.startTime}–{query.endTime}</p>
          </div>
          <form onSubmit={reserve}>
            <div className="field">
              <label className="label" htmlFor="reservation-reason">Motivo de la actividad</label>
              <textarea className="textarea" id="reservation-reason" value={reason} onChange={(event) => setReason(event.target.value)} minLength={1} maxLength={150} rows={3} required />
              <p className="help">Describe la clase, taller o evaluación. Máximo 150 caracteres.</p>
            </div>
            <div className="buttons">
              <button className={`button is-primary${status.busy ? " is-loading" : ""}`} type="submit" disabled={status.busy || !online}>Confirmar reserva</button>
              <button className="button is-light" type="button" onClick={() => setSelectedLab(null)}>Cambiar laboratorio</button>
            </div>
          </form>
        </section>
      )}
    </>
  );
}
