# Containerization Specification

## Scope

Define container requirements for local development and reproducible startup using Podman.

## Requirements

1. The frontend must run in a Podman-compatible container image.
2. Local startup must be possible with a single `podman compose up --build` command.
3. Environment variables must be externalized from source code.
4. The container must expose the app on port `3000`.
5. The setup must support switching API base URL without image rebuild.
6. The containerized setup must preserve trunk-based quality checks before merge.

## Non-functional constraints

- Keep image layers minimal and deterministic.
- Avoid embedding credentials in image layers.
- Prefer explicit runtime configuration over hardcoded values.

## Acceptance criteria

- App starts successfully in Podman and is reachable on mapped host port.
- App connects to configured API base URL.
- Container startup/shutdown commands are documented in `docs/podman-runbook.md`.
- Containerization docs are linked from root `README.md`.
