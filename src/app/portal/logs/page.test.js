import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Page from "./page";
import { LanguageProvider } from "@/components/LanguageProvider";

const api = { listAuditLogs: jest.fn(), listLabs: jest.fn(), listLabConditions: jest.fn(), listReservations: jest.fn(), listUsers: jest.fn() };
jest.mock("@/services/render-api", () => ({ createRenderApiClient: () => api }));
const useAuth = jest.fn();
jest.mock("@/components/AuthProvider", () => ({ useAuth: () => useAuth() }));

const renderedLogs = [
  { id: 1, createdAt: "2026-08-17T08:00:00Z", raw: { umg_accion: "CREAR-1", umg_modulo: "RESERVAS", umg_descripcion: "Reserva creada" } },
  { id: 2, createdAt: "2026-08-18T08:00:00Z", raw: { umg_accion: "CREAR-2", umg_modulo: "LABS", umg_descripcion: "Laboratorio actualizado" } },
  { id: 3, createdAt: "2026-08-19T08:00:00Z", raw: { umg_accion: "CREAR-3", umg_modulo: "RESERVAS", umg_descripcion: "Reserva creada" } }
];

describe("LogsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.listLabs.mockResolvedValue([{ id: 3, name: "A1", status: 1 }, { id: 4, name: "C2", status: 0 }]);
    api.listLabConditions.mockResolvedValue([{ id: 1, status: 1 }]);
    api.listReservations.mockResolvedValue([{ id: 2, status: "Publicada", labName: "A1" }, { id: 3, status: "Cancelada", labName: "C2" }]);
    api.listUsers.mockResolvedValue([{ id: 18, roleName: "Administrador", status: 1 }, { id: 7, roleName: "Profesor", status: 1 }]);
    useAuth.mockReturnValue({ identity: { id: 18, name: "Chris", email: "chris@umg.edu.gt" }, isAdmin: true });
  });

  it("loads the documented operation and shows a full real-data weekly chart by default", async () => {
    api.listAuditLogs.mockResolvedValue(renderedLogs);
    render(<LanguageProvider><Page /></LanguageProvider>);
    expect(await screen.findByRole("img", { name: /Actividad diaria de la semana/ })).toBeInTheDocument();
    expect(api.listAuditLogs).toHaveBeenCalledWith({ userId: "18" });
    expect(screen.getByLabelText("Semana que incluye")).toHaveValue("2026-08-17");
    expect(screen.getByText("registros del período").closest("strong")).toHaveTextContent("3");
    expect(screen.getByText("2026-08-17 – 2026-08-23")).toBeInTheDocument();
  });

  it("filters loaded records by a validated custom date range without a new endpoint", async () => {
    api.listAuditLogs.mockResolvedValue(renderedLogs);
    render(<LanguageProvider><Page /></LanguageProvider>);
    await screen.findByRole("img", { name: /Actividad diaria de la semana/ });
    fireEvent.change(screen.getByLabelText("Período"), { target: { value: "range" } });
    fireEvent.change(screen.getByLabelText("Fecha inicial"), { target: { value: "2026-08-18" } });
    fireEvent.change(screen.getByLabelText("Fecha final"), { target: { value: "2026-08-19" } });
    fireEvent.click(screen.getByRole("button", { name: "Aplicar período" }));
    expect(await screen.findByText("2026-08-18 – 2026-08-19")).toBeInTheDocument();
    expect(api.listAuditLogs).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("CREAR-1")).not.toBeInTheDocument();
    expect(screen.getAllByText("CREAR-2").length).toBeGreaterThan(0);
  });

  it("announces a localized invalid range while retaining the latest valid chart", async () => {
    api.listAuditLogs.mockResolvedValue(renderedLogs);
    render(<LanguageProvider><Page /></LanguageProvider>);
    await screen.findByRole("img", { name: /Actividad diaria de la semana/ });
    fireEvent.change(screen.getByLabelText("Período"), { target: { value: "range" } });
    fireEvent.change(screen.getByLabelText("Fecha inicial"), { target: { value: "2026-08-20" } });
    fireEvent.change(screen.getByLabelText("Fecha final"), { target: { value: "2026-08-19" } });
    fireEvent.click(screen.getByRole("button", { name: "Aplicar período" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("La fecha inicial no puede ser posterior a la fecha final.");
    expect(screen.getByText("2026-08-17 – 2026-08-23")).toBeInTheDocument();
  });

  it("shows a localized API error", async () => {
    api.listAuditLogs.mockRejectedValue({ code: "api.server" });
    render(<LanguageProvider><Page /></LanguageProvider>);
    expect(await screen.findByRole("alert")).toHaveTextContent("El servicio no está disponible.");
  });

  it("requires an explicit user id before making a new audit request", async () => {
    api.listAuditLogs.mockResolvedValue([]);
    render(<LanguageProvider><Page /></LanguageProvider>);
    await screen.findByText("No hay registros publicados.");
    fireEvent.change(screen.getByLabelText("ID de usuario"), { target: { value: "" } });
    fireEvent.submit(screen.getByRole("button", { name: "Consultar registros" }).closest("form"));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Ingresa un ID de usuario"));
    expect(api.listAuditLogs).toHaveBeenCalledTimes(1);
  });

  it("builds administrator-only operational panels from published project resources", async () => {
    api.listAuditLogs.mockResolvedValue(renderedLogs);
    render(<LanguageProvider><Page /></LanguageProvider>);
    expect(await screen.findByRole("heading", { name: "Tablero operativo" })).toBeInTheDocument();
    expect(api.listLabs).toHaveBeenCalled();
    expect(api.listLabConditions).toHaveBeenCalled();
    expect(api.listReservations).toHaveBeenCalled();
    expect(api.listUsers).toHaveBeenCalled();
    expect(screen.getByRole("img", { name: /Laboratorios activos: 1 de 2/ })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Reservas por estado: Cancelada 1, Publicada 1/ })).toBeInTheDocument();
  });

  it("keeps the audit dashboard visible when one operational source fails", async () => {
    api.listAuditLogs.mockResolvedValue(renderedLogs);
    api.listLabs.mockRejectedValue({ code: "api.forbidden" });
    render(<LanguageProvider><Page /></LanguageProvider>);
    expect(await screen.findByRole("img", { name: /Actividad diaria de la semana/ })).toBeInTheDocument();
    expect(await screen.findByText("No tienes acceso a esta acción.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tablero operativo" })).toBeInTheDocument();
  });

  it("keeps administrator resource and user requests out of the professor dashboard", async () => {
    api.listAuditLogs.mockResolvedValue(renderedLogs);
    useAuth.mockReturnValue({ identity: { id: 7, name: "Ana", email: "ana@umg.edu.gt" }, isAdmin: false });
    render(<LanguageProvider><Page /></LanguageProvider>);
    await screen.findByRole("img", { name: /Actividad diaria de la semana/ });
    expect(screen.queryByRole("heading", { name: "Tablero operativo" })).not.toBeInTheDocument();
    expect(api.listLabs).not.toHaveBeenCalled();
    expect(api.listLabConditions).not.toHaveBeenCalled();
    expect(api.listReservations).not.toHaveBeenCalled();
    expect(api.listUsers).not.toHaveBeenCalled();
  });
});
