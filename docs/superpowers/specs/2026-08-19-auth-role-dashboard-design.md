# Login, roles y tablero de auditoría — diseño

**Fecha:** 2026-08-19  
**Rama:** `feature/auth-role-dashboard`  
**Estado:** aprobado para documentación; pendiente de implementación

## Objetivo

Convertir el portal en una experiencia de operación con inicio de sesión real de
Render, identidad de interfaz y permisos visuales Admin/Profesor. El acceso tendrá
solo correo y contraseña: no mostrará registro ni recuperación de contraseña.
También se ampliará la administración de usuarios con las operaciones que Render
realmente publica y se rediseñará el tablero de logs con gráficas de datos reales.

## Contrato y límites reales

El único backend sigue siendo Render v1. Se usarán exclusivamente estas operaciones
publicadas:

| Necesidad | Operación publicada | Uso de la interfaz |
|---|---|---|
| Validar acceso | `POST /api/auth/login/` | Login con credenciales introducidas por la persona. |
| Leer usuarios | `GET /api/usuarios/` | Lista administrativa. |
| Crear usuario | `POST /api/usuarios/` | Solo visible y ejecutable por Admin. |
| Inactivar usuario | `PATCH /api/usuarios/{id}/inactivar/` | Solo Admin y con confirmación. |
| Cambiar contraseña | `POST /api/auth/cambiar-contrasena/` | Solo para la propia identidad en la interfaz. |
| Restablecer contraseña | `PATCH /api/usuarios/{id}/resetear-contrasena/` | Solo Admin en la interfaz. |

Render no publica una operación para editar el perfil de un usuario, reactivar uno
inactivado ni asociar un laboratorio a un usuario. Esas acciones no se simularán ni
se inventarán como peticiones `PUT`/`PATCH`. La interfaz documentará esa brecha.

Render tampoco obliga actualmente autenticación ni autorización en el servidor. La
sesión y las reglas de rol de este incremento controlan la experiencia del cliente;
no sustituyen la obligatoriedad de autenticación y permisos que el backend debe
imponer antes de un despliegue de seguridad real.

## Identidad y acceso

`AuthProvider` será el único dueño de la sesión de interfaz. Después de un login
correcto normalizará únicamente el identificador, nombre y rol que entregue la
respuesta de Render, y los guardará en `sessionStorage` durante la pestaña actual.
Nunca guardará ni registrará la contraseña, tokens, cookies ni respuestas completas.

Las rutas del portal requerirán esa identidad y redirigirán a `/acceso` si no existe.
`/acceso` no tendrá enlaces, controles ni pantallas de registro o recuperación. Al
iniciar sesión se redirige al resumen; al cerrar sesión se limpia la identidad local
y se vuelve a acceso. Todas las cadenas, validaciones y ARIA son ES/EN.

## Matriz de permisos de interfaz

| Recurso | Admin | Profesor |
|---|---|---|
| Resumen, disponibilidad y logs | Ver todo | Ver todo |
| Reservas | Crear, inspeccionar, modificar/cancelar cualquiera | Crear, inspeccionar todas; modificar/cancelar solo si `UMG_User_ID` coincide con su identidad |
| Laboratorios y condiciones | Ver y administrar todo | Solo lectura: Render no expone propietario de laboratorio |
| Usuarios | Ver lista, crear, inactivar, restablecer contraseña | Ver lista; cambiar únicamente su propia contraseña |
| Inactivar usuarios | Sí, con confirmación | No |

Los controles no autorizados no se renderizan y sus callbacks vuelven a verificar la
identidad/rol. Una respuesta 401/403/4xx/5xx se mantiene como mensaje localizado y
amigable; no se muestra el cuerpo técnico de Render.

## Tablero de logs

La inspiración toma la jerarquía de información de Tabler y los patrones de gráficas
Bulma de Shuffle, sin copiar código, plantilla o ilustraciones. Tabler completo se
basa en Bootstrap 5, por lo que no se integrará con el proyecto Bulma. Shuffle
publica sus ejemplos visuales, pero reserva el HTML de componentes para clientes
activos; se implementarán componentes originales.

El dashboard conservará la paleta institucional: navy para estructura, azul de
reservas para series, teal para actividad correcta, amber para atención y danger
para errores. Su firma será una **banda de auditoría**: tendencia de los últimos
siete días con segmentos por módulo y un marcador de la actividad reciente.

No se añadirá una librería de gráficas. Componentes SVG/CSS propios, pequeños y
accesibles mostrarán:

- conteo total, módulos y acción dominante;
- tendencia diaria de registros;
- barras de actividad por módulo;
- lista paginada de eventos recientes con filtros ya publicados;
- estados de carga, vacío y error.

`@tabler/icons-react` se añadirá como dependencia MIT, mediante imports directos
para conservar tree-shaking. Bulma seguirá siendo el único framework CSS.

## Intento visual

- **Persona:** coordinador o docente que consulta disponibilidad y deja evidencia
  de una operación entre clases.
- **Dominio:** bitácora, horario, riel de tiempo, laboratorio, firma de auditoría,
  expediente académico.
- **Mundo de color:** tinta navy, papel institucional, luz teal de equipo libre,
  marcador amber, sello rojo de acción sensible y azul de reserva.
- **Firma:** banda de auditoría que conecta métricas, tendencia y último evento.
- **Decisiones no genéricas:** se reemplazan tarjetas métricas idénticas por una
  banda temporal; se reemplaza una gráfica de marketing por actividad auditada; se
  evita Bootstrap para conservar las capas, tipografía y controles Bulma existentes.

Las capas usarán bordes de baja intensidad y cambios sutiles de superficie. La
escala de espaciado es 4/8/12/16/24/32, controles mínimos de 44 px y datos numéricos
con alineación tabular. Tema oscuro conserva contraste y separación por bordes.

## Pruebas y evidencia

- Cliente API: body y método de login, creación, inactivación, cambio y reset de
  contraseña; errores normalizados.
- `AuthProvider`: identidad permitida, sesión sin contraseña, cierre y redirección.
- Rutas: bloqueo sin identidad, Admin con acciones permitidas y Profesor sin
  acciones prohibidas; edición de reserva limitada a propiedad.
- Usuarios: renderizado de lista, creación/Inactivar solo Admin y confirmación.
- Logs: métricas y gráficas se derivan exclusivamente de respuestas de logs,
  incluidas carga, vacío, errores e idioma.
- Accesibilidad: navegación por teclado, foco de diálogos, etiquetas/formularios,
  estados anunciados y contraste.
- Puertas locales: `npm run contract`, `npm run check`, `npm run test:jest`,
  `npm run release:check`, `npm run build` y flujo local de login contra Render
  usando credenciales proporcionadas fuera del repositorio.

## No objetivos

- Crear endpoints, proxies, token refresh, recuperación de contraseña o registro
  desde la pantalla de login.
- Tratar los permisos de cliente como seguridad del backend.
- Copiar código de Tabler o Shuffle, usar Bootstrap o mostrar métricas falsas.
