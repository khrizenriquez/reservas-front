# Reservas web product design

Status: **Accepted**  
Decision date: **2026-07-31**

This versioned specification applies the approved decisions from ADR-010 and ADR-011
to the web increment. It is the implementation contract for HU-018 and the web
journeys that consume reservation HUs.

## Product intent

The product should feel like a dependable academic operations desk: calm enough for
daily scheduling, precise enough for administrators, and welcoming enough for a
first-time teacher. It must never resemble an infrastructure console or expose
internal implementation details.

Primary users are visitors, teachers, and administrators. Their highest-frequency
actions are checking availability, creating a reservation, understanding the next
reservation, and reacting to a change. Dense administration and reporting remain
available without dominating the teacher experience.

## Information architecture

| Route | Audience | Purpose |
|---|---|---|
| `/` | Public | Value, three laboratories, process, FAQ, and access CTA |
| `/acceso` | Public | Institutional sign-in |
| `/portal` | Authenticated | Role-aware operational summary |
| `/portal/disponibilidad` | Authenticated | Search free labs and begin a reservation |
| `/portal/reservas` | Authenticated | List, filter, inspect, modify, and cancel |
| `/portal/notificaciones` | Authenticated | Inbox and unread state |
| `/portal/reportes` | Administrator | Summary, exports, and schedules |
| `/portal/administracion` | Administrator | Labs, conditions, users, roles, and audit |
| `/portal/perfil` | Authenticated | Identity, sessions, and sign-out controls |

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

## Responsive behavior

Desktop uses a persistent side navigation inside the portal. Tablet and mobile use a
compact top bar and a controlled navigation drawer. Landing content collapses from
two columns to one. Reservation forms become a single sequence and keep the summary
after the fields instead of pinning it.

## Security and privacy

- Web login sends `clientType: WEB` through Kong.
- Access tokens exist only in the in-memory session provider.
- Refresh is performed using the API HttpOnly cookie plus its CSRF header.
- Every request uses `credentials: include`; no token is written to localStorage,
  sessionStorage, IndexedDB, logs, HTML, or error telemetry.
- UI authorization improves usability but never replaces API RBAC.
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

