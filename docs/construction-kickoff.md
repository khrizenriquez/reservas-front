# Construction Kickoff Plan

## Objective

Start the project from scratch with a strict spec-driven workflow and trunk-based delivery.

## Confirmed stack decision

- Framework: Next.js (App Router)
- UI library/runtime: React
- Language: JavaScript (no TypeScript in phase 1)
- CSS framework: Bulma

This baseline is not a pure React-only setup. It is Next.js + React + Bulma.

## Phase 0: Governance before code

1. Validate source of truth documents:
   - `specs/product-design.md`
   - `specs/acceptance/HU-018-web-client.feature`
   - `specs/constraints-traceability.md`
   - `specs/api-contract.json`
2. Confirm branch and commit conventions from `AGENTS.md`.
3. Confirm quality gates and test policy (Jest >= 80% coverage).

## Phase 1: Minimal project scaffold

1. Initialize Next.js project (JavaScript variant).
2. Install Bulma and create design token/theme entrypoint.
3. Configure project structure for App Router routes defined in specs.
4. Create contract client foundation aligned with endpoint inventory in `README.md`.

## Phase 2: Core vertical slices

1. Public routes:
   - `/`
   - `/acceso`
2. Session and portal shell:
   - `/portal`
   - `/portal/perfil`
3. Reservation flows:
   - `/portal/disponibilidad`
   - `/portal/reservas`
4. Admin routes:
   - `/portal/administracion`

## Phase 3: Quality and hardening

1. Unit tests in Jest with global coverage threshold >= 80%.
2. Contract verification and adapter mapping consistency.
3. Accessibility and error-state coverage.
4. Final traceability check requirement -> implementation -> tests -> evidence.

## Constraints

- No implementation outside approved specs.
- No contract drift without spec and tests update.
- No long-lived branches.
- No merge to `main` without passing required gates.

## Delivery rules

- Small commits in short native English.
- Small PRs with explicit traceability references.
- Delete feature/fix branch immediately after merge.
