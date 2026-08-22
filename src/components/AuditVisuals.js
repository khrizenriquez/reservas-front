"use client";

import { IconActivity, IconChartBar, IconFingerprint } from "@tabler/icons-react";

const chartPoints = (entries, width = 560, height = 150) => {
  const maximum = Math.max(...entries.map(([, count]) => count), 1);
  const step = entries.length > 1 ? width / (entries.length - 1) : width;
  return entries.map(([, count], index) => `${index * step},${height - ((count / maximum) * (height - 18)) - 9}`).join(" ");
};

export function AuditTrend({ entries, label }) {
  const points = chartPoints(entries);
  return <div className="audit-chart" role="img" aria-label={label}><svg viewBox="0 0 560 150" preserveAspectRatio="none" aria-hidden="true"><path className="audit-chart-grid" d="M0 25H560M0 75H560M0 125H560" /><polyline className="audit-chart-line" points={points} /><polyline className="audit-chart-area" points={`0,150 ${points} 560,150`} /></svg><div className="audit-chart-labels">{entries.map(([day, count]) => <span key={day}><small>{day}</small><strong>{count}</strong></span>)}</div></div>;
}

export function ModuleBars({ entries, label }) {
  const maximum = Math.max(...entries.map(([, count]) => count), 1);
  return <div className="audit-bars" role="img" aria-label={label}>{entries.map(([module, count]) => <div className="audit-bar-row" key={module}><span>{module}</span><div aria-hidden="true"><i style={{ width: `${(count / maximum) * 100}%` }} /></div><strong>{count}</strong></div>)}</div>;
}

export function AuditMetric({ icon: Icon, label, value }) {
  return <article className="audit-metric"><span className="audit-metric-icon" aria-hidden="true"><Icon size={20} stroke={1.8} /></span><span>{label}</span><strong>{value}</strong></article>;
}

export function WeeklyActivityChart({ entries, label }) {
  const maximum = Math.max(...entries.map((entry) => entry.count), 1);
  const description = entries.map((entry) => `${entry.label} ${entry.count}`).join(", ");
  return <div className="weekly-activity-chart" role="img" aria-label={`${label}: ${description}`}>
    <div className="weekly-activity-bars" aria-hidden="true">{entries.map((entry) => <div className={`weekly-activity-day${entry.count === maximum && entry.count > 0 ? " is-peak" : ""}`} key={entry.date}><strong>{entry.count}</strong><span><i style={{ "--activity-height": `${Math.max((entry.count / maximum) * 100, entry.count ? 10 : 2)}%` }} /></span><small>{entry.label}</small></div>)}</div>
  </div>;
}

export function OperationalGauge({ label, value, total, description, summary }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const accessibleSummary = `${summary ?? `${label}: ${value}/${total} (${percentage}%)`}${description ? `. ${description}` : ""}`;
  return <article className="operational-gauge" role="img" aria-label={accessibleSummary}>
    <p>{label}</p><div className="operational-gauge-dial" aria-hidden="true" style={{ "--gauge-progress": `${percentage * 3.6}deg` }}><div><strong>{percentage}%</strong><span>{value}/{total}</span></div></div>{description ? <small>{description}</small> : null}
  </article>;
}

export function OperationalBars({ entries, label, emptyLabel }) {
  const maximum = Math.max(...entries.map(([, count]) => count), 1);
  const description = entries.length ? entries.map(([name, count]) => `${name} ${count}`).join(", ") : emptyLabel;
  return <div className="operational-bars" role="img" aria-label={`${label}: ${description}`}>{entries.length ? entries.map(([name, count]) => <div className="operational-bar-row" key={name}><span>{name}</span><div aria-hidden="true"><i style={{ width: `${(count / maximum) * 100}%` }} /></div><strong>{count}</strong></div>) : <p>{emptyLabel}</p>}</div>;
}

export const auditIcons = { total: IconActivity, modules: IconChartBar, action: IconFingerprint };
