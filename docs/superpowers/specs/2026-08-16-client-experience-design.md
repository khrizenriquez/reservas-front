# Client pagination, audit dashboard, and premium theme design

## Context

Render v1 exposes `GET /api/logs/`, but its live implementation returns HTTP 403
unless the documented `UMG_User_ID` query parameter is supplied. The checked-in
schema marks that parameter optional, so the client currently omits it and
incorrectly renders a friendly API error. A live request for user `1` returns 100
audit records with action, module, description, and timestamp fields.

Long client-side lists also make the operational routes difficult to scan. The
published API does not expose pagination, so list presentation must paginate the
already-received records without inventing a server parameter or endpoint.

## Decisions

- `listAuditLogs({ userId })` serializes only the published query key
  `UMG_User_ID`; it has no default identity.
- The Logs route presents an explicit, localized user-id field. It initially uses
  `1` as the publicly verified example value and requires a value before fetching.
  This is a query input, not authentication, identity persistence, or access
  control.
- A reusable client `Pagination` component shows ten records initially, allows
  10, 20, or 50 records per page, and resets the active page when its items or
  page size changes. Every list page uses it after its existing filters.
- A reusable accessible `Modal` component replaces long inline admin and
  reservation forms/detail/confirmation surfaces. It supports `Escape`, backdrop
  close where safe, focus restoration, labelled dialog semantics, and reduced
  motion.
- `/portal/logs` adds local-only audit summaries: total records, distinct modules,
  most frequent action, activity grouped by module, and activity grouped by day.
  It derives all values from the received records and makes no extra API calls.
- The dark theme receives semantic surface, elevation, text, accent, and focus
  tokens. Shared transitions use opacity, transform, shadow, and color only;
  they are disabled for `prefers-reduced-motion` and never block input.

## Visual direction

The portal keeps its academic character but uses quieter near-black blue surfaces,
layered panels, restrained translucent highlights, and spring-like easing. Motion
is purposeful: route/card entrance, control hover, dialog reveal, and selected
pagination state. It avoids decorative looping motion and Apple branding/assets.

## Acceptance evidence

1. A Logs request contains `?UMG_User_ID=<entered value>` and succeeds against
   the verified Render example; a missing value is localized and makes no request.
2. Audit cards and summaries preserve the API data and expose action/module/date
   information without a new backend operation.
3. Each data list exposes exactly 10 initial records and supports 10/20/50 page
   sizes with keyboard-accessible page navigation.
4. Forms and destructive confirmations are usable in labelled keyboard-accessible
   dialogs, with localized static text.
5. The premium dark appearance preserves contrast, visible focus, and reduced
   motion behavior.
6. Jest coverage remains above 80%, contract/lint/test/build gates pass, and the
   README, product design, traceability, and todo list record the change.
