# ADR 0002: Adoptar contrato API consumer-owned con verificacion exacta

## Estado
Aprobado

## Contexto

Se necesita evitar incompatibilidades silenciosas entre el cliente y el API Render v1.

## Decision

- Mantener un contrato OpenAPI consumer-owned versionado.
- Validar hash, operaciones, request/response schemas y provenance.
- Fallar el gate ante cualquier deriva del contrato esperado.

## Consecuencias

- Positivas: integracion estable, deteccion temprana de breaking changes.
- Costos: mantenimiento del manifest y scripts de verificacion.

## Cumplimiento

- Script de verificacion en CI/local.
- Prohibido aprobar cambios de API sin actualizar contrato y pruebas.
