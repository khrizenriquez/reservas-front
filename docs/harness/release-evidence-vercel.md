# Vercel Release Evidence

## Prepared configuration

- Branch: `fix/vercel-contract-build`
- API profile: `render-v1` only
- Build configuration: `vercel.json`
- Security headers: `next.config.mjs`
- Environment values: managed in Vercel, never committed

## Local evidence

- [x] `npm run contract` — immutable Render v1 snapshot and required operations verified on 2026-08-16 without outbound network access.
- [x] `npm run contract:live` — published Render v1 schema verified on 2026-08-16; its result is release evidence, not a Vercel build dependency.
- [x] `npm run check` — lint and 50 Jest tests pass; global branch coverage is 80.81%.
- [x] `npm run test:jest` — 50 tests and all global coverage thresholds pass.
- [x] `npm run release:check` — committed Vercel configuration verified.
- [x] `npm run build` — Next.js production build passes.
- [x] `npm audit --omit=dev --audit-level=high` — 0 vulnerabilities reported on 2026-08-16.
- [x] Local public/access/unauthenticated-portal routes return HTTP 200 under
  `npm run dev`; the portal visibly requires access without an in-memory session.
- [x] Local Render CORS — `CORS_ORIGIN=http://127.0.0.1:3000 npm run cors:check`
  passes with the published anonymous Render contract on 2026-08-16.
- [x] Local security headers — CSP, permissions, referrer, HSTS, frame/MIME, and
  `sw.js` no-cache headers return from the Next.js runtime on 2026-08-16.

## Required external evidence

- [ ] Vercel Preview URL and green deploy log.
- [ ] CORS pass for that exact Preview URL.
- [ ] Keyboard/screen-reader walkthrough of core routes.
- [ ] Installed-PWA offline walkthrough.
- [ ] Vercel Production URL created from `main`.
- [ ] CORS pass for that exact Production URL.
- [ ] Production smoke test against Render.

## Known blockers and residual risks

- Render returns wildcard CORS without credential approval. This is valid for the
  only verified integration mode: anonymous Render v1 requests with
  `credentials: "omit"`. Do not add a cookie, token, or refresh flow until Render
  publishes its contract and corresponding CORS requirements.
- Render does not publish idempotency-key support, so HU-018-S04 remains partial.
- Deploy URLs, reviewer identity, and timestamps must be recorded here only after
  real Vercel deployments; they must not be fabricated from local build output.
- The first Vercel Production build failed only because the former `contract`
  command made a live Render schema request that timed out. The deterministic
  correction is awaiting a green Vercel Preview deployment.
