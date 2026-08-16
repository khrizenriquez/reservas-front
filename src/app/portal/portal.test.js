import { render, screen } from "@testing-library/react";
import PortalLayout from "./layout";
import PortalPage from "./page";
import ProfilePage from "./perfil/page";
import { LanguageProvider } from "@/components/LanguageProvider";

const listReservations = jest.fn();
jest.mock("@/services/render-api", () => ({ createRenderApiClient: () => ({ listReservations }) }));

const wrap = (children) => render(<LanguageProvider>{children}</LanguageProvider>);

describe("portal shell", () => {
  beforeEach(() => { jest.clearAllMocks(); listReservations.mockResolvedValue([]); });

  it("renders portal navigation without an in-memory session", () => {
    wrap(<PortalLayout>child</PortalLayout>);
    expect(screen.getByRole("link", { name: "Administración" })).toHaveAttribute("href", "/portal/administracion");
  });

  it("renders the direct Render summary and profile without identity", async () => {
    wrap(<PortalLayout><PortalPage /><ProfilePage /></PortalLayout>);
    expect(screen.getByText("Render v1 publica este portal con acceso directo, sin iniciar sesión.")).toBeInTheDocument();
    expect(await screen.findByText("No hay reservas registradas.")).toBeInTheDocument();
    expect(listReservations).toHaveBeenCalledWith();
    expect(screen.getByText("La API publicada no expone un perfil actual ni aplica una sesión en el cliente.")).toBeInTheDocument();
  });

  it("keeps a friendly summary error when Render cannot list reservations", async () => {
    listReservations.mockRejectedValue({ code: "api.server" });
    wrap(<PortalPage />);
    expect(await screen.findByRole("alert")).toHaveTextContent("El servicio no está disponible.");
  });

  it("does not fabricate an institutional identity", () => {
    wrap(<ProfilePage />);
    expect(screen.queryByText("Usuario institucional")).not.toBeInTheDocument();
  });
});
