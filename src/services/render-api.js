const DEFAULT_BASE_URL = "https://umg-api-django.onrender.com";
const runtimeBaseUrl = () => typeof window === "undefined" ? undefined : window.__RESERVAS_RUNTIME_CONFIG__?.apiBaseUrl;

export class RenderApiError extends Error {
  constructor({ status = 0, code, details }) {
    super(code);
    this.name = "RenderApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const errorCode = (status) => {
  if (status === 400) return "api.validation";
  if (status === 401) return "api.unauthorized";
  if (status === 403) return "api.forbidden";
  if (status === 404) return "api.notFound";
  if (status === 409) return "api.conflict";
  return status >= 500 ? "api.server" : "api.network";
};

const omitUndefined = (record) => Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined && value !== ""));

export function mapRenderRecord(record) {
  return {
    id: record.UMG_ID ?? record.umg_id,
    name: record.UMG_Nombre ?? record.UMG_Lab_Nombre ?? record.UMG_Docente_Nombre ?? record.UMG_Usuario,
    status: record.UMG_Estado,
    date: record.UMG_Fecha_Reserva ?? record.UMG_Fecha,
    startTime: record.UMG_Hora_Inicio,
    endTime: record.UMG_Hora_Fin,
    reason: record.UMG_Motivo,
    email: record.UMG_Docente_Correo ?? record.UMG_Usuario,
    userId: record.UMG_User_ID,
    labId: record.UMG_Lab_ID,
    labName: record.UMG_Lab_Nombre,
    roleId: record.UMG_Rol_ID,
    roleName: record.UMG_Rol_Nombre,
    type: record.UMG_Tipo,
    createdAt: record.UMG_Fecha_Registro ?? record.UMG_Fecha_Creacion ?? record.umg_fecha_registro,
    raw: record
  };
}

const normalizeResponse = (data) => Array.isArray(data) ? data.map(mapRenderRecord) : data && typeof data === "object" ? mapRenderRecord(data) : data;

const reservationPayload = ({ userId, labId, date, startTime, endTime, reason, requesterId }) => omitUndefined({
  UMG_User_ID: userId,
  UMG_Lab_ID: labId,
  UMG_Fecha_Reserva: date,
  UMG_Hora_Inicio: startTime,
  UMG_Hora_Fin: endTime,
  UMG_Motivo: reason,
  UMG_Solicitante_ID: requesterId
});

export function createRenderApiClient({ baseUrl = runtimeBaseUrl() || process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL, fetchImpl = fetch } = {}) {
  const request = async (path, { method = "GET", body, query } = {}) => {
    const url = new URL(path, `${baseUrl}/`);
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
    });
    let response;
    try {
      response = await fetchImpl(url, {
        method,
        credentials: "omit",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined
      });
    } catch {
      throw new RenderApiError({ code: "api.network" });
    }
    let data = null;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : null;
    } catch {
      throw new RenderApiError({ status: response.status, code: response.ok ? "api.server" : errorCode(response.status) });
    }
    if (!response.ok) throw new RenderApiError({ status: response.status, code: errorCode(response.status), details: data });
    return normalizeResponse(data);
  };
  const operation = (path, method, map = (value) => value) => (input = {}) => request(
    typeof path === "function" ? path(input) : path,
    { method, body: method === "GET" ? undefined : map(input), query: method === "GET" ? input : undefined }
  );

  return {
    login: operation("/api/auth/login/", "POST", ({ username, password }) => ({ UMG_Usuario: username, UMG_Contrasena: password })),
    changePassword: operation("/api/auth/cambiar-contrasena/", "POST", ({ userId, newPassword }) => ({ UMG_ID: userId, NuevaContrasena: newPassword })),
    listUsers: operation("/api/usuarios/", "GET"),
    createUser: operation("/api/usuarios/", "POST", ({ password, roleId, name, lastName, username }) => omitUndefined({ UMG_Contrasena: password, UMG_Rol_ID: roleId, UMG_Nombre: name, UMG_Apellido: lastName, UMG_Usuario: username })),
    deactivateUser: operation(({ id }) => `/api/usuarios/${id}/inactivar/`, "PATCH", () => undefined),
    resetUserPassword: operation(({ id }) => `/api/usuarios/${id}/resetear-contrasena/`, "PATCH", ({ temporaryPassword }) => omitUndefined({ ContrasenaTemporal: temporaryPassword })),
    listLabs: operation("/api/labs/", "GET"),
    createLab: operation("/api/labs/", "POST", ({ name }) => ({ UMG_Nombre: name })),
    updateLab: operation(({ id }) => `/api/labs/${id}/`, "PUT", ({ name, status }) => omitUndefined({ UMG_Nombre: name, UMG_Estado: status })),
    getLabAvailability: operation("/api/labs/disponibles/", "GET"),
    listLabConditions: operation("/api/condiciones/", "GET"),
    createLabCondition: operation("/api/condiciones/", "POST", ({ labId, date, startTime, endTime, type, reason }) => omitUndefined({ UMG_Lab_ID: labId, UMG_Fecha: date, UMG_Hora_Inicio: startTime, UMG_Hora_Fin: endTime, UMG_Tipo: type, UMG_Motivo: reason })),
    updateLabCondition: operation(({ id }) => `/api/condiciones/${id}/`, "PUT", ({ labId, date, startTime, endTime, type, reason, status }) => omitUndefined({ UMG_Lab_ID: labId, UMG_Fecha: date, UMG_Hora_Inicio: startTime, UMG_Hora_Fin: endTime, UMG_Tipo: type, UMG_Motivo: reason, UMG_Estado: status })),
    listReservations: operation("/api/reservas/", "GET"),
    createReservation: operation("/api/reservas/", "POST", reservationPayload),
    getReservation: operation(({ id }) => `/api/reservas/${id}/`, "GET"),
    updateReservation: operation(({ id }) => `/api/reservas/${id}/modificar/`, "PUT", reservationPayload),
    cancelReservation: operation(({ id }) => `/api/reservas/${id}/cancelar/`, "PATCH", ({ requesterId }) => requesterId === undefined ? undefined : { UMG_Solicitante_ID: requesterId }),
    listAuditLogs: operation("/api/logs/", "GET")
  };
}
