import { render, screen, waitFor } from "@testing-library/react";
import PortalLayout from "./layout";
import PortalPage from "./page";
import ProfilePage from "./perfil/page";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const listReservations = jest.fn();
const changePassword = jest.fn();
jest.mock("@/services/render-api", () => ({ createRenderApiClient: () => ({ listReservations, changePassword }) }));
const replace = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));
const useAuth = jest.fn();
jest.mock("@/components/AuthProvider", () => ({ useAuth: () => useAuth() }));

const wrap = (children) => render(<ThemeProvider><LanguageProvider>{children}</LanguageProvider></ThemeProvider>);

describe("portal shell", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    listReservations.mockResolvedValue([]);
    useAuth.mockReturnValue({ identity: { id: 18, name: "Chris Admin", email: "chris@umg.edu.gt", roleId: 1 }, ready: true, isAdmin: true, signOut: jest.fn() });
  });

  it("renders portal navigation for an authenticated identity", () => {
    wrap(<PortalLayout>child</PortalLayout>);
    expect(screen.getByRole("link", { name: "Administración" })).toHaveAttribute("href", "/portal/administracion");
    expect(screen.getByRole("link", { name: "Usuarios" })).toHaveAttribute("href", "/portal/usuarios");
  });

  it("does not expose the users navigation item to a professor", () => {
    useAuth.mockReturnValue({ identity: { id: 7, name: "Docente", email: "docente@umg.edu.gt", roleId: 2 }, ready: true, isAdmin: false, signOut: jest.fn() });
    wrap(<PortalLayout>child</PortalLayout>);
    expect(screen.queryByRole("link", { name: "Usuarios" })).not.toBeInTheDocument();
  });

  it("renders the authenticated Render summary and profile", async () => {
    wrap(<PortalLayout><PortalPage /><ProfilePage /></PortalLayout>);
    expect(screen.getByText("Consulta la operación académica de tu cuenta institucional.")).toBeInTheDocument();
    expect(await screen.findByText("No hay reservas registradas.")).toBeInTheDocument();
    expect(listReservations).toHaveBeenCalledWith();
    expect(screen.getAllByText("Chris Admin")).toHaveLength(2);
    expect(screen.getByText("chris@umg.edu.gt")).toBeInTheDocument();
  });

  it("keeps a friendly summary error when Render cannot list reservations", async () => {
    listReservations.mockRejectedValue({ code: "api.server" });
    wrap(<PortalPage />);
    expect(await screen.findByRole("alert")).toHaveTextContent("El servicio no está disponible.");
  });

  it("redirects to access when the local session is absent", async () => {
    useAuth.mockReturnValue({ identity: null, ready: true, isAdmin: false, signOut: jest.fn() });
    wrap(<PortalLayout>child</PortalLayout>);
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/acceso"));
  });
});
