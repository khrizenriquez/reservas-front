# Commit Conventions

## Convencion recomendada

tipo(alcance): descripcion breve

Ejemplos:
- feat(auth): agregar validacion de cambio obligatorio
- fix(contract): corregir mapeo de operationId en adaptador
- test(e2e): cubrir flujo de cancelacion futura
- docs(adr): registrar decision de evidencia por commit

## Reglas

- Un commit debe ser coherente y trazable.
- Si cambia comportamiento, incluir referencia a requisito/escenario.
- Evitar mezclar refactors no relacionados con cambios funcionales.
