# Constraints Traceability (SDD)

## Purpose

Define and map implementation constraints to user stories and acceptance scenarios so delivery decisions remain verifiable.

## Canonical scenario source

- `specs/acceptance/HU-018-web-client.feature`

## Constraints matrix

| Constraint ID | Constraint | How we implement it | Mapped scenarios | Verification evidence |
|---|---|---|---|---|
| CST-001 | REST-first API integration | Use only contract operations from `specs/api-contract.json` and OpenAPI paths from the Render v1 snapshot `specs/contracts/render-v1-openapi.yaml`. | HU-018-S02, HU-018-S03, HU-018-S04, HU-018-S05, HU-018-S06 | Contract checks + API integration tests |
| CST-002 | Native async HTTP (no Axios) | HTTP calls use native `fetch` and `async/await`; avoid Axios dependency. | HU-018-S02, HU-018-S03, HU-018-S04, HU-018-S05 | Lint/dependency checks + code review |
| CST-003 | CORS explicit allowlist | Render must allow only the exact Netlify preview/production origins; unknown origins are denied. | HU-018-S02, HU-018-S03, HU-018-S04, HU-018-S05, HU-018-S06 | `CORS_ORIGIN=<deploy-url> npm run cors:check`; currently blocked because Render returns wildcard CORS. |
| CST-004 | Credentialed CORS safety | Render must return the exact approved origin plus `Access-Control-Allow-Credentials: true` for credentialed flows. | HU-018-S02 | `cors:check`; currently blocked pending Render configuration. |
| CST-005 | Preflight and headers integrity | Support required methods/headers (`GET`,`POST`,`PUT`,`PATCH`,`OPTIONS`; content/csrf/idempotency headers as used). | HU-018-S03, HU-018-S04, HU-018-S05 | Preflight/API tests |
| CST-006 | Minimal dependency policy | Prefer platform/framework native capabilities; add dependencies only with justification. | HU-018-S01..HU-018-S08 | PR governance and architecture review |
| CST-007 | Optional Zustand usage rule | `zustand` allowed only for cross-route client state that cannot be cleanly solved with local/context state. | HU-018-S05, HU-018-S06 | ADR/PR justification + tests |
| CST-008 | Optional Zod usage rule | `zod` allowed for complex runtime schema validation at API/form boundaries. | HU-018-S03, HU-018-S04, HU-018-S05 | Validation tests |
| CST-009 | Netlify deployment readiness | `netlify.toml` builds Next.js with the release gates and isolated public configuration; preview/production connectivity still requires Netlify and Render approval. | HU-018-S01..HU-018-S08 | `npm run release:check`, deploy URLs, `cors:check`, and release evidence. |
| CST-010 | Security and storage restrictions | Access token in memory only; no token in localStorage/sessionStorage/IndexedDB/logs. | HU-018-S02 | Security tests + code review |
| CST-011 | Friendly API error UX | API 4xx/5xx responses map to friendly user-facing localized messages in forms and page-level status blocks. | HU-018-S03, HU-018-S04, HU-018-S05, HU-018-S08 | UI/error handling tests + accessibility checks |
| CST-012 | i18n baseline | Spanish default and English selectable across public and authenticated surfaces. | HU-018-S01..HU-018-S08 | Localization tests + UX walkthrough |

## Working rules

1. Any new technical decision must map to at least one scenario.
2. Any dependency addition must update this matrix if it changes constraints.
3. Any CORS-related change must update both `SECURITY.md` and this matrix.
4. Acceptance validation is incomplete if mapped constraints are not verified.
5. Any localization or error-copy change must update `specs/i18n-error-spec.md` and this matrix.
