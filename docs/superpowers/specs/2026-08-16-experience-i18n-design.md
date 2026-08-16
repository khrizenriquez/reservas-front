# Tema, carga progresiva, logs e i18n completo — diseño

**Fecha:** 2026-08-16

**Rama:** `feature/experience-i18n`

**Estado:** pendiente de revisión del usuario

## Objetivo

Mejorar la percepción de velocidad y la claridad del cliente sin inventar API:
añadir tema nocturno, estados de carga visibles, carga diferida de rutas, una vista
explícita de logs y localización completa de todo texto estático de interfaz.

El contrato Render v1 ya publica `GET /api/logs/` (`logs_retrieve`, con
`UMG_User_ID` opcional) y el API client ya lo expone como `listAuditLogs()`. La
nueva vista solo consumirá esa operación publicada.

## Arquitectura

### Tema

`ThemeProvider` administrará `light`/`dark` sin dependencias. En la primera visita
usará `prefers-color-scheme`; después conservará la preferencia explícita en
`localStorage` bajo una clave de apariencia no sensible. El proveedor colocará
`data-theme` en el elemento raíz y el CSS reemplazará colores fijos por tokens
semánticos. Un botón accesible en las navegaciones pública y de portal mostrará la
acción localizada para cambiar de tema.

El tema no comparte ni persiste credenciales, identidad ni respuesta de login.

### Carga visible y diferida

Cada ruta de portal tendrá `loading.js` para que App Router muestre una pantalla
de carga inmediatamente durante navegación diferida. `LoadingState` será el
componente accesible reutilizable para carga de datos dentro de una ruta, con
`role="status"`, texto localizado y animación compatible con reducción de
movimiento.

Las rutas de App Router se entregan en chunks independientes. Administración y
logs se cargarán bajo rutas propias, de modo que sus módulos y consultas no formen
parte de la carga inicial de landing, acceso, resumen o reservas. No se usará un
spinner que oculte errores: al terminar una consulta se conserva el mensaje API
localizado existente.

### Logs

Se añadirá `/portal/logs`, con enlace visible "Logs"/"Logs" en el portal. La ruta
listará las respuestas de `GET /api/logs/` usando el mapper actual y mostrará
fecha, módulo, acción y descripción. La información recibida del backend no se
traduce ni altera. Se mantendrá el resumen de auditoría en Administración para no
romper el flujo existente.

### i18n

`src/lib/i18n.js` se convertirá en el único diccionario de textos de interfaz ES y
EN, con claves anidadas por área (`landing`, `access`, `portal`, `reservations`,
`admin`, `logs`, `loading`, `theme`, `common` y errores). Cada componente que
renderice texto fijo consumirá `t(key)` desde `LanguageProvider`; incluye títulos,
etiquetas, botones, confirmaciones, placeholders, estados vacíos, ayudas,
atributos ARIA y textos de carga.

Los valores de la base de datos, los códigos de API y las URLs permanecen sin
traducción. El selector existente cambia todo el árbol React inmediatamente y
conserva el idioma durante la pestaña actual.

## Manejo de errores y accesibilidad

- Estados de carga tienen texto, no solo animación, y no desplazan el foco.
- El toggle de tema declara la acción y el estado con texto/ARIA localizado.
- Los contrastes de tema nocturno respetan la paleta institucional y los focus
  rings permanecen visibles.
- 4xx/5xx siguen pasando por `StatusMessage`; el loader nunca afirma que la
  operación fue exitosa.

## Pruebas y salida

- Pruebas de `ThemeProvider`/toggle: sistema, cambio explícito, persistencia y
  atributo raíz.
- Pruebas de `LoadingState` y archivos `loading.js`: texto ES/EN y semántica.
- Pruebas de `/portal/logs`: llamada a `listAuditLogs`, datos sin traducir, carga y
  error localizado.
- Pruebas de cambio de idioma sobre landing, acceso, portal, reservas,
  administración, disponibilidad, perfil, offline y nuevos controles; ninguna
  cadena fija de UI queda fuera de `i18n.js`.
- Ejecutar `npm run contract`, `npm run check`, `npm run test:jest`,
  `npm run release:check`, `npm run build` y una comprobación local de rutas.

## No objetivos

- Cambiar datos devueltos por Render, URLs o el contrato v1.
- Añadir una librería de temas/i18n, proxy, autenticación o endpoints nuevos.
- Traducir contenido de base de datos.
