# Constraints Traceability (SDD)

## Purpose

Define and map implementation constraints to user stories and acceptance scenarios so delivery decisions remain verifiable.

## Canonical scenario source

- `specs/acceptance/HU-018-web-client.feature`

## Constraints matrix

| Constraint ID | Constraint | How we implement it | Mapped scenarios | Verification evidence |
|---|---|---|---|---|
| CST-001 | REST-first API integration | Use only contract operations from `specs/api-contract.json` and OpenAPI paths from the immutable Render v1 snapshot `specs/contracts/render-v1-openapi.yaml`; live-schema evidence is isolated from the deterministic build gate. | HU-018-S02, HU-018-S03, HU-018-S04, HU-018-S05, HU-018-S06 | `contract`, `contract:live`, and API integration tests |
| CST-002 | Native async HTTP (no Axios) | HTTP calls use native `fetch` and `async/await`; avoid Axios dependency. | HU-018-S02, HU-018-S03, HU-018-S04, HU-018-S05 | Lint/dependency checks + code review |
| CST-003 | CORS compatible with published API | The client uses Render's anonymous security alternative with `credentials: "omit"`; wildcard CORS is valid without browser credentials. | HU-018-S02, HU-018-S03, HU-018-S04, HU-018-S05, HU-018-S06 | `CORS_ORIGIN=<app-url> npm run cors:check` validates origin, POST and `Content-Type`. |
| CST-004 | Credentialed CORS safety | Not active: Render does not publish a required credentialed session contract and the client sends no cookies. Any future credentialed contract must require exact origins plus `Access-Control-Allow-Credentials: true`. | HU-018-S02 | API-client test asserts `credentials: "omit"`; code review against the Render snapshot. |
| CST-005 | Preflight and headers integrity | Support published methods/headers (`GET`,`POST`,`PUT`,`PATCH`,`OPTIONS`; `Content-Type` for JSON). | HU-018-S03, HU-018-S04, HU-018-S05 | `cors:check` and API-client tests |
| CST-006 | Minimal dependency policy | Prefer platform/framework native capabilities; add dependencies only with justification. | HU-018-S01..HU-018-S08 | PR governance and architecture review |
| CST-007 | Optional Zustand usage rule | `zustand` allowed only for cross-route client state that cannot be cleanly solved with local/context state. | HU-018-S05, HU-018-S06 | ADR/PR justification + tests |
| CST-008 | Optional Zod usage rule | `zod` allowed for complex runtime schema validation at API/form boundaries. | HU-018-S03, HU-018-S04, HU-018-S05 | Validation tests |
| CST-009 | Vercel deployment readiness | `vercel.json` runs deterministic release gates, `next.config.mjs` provides the security headers and isolates Podman-only standalone output from Vercel's native Next.js adapter, and `package.json` pins Node 22.x; `contract:live`, preview/production connectivity, and CORS evidence use the same Render-only anonymous contract outside the build's external-network boundary. | HU-018-S01..HU-018-S08 | `npm run release:check`, `contract:live`, deploy URLs, `cors:check`, and release evidence. |
| CST-010 | Direct-access and storage restrictions | No token, cookie, local role gate or fabricated user identity. `/acceso` is optional and Render v1 calls use `credentials: "omit"`. **Backend TODO:** publish and enforce mandatory auth, identity and permissions before reintroducing an authenticated portal. | HU-018-S02, HU-018-S05, HU-018-S06 | Route/API tests assert direct rendering and omitted credentials; security review verifies the explicit backend debt. |
| CST-011 | Friendly API error UX | API 4xx/5xx responses map to friendly user-facing localized messages in forms and page-level status blocks. | HU-018-S03, HU-018-S04, HU-018-S05, HU-018-S08 | UI/error handling tests + accessibility checks |
| CST-012 | i18n baseline | Spanish default and English selectable across public and direct portal surfaces. | HU-018-S01..HU-018-S08 | Localization tests + UX walkthrough |

## Working rules

1. Any new technical decision must map to at least one scenario.
2. Any dependency addition must update this matrix if it changes constraints.
3. Any CORS-related change must update both `SECURITY.md` and this matrix.
4. Acceptance validation is incomplete if mapped constraints are not verified.
5. Any localization or error-copy change must update `specs/i18n-error-spec.md` and this matrix.
