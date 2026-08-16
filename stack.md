# Stack and Architecture Baseline

## Confirmed technology stack

- Frontend framework: Next.js (App Router)
- UI runtime: React
- Language: JavaScript
- Styling: Bulma CSS
- HTTP client strategy: Native `fetch` + `async/await` (no Axios)
- API contract format: OpenAPI 3 (`specs/contracts/render-v1-openapi.yaml`)
- Contract manifest: `specs/api-contract.json`
- Container runtime target: Podman
- Container orchestration target: Podman Compose
- Hosting target: Vercel (free tier) primary
- i18n baseline: Spanish default, English selectable

## Delivery and governance stack

- Workflow model: Trunk-based development
- Requirements method: Spec-driven development (SDD)
- Decision model: ADR-driven governance
- Security baseline: `SECURITY.md`

## Dependency policy

- Keep dependencies minimal by default.
- Prefer platform-native APIs and framework-native capabilities before adding libraries.
- New dependency additions require explicit justification in PR notes.
- `axios` is not allowed in baseline architecture.

## State and validation policy

- Default state approach: React local state/context per route scope.
- `zustand` is optional and only allowed when cross-route client state cannot be managed cleanly with local/context state.
- `zod` is optional and recommended for boundary validation (API payload parsing, form schema validation) when complexity justifies it.
- Any adoption of `zustand` or `zod` must be documented in specs and reflected in tests.

## Visual and interaction policy

- Dashboard/forms direction: Vuexy-inspired enterprise UI language.
- Landing direction: Crafto-inspired modern marketing layout rhythm.
- All implementations must be original and project-owned.
- API error handling must produce friendly localized UI messages for 4xx/5xx cases.

## Architecture definition status

Yes, architecture and patterns are already defined at baseline level and should drive implementation.

Defined sources:

- Product and route behavior: `specs/product-design.md`
- Acceptance scenarios: `specs/acceptance/HU-018-web-client.feature`
- Process and quality governance: `docs/spec-driven-development.md`, `AGENTS.md`
- Architecture and sequence diagrams: `docs/architecture-flow.md`
- Constraints traceability: `specs/constraints-traceability.md`
- Design direction: `design.md`
- i18n and error specification: `specs/i18n-error-spec.md`

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
- CORS governance pattern:
  - Credentialed cross-origin requests require explicit origin allowlists and strict preflight policy.

## Client-to-API interaction model

1. Browser user performs action on route.
2. React/Next component triggers service action.
3. Service uses API client operation bound to contract path/method.
4. Request targets configured API base URL.
5. Response is adapted/normalized and rendered in UI.
6. Errors are mapped to consistent UX messages and states.
