# Vision y Alcance

## Vision

Entregar un cliente web reproducible, verificable y mantenible, gobernado por especificaciones y evidencia automatizada.

## Objetivos

- Alinear funcionalidades con historias y criterios aprobados.
- Evitar deriva funcional entre implementacion, contrato y pruebas.
- Garantizar que cada cambio sea auditable por commit.

## No objetivos

- Agregar capacidades fuera del contrato aprobado.
- Marcar una entrega como valida sin evidencia ejecutable.

## Limites operativos

- El contrato API es fuente normativa para integracion.
- Los requisitos funcionales se gestionan por historia + criterio.
- La aceptacion requiere trazabilidad cerrada.

## KPI iniciales

- Cobertura de trazabilidad >= 100% de requisitos activos.
- Gates de contrato y pruebas en verde por commit de release.
- 0 cambios de comportamiento sin actualizacion de spec/ADR.
