import { fireEvent, render, screen } from "@testing-library/react";
import Page from "./page";
import { LanguageProvider } from "@/components/LanguageProvider";

const listAuditLogs = jest.fn();
jest.mock("@/services/render-api", () => ({ createRenderApiClient: () => ({ listAuditLogs }) }));

describe("LogsPage", () => {
  beforeEach(() => jest.clearAllMocks());
  it("renders raw published logs through the documented client operation", async () => {
    listAuditLogs.mockResolvedValue(Array.from({ length: 12 }, (_, index) => ({ id: index + 1, createdAt: "2099-08-01", raw: { umg_accion: `CREAR-${index + 1}`, umg_modulo: "RESERVAS", umg_descripcion: "Reserva creada" } })));
    render(<LanguageProvider><Page /></LanguageProvider>);
    expect((await screen.findAllByText("CREAR-1")).length).toBeGreaterThan(1);
    expect(screen.queryByText("CREAR-11")).not.toBeInTheDocument();
    expect(listAuditLogs).toHaveBeenCalledWith({ userId: "1" });
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    expect((await screen.findAllByText("CREAR-11")).length).toBeGreaterThan(0);
    fireEvent.change(screen.getByLabelText("Mostrar"), { target: { value: "20" } });
    expect(screen.getByText("Mostrando 1–12 de 12")).toBeInTheDocument();
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
    expect(await screen.findByRole("alert")).toHaveTextContent("Ingresa un ID de usuario");
    expect(listAuditLogs).toHaveBeenCalledTimes(1);
  });
});
