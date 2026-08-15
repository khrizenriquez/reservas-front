# Reservas Front Reset Plan

This repository will follow a trunk-based workflow to rebuild from a clean baseline.
Main stays stable and releasable. Work is delivered in short-lived branches and merged frequently.

## Source of truth

- API base source: https://umg-api-django.onrender.com/api/docs/
- Contract baseline used in this repo: `specs/api-contract.json`
- Product and acceptance specifications: `specs/`
- Team rules and workflow: `docs/` and `AGENTS.md`

## Trunk-based rules

- `main` is always releasable.
- Keep branches short-lived and small.
- Merge at least daily when work is ready.
- Run automated checks before merge.
- Delete branches after merge.
- Keep active branches low (target: 3 or fewer in parallel).

## Branch naming convention

Use short English names only:

- `feature/login`
- `feature/backend-connectivity`
- `fix/get-main-dashboard-info`

## Commit message convention

Use short native English messages matching branch scope:

- `add login shell`
- `connect dashboard api`
- `fix dashboard summary`

## API endpoint inventory (legacy contract)

The current verified operation set is:

| Operation | Method | Path |
|---|---|---|
| login | POST | /api/auth/login/ |
| changePassword | POST | /api/auth/cambiar-contrasena/ |
| listUsers | GET | /api/usuarios/ |
| createUser | POST | /api/usuarios/ |
| deactivateUser | PATCH | /api/usuarios/{id}/inactivar/ |
| resetUserPassword | PATCH | /api/usuarios/{id}/resetear-contrasena/ |
| listLabs | GET | /api/labs/ |
| createLab | POST | /api/labs/ |
| updateLab | PUT | /api/labs/{id}/ |
| getLabAvailability | GET | /api/labs/disponibles/ |
| listLabConditions | GET | /api/condiciones/ |
| createLabCondition | POST | /api/condiciones/ |
| updateLabCondition | PUT | /api/condiciones/{id}/ |
| listReservations | GET | /api/reservas/ |
| createReservation | POST | /api/reservas/ |
| getReservation | GET | /api/reservas/{id}/ |
| updateReservation | PUT | /api/reservas/{id}/modificar/ |
| cancelReservation | PATCH | /api/reservas/{id}/cancelar/ |
| listAuditLogs | GET | /api/logs/ |

## Local quality gates

Run before every merge to `main`:

```bash
npm run contract
npm run check
npm run test:jest
```

## Jest coverage policy

- Local Jest coverage must stay above 80%.
- Coverage is enforced by threshold in Jest config.
