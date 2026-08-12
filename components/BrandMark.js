export function BrandMark({ compact = false }) {
  return (
    <span className={`brand-mark${compact ? " brand-mark--compact" : ""}`} aria-label="Reservas UMG">
      <span className="brand-mark__symbol" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      {!compact && (
        <span className="brand-mark__text">
          <strong>Reservas</strong>
          <small>Laboratorios UMG</small>
        </span>
      )}
    </span>
  );
}
