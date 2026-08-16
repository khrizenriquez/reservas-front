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
- Credentials model: the published Render v1 schema permits anonymous requests and
  does not document a required cookie session; requests use `credentials: "omit"`.
- Portal access model: `/portal` and all currently implemented child routes are
  direct. The frontend must not introduce a login or role prerequisite while the
  only published backend contract permits anonymous calls.
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
| `/acceso` | Optional | Diagnostic login operation; direct portal entry remains available |
| `/portal` | Direct | Operational summary from published Render data |
| `/portal/disponibilidad` | Direct | Search free labs and begin a reservation |
| `/portal/reservas` | Direct | List, filter, inspect, modify, and cancel |
| `/portal/notificaciones` | Unavailable | No Render v1 operation is published for this surface |
| `/portal/reportes` | Unavailable | No Render v1 operation is published for this surface |
| `/portal/administracion` | Direct | Labs, conditions, users, roles, and audit as published by Render |
| `/portal/perfil` | Direct | Explains that no current identity/profile is published |

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

Color is always paired with text, iconography, or shape. The light theme is the first
release; tokens already reserve a dark theme without making it a release blocker.

### Depth and surfaces

The system uses borders and restrained shadows. Navigation is a solid navy plane;
work areas use paper and white surfaces. Panels are grouped by hierarchy, not by
placing every paragraph in a card. Floating effects are limited to menus, dialogs,
and the sticky reservation summary.

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

## Responsive behavior

Desktop uses a persistent side navigation inside the portal. Tablet and mobile use a
compact top bar and a controlled navigation drawer. Landing content collapses from
two columns to one. Reservation forms become a single sequence and keep the summary
after the fields instead of pinning it.

## Security and privacy

- `/acceso` may call the published login operation, but its result is not retained
  or required by portal routes.
- No token, cookie, refresh flow, CSRF header, localStorage, sessionStorage,
  IndexedDB, logs, HTML, or error telemetry is assumed.
- Every request uses `credentials: "omit"` until Render publishes a different
  authenticated-session contract.
- **Security TODO:** Render v1 must publish and enforce mandatory authentication,
  identity and per-operation authorization. Until then, hiding routes or checking
  a client role would be only cosmetic and is prohibited as a security control.
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
