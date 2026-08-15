# Traceability Matrix Base

## Objetivo

Cerrar el ciclo requisito -> implementacion -> prueba -> evidencia por commit.

| Requisito | Escenario | Contrato | Implementacion | Prueba | Evidencia |
|---|---|---|---|---|---|
| US-001 | AC-001-S01 | N/A o operationId | ruta/modulo | test-id | enlace al reporte |

## Reglas de cierre

- No hay requisito cerrado sin evidencia.
- Si cambia implementacion observable, se revisa escenario y prueba.
- Si cambia contrato, se actualiza matriz y se rerun del gate.
