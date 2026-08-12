export function SectionHeading({ eyebrow, title, description, id, compact = false }) {
  return (
    <div className={`section-heading${compact ? " section-heading--compact" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
