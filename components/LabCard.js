import { TimeRail } from "@/components/TimeRail";

export function LabCard({ number, name, description, tone }) {
  return (
    <article className={`lab-card lab-card--${tone}`}>
      <div className="lab-card__heading">
        <span className="lab-card__number" aria-hidden="true">
          {number}
        </span>
        <span className="status-pill status-pill--neutral">Reservable</span>
      </div>
      <h3>{name}</h3>
      <p>{description}</p>
      <TimeRail start="07:00" end="22:00" activeStart={Number(number) - 1} activeSpan={1} />
    </article>
  );
}
