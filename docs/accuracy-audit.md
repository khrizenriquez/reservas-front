# Accuracy Audit: docs vs specs

Fecha: 2026-08-15

## Objetivo

Validar que `docs/` represente fielmente el estado real del proyecto y distinguir contenido canonico vs plantilla reutilizable.

## Resultado ejecutivo

- Alineacion global: Alta.
- Riesgo de ambiguedad: Controlado (se explicito fuente de verdad y gates reales).

## Fuentes canonicas verificadas

- `specs/product-design.md`
- `specs/acceptance/LEG-WEB.feature`
- `specs/traceability.md`
- `specs/contracts/legacy-openapi.yaml`
- `specs/api-contract.json`
- `scripts/verify-api-contract.mjs`
- `package.json` scripts `contract`, `check`, `check:full`

## Alineaciones confirmadas

1. SDD como proceso obligatorio y trazable por evidencia.
2. Contrato consumer-owned y verificacion exacta.
3. Gates por commit con evidencia para release.
4. Flujo de pruebas por capas (contract -> unit -> e2e/pwa -> evidencia).

## Delimitacion importante

- `docs/requirements/*` es plantilla base para iniciar otro proyecto.
- La trazabilidad normativa del proyecto actual permanece en `specs/traceability.md` con IDs `LEG-WEB-*`, `ERR-001`, `LEG-INT-001`.

## No conformidades criticas

- Ninguna detectada en contradiccion directa con la spec vigente.

## Recomendacion para proyecto nuevo

Al crear el nuevo repo, copiar `docs/` y luego:

1. Reemplazar plantillas de `docs/requirements/*` por historias/criterios finales del nuevo alcance.
2. Crear/actualizar ADRs desde 0001 segun decisiones del nuevo contexto.
3. Implementar scripts equivalentes a `contract`, `check`, `check:full` y documentarlos en `docs/harness`.
