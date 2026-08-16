"use client";

import Link from "next/link";
import { useState } from "react";
import { createRenderApiClient } from "@/services/render-api";
import { StatusMessage } from "@/components/StatusMessage";

const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];

export default function AvailabilityPage() {
  const [labs, setLabs] = useState(null);
  const [criteria, setCriteria] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextCriteria = { fecha: form.get("fecha"), hora_inicio: form.get("hora_inicio"), hora_fin: form.get("hora_fin") };
    setLoading(true);
    setError(null);
    try {
      setLabs(asList(await createRenderApiClient().getLabAvailability(nextCriteria)));
      setCriteria(nextCriteria);
    } catch (caught) {
      setError(caught?.code ?? "api.network");
      setLabs(null);
    } finally { setLoading(false); }
  };

  return <section className="workflow-page">
    <header className="page-heading"><p className="eyebrow">Planificación</p><h1>Disponibilidad</h1><p>Busca laboratorios libres para el horario de tu clase.</p></header>
    <form onSubmit={submit} className="workflow-form availability-form">
      <label>Fecha<input name="fecha" type="date" required /></label>
      <label>Hora de inicio<input name="hora_inicio" type="time" required /></label>
      <label>Hora de fin<input name="hora_fin" type="time" required /></label>
      <button className="button is-primary" disabled={loading}>{loading ? "Consultando…" : "Buscar disponibilidad"}</button>
    </form>
    {error ? <StatusMessage code={error} /> : null}
    {labs?.length === 0 ? <p role="status">No hay laboratorios disponibles para ese horario.</p> : null}
    {labs?.length > 0 ? <ul aria-label="Laboratorios disponibles" className="record-list availability-list">{labs.map((lab) => {
      const query = new URLSearchParams({ labId: lab.id, date: criteria.fecha, startTime: criteria.hora_inicio, endTime: criteria.hora_fin });
      return <li key={lab.id} className="record-card"><div><strong>{lab.name}</strong><span className="status-tag available">Disponible</span></div><Link className="button is-primary is-small" href={`/portal/reservas?${query.toString()}`}>Reservar este laboratorio</Link></li>;
    })}</ul> : null}
  </section>;
}
