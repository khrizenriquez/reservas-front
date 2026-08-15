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
3. Run `npm run contract`, `npm run check`, and `npm run test:jest` once those commands exist; add the item-specific validation below.
4. Commit with a short native-English message, open a PR, and validate its preview where the item affects the deployable app.
5. Merge only when green, delete the branch, update local `main`, then create the branch for the next item.

No item is complete without tests, traceability, and passing quality gates.

## Ordered delivery steps

- [x] **01 — `feature/governance-render-v1`: lock Render v1 as the sole contract.** The docs and contract manifest now use the published Render schema and `render-v1-openapi.yaml`; absent endpoints are not substituted. Reports and notifications cannot make data requests until Render publishes matching operations. The documentation PR must validate every referenced local path and the published schema.
- [x] **02 — `feature/next-scaffold`: create the executable foundation.** Next.js App Router in JavaScript, Bulma, the approved folder boundaries, `.env.example`, linting, Jest, coverage threshold (>80%), and scripts `contract`, `check`, and `test:jest` are configured. The root route has a rendered-route test and the production build passes.
- [x] **03 — `feature/render-contract-gate`: verify the Render v1 contract.** A dependency-free verifier checks the committed snapshot hash and required `/api/*` operations against the Render schema. Fixtures and unit tests cover matching, missing, and drifted operations; it validates only Render v1.
- [ ] **04 — `feature/render-api-client`: build the API boundary.** Create the configured native-`fetch` client, operation methods for the published Render API, UI mappers, request validation, and a localized normalized-error model. Test methods, URLs, bodies, query parameters, network failures, and 4xx/5xx mappings. Map CST-001, CST-002, and CST-011.
- [ ] **05 — `feature/podman-runtime`: enable reproducible local startup.** Add a Podman-compatible Containerfile, `compose.yaml`, runtime environment handling, health check, and runbook. Verify `podman compose up --build`, port 3000, shutdown, and configurable Render base URL.
- [ ] **06 — `feature/ui-foundation`: implement the shared visual system.** Add original Bulma-based tokens, layouts, typography, responsive behavior, reduced-motion support, visible focus, ES/EN provider and selector, and reusable localized status/error states. Test language persistence, keyboard behavior, and error announcements. Map HU-018-S08 and CST-011/012.
- [ ] **07 — `feature/public-landing`: deliver `/`.** Build the Crafto-inspired original institutional landing using only approved imagery, three laboratory explanations, reservation process, FAQ, responsive layout, and access CTA. Test HU-018-S01, localization, accessibility landmarks, and the required call-to-action.
- [ ] **08 — `feature/render-login`: deliver `/acceso` using Render login.** Implement only `POST /api/auth/login/` according to the live Render contract. Verify the response behavior before defining the in-memory session shape; do not add refresh, logout, `/me`, local token persistence, or guessed headers. Test valid/invalid login, loading, localized validation/error states, and security storage restrictions. Map HU-018-S02.
- [ ] **09 — `feature/portal-shell`: deliver authenticated shell and profile.** Build `/portal` and `/portal/perfil` from data actually available after Render login. Enforce client-side role-aware navigation as a usability layer only. Test route guards, focus order, responsive navigation, language control, and forbidden states.
- [ ] **10 — `feature/lab-availability`: deliver availability search.** Build `/portal/disponibilidad` using `GET /api/labs/disponibles/` with `fecha`, `hora_inicio`, and `hora_fin`; introduce the accessible laboratory time rail. Test query mapping, input validation, free/empty/error states, keyboard interaction, and offline read-only messaging. Map HU-018-S03.
- [ ] **11 — `feature/reservation-create`: create reservations safely.** Use `POST /api/reservas/` with only fields documented by Render. Add an idempotency key only after confirming Render accepts it; otherwise document the contract gap and do not claim HU-018-S04 complete. Test confirmation, duplicate prevention, failures, and offline mutation disablement.
- [ ] **12 — `feature/reservation-management`: manage owned future bookings.** Implement list/detail/update/cancel with `GET /api/reservas/`, `GET /api/reservas/{id}/`, `PUT .../modificar/`, and `PATCH .../cancelar/`. Include ownership/future-state rules derived from Render responses and an accessible destructive confirmation. Test all operation mappings and HU-018-S05.
- [ ] **13 — `feature/admin-render`: implement contract-backed administration.** Add the permitted labs, conditions, users, and audit interfaces using their published Render endpoints. Keep `/portal/reportes` and `/portal/notificaciones` non-data-backed unless Render adds required operations. Test role-aware navigation, accessible compact views, every administrative mutation, and HU-018-S06.
- [ ] **14 — `feature/pwa-offline`: add safe PWA behavior.** Add a public-shell manifest/service worker, stale/offline indication, revalidation on reconnect, and hard-disable every reservation mutation offline. Test HU-018-S07; never queue mutations.
- [ ] **15 — `feature/netlify-release`: deploy and close evidence.** Configure Netlify previews/production, environment isolation, security headers, and CORS validation with Render. Run full contract/check/Jest gates, verify coverage >80%, execute required accessibility/acceptance checks, complete the traceability matrix and release evidence, then validate production from `main`.
