# Deployment and Hosting Specification

## Scope

Define deployment requirements for free hosting with Netlify as the primary target.

## Requirements

1. The frontend must deploy successfully on Netlify free tier.
2. Branch/PR preview deployments must be available before merge.
3. Production deployment must be triggered from the stable `main` branch.
4. Runtime environment variables must be configured in hosting settings.
5. API base URL and API profile must be environment-driven.
6. Deployment must not expose secrets in source, logs, or client bundles.

## Operational constraints

- `main` stays releasable.
- Deployment quality gates must pass before promotion.
- Preview deployment approval is required before merging impactful UI/API changes.

## Acceptance criteria

- Preview deploy URL is generated for active branch/PR.
- Production deploy is successful from `main`.
- App can call the configured API base URL after deployment.
- Deployment and security checks are documented in `docs/deployment-free-hosting.md` and `SECURITY.md`.
