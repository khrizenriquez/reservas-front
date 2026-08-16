# Reservas Front

This repository is intentionally reset to a documentation-first baseline so the web application can be rebuilt from scratch using spec-driven development and trunk-based delivery.

## Current baseline state

Only governance and specification assets are kept at root level:

- `README.md`
- `SECURITY.md`
- `AGENTS.md`
- `docs/`
- `specs/`

Implementation code, build files, and runtime folders will be recreated in controlled phases.

## Source of truth

- Primary API docs: https://umg-api-django.onrender.com/api/docs/
- Local Render v1 contract baseline: `specs/api-contract.json`
- API contract snapshot: `specs/contracts/render-v1-openapi.yaml`
- Product behavior: `specs/product-design.md`
- Acceptance scenarios: `specs/acceptance/HU-018-web-client.feature`
- Constraints traceability: `specs/constraints-traceability.md`
- i18n and error specification: `specs/i18n-error-spec.md`
- Team workflow rules: `AGENTS.md` + `docs/`

## Technical baseline

- Framework: Next.js (App Router)
- UI runtime: React
- Language: JavaScript
- CSS framework: Bulma
- Container runtime target: Podman
- Free hosting target: Vercel (sole target)

This project is not a pure React-only baseline.

## How the project works

The target flow is:

1. User interacts with web UI routes (`/`, `/acceso`, `/portal/...`).
2. UI layer calls application/client services.
3. Client services map requests only to published Render v1 contract operations.
4. API requests go to the Django API source through the configured base URL.
5. Responses are normalized for UI state rendering.

Architecture and sequence diagrams are documented in `docs/architecture-flow.md`.

## Frontend routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Institutional landing page, laboratory overview, reservation process, FAQ, language selector, and access call to action. |
| `/acceso` | Optional | Diagnostic login form using only `POST /api/auth/login/`; it is not required to enter the portal. |
| `/portal` | Direct | Portal home and navigation shell using the published anonymous Render v1 contract. |
| `/portal/perfil` | Direct | Explains that Render v1 does not publish a current-profile operation. |
| `/portal/disponibilidad` | Direct | Laboratory availability search for a selected date and interval. |
| `/portal/reservas` | Direct | Reservation list, filters, detail, create, modify, and cancel flows permitted by Render v1. |
| `/portal/administracion` | Direct | Contract-backed management of laboratories, conditions, users, and audit records. |
| `/portal/logs` | Direct | Visible Render v1 audit-log view using `GET /api/logs/`. |
| `/_not-found` | Public | Framework-generated fallback for unmatched routes. |

The client includes localized ES/EN interface copy, accessible loading states,
route-level lazy loading and a persisted light/dark theme. Database values and
URLs remain unchanged when the language changes.

All portal routes are directly accessible because Render v1 publishes an anonymous
security alternative. The client does not persist tokens, create a proxy, invent a
local identity or use unverified API paths.

> **Security TODO (backend):** the published Render v1 contract currently permits
> anonymous requests, including potentially administrative operations. The frontend
> cannot make this safe with hidden links or local role checks. Render must publish
> and enforce required authentication, a current-identity operation and per-action
> authorization before the client reintroduces login as a prerequisite.

## API endpoint inventory (Render v1 contract)

| Operation | Method | Path |
|---|---|---|
| login | POST | /api/auth/login/ |
| changePassword | POST | /api/auth/cambiar-contrasena/ |
| listUsers | GET | /api/usuarios/ |
| createUser | POST | /api/usuarios/ |
| deactivateUser | PATCH | /api/usuarios/{id}/inactivar/ |
| resetUserPassword | PATCH | /api/usuarios/{id}/resetear-contrasena/ |
| listLabs | GET | /api/labs/ |
| createLab | POST | /api/labs/ |
| updateLab | PUT | /api/labs/{id}/ |
| getLabAvailability | GET | /api/labs/disponibles/ |
| listLabConditions | GET | /api/condiciones/ |
| createLabCondition | POST | /api/condiciones/ |
| updateLabCondition | PUT | /api/condiciones/{id}/ |
| listReservations | GET | /api/reservas/ |
| createReservation | POST | /api/reservas/ |
| getReservation | GET | /api/reservas/{id}/ |
| updateReservation | PUT | /api/reservas/{id}/modificar/ |
| cancelReservation | PATCH | /api/reservas/{id}/cancelar/ |
| listAuditLogs | GET | /api/logs/ |

## Trunk-based workflow

- `main` must stay stable and releasable.
- Branches are short-lived (`feature/*`, `fix/*`).
- Merge in small batches with fast feedback.
- Delete branches after merge.

Branch examples:

- `feature/login`
- `feature/backend-connectivity`
- `fix/get-main-dashboard-info`

Commit style:

- Short native English messages.
- Example: `add login shell`

## Quality gates policy

Minimum required before merging into `main`:

- Contract validation.
- Static checks/lint.
- Unit tests.
- Jest coverage > 80%.
- Friendly localized error behavior validated for critical user journeys.

Note: command scripts are reintroduced during scaffold phase. The execution policy is defined now; runnable scripts are part of implementation tasks.

## Podman container plan

Containerized development is an explicit requirement.

- Runtime: Podman
- Orchestration: Podman Compose (`podman compose`)
- Planned services:
	- `web` (Next.js app)
	- optional local `mock-api` for isolated testing

Detailed container spec and runbook:

- `specs/containerization-spec.md`
- `docs/podman-runbook.md`

## Free hosting plan (Vercel-first)

The frontend must be deployable to Vercel as its only hosting target.

Deployment expectations:

- Production build must be compatible with Vercel build/runtime constraints.
- All environment variables must be managed in hosting settings (never committed).
- Preview deployments must be enabled per branch/PR.
- API base URL must be configurable per environment (preview/production).

Required documentation:

- `docs/deployment-free-hosting.md`
- `specs/deployment-hosting-spec.md`

Readiness gate before first production publish:

1. Contract, lint, and tests are green.
2. Jest coverage remains above 80%.
3. Security policy checks for secrets and headers are satisfied.
4. Vercel Preview and Production deployments both succeed.

## Start here

1. Read `docs/construction-kickoff.md`.
2. Review `todo-list.md`.
3. Review `stack.md`.
4. Implement in short feature branches following `AGENTS.md`.
