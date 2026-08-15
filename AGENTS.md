# AGENTS.md

## Mission

Use a strict trunk-based workflow to build this project from a clean baseline while keeping `main` stable.

## Source systems

- Primary API reference: https://umg-api-django.onrender.com/api/docs/
- Local verified contract baseline: `specs/api-contract.json`
- Product and acceptance specs: `specs/`

## Technical baseline

- Next.js (App Router)
- React
- JavaScript
- Bulma CSS

## Hosting baseline

- Primary free hosting target: Netlify
- Secondary free hosting options are allowed only if they preserve the same security and quality gates.

## Required workflow

1. Branch from `main` using naming convention.
2. Keep work in small, focused commits.
3. Run contract and test gates locally.
4. Open PR and merge quickly when green.
5. Delete branch after merge.

## Branch naming convention

- `feature/login`
- `feature/backend-connectivity`
- `fix/get-main-dashboard-info`

Pattern:

- `feature/<short-kebab-scope>`
- `fix/<short-kebab-scope>`

## Commit message convention

- Short native English only.
- Examples:
  - `add login shell`
  - `connect dashboard api`
  - `fix dashboard summary`

## Quality gates

Minimum required before merge:

- `npm run contract`
- `npm run check`
- `npm run test:jest`

## Deployment gates

- Preview deployment must pass before merge.
- Production deployment must use environment variables managed by hosting.
- No secrets in repository, commit history, or build logs.

## Testing policy

- Jest is required for local unit testing.
- Jest coverage must be above 80%.
- Do not merge if coverage threshold fails.

## Trunk-based principles

- Frequent merges to `main`.
- Small batches.
- Automated tests in CI and local runs.
- Keep active branches low and remove stale branches.
