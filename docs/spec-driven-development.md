# Spec-Driven Development (SDD)

## Principio

La especificacion es la fuente de verdad. El codigo implementa la spec; no la redefine.

## Perfil vigente de referencia

Para este repositorio, el perfil vigente es `legacy` y su alcance funcional esta descrito por IDs `LEG-WEB-*`, `ERR-001` y `LEG-INT-001`.

- Catalogo funcional: `specs/product-design.md`
- Escenarios: `specs/acceptance/LEG-WEB.feature`
- Matriz normativa: `specs/traceability.md`

## Artefactos obligatorios

- Especificacion de producto.
- Criterios de aceptacion (Gherkin u otro formato verificable).
- Contrato API versionado.
- Matriz de trazabilidad requisito -> codigo -> prueba -> evidencia.
- ADRs para decisiones estructurales.

## Flujo de trabajo

1. Propuesta: nueva necesidad o cambio.
2. Especificacion: actualizar historia/criterio/contrato segun corresponda.
3. Decision: registrar ADR si hay impacto arquitectonico o de gobernanza.
4. Implementacion: cambios en codigo alineados con la spec.
5. Verificacion: ejecutar harness (unit, e2e, contrato, gates).
6. Evidencia: adjuntar resultados trazables al commit.

## Regla de oro

Ningun requisito se considera cerrado sin evidencia automatizada o checklist manual versionado cuando aplique.

## Control de cambios

- Cambio funcional sin cambio de spec: no permitido.
- Cambio de contrato sin verificacion: no permitido.
- Cambio arquitectonico sin ADR: no permitido.

## Gates minimos obligatorios en este repo

- `npm run contract`
- `npm run check`
- `npm run check:full` cuando el cambio impacta UX/E2E/PWA

## Politica trunk-based

- `main` siempre estable y desplegable.
- Branches cortas por tarea y merges frecuentes.
- Convencion de ramas: `feature/<scope>` y `fix/<scope>`.
- Convencion de commits: mensajes cortos en ingles nativo.
- Borrar branches despues del merge para mantener repositorio limpio.

## RPI

En este baseline, RPI se interpreta como:

- Requirements: historias, criterios y trazabilidad.
- Principles: ADRs, limites y reglas de calidad.
- Implementation: codigo + pruebas + evidencia por commit.
