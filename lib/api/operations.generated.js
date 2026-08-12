const legacy = Object.freeze({
  login: { method: "POST", path: "/api/auth/login/", public: true },
  changePassword: { method: "POST", path: "/api/auth/cambiar-contrasena/" },
  listUsers: { method: "GET", path: "/api/usuarios/" },
  createUser: { method: "POST", path: "/api/usuarios/" },
  deactivateUser: { method: "PATCH", path: ({ userId }) => `/api/usuarios/${encodeURIComponent(userId)}/inactivar/` },
  resetUserPassword: { method: "PATCH", path: ({ userId }) => `/api/usuarios/${encodeURIComponent(userId)}/resetear-contrasena/` },
  listLabs: { method: "GET", path: "/api/labs/" },
  createLab: { method: "POST", path: "/api/labs/" },
  updateLab: { method: "PUT", path: ({ labId }) => `/api/labs/${encodeURIComponent(labId)}/` },
  getLabAvailability: { method: "GET", path: "/api/labs/disponibles/" },
  listLabConditions: { method: "GET", path: "/api/condiciones/" },
  createLabCondition: { method: "POST", path: "/api/condiciones/" },
  updateLabCondition: { method: "PUT", path: ({ conditionId }) => `/api/condiciones/${encodeURIComponent(conditionId)}/` },
  listReservations: { method: "GET", path: "/api/reservas/" },
  createReservation: { method: "POST", path: "/api/reservas/" },
  getReservation: { method: "GET", path: ({ reservationId }) => `/api/reservas/${encodeURIComponent(reservationId)}/` },
  updateReservation: { method: "PUT", path: ({ reservationId }) => `/api/reservas/${encodeURIComponent(reservationId)}/modificar/` },
  cancelReservation: { method: "PATCH", path: ({ reservationId }) => `/api/reservas/${encodeURIComponent(reservationId)}/cancelar/` },
  listAuditLogs: { method: "GET", path: "/api/logs/" },
});

const v2 = Object.freeze({
  ...Object.fromEntries(Object.entries(legacy).map(([id, operation]) => [
    id,
    {
      ...operation,
      path: typeof operation.path === "string"
        ? operation.path.replace("/api/", "/api/v2/")
        : (params) => operation.path(params).replace("/api/", "/api/v2/"),
    },
  ])),
  login: { method: "POST", path: "/api/v2/auth/login/", public: true },
  refreshSession: { method: "POST", path: "/api/v2/auth/refresh/", public: true },
  logout: { method: "POST", path: "/api/v2/auth/logout/" },
  getCurrentUser: { method: "GET", path: "/api/v2/auth/me/" },
  changePassword: { method: "POST", path: "/api/v2/auth/change-password/" },
});

export const operationsByProfile = Object.freeze({ legacy, v2 });
