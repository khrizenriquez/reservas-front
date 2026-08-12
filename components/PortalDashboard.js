"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "@/components/PageHeader";
import { ResourceState } from "@/components/ResourceState";
import { humanDate, shortTime, statusLabel, toIsoDate } from "@/lib/format";
import { messageForError } from "@/lib/api/problem";
import { useSession } from "@/providers/SessionProvider";

export function PortalDashboard() {
  const { user, request } = useSession();
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const isAdmin = user?.role?.name === "ADMIN";

  const load = useCallback(async () => {
    setState({ loading: true, error: "", data: null });
    try {
      const baseRequests = [
        request("listReservations", { query: { limit: 5, dateFrom: toIsoDate() } }),
        request("listLabs"),
      ];
      const [reservations, labs] = await Promise.all(baseRequests);
      setState({ loading: false, error: "", data: { reservations, labs } });
    } catch (error) {
      setState({ loading: false, error: messageForError(error), data: null });
    }
  }, [request]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  const data = state.data;
  return (
    <>
      <PageHeader
        eyebrow={`Hola, ${user?.firstName}`}
        title={isAdmin ? "Pulso de la operación" : "Tu agenda académica"}
        description={
          isAdmin
            ? "Reservas, ocupación y pendientes del periodo actual."
            : "Próximas reservas y accesos rápidos para organizar tus clases."
        }
        action={<Link className="button is-primary" href="/portal/disponibilidad">Nueva reserva</Link>}
      />

      <ResourceState loading={state.loading} error={state.error} onRetry={load}>
        {data && (
          <div className="dashboard-layout">
            <section className="metric-grid" aria-label="Indicadores principales">
              <article className="metric-card metric-card--primary">
                <span>Próximas reservas</span>
                <strong>{data.reservations.items.length}</strong>
                <small>En esta vista</small>
              </article>
              <article className="metric-card">
                <span>Laboratorios disponibles</span>
                <strong>{data.labs.filter((lab) => lab.active).length}</strong>
                <small>De {data.labs.length} registrados</small>
              </article>
              <article className="metric-card metric-card--accent">
                <span>Perfil API</span>
                <strong>{isAdmin ? "Admin" : "Docente"}</strong>
                <small>Datos calculados desde Django</small>
              </article>
            </section>

            <div className="dashboard-columns">
              <section className="portal-panel" aria-labelledby="upcoming-title">
                <div className="portal-panel__heading">
                  <div>
                    <p className="eyebrow">Siguiente en agenda</p>
                    <h2 id="upcoming-title">Próximas reservas</h2>
                  </div>
                  <Link href="/portal/reservas">Ver todas</Link>
                </div>
                {data.reservations.items.length === 0 ? (
                  <div className="panel-empty">
                    <p>No tienes reservas próximas.</p>
                    <Link href="/portal/disponibilidad">Consultar disponibilidad →</Link>
                  </div>
                ) : (
                  <div className="reservation-compact-list">
                    {data.reservations.items.map((reservation) => (
                      <article key={reservation.id}>
                        <time dateTime={reservation.date}>
                          <strong>{new Date(`${reservation.date}T12:00:00Z`).getUTCDate()}</strong>
                          <span>{humanDate(reservation.date).split(" ")[1]}</span>
                        </time>
                        <div>
                          <h3>Laboratorio {reservation.labId}</h3>
                          <p>{shortTime(reservation.startTime)}–{shortTime(reservation.endTime)} · {reservation.reason}</p>
                        </div>
                        <span className={`status-tag status-tag--${reservation.status.toLowerCase()}`}>
                          {statusLabel(reservation.status)}
                        </span>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <aside className="quick-panel" aria-labelledby="quick-title">
                <p className="eyebrow eyebrow--light">Ruta rápida</p>
                <h2 id="quick-title">¿Qué necesitas hacer?</h2>
                <Link href="/portal/disponibilidad"><span>01</span> Encontrar un horario</Link>
                <Link href="/portal/reservas"><span>02</span> Modificar una reserva</Link>
                <Link href="/portal/perfil"><span>03</span> Revisar mi perfil</Link>
              </aside>
            </div>
          </div>
        )}
      </ResourceState>
    </>
  );
}
