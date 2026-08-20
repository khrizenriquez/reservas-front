# Reservas web product design

Status: **Accepted**  
Decision date: **2026-07-31**

This versioned specification applies the approved decisions from ADR-010 and ADR-011
to the web increment. It is the implementation contract for HU-018 and the web
journeys that consume reservation HUs.

## Implementation baseline

- Framework: Next.js (App Router)
- UI runtime: React
- Language baseline: JavaScript
- Styling baseline: Bulma CSS
- Hosting baseline: Vercel (free tier) as primary target

This specification does not define a pure React-only baseline. The default implementation is Next.js + React + Bulma.

## Deployment baseline

- The frontend must be deployable to Vercel free tier without functional regressions.
- Branch/PR preview deployments should be enabled to validate UI and API connectivity before merge.
- Production and preview must use distinct environment variable scopes.
- API base URL must be configurable at deploy time.

## Integration constraints

- API style: REST only, aligned to the Render v1 schema and `specs/api-contract.json` / `specs/contracts/render-v1-openapi.yaml`.
- HTTP client: native `fetch` with `async/await`.
- `axios` is not part of the approved baseline.
- Credentials model: `/acceso` validates credentials only through the published
  `POST /api/auth/login/` operation. The UI keeps a normalized identity in
  tab-scoped `sessionStorage`; no password, token, cookie, or refresh flow is kept.
- Portal access model: `/portal` and its implemented child routes require that UI
  session. There is no public registration or password-recovery journey. The UI
  role gate is an experience control, not a replacement for Render authorization.
- Dependency minimization is mandatory; add libraries only when native/framework options are insufficient.

## CORS constraints

- The client uses the anonymous alternative published by Render v1 and sends no
  browser credentials, so Render's `Access-Control-Allow-Origin: *` is valid for
  this integration.
- Supported methods must cover the contract set (`GET`, `POST`, `PUT`, `PATCH`, `OPTIONS`).
- Allowed headers must include `Content-Type`; CSRF and idempotency headers are not
  sent unless Render first publishes a matching contract.
- If Render later publishes a required credentialed session, this specification and
  the CORS policy must change together before the client adopts it.

## Optional libraries policy

- `zustand` may be used only for cross-route client state that cannot be managed cleanly with route-local state/context.
- `zod` may be used for runtime payload/form validation when schema complexity warrants explicit parsing.
- Any adoption of optional libraries must be mapped to acceptance scenarios and covered by tests.

## Product intent

The product should feel like a dependable academic operations desk: calm enough for
daily scheduling, precise enough for administrators, and welcoming enough for a
first-time teacher. It must never resemble an infrastructure console or expose
internal implementation details.

Primary users are visitors, teachers, and administrators. Their highest-frequency
actions are checking availability, creating a reservation, understanding the next
reservation, and reacting to a change. Dense administration and reporting remain
available without dominating the teacher experience.

## Visual reference direction

- Dashboard/forms interaction language should follow a Vuexy-style enterprise feel.
- Landing composition should follow a Crafto-style premium visual rhythm.
- Reference style must be interpreted and implemented with original project-owned code.

## Media direction

Approved baseline imagery references:

- https://umg.edu.gt/img/admisiones/guatemala.webp
- https://umg.edu.gt/img/admisiones/Edificio_medicina-odontologia.webp
- https://umg.edu.gt/img/cu/centros-universitarios-t.webp

## Information architecture

| Route | Audience | Purpose |
|---|---|---|
| `/` | Public | Value, three laboratories, process, FAQ, and access CTA |
| `/acceso` | Public | Required Render login; no public registration or password recovery |
| `/portal` | Authenticated UI | Operational summary from published Render data |
| `/portal/disponibilidad` | Authenticated UI | Search free labs and begin a reservation |
| `/portal/reservas` | Authenticated UI | Paginated list, filter, inspect, create, modify, and cancel; professors only mutate their own future reservations |
| `/portal/notificaciones` | Unavailable | No Render v1 operation is published for this surface |
| `/portal/reportes` | Unavailable | No Render v1 operation is published for this surface |
| `/portal/administracion` | Authenticated UI | Laboratories, conditions, and audit review; only administrators create/edit laboratories or conditions |
| `/portal/usuarios` | Administrator UI | Real user list with client pagination and documented create, reset-password, and inactivate actions; hidden from professors and direct access redirects to `/portal` |
| `/portal/logs` | Authenticated UI | Audit dashboard and paginated list from `GET /api/logs/?UMG_User_ID=<value>`; defaults to the signed-in ID and locally groups returned records by week or a validated date range |
| `/portal/perfil` | Authenticated UI | Shows the session identity and changes only its own password |

