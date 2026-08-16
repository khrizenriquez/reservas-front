"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createRenderApiClient } from "@/services/render-api";
import { StatusMessage } from "@/components/StatusMessage";
import { LoadingState } from "@/components/LoadingState";
import { useLanguage } from "@/components/LanguageProvider";

const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];

export default function PortalPage() {
  const [reservations, setReservations] = useState(null);
  const [error, setError] = useState(null);
  const { t } = useLanguage();
  useEffect(() => { createRenderApiClient().listReservations().then((items) => setReservations(asList(items))).catch((caught) => setError(caught?.code ?? "api.network")); }, []);
  return <section className="workflow-page"><header className="page-heading"><p className="eyebrow">{t("portal.eyebrow")}</p><h1>{t("portal.summaryTitle")}</h1><p>{t("portal.summaryDescription")}</p></header><section className="data-panel"><h2>{t("portal.upcoming")}</h2>{error ? <StatusMessage code={error} /> : null}{reservations === null && !error ? <LoadingState messageKey="loading.summary" /> : null}{reservations?.length === 0 ? <p role="status">{t("portal.noReservations")}</p> : null}{reservations?.slice(0, 3).map((reservation) => <p key={reservation.id}><strong>{reservation.labName ?? reservation.name}</strong> · {reservation.date} · {reservation.startTime}</p>)}<Link className="button is-primary" href="/portal/disponibilidad">{t("portal.checkAvailability")}</Link></section></section>;
}
