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

  it.each([[400, "api.validation"], [401, "api.unauthorized"], [404, "api.notFound"], [409, "api.conflict"], [500, "api.server"]])("maps HTTP %i", async (status, code) => {
    const client = createRenderApiClient({ fetchImpl: jest.fn().mockResolvedValue(response(status, {})) });
    await expect(client.listLabs()).rejects.toMatchObject({ code });
  });
});
