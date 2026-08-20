# Weekly Audit Analytics and Admin Users Design

**Branch:** `feature/weekly-logs-users`  
**Status:** proposed  
**Date:** 2026-08-19

## Purpose

Give administrators a focused people-management surface and make the published
Render audit records understandable at a weekly glance. The design keeps the
existing institutional navy, blue, and teal visual language. It uses Bulma for
layout and original React/CSS/SVG components; `@tabler/icons-react` remains the
only Tabler package. Bootstrap, Tabler template source, mock data, and analytics
endpoints are out of scope.

## Contract boundary

Render v1 publishes `GET /api/logs/?UMG_User_ID=<value>` but no date, week, or
server-pagination parameter. The client therefore fetches only that documented
operation, then filters and groups its returned records locally. A period selector
never claims to query a server-side date range.

The user surface consumes the already verified operations:

- `GET /api/usuarios/`
- `POST /api/usuarios/`
- `PATCH /api/usuarios/{id}/inactivar/`
- `PATCH /api/usuarios/{id}/resetear-contrasena/`

No published reactivation operation exists, so the product exposes inactivation,
not a fabricated activation control.

## Logs experience

### Weekly view

The default selection is the calendar Monday–Sunday week containing the latest
timestamp in the loaded Render response. This ensures the first render shows the
latest real activity even when the live API contains historical dates. The full-width
primary panel renders seven weekday bars in Monday-to-Sunday order. A bar includes a
visible count, an accessible textual label, and a restrained entrance transition;
`prefers-reduced-motion` removes the movement.

The visual signature is an **academic activity strip**: quiet navy bars for the
week, with the highest active day raised in institutional teal/blue. It represents a
teaching week rather than a generic dashboard chart. It is accompanied by a textual
weekly total, selected period and explicit empty state, so color is never the sole
carrier of information.

### Period controls and validation

The filter has two modes:

1. **Week** (default): a date selects its containing Monday–Sunday interval.
2. **Custom range**: start and end dates filter the already-loaded records.

Both values must be valid ISO dates, and start cannot be later than end. Invalid
controls display localized, announced inline feedback and retain the prior valid
chart. The current published user-ID query remains explicit and defaults to the
signed-in identity. Loading, error and no-record states are localized.

Module breakdown, daily list and raw paginated records remain below the weekly
panel and derive only from the filtered record set. The period controls do not alter
the raw endpoint contract.

## Users experience

`/portal/usuarios` is a dedicated Admin-only route. Navigation shows it only when
the signed-in identity has administrator role. A professor who manually opens the
URL is redirected to `/portal`, before any user management data is presented.

For administrators, the page reads the real Render user list and displays an
accessible, client-paginated table/cards with name, institutional email, role,
status and actions. The Admin may:

- open a localized modal to create a user with the documented fields;
- reset a selected user’s password using the published operation; and
- inactivate another active user after confirmation.

Self-inactivation is disabled. No update or activation operation is shown because
Render v1 does not publish one. The existing Administration route retains labs,
conditions and audit only; its embedded Users section is removed to make the
ownership of user management unambiguous.

## Component and data boundaries

- `AuditPeriodControls`: owns filter draft values and localized validation.
- `WeeklyActivityChart`: receives normalized daily entries and renders the original
  seven-bar SVG/CSS view. It has no API dependency.
- `LogsPage`: fetches the single published logs operation, normalizes dates once,
  and derives period/module/pagination data with memoized values.
- `UsersPage`: owns only the users read/mutate workflow. It reuses the existing
  `Modal`, `Pagination`, `StatusMessage`, and Render API client.
- `PortalLayout`: contains only role-aware navigation and portal access guard.

## Verification

Unit/rendered tests must prove:

- default weekly grouping, Monday–Sunday order, custom-range filter, invalid range,
  empty interval, accessible labels and reduced-motion-compatible class behavior;
- only the documented logs request is sent;
- admin navigation and user list/create/reset/inactivate paths;
- professor navigation omission and direct-route redirect;
- localized success/error states, pagination, and self-inactivation protection.

Required gates remain `npm run contract`, `npm run check`, `npm run test:jest`,
`npm run release:check`, `npm run build`, local runtime smoke, and the exact-origin
CORS check. Preview validation follows push/PR.

## Scope review

This design does not add an API endpoint, a fake activation action, password
recovery, registration for unauthenticated users, Bootstrap, chart data mocks, or
server-side analytics. It is one focused trunk increment: weekly log presentation
and the dedicated administrator user-management route.
