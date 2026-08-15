# Documentacion Base del Proyecto

Este directorio centraliza el modelo de trabajo para iniciar proyectos desde cero con enfoque de especificaciones, ADRs y evidencias de calidad.

## Estado de este directorio

- Este `docs/` es un baseline reutilizable para nuevos proyectos.
- La fuente canonica de este repositorio actual sigue en `specs/`, `scripts/` y pruebas.
- Verificacion de alineacion actual: `docs/accuracy-audit.md`.

## Mapa rapido

- vision-and-scope.md: alcance, limites y objetivos.
- spec-driven-development.md: ciclo SDD y reglas de trazabilidad.
- construction-kickoff.md: pasos iniciales, restricciones y reglas de construccion.
- adr/: decisiones de arquitectura (ADRs) versionadas.
- requirements/: historias de usuario, criterios de aceptacion y matriz.
- harness/: guias para ejecutar pruebas y recolectar evidencia.
- process/: convenciones de commits, PR y Definition of Done.

## Baseline tecnico confirmado

- Framework: Next.js (App Router)
- UI runtime: React
- Lenguaje: JavaScript
- Estilos: Bulma

No se considera un baseline de React puro sin Next.js.

## Flujo recomendado

1. Definir alcance en vision-and-scope.
2. Registrar decisiones clave en ADRs.
3. Escribir/actualizar historias y criterios de aceptacion.
4. Mantener matriz de trazabilidad requisito -> implementacion -> pruebas.
5. Ejecutar harness y adjuntar evidencia por commit.
6. Abrir PR cumpliendo Definition of Done.

## Artefactos fuente actuales

Este baseline se alinea con estos artefactos existentes:

- specs/product-design.md
- specs/acceptance/LEG-WEB.feature
- specs/traceability.md
- specs/api-contract.json
- scripts/verify-api-contract.mjs

## Fuente de verdad (repositorio actual)

Para evitar ambiguedad, en este proyecto la verdad normativa es:

- Producto y limites: `specs/product-design.md`
- Aceptacion: `specs/acceptance/LEG-WEB.feature`
- Trazabilidad SDD: `specs/traceability.md`
- Contrato: `specs/contracts/legacy-openapi.yaml` + `specs/api-contract.json`
- Gate de contrato: `npm run contract`
- Gate base: `npm run check`
- Gate ampliado: `npm run check:full`
