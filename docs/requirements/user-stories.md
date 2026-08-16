# User Stories Mapped

Este archivo lista las historias activas y su mapeo directo a criterios de aceptacion.

## HU-018: Web client journeys

- Como visitante, quiero entender el servicio desde la landing para saber como reservar.
	- Escenarios: `HU-018-S01`
- Como usuario institucional, quiero comprobar opcionalmente el login publicado sin bloquear el acceso directo al portal.
	- Escenarios: `HU-018-S02`
- Como visitante directo, quiero buscar disponibilidad accesible para identificar laboratorios libres.
	- Escenarios: `HU-018-S03`
- Como docente, quiero crear una reserva desde disponibilidad para confirmar mi espacio de laboratorio.
	- Escenarios: `HU-018-S04`
- Como visitante directo, quiero gestionar una reserva futura según las operaciones que Render publica.
	- Escenarios: `HU-018-S05`
- Como visitante directo, quiero usar las superficies administrativas y de auditoria que Render publica.
	- Escenarios: `HU-018-S06`
- Como usuario PWA, quiero comportamiento offline seguro para evitar mutaciones inseguras sin conectividad.
	- Escenarios: `HU-018-S07`
- Como usuario con tecnologia de asistencia, quiero recorridos accesibles con foco y anuncios correctos.
	- Escenarios: `HU-018-S08`

## Historias relacionadas (tags)

Los escenarios incorporan relaciones con historias referenciadas por tags:

- `HU-001`, `HU-003`, `HU-007`, `HU-008`, `HU-011`, `HU-012`, `HU-013`, `HU-015`, `HU-017`

Fuente canonica de escenarios:

- `specs/acceptance/HU-018-web-client.feature`

## TODO de seguridad del backend

Render v1 publica una alternativa anónima. El frontend no debe fingir identidad ni
usar un guard local como sustituto de autorización. Cuando Render aplique un
esquema obligatorio con identidad actual y permisos por operación, estas historias
deben volver a incorporar autenticación y autorización verificables de extremo a
extremo.
