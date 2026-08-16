# Acceso directo anónimo a Render v1 — diseño

**Fecha:** 2026-08-16

**Rama:** `fix/anonymous-render-access`
**Estado:** pendiente de revisión del usuario

## Contexto y evidencia

El único contrato permitido por el cliente es Render v1. La instantánea verificada
`specs/contracts/render-v1-openapi.yaml` publica `POST /api/usuarios/` con el
resumen **Crear usuarios**. Sus operaciones declaran tres alternativas de
seguridad: `cookieAuth`, `basicAuth` y `{}`. La alternativa vacía permite una
llamada anónima según OpenAPI.

No se creará un usuario de prueba ni se enviarán mutaciones para comprobarlo: eso
alteraría datos reales. Un intento de comprobación HTTP de solo lectura contra
Render agotó 30 segundos sin respuesta el 2026-08-16, por lo que la evidencia
operativa es el contrato versionado y no una cuenta fabricada por el frontend.

## Decisión

El cliente adoptará acceso directo anónimo para todas las páginas del portal.
No persistirá ni exigirá usuario, contraseña, cookie, token, rol o identidad local
para navegar o llamar a Render v1.

`/acceso` se conserva como una página opcional de diagnóstico del endpoint
publicado `POST /api/auth/login/`; no será requisito ni puerta de entrada de
`/portal`.

## Comportamiento por área

| Área | Comportamiento nuevo |
| --- | --- |
| Navegación del portal | Se muestra sin `SessionProvider` y sin guard de sesión. |
| Administración | Se abre sin comprobación de rol del cliente, porque Render v1 declara acceso anónimo. |
| Perfil | Declara con claridad que no existe identidad de visitante; no inventa un perfil actual. |
| Disponibilidad | Conserva sus consultas Render v1 directas, sin sesión. |
| Reservas | Lista y consulta datos sin filtro de identidad. No genera un identificador de usuario ni falsifica propiedad. Las acciones que Render rechace por datos faltantes muestran el error localizado existente. |
| Acceso | Puede probar login de Render, pero su resultado no habilita, persiste ni bloquea otras rutas. |

El cliente seguirá usando `fetch`, `credentials: "omit"` y las rutas verificadas
en el contrato. No habrá proxy, endpoints alternativos, credenciales de ejemplo ni
interpretación de un supuesto perfil v2.

## Pruebas y criterios de salida

- Cambiar pruebas unitarias de layout, portal, administración, perfil y reservas
  para montar las rutas sin sesión y afirmar que el contenido queda disponible.
- Conservar y ajustar las pruebas de `/acceso` para confirmar que el login sigue
  siendo opcional y usa exclusivamente su operación Render v1.
- Ajustar pruebas de `render-api` para confirmar llamadas sin credenciales ni
  endpoints inventados.
- Ejecutar `npm run contract`, `npm run check` y `npm run test:jest`; la cobertura
  global debe permanecer por encima de 80 %.

## Deuda de seguridad explícita

La autorización real no puede ser suplida por un guard de interfaz. Mientras el
contrato y la implementación de Render v1 permitan llamadas anónimas, datos y
operaciones potencialmente administrativas quedan expuestos por el backend. Esto
es una deuda de seguridad del servicio, no una autorización que el frontend pueda
corregir de forma fiable.

**TODO para backend:** publicar y aplicar un esquema de autenticación obligatorio
en Render v1, definir identidad actual y permisos por operación, y actualizar CORS
si se usan credenciales. Solo con ese contrato aplicado se reintroducirán login,
autorización y pruebas de control de acceso de extremo a extremo en el cliente.

## No objetivos

- Crear usuarios o datos de demostración.
- Guardar tokens, cookies o contraseñas.
- Añadir un proxy, BFF, endpoint v2 o contrato alternativo.
- Pretender que ocultar enlaces constituye seguridad.