## Visual system

### Palette

- Academic navy `#17355F`: primary navigation and strong headings.
- Reservation blue `#2376A8`: interactive controls and time rails.
- Signal teal `#148A7B`: available and successful states.
- Amber `#D9921E`: pending attention and selected time markers.
- Ink `#1D2A36`: body text.
- Paper `#F4F1E8`: warm application canvas.
- Surface `#FFFFFF`: content panels.
- Border `#D8DFE5`: structural separation.
- Danger `#B74343`: destructive and error states.

Color is always paired with text, iconography, or shape. Light and dark are both
supported releases: dark uses near-black blue canvas, layered blue surfaces, elevated
cards and high-contrast text rather than a simple inverted palette.

### Depth and surfaces

The system uses borders and restrained shadows. Navigation is a solid navy plane;
work areas use paper and white surfaces. Panels are grouped by hierarchy, not by
placing every paragraph in a card. Floating effects are limited to menus, dialogs,
cards and the sticky reservation summary. Changes in theme, hover elevation and
dialog reveal use transform, opacity, shadow and color with a restrained spring-like
curve; they reduce to effectively no motion for `prefers-reduced-motion`.

### Typography and spacing

Headings use a scholarly serif stack; interface text uses a highly legible system
sans stack. The spacing base is 4 px with a normal control rhythm of 8/12/16/24/32.
Primary page titles use 36 px on desktop and 30 px on compact screens. Touch targets
are at least 44 px.

### Signature element

The recurring visual signature is the **laboratory time rail**: a compact schedule
line with half-hour ticks, an availability band, and a clearly shaped active slot.
It appears in the landing preview, availability results, reservation detail, and the
mobile theme. It conveys the product domain without decorative illustration.

## Component rules

- Bulma supplies layout, forms, buttons, menus, notifications, and responsive helpers.
- Product components add domain behavior: `TimeRail`, `LabAvailabilityCard`,
  `ReservationSummary`, `StatusTag`, and `SessionList`.
- Forms keep visible labels, help text, and field-level errors. Submission errors use
  API problem `code`, never string comparison.
- Tables are reserved for genuinely comparative administrative information. Compact
  screens switch to labeled rows instead of horizontal overflow where practical.
- Loading, empty, error, offline, forbidden, and success states are designed for each
  data surface.
- API 4xx/5xx failures must resolve to friendly user copy (not raw backend detail text).
- Client-side collections show 10 records by default and let people choose 10, 20 or
  50 per page. The active page must remain valid when data changes.
- Dialogs use `role="dialog"`, `aria-modal`, a visible heading, `Escape`, backdrop
  dismissal when safe, focus restoration and localized close/cancel controls.

## Responsive behavior

Desktop uses a persistent side navigation inside the portal. Tablet and mobile use a
compact top bar and a controlled navigation drawer. Landing content collapses from
two columns to one. Reservation forms become a single sequence and keep the summary
after the fields instead of pinning it.

## Security and privacy

- `/acceso` requires the published login operation before portal navigation. Its
  session holds only identity metadata in `sessionStorage` for the current tab.
- No password, token, cookie, refresh flow, CSRF header, localStorage, IndexedDB,
  logs, HTML, or error telemetry is assumed.
- Every request uses `credentials: "omit"` until Render publishes a different
  authenticated-session contract.
- **Security TODO:** Render v1 must enforce identity and per-operation
  authorization. The login/session and client role rules improve the UI but are not
  a security control while Render still accepts anonymous calls.
- No demo account, password, internal hostname, push endpoint, or personal data is
  embedded in source.

## PWA and offline behavior

The manifest and service worker cache only the public/static shell. Previously read
views may remain visible with an explicit stale/offline banner. Creating, modifying,
or cancelling a reservation is disabled while offline and is never queued for later.
Reconnection triggers revalidation.

## Accessibility acceptance

- WCAG 2.2 AA contrast for core journeys.
- Visible focus and complete keyboard navigation.
- One `h1` and landmark structure per page.
- Inputs have programmatic labels, descriptions, and error associations.
- Status is never communicated by color alone.
- Motion respects `prefers-reduced-motion`.

## Language and localization

- Default language is Spanish.
- English must be selectable through visible language controls.
- Error, validation, and status messages must be localized.
- All static interface copy, including labels, buttons, loading states and ARIA
  text, lives in the ES/EN i18n configuration. API/database values and URLs are
  intentionally not translated.
- The interface supports a persistent light/dark theme; the first visit follows
  the browser preference and every async route/data flow announces loading.
