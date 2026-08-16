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

const asArray = (value) => (Array.isArray(value) ? value : [value]);

export function mapRenderRecord(record) {
  return {
    id: record.UMG_ID ?? record.umg_id,
    name: record.UMG_Nombre ?? record.UMG_Lab_Nombre,
    status: record.UMG_Estado,
    date: record.UMG_Fecha_Reserva ?? record.UMG_Fecha,
    startTime: record.UMG_Hora_Inicio,
    endTime: record.UMG_Hora_Fin,
    reason: record.UMG_Motivo,
    raw: record
  };
}

export function createRenderApiClient({ baseUrl = runtimeBaseUrl() || process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL, fetchImpl = fetch } = {}) {
  const request = async (path, { method = "GET", body, query } = {}) => {
    const url = new URL(path, `${baseUrl}/`);
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
    });
    let response;
    try {
      response = await fetchImpl(url, { method, credentials: "include", headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
    } catch {
      throw new RenderApiError({ code: "api.network" });
    }
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) throw new RenderApiError({ status: response.status, code: errorCode(response.status), details: data });
    return Array.isArray(data) ? data.map(mapRenderRecord) : data && typeof data === "object" ? mapRenderRecord(data) : data;
  };
  const operation = (path, method, map = (value) => value) => (input = {}) => request(typeof path === "function" ? path(input) : path, { method, body: map(input), query: method === "GET" ? input : undefined });
  return {
    login: operation("/api/auth/login/", "POST", ({ username, password }) => ({ UMG_Usuario: username, UMG_Contrasena: password })),
    changePassword: operation("/api/auth/cambiar-contrasena/", "POST", ({ userId, newPassword }) => ({ UMG_ID: userId, NuevaContrasena: newPassword })),
    listUsers: operation("/api/usuarios/", "GET"), createUser: operation("/api/usuarios/", "POST"),
    deactivateUser: operation(({ id }) => `/api/usuarios/${id}/inactivar/`, "PATCH"), resetUserPassword: operation(({ id }) => `/api/usuarios/${id}/resetear-contrasena/`, "PATCH"),
    listLabs: operation("/api/labs/", "GET"), createLab: operation("/api/labs/", "POST"), updateLab: operation(({ id }) => `/api/labs/${id}/`, "PUT"),
    getLabAvailability: operation("/api/labs/disponibles/", "GET"), listLabConditions: operation("/api/condiciones/", "GET"), createLabCondition: operation("/api/condiciones/", "POST"), updateLabCondition: operation(({ id }) => `/api/condiciones/${id}/`, "PUT"),
    listReservations: operation("/api/reservas/", "GET"), createReservation: operation("/api/reservas/", "POST", ({userId,labId,date,startTime,endTime,reason})=>({UMG_User_ID:userId,UMG_Lab_ID:labId,UMG_Fecha_Reserva:date,UMG_Hora_Inicio:startTime,UMG_Hora_Fin:endTime,UMG_Motivo:reason})), getReservation: operation(({ id }) => `/api/reservas/${id}/`, "GET"), updateReservation: operation(({ id }) => `/api/reservas/${id}/modificar/`, "PUT"), cancelReservation: operation(({ id }) => `/api/reservas/${id}/cancelar/`, "PATCH"), listAuditLogs: operation("/api/logs/", "GET")
  };
}
