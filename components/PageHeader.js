export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <header className="portal-page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="portal-page-header__action">{action}</div>}
    </header>
  );
}

