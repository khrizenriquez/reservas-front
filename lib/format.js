export function toIsoDate(date = new Date()) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function dateAfter(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

export function monthStart() {
  const date = new Date();
  date.setDate(1);
  return toIsoDate(date);
}

export function apiTime(value) {
  return value?.length === 5 ? `${value}:00` : value;
}

export function shortTime(value) {
  return value?.slice(0, 5) ?? "—";
}

export function humanDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-GT", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

export function humanDateTime(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function statusLabel(status) {
  return {
    ACTIVE: "Activa",
    CANCELLED: "Cancelada",
    COMPLETED: "Completada",
    PENDING: "En proceso",
    GENERATED: "Generado",
    FAILED: "Fallido",
  }[status] ?? status;
}
