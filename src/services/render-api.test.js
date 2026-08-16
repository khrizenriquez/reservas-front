import { createRenderApiClient, RenderApiError } from "./render-api";

const response = (status, body) => ({ ok: status < 400, status, text: async () => JSON.stringify(body) });

describe("Render API client", () => {
  it("maps login to the published Render payload and normalizes responses", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(response(200, [{ UMG_ID: 1, UMG_Nombre: "A1", UMG_Estado: 1 }]));
    const client = createRenderApiClient({ baseUrl: "https://render.test", fetchImpl });
    await expect(client.login({ username: "docente@umg.edu.gt", password: "secret" })).resolves.toEqual([expect.objectContaining({ id: 1, name: "A1" })]);
    expect(fetchImpl).toHaveBeenCalledWith(expect.objectContaining({ pathname: "/api/auth/login/" }), expect.objectContaining({ method: "POST", credentials: "omit", body: JSON.stringify({ UMG_Usuario: "docente@umg.edu.gt", UMG_Contrasena: "secret" }) }));
  });

  it("maps availability query parameters and contract paths", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(response(200, []));
    const client = createRenderApiClient({ baseUrl: "https://render.test", fetchImpl });
    await client.getLabAvailability({ fecha: "2026-08-15", hora_inicio: "08:00", hora_fin: "09:00" });
    expect(fetchImpl.mock.calls[0][0].toString()).toContain("/api/labs/disponibles/?fecha=2026-08-15&hora_inicio=08%3A00&hora_fin=09%3A00");
  });

  it("lists reservations directly without identity, cookies, or query filters", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(response(200, []));
    const client = createRenderApiClient({ baseUrl: "https://render.test", fetchImpl });
    await client.listReservations();
    const [url, options] = fetchImpl.mock.calls[0];
    expect(url.toString()).toBe("https://render.test/api/reservas/");
    expect(options).toEqual(expect.objectContaining({ method: "GET", credentials: "omit" }));
  });

  it("uses friendly error keys for API and network failures", async () => {
    const client = createRenderApiClient({ baseUrl: "https://render.test", fetchImpl: jest.fn().mockResolvedValue(response(403, { detail: "no" })) });
    await expect(client.listLabs()).rejects.toMatchObject({ name: "RenderApiError", code: "api.forbidden", status: 403 });
    const offline = createRenderApiClient({ fetchImpl: jest.fn().mockRejectedValue(new Error("offline")) });
    await expect(offline.listLabs()).rejects.toBeInstanceOf(RenderApiError);
  });

  it("exposes every remaining published Render operation", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(response(200, {}));
    const client = createRenderApiClient({ baseUrl: "https://render.test", fetchImpl });
    await client.changePassword({ userId: 1, newPassword: "x" }); await client.listUsers(); await client.createUser({}); await client.deactivateUser({ id: 1 }); await client.resetUserPassword({ id: 1 });
    await client.listLabs(); await client.createLab({}); await client.updateLab({ id: 1 }); await client.listLabConditions(); await client.createLabCondition({}); await client.updateLabCondition({ id: 1 });
    await client.listReservations(); await client.createReservation({}); await client.getReservation({ id: 1 }); await client.updateReservation({ id: 1 }); await client.cancelReservation({ id: 1 }); await client.listAuditLogs();
    expect(fetchImpl).toHaveBeenCalledTimes(17);
  });

  it("maps every published mutation to its documented body without leaking client ids", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(response(200, {}));
    const client = createRenderApiClient({ baseUrl: "https://render.test", fetchImpl });
    await client.createUser({ username: "ana@umg.edu.gt", password: "Cambiar123", name: "Ana", lastName: "López", roleId: 2 });
    await client.deactivateUser({ id: 4 });
    await client.resetUserPassword({ id: 4, temporaryPassword: "Temporal123" });
    await client.createLab({ name: "Lab A" });
    await client.updateLab({ id: 1, name: "Lab B", status: 0 });
    await client.createLabCondition({ labId: 1, date: "2099-08-15", startTime: "08:00", endTime: "09:00", type: "Clase", reason: "Práctica" });
    await client.updateLabCondition({ id: 2, labId: 1, date: "2099-08-16", startTime: "10:00", endTime: "11:00", type: "Bloqueo", reason: "Limpieza", status: 1 });
    await client.updateReservation({ id: 3, userId: 7, labId: 1, date: "2099-08-16", startTime: "10:00", endTime: "11:00", reason: "Examen", requesterId: 7 });
    await client.cancelReservation({ id: 3, requesterId: 7 });
    const requests = fetchImpl.mock.calls.map(([url, options]) => ({ path: new URL(url).pathname, method: options.method, body: options.body }));
    expect(requests).toEqual(expect.arrayContaining([
      { path: "/api/usuarios/", method: "POST", body: JSON.stringify({ UMG_Contrasena: "Cambiar123", UMG_Rol_ID: 2, UMG_Nombre: "Ana", UMG_Apellido: "López", UMG_Usuario: "ana@umg.edu.gt" }) },
      { path: "/api/usuarios/4/inactivar/", method: "PATCH", body: undefined },
      { path: "/api/usuarios/4/resetear-contrasena/", method: "PATCH", body: JSON.stringify({ ContrasenaTemporal: "Temporal123" }) },
      { path: "/api/labs/", method: "POST", body: JSON.stringify({ UMG_Nombre: "Lab A" }) },
      { path: "/api/labs/1/", method: "PUT", body: JSON.stringify({ UMG_Nombre: "Lab B", UMG_Estado: 0 }) },
      { path: "/api/condiciones/", method: "POST", body: JSON.stringify({ UMG_Lab_ID: 1, UMG_Fecha: "2099-08-15", UMG_Hora_Inicio: "08:00", UMG_Hora_Fin: "09:00", UMG_Tipo: "Clase", UMG_Motivo: "Práctica" }) },
      { path: "/api/condiciones/2/", method: "PUT", body: JSON.stringify({ UMG_Lab_ID: 1, UMG_Fecha: "2099-08-16", UMG_Hora_Inicio: "10:00", UMG_Hora_Fin: "11:00", UMG_Tipo: "Bloqueo", UMG_Motivo: "Limpieza", UMG_Estado: 1 }) },
      { path: "/api/reservas/3/modificar/", method: "PUT", body: JSON.stringify({ UMG_User_ID: 7, UMG_Lab_ID: 1, UMG_Fecha_Reserva: "2099-08-16", UMG_Hora_Inicio: "10:00", UMG_Hora_Fin: "11:00", UMG_Motivo: "Examen", UMG_Solicitante_ID: 7 }) },
      { path: "/api/reservas/3/cancelar/", method: "PATCH", body: JSON.stringify({ UMG_Solicitante_ID: 7 }) }
    ]));
  });

  it("maps malformed success bodies to a friendly server error", async () => {
    const client = createRenderApiClient({ fetchImpl: jest.fn().mockResolvedValue({ ok: true, status: 200, text: async () => "not-json" }) });
    await expect(client.listLabs()).rejects.toMatchObject({ name: "RenderApiError", code: "api.server", status: 200 });
  });

  it.each([[400, "api.validation"], [401, "api.unauthorized"], [404, "api.notFound"], [409, "api.conflict"], [500, "api.server"]])("maps HTTP %i", async (status, code) => {
    const client = createRenderApiClient({ fetchImpl: jest.fn().mockResolvedValue(response(status, {})) });
    await expect(client.listLabs()).rejects.toMatchObject({ code });
  });
});
