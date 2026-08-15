# Stack and Architecture Baseline

## Confirmed technology stack

- Frontend framework: Next.js (App Router)
- UI runtime: React
- Language: JavaScript
- Styling: Bulma CSS
- API contract format: OpenAPI 3 (`specs/contracts/legacy-openapi.yaml`)
- Contract manifest: `specs/api-contract.json`
- Container runtime target: Podman
- Container orchestration target: Podman Compose

## Delivery and governance stack

- Workflow model: Trunk-based development
- Requirements method: Spec-driven development (SDD)
- Decision model: ADR-driven governance
- Security baseline: `SECURITY.md`

## Architecture definition status

Yes, architecture and patterns are already defined at baseline level and should drive implementation.

Defined sources:

- Product and route behavior: `specs/product-design.md`
- Acceptance scenarios: `specs/acceptance/LEG-WEB.feature`
- Process and quality governance: `docs/spec-driven-development.md`, `AGENTS.md`
- Architecture and sequence diagrams: `docs/architecture-flow.md`

## Architecture patterns to follow

- Contract-first integration pattern:
  - UI and services must align to the OpenAPI contract and operation inventory.
- Layered frontend pattern:
  - Route/UI layer -> domain/service layer -> API client layer.
- Adapter/mapper pattern:
  - Normalize API request/response shapes for UI-friendly models.
- Standardized error pattern:
  - Convert backend responses into consistent user-facing error states.
- Configuration-driven environment pattern:
  - Runtime behavior controlled by explicit environment variables.
- Trunk-based release pattern:
  - Small branches, frequent merges, always-releasable `main`.
- Quality-gate pattern:
  - Contract validation + tests + coverage thresholds before merge.

## Client-to-API interaction model

1. Browser user performs action on route.
2. React/Next component triggers service action.
3. Service uses API client operation bound to contract path/method.
4. Request targets configured API base URL.
5. Response is adapted/normalized and rendered in UI.
6. Errors are mapped to consistent UX messages and states.
