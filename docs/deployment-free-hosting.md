# Free Hosting Deployment Guide (Netlify-first)

## Objective

Provide a safe and repeatable deployment path for the frontend using free hosting, with Netlify as the primary target.

## Primary target

- Platform: Netlify
- Deployment mode: Git-based continuous deployment
- Environments: Preview (per PR/branch) and Production

## Required runtime configuration

Set these variables in Netlify site settings (never in source control):

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_API_PROFILE`

## Baseline deployment flow

1. Push feature/fix branch.
2. Validate preview deployment.
3. Run required quality gates.
4. Merge to `main`.
5. Validate production deployment.

## Quality gates before promotion

- Contract validation passes.
- Lint and static checks pass.
- Unit tests pass.
- Coverage remains above 80%.

## Security checklist

- No secrets committed in repository.
- No sensitive values logged during build/deploy.
- Preview and production variables are isolated.

## Fallback providers

Other free providers are acceptable only if they preserve:

- Branch preview workflow
- Environment variable isolation
- Equivalent security and quality gates
