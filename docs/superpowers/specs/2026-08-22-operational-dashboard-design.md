# Operational Dashboard and Entity IDs Design

**Branch:** `feature/operational-dashboard`
**Status:** accepted
**Date:** 2026-08-22

## Purpose

Make the administrator-facing information easier to operate without presenting
infrastructure telemetry that the Reservations UMG API does not expose. The
dashboard will use the dark, high-density visual rhythm of the approved Grafana
references, while retaining original Bulma/React/CSS components and the
institutional visual system.

The increment also makes published identifiers visible wherever an administrator
needs them to operate the system: institutional users and laboratories.

## Contract boundary

All values are fetched from published Render v1 operations only:

- `GET /api/logs/?UMG_User_ID=<value>`
- `GET /api/labs/`
- `GET /api/condiciones/`
- `GET /api/reservas/`
- `GET /api/usuarios/` for the administrator-only users breakdown

Render v1 does not publish CPU, memory, disk, network, uptime, pod, database, or
host metrics. The dashboard must not display, estimate, or label any such value.
No analytics endpoint, server-side date range, API pagination, mock record, or
new dependency is introduced.

## Entity identifiers

### Institutional users

`/portal/usuarios` gains a localized `ID de usuario` / `User ID` table column.
The cell renders the normalized `id`, which comes from Render's `UMG_ID`. The
identifier is presented as read-only operational reference data; it is not edited,
used as a password substitute, or exposed to Professor UI because that route
already redirects non-administrators before requesting the user list.

### Laboratories

The laboratories list in `/portal/administracion` shows a localized `ID de
laboratorio` / `Lab ID` label beside each laboratory name, using the normalized
Render `UMG_ID`. The existing condition and reservation forms keep the published
lab-ID input semantics. No synthetic lab code is created.

## Operational dashboard

`/portal/logs` keeps its full-width **Actividad por semana** panel as the primary
view. Its period controls still filter only the already returned audit records.
Under it, a Grafana-inspired *operational overview* renders data-dense cards and
original visualizations organized by source. The visual language uses compact
panel headers, clear values, restrained gauges/progress arcs, and color supported
by labels and numerical values. It is not a copy of Grafana source or styling.

### Period-dependent audit panels

These panels use the currently selected local Logs period:

| Panel | Real calculation |
|---|---|
| Activity records | Number of returned log records in the selected week/range. |
| Active modules | Count of distinct `UMG_Modulo` values in that period. |
| Main action | Most frequent returned `UMG_Accion` in that period. |
| Activity by module | Existing proportional module bars, filtered to the selected period. |
| Activity by day | Existing selected-period daily sequence. |

### Project resource panels

When an administrator opens Logs, the page independently loads labs, conditions,
reservations, and users. It shows the following factual project measures:

| Panel | Source and calculation |
|---|---|
| Laboratories available to operate | `GET /api/labs/`: active labs / total labs. |
| Conditions active | `GET /api/condiciones/`: active conditions / total conditions. |
| Reservations by status | `GET /api/reservas/`: counts grouped by its published status field. |
| Reservation load by laboratory | `GET /api/reservas/`: counts grouped by published lab name, with an explicit fallback only when Render omits the name. |
| Accounts by role | `GET /api/usuarios/`: counts grouped by published role. |
| Accounts active | `GET /api/usuarios/`: active users / total users. |

The user panels are Admin-only. Professor users retain Logs' own audit view and
period analytics, but the page neither requests `/api/usuarios/` nor displays user
counts, names, or roles for them. The UI role boundary remains a product control,
not server authorization while Render permits anonymous access.

Each source gets its own loading, error, and no-data state. A failure in resources
does not prevent audit records or their weekly chart from rendering. API error
messages and states are localized in Spanish and English and announced accessibly.

## Component boundaries

- `operational-metrics.js`: pure data functions to normalize status, group entity
  records, calculate ratios, and create chart entries. It owns no fetching or UI.
- `OperationalGauge`: original accessible circular/proportional indicator for a
  named project ratio. It receives a label, actual numerator/denominator, and
  optional explanatory description.
- `OperationalBars`: original accessible ranked bars for reservations by lab and
  users by role. It accepts precomputed entries only.
- `LogsPage`: keeps its documented logs request and local period filter. It owns
  independent resource fetching and composes the dashboard panels.
- `UsersPage` and `AdminPage`: present real normalized IDs; they do not duplicate
  dashboard aggregation or fetch unrelated data.

## UX and responsive behavior

Panels use a responsive grid: compact numeric cards on narrow screens and a
multi-column dashboard on larger screens. Numeric values, labels, and textual
summaries remain available even when a visual chart is read by assistive
technology. Motion is limited to entrance/progress transitions and is removed by
the existing `prefers-reduced-motion` rule.

## Verification and acceptance evidence

Tests must cover:

- user and laboratory IDs rendered from normalized real-record shapes;
- no resource-list request outside the published operations;
- administrator loads resource and user aggregations while Professor does not
  request or render users;
- correct active/total ratios and groupings for labs, conditions, reservations,
  and users;
- selected Logs period continues to affect only audit-derived panels;
- independent loading, empty, and localized error states;
- accessible chart labels and reduced-motion-safe markup.

Required release evidence remains the deterministic contract/lint/Jest gates
above 80% coverage, `npm run contract:live`, release configuration, production
build, local route smoke, and the Vercel Preview after push.

## Scope review

This increment adds no observability backend, no CPU/RAM/server simulation, no
new API contract, no server-side analytics, no mock data, no Bootstrap, and no
new third-party dependency. It is focused on project-level operational data and
published entity identifiers.
