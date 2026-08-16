"use client";

import Link from "next/link";
import { useState } from "react";
import { createRenderApiClient } from "@/services/render-api";
import { StatusMessage } from "@/components/StatusMessage";
import { LoadingState } from "@/components/LoadingState";
import { useLanguage } from "@/components/LanguageProvider";

const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];

export default function AvailabilityPage() {
  const [labs, setLabs] = useState(null);
  const [criteria, setCriteria] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const submit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextCriteria = { fecha: form.get("fecha"), hora_inicio: form.get("hora_inicio"), hora_fin: form.get("hora_fin") };
    setLoading(true); setError(null);
    try { setLabs(asList(await createRenderApiClient().getLabAvailability(nextCriteria))); setCriteria(nextCriteria); }
    catch (caught) { setError(caught?.code ?? "api.network"); setLabs(null); }
    finally { setLoading(false); }
  };
  return <section className="workflow-page"><header className="page-heading"><p className="eyebrow">{t("availability.eyebrow")}</p><h1>{t("availability.title")}</h1><p>{t("availability.description")}</p></header><form onSubmit={submit} className="workflow-form availability-form"><label>{t("availability.date")}<input name="fecha" type="date" required /></label><label>{t("availability.start")}<input name="hora_inicio" type="time" required /></label><label>{t("availability.end")}<input name="hora_fin" type="time" required /></label><button className="button is-primary" disabled={loading}>{loading ? t("availability.searching") : t("availability.submit")}</button></form>{loading ? <LoadingState messageKey="availability.searching" /> : null}{error ? <StatusMessage code={error} /> : null}{labs?.length === 0 ? <p role="status">{t("availability.empty")}</p> : null}{labs?.length > 0 ? <ul aria-label={t("availability.list")} className="record-list availability-list">{labs.map((lab) => { const query = new URLSearchParams({ labId: lab.id, date: criteria.fecha, startTime: criteria.hora_inicio, endTime: criteria.hora_fin }); return <li key={lab.id} className="record-card"><div><strong>{lab.name}</strong><span className="status-tag available">{t("availability.available")}</span></div><Link className="button is-primary is-small" href={`/portal/reservas?${query.toString()}`}>{t("availability.reserve")}</Link></li>; })}</ul> : null}</section>;
}
