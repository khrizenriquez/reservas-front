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
- Local contract baseline: `specs/api-contract.json`
- API contract snapshot: `specs/contracts/legacy-openapi.yaml`
- Product behavior: `specs/product-design.md`
- Acceptance scenarios: `specs/acceptance/LEG-WEB.feature`
- Team workflow rules: `AGENTS.md` + `docs/`

## Technical baseline

- Framework: Next.js (App Router)
- UI runtime: React
- Language: JavaScript
- CSS framework: Bulma
- Container runtime target: Podman
- Free hosting target: Netlify (primary), with equivalent free static/node hosting as fallback

This project is not a pure React-only baseline.

## How the project works

The target flow is:

1. User interacts with web UI routes (`/`, `/acceso`, `/portal/...`).
2. UI layer calls application/client services.
3. Client services map requests to legacy contract operations.
4. API requests go to the Django API source through the configured base URL.
5. Responses are normalized for UI state rendering.

Architecture and sequence diagrams are documented in `docs/architecture-flow.md`.

## API endpoint inventory (legacy contract)

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

## Free hosting plan (Netlify-first)

The frontend must be deployable to a free hosting service, with Netlify as the default target.

Deployment expectations:

- Production build must be compatible with Netlify build/runtime constraints.
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
4. Netlify preview and production deployment both succeed.

## Start here

1. Read `docs/construction-kickoff.md`.
2. Review `todo-list.md`.
3. Review `stack.md`.
4. Implement in short feature branches following `AGENTS.md`.
