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
- architecture-flow.md: diagramas de arquitectura, flujo y secuencia cliente-API.
- podman-runbook.md: ejecucion local con Podman y compose.
- deployment-free-hosting.md: guia de despliegue en servicios gratuitos (Netlify-first).
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
- specs/acceptance/HU-018-web-client.feature
- specs/api-contract.json
- specs/contracts/legacy-openapi.yaml
- specs/containerization-spec.md
- specs/constraints-traceability.md
- specs/deployment-hosting-spec.md

## Fuente de verdad (repositorio actual)

Para evitar ambiguedad, en este proyecto la verdad normativa es:

- Producto y limites: `specs/product-design.md`
- Aceptacion: `specs/acceptance/HU-018-web-client.feature`
- Contrato: `specs/contracts/legacy-openapi.yaml` + `specs/api-contract.json`
- Contenedores: `specs/containerization-spec.md` + `docs/podman-runbook.md`
- Hosting gratuito: `specs/deployment-hosting-spec.md` + `docs/deployment-free-hosting.md`
- Restricciones y mapeo: `specs/constraints-traceability.md`
- Gates y comandos: se reactivan durante la fase de scaffold inicial.
