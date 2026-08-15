# ADR 0003: Exigir gates con evidencia por commit para release

## Estado
Aprobado

## Contexto

Los resultados narrativos sin artefactos no permiten auditoria ni repetibilidad.

## Decision

Un gate solo se considera aprobado cuando existe evidencia ejecutable y asociada a commit:

- Resultado de contrato
- Resultado de pruebas unitarias
- Resultado de pruebas E2E relevantes
- Evidencia manual versionada cuando aplique

## Consecuencias

- Positivas: mayor confianza para release y reproduccion de resultados.
- Costos: disciplina operativa adicional y almacenamiento de reportes.

## Cumplimiento

- Todo PR debe incluir evidencia o referencia inequvoca al pipeline.
- Cambios sin evidencia quedan bloqueados para merge.
