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

`/acceso` primero valida con Render v1 y preserva solo metadatos de identidad en
`sessionStorage` para la pestaña actual. Luego las rutas del portal llaman Render v1
directamente y omiten credenciales del navegador. El rol local controla la UI, pero
no reemplaza autorización backend porque el contrato publicado aún permite acceso
anónimo.

La ruta de logs usa exclusivamente `GET /api/logs/?UMG_User_ID=<value>`. La
segmentación semanal y por rango ocurre en el navegador sobre esa respuesta; no se
envía ningún parámetro de fecha, analítica o paginación que Render v1 no publique.
Para administradores, los paneles operativos leen por separado los laboratorios,
condiciones, reservas y usuarios publicados. Esos conteos son de la operación
académica; el cliente no solicita ni simula telemetría de infraestructura.

```mermaid
sequenceDiagram
  actor User
  participant UI as Next.js Route Component
  participant SVC as Service Function
  participant CLI as API Client
  participant API as Django API (Render)

  User->>UI: Sign in or trigger portal action
  UI->>CLI: POST /api/auth/login/ (when signing in)
  CLI->>API: Validate published credentials
  API-->>CLI: User record / login response
  CLI-->>UI: Normalized tab-scoped identity (no password)
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
