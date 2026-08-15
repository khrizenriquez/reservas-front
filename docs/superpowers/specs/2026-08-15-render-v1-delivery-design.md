# Render v1 delivery design

## Decision

The sole backend integration target is the API deployed at
`https://umg-api-django.onrender.com`. The active API surface is its published
OpenAPI schema at `/api/schema/?format=json` and its `/api/*` paths. The
repository snapshot `specs/contracts/render-v1-openapi.yaml` is a checked-in
copy of that Render v1 contract.

The client will not invent login/refresh/logout/current-user endpoints or
fabricate data for routes that require an unavailable API operation. Each
user-facing capability must map to a published Render operation and a test.

## Architecture

The Next.js App Router UI calls route-scoped services. Services call a single
native `fetch` client configured with `NEXT_PUBLIC_API_BASE_URL`; the client
uses only the Render v1 operation inventory, maps successful payloads to UI
models, and turns HTTP/transport failures into localized user-facing errors.
Bulma provides the base UI primitives and original product components provide
the time rail, availability, reservations, and role-aware surfaces.

Authentication and session behavior will be implemented only after verifying
the live login response and its documented cookie/header requirements. No token
storage or refresh flow is assumed.

## Delivery model

Every unchecked roadmap item in `todo-list.md` is one short-lived
`feature/*` or `fix/*` branch. For every item: branch from updated `main`, make
only the item changes, add or update its tests, run its required gates, create a
short English commit, open a PR, validate its preview when applicable, merge
when green, delete the branch, and begin the next item from `main`.

The dependency order is: governance and contract evidence, Next scaffold and
quality harness, API client, local container runtime, shared accessible/i18n
UI, public/login entry, portal and availability, reservation creation and
management, administration, offline behavior, Netlify deployment, then release
evidence.

## Error handling and verification

All routes expose loading, empty, success, offline, forbidden, validation, and
failure states as appropriate. API 4xx/5xx response bodies are not rendered as
user copy. Every functional item maps to one or more HU-018 scenarios and has
unit/integration coverage; the complete project maintains Jest global coverage
above 80%. Contract, static, and Jest gates are required before every merge;
preview and Podman validation apply to the relevant items.
