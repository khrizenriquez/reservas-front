const STATUS = Object.freeze({ R: "ACTIVE", C: "CANCELLED", F: "COMPLETED" });

function roleName(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "admin" || normalized === "administrador") return "ADMIN";
  if (normalized === "docente") return "TEACHER";
  return String(value ?? "UNKNOWN").toUpperCase();
}

export function mapUser(value) {
  if (!value) return null;
  return {
    id: Number(value.UMG_ID),
    username: value.UMG_Usuario,
    firstName: value.UMG_Nombre,
    lastName: value.UMG_Apellido,
    role: { id: Number(value.UMG_Rol_ID), name: roleName(value.UMG_Rol_Nombre) },
    active: Number(value.UMG_Estado ?? 1) === 1,
    mustChangePassword: Boolean(value.RequiereCambioContrasena ?? Number(value.UMG_Ingreso) === 0),
    createdAt: value.UMG_Fecha_Creacion ?? null,
    lastAccessAt: value.UMG_Ultimo_Acceso ?? null,
  };
}

export function mapLab(value) {
  return {
    id: Number(value.UMG_ID),
    name: value.UMG_Nombre,
    active: Number(value.UMG_Estado) === 1,
    createdAt: value.UMG_Fecha_Registro ?? null,
  };
}

export function mapReservation(value) {
  return {
    id: Number(value.UMG_ID),
    userId: Number(value.UMG_User_ID),
    teacherName: value.UMG_Docente_Nombre,
    teacherEmail: value.UMG_Docente_Correo,
    labId: Number(value.UMG_Lab_ID),
    labName: value.UMG_Lab_Nombre,
    date: value.UMG_Fecha_Reserva,
    startTime: value.UMG_Hora_Inicio,
    endTime: value.UMG_Hora_Fin,
    reason: value.UMG_Motivo,
    status: STATUS[value.UMG_Estado] ?? value.UMG_Estado,
    createdAt: value.UMG_Fecha_Registro,
  };
}

export function mapCondition(value) {
  return {
    id: Number(value.UMG_ID),
    labId: value.UMG_Lab_ID == null ? null : Number(value.UMG_Lab_ID),
    labName: value.UMG_Lab_Nombre,
    date: value.UMG_Fecha,
    startTime: value.UMG_Hora_Inicio,
    endTime: value.UMG_Hora_Fin,
    type: value.UMG_Tipo,
    reason: value.UMG_Motivo,
    active: Number(value.UMG_Estado) === 1,
    createdAt: value.UMG_Fecha_Registro,
  };
}

export function mapLog(value) {
  return {
    id: Number(value.umg_id),
    userId: value.umg_user == null ? null : Number(value.umg_user),
    action: value.umg_accion,
    module: value.umg_modulo,
    description: value.umg_descripcion,
    createdAt: value.umg_fecha_registro,
  };
}

const hhmm = (value) => String(value ?? "").slice(0, 5);

export function adaptRequest(operationId, { query = {}, body, actor, profile } = {}) {
  const nextQuery = { ...query };
  let nextBody = body === undefined ? undefined : { ...body };
  if (operationId === "login") {
    nextBody = {
      UMG_Usuario: String(body?.username ?? "").trim(),
      UMG_Contrasena: body?.password ?? "",
    };
  } else if (operationId === "changePassword") {
    nextBody = profile === "v2"
      ? { currentPassword: body.currentPassword, newPassword: body.newPassword }
      : { UMG_ID: actor.id, NuevaContrasena: body.newPassword };
  } else if (operationId === "getLabAvailability") {
    Object.assign(nextQuery, {
      fecha: query.date,
      hora_inicio: hhmm(query.startTime),
      hora_fin: hhmm(query.endTime),
    });
    delete nextQuery.date;
    delete nextQuery.startTime;
    delete nextQuery.endTime;
  } else if (operationId === "listReservations") {
    nextQuery.userId = actor?.role?.name === "ADMIN" ? query.userId : actor?.id;
    if (query.date) nextQuery.fecha = query.date;
    delete nextQuery.limit;
    delete nextQuery.dateFrom;
    delete nextQuery.status;
    delete nextQuery.date;
  } else if (operationId === "createReservation" || operationId === "updateReservation") {
    nextBody = {
      UMG_User_ID: actor.id,
      UMG_Lab_ID: body.labId,
      UMG_Fecha_Reserva: body.date,
      UMG_Hora_Inicio: body.startTime,
      UMG_Hora_Fin: body.endTime,
      UMG_Motivo: body.reason,
      UMG_Solicitante_ID: actor.id,
    };
  } else if (operationId === "cancelReservation") {
    nextBody = { UMG_Solicitante_ID: actor.id };
  } else if (operationId === "createUser") {
    nextBody = {
      UMG_Usuario: body.username,
      UMG_Contrasena: body.password,
      UMG_Nombre: body.firstName,
      UMG_Apellido: body.lastName,
      UMG_Rol_ID: body.roleId,
    };
  } else if (operationId === "resetUserPassword") {
    nextBody = { ContrasenaTemporal: body.password };
  } else if (operationId === "createLab") {
    nextBody = { UMG_Nombre: body.name };
  } else if (operationId === "updateLab") {
    nextBody = { UMG_Nombre: body.name, UMG_Estado: body.active ? 1 : 0 };
  } else if (operationId === "createLabCondition" || operationId === "updateLabCondition") {
    nextBody = {
      UMG_Lab_ID: body.labId || null,
      UMG_Fecha: body.date,
      UMG_Hora_Inicio: body.startTime,
      UMG_Hora_Fin: body.endTime,
      UMG_Tipo: body.type,
      UMG_Motivo: body.reason,
      UMG_Estado: body.active === false ? 0 : 1,
    };
  } else if (operationId === "listAuditLogs") {
    nextQuery.UMG_User_ID = actor?.id;
    delete nextQuery.limit;
    delete nextQuery.module;
    delete nextQuery.action;
    delete nextQuery.userId;
  }
  return { query: nextQuery, body: nextBody };
}

export function adaptResponse(operationId, payload, options = {}) {
  if (operationId === "login") {
    if (options.profile === "legacy") return { user: mapUser(payload), legacy: true };
    return { ...payload, user: mapUser(payload.user) };
  }
  if (operationId === "refreshSession") return { ...payload, user: mapUser(payload.user) };
  if (operationId === "getCurrentUser") return mapUser(payload);
  if (operationId === "listUsers") {
    const items = payload.map(mapUser);
    return { items, total: items.length };
  }
  if (["listLabs", "getLabAvailability"].includes(operationId)) return payload.map(mapLab);
  if (["listLabConditions"].includes(operationId)) {
    const items = payload.map(mapCondition);
    return { items, total: items.length };
  }
  if (operationId === "listReservations") {
    const requested = options.originalQuery ?? {};
    let items = payload.map(mapReservation);
    if (requested.dateFrom) items = items.filter((item) => item.date >= requested.dateFrom);
    if (requested.status) items = items.filter((item) => item.status === requested.status);
    return { items, total: items.length };
  }
  if (["createReservation", "getReservation"].includes(operationId)) return mapReservation(payload);
  if (operationId === "listAuditLogs") {
    const requested = options.originalQuery ?? {};
    let items = payload.map(mapLog);
    if (requested.module) items = items.filter((item) => item.module.toLowerCase().includes(requested.module.toLowerCase()));
    if (requested.action) items = items.filter((item) => item.action.toLowerCase().includes(requested.action.toLowerCase()));
    if (requested.userId) items = items.filter((item) => String(item.userId) === String(requested.userId));
    return { items, total: items.length };
  }
  return payload;
}
