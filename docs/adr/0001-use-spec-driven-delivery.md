# ADR 0001: Adoptar desarrollo guiado por especificaciones (SDD)

## Estado
Aprobado

## Contexto

Se requiere reproducibilidad funcional entre requisitos, implementacion y pruebas para iniciar proyectos desde cero sin ambiguedad.

## Decision

Adoptar SDD como proceso obligatorio:

- La especificacion define comportamiento esperado.
- La implementacion debe mapearse a requisitos trazables.
- La validacion se ejecuta con harness estandar.

## Consecuencias

- Positivas: menos deriva funcional y mayor auditabilidad.
- Costos: mayor disciplina documental y de mantenimiento.

## Cumplimiento

- Historias y criterios actualizados por cambio funcional.
- Matriz de trazabilidad cerrada por release.
- Evidencia de pruebas asociada al commit.
