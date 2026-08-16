# Vercel release design

## Decision

Vercel Hobby is the only hosting target for this academic, non-commercial web
client. Vercel receives the connected Git repository, creates a preview for
each non-`main` branch and deploys production only from `main`. Render v1
remains the sole backend and every browser request continues to use its
published `/api/*` contract directly with `credentials: "omit"`.

The prior hosting target is removed. The repository will have no duplicate
provider configuration, deployment evidence, or provider-specific release
checks.

## Configuration

`vercel.json` declares the Next.js framework and one build command:
`npm run contract && npm run check && npm run release:check && npm run build`.
It does not declare an output directory because Vercel detects Next.js and
configures its deployment output itself.

`next.config.mjs` owns the response security headers so the same policy is
enforced by Next.js and Vercel: CSP, Permissions-Policy, Referrer-Policy,
HSTS, MIME sniffing protection, frame denial, and a no-store service-worker
response. The CSP permits only the published Render v1 origin for `connect-src`
and approved UMG image origins.

The Vercel dashboard holds these public build-time values in both Preview and
Production environments:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | `https://umg-api-django.onrender.com` |
| `NEXT_PUBLIC_API_PROFILE` | `render-v1` |

No Vercel token, project ID, organization ID, account credential, or secret is
committed. `.vercel/` stays local and ignored if the owner later links the
project with the CLI.

## Evidence and release flow

The Vercel release verifier asserts provider config, build gates, headers, and
the absence of committed API configuration. The release evidence records local
contract, lint, Jest coverage, audit, build, local smoke, and Render CORS
results. It then requires a Vercel preview URL, its CORS result and accessibility
walkthrough before merge; a `main` production URL, CORS result, and production
smoke result close the item.

The repository owner must import the Git repository into Vercel, select `main`
as the production branch, configure the two public values in Preview and
Production, and provide the generated preview URL. No external deployment is
claimed before that happens.
