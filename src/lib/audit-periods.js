const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

const dateAtUtcMidday = (isoDate) => new Date(`${isoDate}T12:00:00Z`);
const isoFromDate = (value) => value.toISOString().slice(0, 10);

export const isIsoDate = (value) => {
  if (!isoDatePattern.test(String(value ?? ""))) return false;
  const date = dateAtUtcMidday(value);
  return !Number.isNaN(date.valueOf()) && isoFromDate(date) === value;
};

export const auditDateFor = (log) => {
  const value = String(log?.createdAt ?? log?.raw?.UMG_Fecha_Registro ?? "").slice(0, 10);
  return isIsoDate(value) ? value : null;
};

export const mondayFor = (isoDate) => {
  if (!isIsoDate(isoDate)) return null;
  const date = dateAtUtcMidday(isoDate);
  const offset = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - offset);
  return isoFromDate(date);
};

export const addDays = (isoDate, days) => {
  const date = dateAtUtcMidday(isoDate);
  date.setUTCDate(date.getUTCDate() + days);
  return isoFromDate(date);
};

export const latestAuditDate = (logs) => logs.reduce((latest, log) => {
  const date = auditDateFor(log);
  return date && (!latest || date > latest) ? date : latest;
}, null);

export const inRange = (logs, start, end) => logs.filter((log) => {
  const date = auditDateFor(log);
  return date && date >= start && date <= end;
});

const countsByDate = (logs) => logs.reduce((counts, log) => {
  const date = auditDateFor(log);
  if (date) counts[date] = (counts[date] ?? 0) + 1;
  return counts;
}, {});

export const weeklyEntries = (logs, monday, weekdayLabels) => {
  const counts = countsByDate(logs);
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(monday, index);
    return { date, label: weekdayLabels[index], count: counts[date] ?? 0 };
  });
};

export const rangeEntries = (logs) => Object.entries(countsByDate(logs))
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([date, count]) => ({ date, label: date, count }));

export const validateAuditPeriod = ({ mode, week, start, end }) => {
  if (mode === "week") return isIsoDate(week) ? null : "logs.invalidWeek";
  if (!isIsoDate(start) || !isIsoDate(end)) return "logs.invalidRange";
  return start > end ? "logs.invalidRangeOrder" : null;
};
