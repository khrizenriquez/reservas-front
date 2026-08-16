import { render, screen } from "@testing-library/react";
import PortalLayout from "./layout";
import PortalPage from "./page";
import ProfilePage from "./perfil/page";
import { SessionProvider } from "@/components/SessionProvider";
import { LanguageProvider } from "@/components/LanguageProvider";

const listReservations = jest.fn();
jest.mock("@/services/render-api", () => ({ createRenderApiClient: () => ({ listReservations }) }));

const wrap = (children, session) => render(<LanguageProvider><SessionProvider initialSession={session}>{children}</SessionProvider></LanguageProvider>);

describe("portal shell", () => {
  beforeEach(() => { jest.clearAllMocks(); listReservations.mockResolvedValue([]); });

  it("requires an in-memory session", () => {
    wrap(<PortalLayout>child</PortalLayout>);
    expect(screen.getByRole("link", { name: "Ingresar" })).toHaveAttribute("href", "/acceso");
  });

  it("renders reservation summary and profile for the active session", async () => {
    wrap(<PortalLayout><PortalPage /><ProfilePage /></PortalLayout>, { id: 7, name: "Ana", roleName: "Docente" });
    expect(screen.getByText("Sesión institucional activa para Ana.")).toBeInTheDocument();
    expect(await screen.findByText("No tienes reservas registradas.")).toBeInTheDocument();
    expect(listReservations).toHaveBeenCalledWith({ userId: 7 });
    expect(screen.getByText("Esta sesión existe solo en memoria del navegador.")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Administración" })).not.toBeInTheDocument();
  });

  it("shows administration navigation only for a recognized administrator", () => {
    wrap(<PortalLayout>child</PortalLayout>, { name: "Ada", roleName: "Administrador" });
    expect(screen.getByRole("link", { name: "Administración" })).toHaveAttribute("href", "/portal/administracion");
  });

  it("keeps a friendly summary error when Render cannot list reservations", async () => {
    listReservations.mockRejectedValue({ code: "api.server" });
    wrap(<PortalPage />, { id: 7, name: "Ana" });
    expect(await screen.findByRole("alert")).toHaveTextContent("El servicio no está disponible.");
  });

  it("uses the institutional fallback label when login has no display name", () => {
    wrap(<ProfilePage />, {});
    expect(screen.getByText("Usuario institucional")).toBeInTheDocument();
  });
});
