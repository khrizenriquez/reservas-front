"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createRenderApiClient } from "@/services/render-api";
import { StatusMessage } from "@/components/StatusMessage";

const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];

export default function PortalPage() {
  const [reservations, setReservations] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    createRenderApiClient().listReservations().then((items) => setReservations(asList(items))).catch((caught) => setError(caught?.code ?? "api.network"));
  }, []);
  return <section className="workflow-page"><header className="page-heading"><p className="eyebrow">Portal institucional</p><h1>Resumen</h1><p>Render v1 publica este portal con acceso directo, sin iniciar sesión.</p></header><section className="data-panel"><h2>Próximas reservas</h2>{error ? <StatusMessage code={error} /> : null}{reservations === null && !error ? <p role="status">Cargando reservas…</p> : null}{reservations?.length === 0 ? <p role="status">No hay reservas registradas.</p> : null}{reservations?.slice(0, 3).map((reservation) => <p key={reservation.id}><strong>{reservation.labName ?? reservation.name}</strong> · {reservation.date} · {reservation.startTime}</p>)}<Link className="button is-primary" href="/portal/disponibilidad">Consultar disponibilidad</Link></section></section>;
}
