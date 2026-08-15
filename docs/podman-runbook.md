# Podman Runbook

## Objective

Run the frontend project locally using Podman-compatible container definitions.

## Runtime baseline

- Container runtime: Podman
- Compose command: `podman compose`
- Main service: `web`

## Runtime files

- `Containerfile` (Podman compatible multi-stage image)
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

- API base URL defaults to Render v1. Override it at runtime without rebuilding:

```bash
NEXT_PUBLIC_API_BASE_URL=https://umg-api-django.onrender.com podman compose up --build
```

- The entrypoint writes `/runtime-config.js` when the container starts; this is
  the only runtime configuration exposed to the browser.
- No secrets should be committed to source control.
- Validate the running app with `curl http://localhost:3000/`.
