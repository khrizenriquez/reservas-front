# Delivery Todo List

## Fixed decisions

- The only backend is Render v1: `https://umg-api-django.onrender.com`.
- The only permitted API paths are the published `/api/*` operations in
  `https://umg-api-django.onrender.com/api/schema/?format=json`, captured in
  `specs/contracts/render-v1-openapi.yaml`.
- There is one API profile only: Render v1. Do not create client substitutes for
  absent API operations.
- Next.js App Router + React + JavaScript + Bulma + native `fetch` are required.

## Execution rule for every item

1. Start from an updated `main` on a new `feature/<scope>` or `fix/<scope>` branch.
2. Complete only that item, with the listed tests and acceptance mappings.
3. Run `npm run contract`, `npm run check`, and `npm run test:jest` once those commands exist; deployment items also record `npm run contract:live` and the exact-origin CORS check.
4. Commit with a short native-English message, open a PR, and validate its preview where the item affects the deployable app.
5. Merge only when green, delete the branch, update local `main`, then create the branch for the next item.

No item is complete without tests, traceability, and passing quality gates.

## Current status and important notes

- **Completed:** 16 of 17 delivery items; the active item is the Vercel release.
- **Backend boundary:** Render v1 is the only supported API. No client flow may
  depend on endpoints that its published schema does not expose.
- **Runtime configuration:** Podman creates `runtime-config.js` at startup;
  `NEXT_PUBLIC_API_BASE_URL` is a public URL, never a secret.
- **Known product gaps:** reports and notifications remain non-data-backed until
  Render publishes matching operations. Reservation idempotency must be verified
  with Render before HU-018-S04 can be marked complete.
- **CORS decision:** Render v1 publishes an anonymous security alternative and
  responds with wildcard CORS. The client therefore uses `credentials: "omit"`;
  it must not add cookies, token storage, refresh or an API proxy unless Render
  first publishes that contract.
- **Required closure:** every completed item has its own merged PR; quality gates
  remain contract, lint, Jest coverage over 80%, and production build.
- **Local workflow evidence:** `feature/local-full-workflow` verifies the rendered
  flows through local `fetch` interception. This is not a substitute API and does
  not create, change, or cancel records on Render; a live mutation run still
  requires an explicitly authorized test account and disposable records.

## Ordered delivery steps

- [x] **01 — `feature/governance-render-v1`: lock Render v1 as the sole contract.** The docs and contract manifest now use the published Render schema and `render-v1-openapi.yaml`; absent endpoints are not substituted. Reports and notifications cannot make data requests until Render publishes matching operations. The documentation PR must validate every referenced local path and the published schema.
- [x] **02 — `feature/next-scaffold`: create the executable foundation.** Next.js App Router in JavaScript, Bulma, the approved folder boundaries, `.env.example`, linting, Jest, coverage threshold (>80%), and scripts `contract`, `check`, and `test:jest` are configured. The root route has a rendered-route test and the production build passes.
- [x] **03 — `feature/render-contract-gate`: verify the Render v1 contract.** A dependency-free verifier checks the committed snapshot hash and required `/api/*` operations against the Render schema. Fixtures and unit tests cover matching, missing, and drifted operations; it validates only Render v1.
- [x] **04 — `feature/render-api-client`: build the API boundary.** A native-`fetch` client implements only published Render operations, normalizes API records, and maps transport/4xx/5xx failures to localized error keys. Tests cover methods, URLs, bodies, query parameters, network failures, and status mappings. Maps CST-001, CST-002, and CST-011.
- [x] **05 — `feature/podman-runtime`: enable reproducible local startup.** A Podman-compatible multi-stage Containerfile, `compose.yaml`, runtime configuration, and runbook are available. The image was built and validated on port 3000 with a configurable Render base URL and clean shutdown.
- [x] **06 — `feature/ui-foundation`: implement the shared visual system.** Shared tokens, reduced-motion support, visible focus, ES/EN provider and selector, and localized accessible status/error states are implemented and tested. Maps HU-018-S08 and CST-011/012.
- [x] **07 — `feature/public-landing`: deliver `/`.** The original institutional landing includes approved imagery, three laboratory explanations, reservation process, FAQ, responsive layout, visible language control, and access CTA. Tests cover HU-018-S01 landmarks and CTA.
- [x] **08 — `feature/render-login`: deliver `/acceso` using Render login.** `/acceso` uses only `POST /api/auth/login/`; invalid credentials were verified against Render as HTTP 401. The form has loading, localized error and successful-response states; no token, refresh, logout or guessed endpoint was added. The eventual authenticated portal session remains constrained to verified Render behavior. Maps HU-018-S02.
- [x] **09 — `feature/portal-shell`: deliver authenticated shell and profile.** `/portal` and `/portal/perfil` use only the successful Render-login response held in memory. The shell guards unauthenticated access and offers responsive navigation/language control; no token persistence is used.
- [x] **10 — `feature/lab-availability`: deliver availability search.** `/portal/disponibilidad` uses `GET /api/labs/disponibles/` with `fecha`, `hora_inicio`, and `hora_fin`, with tested free, empty and localized network-error states. Maps HU-018-S03.
- [x] **11 — `feature/reservation-create`: create reservations safely.** `/portal/reservas` sends only the documented Render payload and has a tested confirmation state. Render does not publish idempotency-key support, so duplicate prevention and full HU-018-S04 acceptance remain a documented backend contract gap.
- [x] **12 — `feature/reservation-management`: manage owned future bookings.** Reservations are loaded from Render and cancellation requires explicit browser confirmation before its published PATCH operation. Full ownership/future-state enforcement remains dependent on the response data supplied by Render.
- [x] **13 — `feature/admin-render`: implement contract-backed administration.** The administration surface reads labs, conditions, users and audit through published Render operations. Reports and notifications remain excluded because Render exposes no matching operations.
- [x] **14 — `feature/pwa-offline`: add safe PWA behavior.** The public-shell manifest and service worker cache only the public route; an accessible localized offline notice is shown, reservations revalidate on reconnect, and create/cancel controls are hard-disabled offline. Tests prove no mutation is queued or sent while offline. Maps HU-018-S07.
- [x] **15 — `feature/local-acceptance`: validate the local application first.** The local runtime now serves its config and public/access/portal routes, the Render CORS check passes for `http://127.0.0.1:3000`, and contract/lint/Jest/build gates pass. The client uses Render's anonymous published contract with `credentials: "omit"`; a reviewer can exercise a real institutional account without adding a proxy, token storage or substitute API.
- [x] **16 — `feature/local-full-workflow`: complete locally verifiable Render v1 workflows.** The API client now maps every published mutation to its documented body; availability transfers an available lab and its selected interval to the reservation form; reservations list/filter/inspect/create/modify/cancel only the active user's future records; and administration lists and manages labs, conditions, users, and audit data for an administrator. Jest covers the rendered operations, errors, confirmation and offline safety with global coverage above 80%; `contract`, `check`, and production `build` pass. Tests intercept `fetch` locally and production requests remain direct Render v1 calls.
- [ ] **17 — `fix/vercel-contract-build`: deploy and close evidence.** Vercel build configuration, Next.js security headers, environment instructions, CORS validator, traceability matrix, and release-evidence template are prepared. The former build-time Render schema timeout is corrected by a deterministic snapshot gate plus separate live-schema evidence, Jest explicitly runs in its test runtime despite Vercel's production build environment, Node 22.x is pinned, and standalone output is isolated to Podman so Vercel can use its native adapter. It remains open until a green Vercel Preview and a Production redeploy pass the anonymous Render CORS check plus accessibility/PWA walkthroughs.
