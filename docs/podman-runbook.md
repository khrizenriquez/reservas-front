# Podman Runbook

## Objective

Run the frontend project locally using Podman-compatible container definitions.

## Planned baseline

- Container runtime: Podman
- Compose command: `podman compose`
- Main service: `web`

## Planned files

- `Containerfile` (or `Dockerfile` compatible with Podman)
- `compose.yaml`
- `.env.example`

## Standard startup

```bash
podman compose up --build
```

## Standard shutdown

```bash
podman compose down
```

## Planned ports

- `3000`: frontend app

## Notes

- API base URL must point to the expected environment (Render or local stub).
- No secrets should be committed to source control.
- Health checks and container hardening are included in containerization tasks.
