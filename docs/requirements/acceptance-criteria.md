# Acceptance Criteria Mapped

## Canonical source

- `specs/acceptance/HU-018-web-client.feature`

## Scenario inventory

- `HU-018-S01`: Understand service from landing
- `HU-018-S02`: Start secure web session
- `HU-018-S03`: Search availability accessibly
- `HU-018-S04`: Create reservation with idempotency
- `HU-018-S05`: Manage owned future reservation
- `HU-018-S06`: Use role-aware administration
- `HU-018-S07`: Keep offline behavior safe
- `HU-018-S08`: Complete journeys with assistive technology

## Constraint mapping rule

Cada escenario debe estar mapeado a restricciones tecnicas en:

- `specs/constraints-traceability.md`

Especialmente para:

- CORS y el modelo de sesion publicado por Render v1
- REST y contrato OpenAPI
- `fetch` + `async/await` nativo
- Politica de dependencias (`axios` no permitido)
- Uso opcional de `zustand` y `zod` con justificacion

## Evidence rule

Un criterio solo se considera cumplido cuando existe evidencia verificable de pruebas
automatizadas o checklist controlado, enlazada al commit correspondiente.
