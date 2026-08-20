# User Stories Mapped

Este archivo lista las historias activas y su mapeo directo a criterios de aceptacion.

## HU-018: Web client journeys

- Como visitante, quiero entender el servicio desde la landing para saber como reservar.
	- Escenarios: `HU-018-S01`
- Como usuario institucional, quiero iniciar sesión con Render antes de usar el portal sin almacenar mi contraseña.
	- Escenarios: `HU-018-S02`
- Como usuario autenticado, quiero buscar disponibilidad accesible para identificar laboratorios libres.
	- Escenarios: `HU-018-S03`
- Como docente, quiero crear una reserva desde disponibilidad para confirmar mi espacio de laboratorio.
	- Escenarios: `HU-018-S04`
- Como profesor, quiero gestionar solo mis reservas futuras; como administrador, quiero gestionar todas las reservas futuras.
	- Escenarios: `HU-018-S05`
- Como administrador, quiero administrar usuarios en una superficie dedicada (crear, restablecer e inactivar); como profesor, no quiero ver ni acceder a la lista de usuarios.
	- Escenarios: `HU-018-S06`
- Como usuario autenticado, quiero entender la actividad real de auditoría por semana o rango de fechas sin depender de una consulta no publicada.
	- Escenarios: `HU-018-S09`
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

Render v1 aún publica una alternativa anónima. El frontend usa el login publicado
para la experiencia de sesión, pero el guard y el rol local no sustituyen la
autorización. Render debe aplicar identidad y permisos por operación para que estas
historias queden protegidas de extremo a extremo.
