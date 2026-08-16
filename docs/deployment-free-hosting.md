# Free Hosting Deployment Guide (Vercel-first)

## Objective

Provide a safe, repeatable free-hosting deployment path for the frontend with
Vercel as the sole hosting target.

## Deployment model

- Platform: Vercel
- Deployment mode: Git-based continuous deployment
- Preview: every non-`main` branch/PR
- Production: `main`

## Local-first validation

Before opening a deploy PR, start the application with `npm run dev` and run:

```sh
npm run contract
npm run contract:live
npm run local:smoke
CORS_ORIGIN=http://127.0.0.1:3000 npm run cors:check
```

`contract` verifies the immutable Render v1 snapshot and is the deterministic
Vercel build gate. `contract:live` verifies the current published Render schema
as release evidence; it is intentionally outside the Vercel build command so a
transient Render timeout cannot make the frontend deployment unavailable. The
smoke command verifies local route serving. The CORS command is mandatory for
the Render flows: the verified API contract permits anonymous use and the client
uses `credentials: "omit"`, so Render's published wildcard response is valid.
Do not replace Render with a local proxy or an invented frontend endpoint.

Vercel builds with a production environment, while React component tests require
the React test runtime. The committed `test:jest` script therefore explicitly
sets `NODE_ENV=test`; this affects Jest only, not the production `next build`.

## Committed deployment configuration

`vercel.json` is the canonical Vercel configuration. It runs the contract,
lint/Jest, release-configuration, and production-build gates. Vercel detects the
Next.js App Router project without an adapter or an additional dependency.

`next.config.mjs` provides CSP, HSTS, frame, MIME, referrer, permissions, and
service-worker cache headers. Environment values are deliberately excluded from
both files and must be configured in Vercel. The Next.js standalone output is
enabled only for the Podman image; Vercel uses its native Next.js adapter and
therefore receives the standard Next.js build output.

## Required Vercel settings

1. Import the Git repository as a Vercel project.
2. Keep the framework preset as Next.js and set the production branch to `main`.
3. Do not replace the committed build command in the Vercel UI.
4. Keep Node.js on 22.x. `package.json` pins that supported major version so
   Vercel does not automatically choose a newer major runtime.
5. Configure these public build-time variables for both Preview and Production:

| Scope | `NEXT_PUBLIC_API_BASE_URL` | `NEXT_PUBLIC_API_PROFILE` |
|---|---|---|
| Production (`main`) | `https://umg-api-django.onrender.com` | `render-v1` |
| Preview (non-`main` branches) | `https://umg-api-django.onrender.com` | `render-v1` |

No other profile or backend URL is valid. These names are public build-time values;
they must never contain passwords, tokens, cookies, or API keys.

## Baseline deployment flow

1. Pass the local-first validation above.
2. Push the feature/fix branch and open its PR.
3. Confirm Vercel created a Preview deployment for that branch.
4. Run `CORS_ORIGIN=https://<preview-url> npm run cors:check`.
5. Review the preview, build log, headers, and required quality gates.
6. Merge to `main`; Vercel creates the Production deployment.
7. Run `CORS_ORIGIN=https://<production-url> npm run cors:check`.
8. Record both URLs and results in `docs/harness/release-evidence-vercel.md`.

## Quality gates before promotion

- Contract validation passes.
- Live Render schema validation is recorded as release evidence.
- Lint and static checks pass.
- Unit tests pass.
- Coverage remains above 80%.
- Vercel Preview deployment is green.

## Security checklist

- No secrets committed in repository.
- No sensitive values logged during build/deploy.
- Preview and Production variables are isolated in Vercel.
- `next.config.mjs` provides the required security headers.
- `sw.js` is served with `no-cache` so an updated offline policy activates promptly.

## Render CORS validation

On 2026-08-15, Render returned `Access-Control-Allow-Origin: *`, allowed `POST`,
and allowed `Content-Type` for `http://127.0.0.1:3000`. This is compatible with
the published anonymous Render v1 contract because the client omits browser
credentials. Run `cors:check` for each local, Preview, and Production URL as a
release gate; do not introduce a cookie/credential flow unless Render publishes
its explicit contract and CORS changes with it.
