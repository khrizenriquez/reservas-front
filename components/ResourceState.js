export function ResourceState({ loading, error, empty, children, onRetry }) {
  if (loading) {
    return (
      <div className="resource-state" aria-live="polite">
        <span className="portal-loading__mark" aria-hidden="true" />
        <p>Cargando información…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="resource-state resource-state--error" role="alert">
        <strong>No pudimos cargar esta información</strong>
        <p>{error}</p>
        {onRetry && <button className="button is-light" type="button" onClick={onRetry}>Reintentar</button>}
      </div>
    );
  }
  if (empty) {
    return (
      <div className="resource-state">
        <strong>Aún no hay información para mostrar</strong>
        <p>Los nuevos registros aparecerán aquí.</p>
      </div>
    );
  }
  return children;
}
