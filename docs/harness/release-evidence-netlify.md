# Netlify Release Evidence

## Prepared configuration

- Branch: `feature/netlify-release`
- API profile: `render-v1` only
- Build configuration: `netlify.toml`
- Environment values: managed in Netlify, never committed

## Local evidence

- [x] `npm run contract` — Render v1 schema verified on 2026-08-15.
- [x] `npm run check` — lint and 34 Jest tests pass; branch coverage 83.68%.
- [x] `npm run test:jest` — 34 tests pass; all global coverage thresholds pass.
- [x] `npm run release:check` — committed Netlify configuration verified.
- [x] `npm run build` — Next.js production build passes.
- [x] `npm audit --omit=dev --audit-level=high` — 0 vulnerabilities reported.

## Required external evidence

- [ ] Netlify preview URL and green deploy log.
- [ ] CORS pass for that exact preview URL.
- [ ] Keyboard/screen-reader walkthrough of core routes.
- [ ] Installed-PWA offline walkthrough.
- [ ] Netlify production URL created from `main`.
- [ ] CORS pass for that exact production URL.
- [ ] Production smoke test against Render.

## Known blockers and residual risks

- Render currently returns wildcard CORS and omits credential approval for an
  unapproved origin. This is incompatible with credentialed requests and must be
  corrected by the Render owner before any deployed API journey is approved.
- `CORS_ORIGIN=https://example.invalid npm run cors:check` was intentionally run
  on 2026-08-15 and failed with `Access-Control-Allow-Origin: *` and no
  `Access-Control-Allow-Credentials`; this is evidence of the blocker, not a
  passed release check.
- Render does not publish idempotency-key support, so HU-018-S04 remains partial.
- Deploy URLs, reviewer identity and timestamps must be recorded here only after
  real Netlify deployments; they must not be fabricated from local build output.
