export function TimeRail({ start, end, activeStart = 0, activeSpan = 1, label = "Intervalo seleccionado" }) {
  const ticks = [0, 1, 2, 3, 4];

  return (
    <div className="time-rail" role="img" aria-label={`${label}: ${start} a ${end}`}>
      <div className="time-rail__labels" aria-hidden="true">
        <span>{start}</span>
        <span>{end}</span>
      </div>
      <div className="time-rail__track" aria-hidden="true">
        {ticks.map((tick) => (
          <span className="time-rail__tick" key={tick} />
        ))}
        <span
          className="time-rail__active"
          style={{ "--rail-start": activeStart, "--rail-span": activeSpan }}
        />
      </div>
    </div>
  );
}
