# Local full workflow design

## Goal and boundary

This delivery makes the existing application routes demonstrably usable locally
for every published Render v1 operation that has a matching product surface:
availability, reservations, and administration. The production application
continues to call `https://umg-api-django.onrender.com` directly with native
`fetch`, `credentials: "omit"`, and only the paths in
`specs/contracts/render-v1-openapi.yaml`.

Local tests intercept `fetch` at the client boundary. They verify rendered
user actions, method, path, query, and published request payload without
creating, changing, or cancelling data on Render. This is a test technique,
not a proxy, mock server, alternative API, or runtime data source.

Reports and notifications are outside this delivery because Render v1 does not
publish operations to back them. Profile remains an in-memory representation
of the verified login response because no current-user/profile operation is
published.

## User experience

`/portal/disponibilidad` keeps the documented date-and-time search and renders
available labs as accessible result cards. Selecting a result opens the
reservation screen with the lab and searched schedule prefilled; the user can
still enter the documented reason before creation.

`/portal/reservas` lists the authenticated user's published reservation data,
with documented lab/date filters, status, empty/loading/error states, and
accessible actions. A user can create, edit, and cancel an owned future
reservation. Edit uses only `UMG_User_ID`, `UMG_Lab_ID`,
`UMG_Fecha_Reserva`, `UMG_Hora_Inicio`, `UMG_Hora_Fin`, and `UMG_Motivo` from
the published modify example. Cancellation keeps an explicit confirmation and
sends only the published optional requester field. All mutations are disabled
offline and the list reloads from Render after a successful mutation.

`/portal/administracion` is shown by the navigation only when the in-memory
login response identifies an administrator. It renders real lists for labs,
conditions, users, and audit logs rather than counters. It supports the
published create/update flows for labs and conditions, user creation,
inactivation, and password reset. Form fields are limited to the fields in the
published request examples; no guessed roles, endpoints, or account flows are
introduced. The page does not pretend that client visibility is authorization:
Render remains the authority for each request.

## Client and state design

The API client gains operation-specific payload mappers for every mutation and
normalizes list and object responses consistently. Invalid or non-JSON server
responses become a `RenderApiError` with a localized friendly code. Page state
is route-local: a successful mutation updates the visible list from the
returned record when available and otherwise reloads its documented list
operation. No mutable data is persisted in storage.

The login session is normalized from the successful Render record while
retaining the raw record only in React memory. The normalized fields used by
the portal are `id`, `name`, `roleId`, and `roleName`; absent role information
does not reveal administration navigation.

Every data surface has a visible loading, empty, successful, and friendly API
error state. Labels, error announcements, and controls remain keyboard
accessible. Existing Spanish/English error handling is reused and expanded
only for new user-facing state.

## Verification matrix

| Surface | Local evidence |
| --- | --- |
| Render client | Unit tests assert all mutating methods, URLs, query values, documented payloads, response normalization, malformed responses, and error mapping. |
| Availability | UI tests cover search, available/empty/error states, and transfer of a selected result to the reservation form. |
| Reservations | UI tests cover list/filter, create, edit, cancel confirmation, refetch/update behavior, friendly errors, and offline mutation prevention. |
| Administration | UI tests cover visible records, create/edit lab and condition flows, create/inactivate/reset user flows, audit rendering, errors, and role-aware navigation. |
| Application | Jest global coverage remains above 80%; contract, lint, build, local runtime smoke, and Render CORS gates pass. |

## Explicit limitations

The published schema does not expose an idempotency-key field, a current-user
endpoint, role management, reports, notifications, or a test tenant. The UI
does not manufacture those capabilities. A later, separately authorized run
against Render can validate mutations only with a supplied test account and
disposable record identifiers.
