# Accuracy Audit: docs vs specs

Fecha: 2026-08-15

## Objetivo

Validar que `docs/` represente fielmente el estado real del proyecto y distinguir contenido canonico vs plantilla reutilizable.

## Resultado ejecutivo

- Alineacion global: Alta.
- Riesgo de ambiguedad: Controlado (se explicito fuente de verdad y gates reales).

## Fuentes canonicas verificadas

- `specs/product-design.md`
- `specs/acceptance/HU-018-web-client.feature`
- `specs/constraints-traceability.md`
- `specs/contracts/render-v1-openapi.yaml`
- `specs/api-contract.json`

## Alineaciones confirmadas

1. SDD como proceso obligatorio y trazable por evidencia.
2. Contrato consumer-owned y verificacion exacta.
3. Gates por commit con evidencia para release.
4. Flujo de pruebas por capas (contract -> unit -> e2e/pwa -> evidencia).

## Delimitacion importante

- `docs/requirements/*` es plantilla base para iniciar otro proyecto.
- La trazabilidad normativa del proyecto actual permanece en `specs/constraints-traceability.md` y los escenarios HU-018.

## No conformidades criticas

- Ninguna detectada en contradiccion directa con la spec vigente.

## Recomendacion para proyecto nuevo

Al crear el nuevo repo, copiar `docs/` y luego:

1. Reemplazar plantillas de `docs/requirements/*` por historias/criterios finales del nuevo alcance.
2. Crear/actualizar ADRs desde 0001 segun decisiones del nuevo contexto.
3. Implementar scripts `contract`, `check` y `test:jest`, y documentarlos en `docs/harness`.
