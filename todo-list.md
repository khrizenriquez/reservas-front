# Todo List

## Goal

Rebuild the project from scratch using spec-driven development, trunk-based workflow, and Podman-based local startup.

## Phase 0: Governance lock

- [ ] Validate source of truth files:
  - `specs/product-design.md`
  - `specs/acceptance/LEG-WEB.feature`
  - `specs/api-contract.json`
  - `specs/contracts/legacy-openapi.yaml`
- [ ] Confirm branch/commit conventions in `AGENTS.md`.
- [ ] Confirm quality policy in `README.md` and `docs/spec-driven-development.md`.

## Phase 1: Project scaffold

- [ ] Initialize Next.js App Router project in JavaScript.
- [ ] Install and configure Bulma.
- [ ] Add folder structure for app routes and shared components.
- [ ] Add environment template for API base URL and profile.

## Phase 2: API and contract integration

- [ ] Implement API client from `specs/api-contract.json` operation inventory.
- [ ] Add request/response mapping layer for legacy endpoints.
- [ ] Add standardized API error model and handling strategy.
- [ ] Add contract verification command and CI/local gate.

## Phase 3: Functional slices

- [ ] Public landing route `/`.
- [ ] Login route `/acceso`.
- [ ] Portal shell `/portal`.
- [ ] Availability flow `/portal/disponibilidad`.
- [ ] Reservations flow `/portal/reservas`.
- [ ] Profile route `/portal/perfil`.
- [ ] Admin route `/portal/administracion`.

## Phase 4: Quality and testing

- [ ] Configure Jest for unit tests.
- [ ] Enforce Jest global coverage > 80%.
- [ ] Add route/service unit tests.
- [ ] Add acceptance-level checks mapped to `LEG-WEB` scenarios.

## Phase 5: Containerization with Podman

- [ ] Create production-ready Dockerfile (Podman compatible).
- [ ] Create compose file for `podman compose up` local startup.
- [ ] Add run scripts and troubleshooting guide.
- [ ] Validate app startup via Podman.

## Phase 6: Delivery discipline

- [ ] Work only in short-lived feature/fix branches.
- [ ] Keep commits small and in native English.
- [ ] Merge to `main` only when all required gates are green.
- [ ] Delete merged branches.
