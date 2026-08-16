import { render, screen } from "@testing-library/react";
import Page from "./page";
import { LanguageProvider } from "@/components/LanguageProvider";

const listAuditLogs = jest.fn();
jest.mock("@/services/render-api", () => ({ createRenderApiClient: () => ({ listAuditLogs }) }));

describe("LogsPage", () => {
  beforeEach(() => jest.clearAllMocks());
  it("renders raw published logs through the documented client operation", async () => {
    listAuditLogs.mockResolvedValue([{ id: 1, createdAt: "2099-08-01", raw: { umg_accion: "CREAR", umg_modulo: "RESERVAS", umg_descripcion: "Reserva creada" } }]);
    render(<LanguageProvider><Page /></LanguageProvider>);
    expect(await screen.findByText("CREAR")).toBeInTheDocument();
    expect(listAuditLogs).toHaveBeenCalledWith();
  });
  it("shows a localized API error", async () => {
    listAuditLogs.mockRejectedValue({ code: "api.server" });
    render(<LanguageProvider><Page /></LanguageProvider>);
    expect(await screen.findByRole("alert")).toHaveTextContent("El servicio no está disponible.");
  });
});
