# Architecture Flow

## System context

```mermaid
flowchart LR
  U[Web Client User] --> B[Browser]
  B --> W[Reservas Frontend\nNext.js + React + Bulma]
  W --> A[API Base URL\nRender Django API]
  A --> D[(Reservation Data)]
```

## Logical layers

```mermaid
flowchart TB
  UI[Route/UI Layer\nApp Router pages and components]
  SVC[Domain and Service Layer\nUse-case orchestration]
  API[API Client Layer\nOperation-level calls from contract]
  MAP[Adapter and Mapper Layer\nNormalize requests/responses]
  ERR[Error Mapping Layer\nConsistent UX error states]

  UI --> SVC --> API --> MAP --> ERR
  MAP --> API
```

## Request sequence

Portal routes call Render v1 directly; login is an optional diagnostic operation,
not a prerequisite or client-side authorization boundary. Requests omit browser
credentials because the published contract permits anonymous access.

```mermaid
sequenceDiagram
  actor User
  participant UI as Next.js Route Component
  participant SVC as Service Function
  participant CLI as API Client
  participant API as Django API (Render)

  User->>UI: Open route or trigger action (reservation/...)
  UI->>SVC: Execute use case
  SVC->>CLI: Call operation by contract
  CLI->>API: HTTP request (method/path from OpenAPI)
  API-->>CLI: JSON response
  CLI-->>SVC: Adapted/normalized model
  SVC-->>UI: Domain result
  UI-->>User: Render state or mapped error
```

## Deployment flow with Podman

```mermaid
flowchart LR
  Dev[Developer] --> PC[podman compose up]
  PC --> WEB[web container\nNext.js app]
  WEB --> API[Render API endpoint]
```
