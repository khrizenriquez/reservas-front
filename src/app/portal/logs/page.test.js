import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Page from "./page";
import { LanguageProvider } from "@/components/LanguageProvider";

const listAuditLogs = jest.fn();
jest.mock("@/services/render-api", () => ({ createRenderApiClient: () => ({ listAuditLogs }) }));
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
    useAuth.mockReturnValue({ identity: { id: 18, name: "Chris", email: "chris@umg.edu.gt" }, isAdmin: true });
  });

  it("loads the documented operation and shows a full real-data weekly chart by default", async () => {
    listAuditLogs.mockResolvedValue(renderedLogs);
    render(<LanguageProvider><Page /></LanguageProvider>);
    expect(await screen.findByRole("img", { name: /Actividad diaria de la semana/ })).toBeInTheDocument();
    expect(listAuditLogs).toHaveBeenCalledWith({ userId: "18" });
    expect(screen.getByLabelText("Semana que incluye")).toHaveValue("2026-08-17");
    expect(screen.getByText("registros del período").closest("strong")).toHaveTextContent("3");
    expect(screen.getByText("2026-08-17 – 2026-08-23")).toBeInTheDocument();
  });

  it("filters loaded records by a validated custom date range without a new endpoint", async () => {
    listAuditLogs.mockResolvedValue(renderedLogs);
    render(<LanguageProvider><Page /></LanguageProvider>);
    await screen.findByRole("img", { name: /Actividad diaria de la semana/ });
    fireEvent.change(screen.getByLabelText("Período"), { target: { value: "range" } });
    fireEvent.change(screen.getByLabelText("Fecha inicial"), { target: { value: "2026-08-18" } });
    fireEvent.change(screen.getByLabelText("Fecha final"), { target: { value: "2026-08-19" } });
    fireEvent.click(screen.getByRole("button", { name: "Aplicar período" }));
    expect(await screen.findByText("2026-08-18 – 2026-08-19")).toBeInTheDocument();
    expect(listAuditLogs).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("CREAR-1")).not.toBeInTheDocument();
    expect(screen.getAllByText("CREAR-2").length).toBeGreaterThan(0);
  });

  it("announces a localized invalid range while retaining the latest valid chart", async () => {
    listAuditLogs.mockResolvedValue(renderedLogs);
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
    listAuditLogs.mockRejectedValue({ code: "api.server" });
    render(<LanguageProvider><Page /></LanguageProvider>);
    expect(await screen.findByRole("alert")).toHaveTextContent("El servicio no está disponible.");
  });

  it("requires an explicit user id before making a new audit request", async () => {
    listAuditLogs.mockResolvedValue([]);
    render(<LanguageProvider><Page /></LanguageProvider>);
    await screen.findByText("No hay registros publicados.");
    fireEvent.change(screen.getByLabelText("ID de usuario"), { target: { value: "" } });
    fireEvent.submit(screen.getByRole("button", { name: "Consultar registros" }).closest("form"));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Ingresa un ID de usuario"));
    expect(listAuditLogs).toHaveBeenCalledTimes(1);
  });
});
