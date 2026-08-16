# Free Hosting Deployment Guide (Netlify-first)

## Objective

Provide a safe and repeatable deployment path for the frontend using free hosting, with Netlify as the primary target.

## Primary target

- Platform: Netlify
- Deployment mode: Git-based continuous deployment
- Environments: Preview (per PR/branch) and Production

## Committed deployment configuration

`netlify.toml` is the canonical build configuration. It pins Node 22, runs the
contract/lint/Jest/release gates before `next build`, uses the standard Next.js
`.next` publish directory, and sets security headers. Netlify detects the Next.js
App Router runtime automatically; no Netlify plugin or extra dependency is needed.

The file deliberately does not commit `NEXT_PUBLIC_API_BASE_URL`: it is a public
configuration value, but it must be managed by the hosting environment so preview
and production scopes can be controlled independently.

## Required Netlify settings

Connect this repository with continuous deployment enabled. Keep the build values
from `netlify.toml`; do not replace its command in the Netlify UI.

Set these environment variables in Netlify site settings (never in source control):

| Scope | `NEXT_PUBLIC_API_BASE_URL` | `NEXT_PUBLIC_API_PROFILE` |
|---|---|---|
| Production (`main`) | `https://umg-api-django.onrender.com` | `render-v1` |
| Deploy preview | `https://umg-api-django.onrender.com` only after its exact preview origin is allowlisted in Render | `render-v1` |

No other profile or backend URL is valid. These names are public build-time values;
they must never contain passwords, tokens, cookies, or API keys.

## Baseline deployment flow

1. Push feature/fix branch and open its PR.
2. Link the repository to Netlify; Netlify creates a deploy preview for the PR.
3. Add the exact preview URL to Render's credentialed CORS allowlist and run
   `CORS_ORIGIN=https://<preview-url> npm run cors:check`.
4. Review the preview, build log, headers, and required quality gates.
5. Merge to `main`; Netlify creates the production deploy.
6. Add the exact production URL to the same Render allowlist and run
   `CORS_ORIGIN=https://<production-url> npm run cors:check`.
7. Record both URLs and results in `docs/harness/release-evidence-netlify.md`.

## Quality gates before promotion

- Contract validation passes.
- Lint and static checks pass.
- Unit tests pass.
- Coverage remains above 80%.

## Security checklist

- No secrets committed in repository.
- No sensitive values logged during build/deploy.
- Preview and production variables are isolated.
- `netlify.toml` provides CSP, HSTS, frame, MIME, referrer and permissions headers.
- `sw.js` is served with `no-cache` so an updated offline policy activates promptly.

## Render CORS release blocker

On 2026-08-15, an unauthenticated preflight to Render using an unapproved origin
returned `Access-Control-Allow-Origin: *` and did not return
`Access-Control-Allow-Credentials: true`. This cannot support the application's
`credentials: "include"` requests. Do not approve preview or production until the
Render owner configures explicit preview/production origins, enables credentials
only for those origins, and the `cors:check` command succeeds for each URL.

## Fallback providers

Other free providers are acceptable only if they preserve:

- Branch preview workflow
- Environment variable isolation
- Equivalent security and quality gates
