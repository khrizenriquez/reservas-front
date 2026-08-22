import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import Page from "./page";
import { LanguageProvider } from "@/components/LanguageProvider";

const api = { listUsers: jest.fn(), createUser: jest.fn(), resetUserPassword: jest.fn(), deactivateUser: jest.fn() };
jest.mock("@/services/render-api", () => ({ createRenderApiClient: () => api }));
const replace = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));
const useAuth = jest.fn();
jest.mock("@/components/AuthProvider", () => ({ useAuth: () => useAuth() }));

const users = [
  { id: 18, name: "Chris", email: "chris@umg.edu.gt", roleId: 1, status: 1 },
  { id: 7, name: "Ana", email: "ana@umg.edu.gt", roleId: 2, status: 1 },
  { id: 8, name: "Inactiva", email: "inactive@umg.edu.gt", roleId: 2, status: 0 }
];
const renderPage = () => render(<LanguageProvider><Page /></LanguageProvider>);

describe("UsersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.listUsers.mockResolvedValue(users);
    api.createUser.mockResolvedValue({});
    api.resetUserPassword.mockResolvedValue({});
    api.deactivateUser.mockResolvedValue({});
    useAuth.mockReturnValue({ identity: { id: 18, name: "Chris", email: "chris@umg.edu.gt" }, isAdmin: true });
  });

  it("lists real Render users with status and self-inactivation protection", async () => {
    renderPage();
    expect(await screen.findByText("ana@umg.edu.gt")).toBeInTheDocument();
    expect(api.listUsers).toHaveBeenCalled();
    expect(screen.getByRole("columnheader", { name: "ID de usuario" })).toBeInTheDocument();
    expect(screen.getByText("18", { selector: "code" })).toBeInTheDocument();
    expect(screen.getAllByText("Activo")).toHaveLength(2);
    const deactivateButtons = screen.getAllByRole("button", { name: "Inactivar" });
    expect(deactivateButtons[0]).toBeDisabled();
    expect(deactivateButtons[2]).toBeDisabled();
  });

  it("creates, resets, and inactivates a user through published operations", async () => {
    renderPage();
    await screen.findByText("ana@umg.edu.gt");
    fireEvent.click(screen.getByRole("button", { name: "Crear usuario" }));
    fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "nuevo@umg.edu.gt" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "Cambiar123" } });
    fireEvent.change(screen.getByLabelText("Nombres"), { target: { value: "Nuevo" } });
    fireEvent.change(screen.getByLabelText("Apellidos"), { target: { value: "Usuario" } });
    fireEvent.change(screen.getByLabelText("Rol"), { target: { value: "2" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Crear usuario" })[1]);
    await waitFor(() => expect(api.createUser).toHaveBeenCalledWith({ username: "nuevo@umg.edu.gt", password: "Cambiar123", name: "Nuevo", lastName: "Usuario", roleId: 2 }));
    fireEvent.click(screen.getAllByRole("button", { name: "Restablecer clave" })[1]);
    fireEvent.change(screen.getByLabelText("Contraseña temporal"), { target: { value: "Temporal123" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar contraseña temporal" }));
    await waitFor(() => expect(api.resetUserPassword).toHaveBeenCalledWith({ id: 7, temporaryPassword: "Temporal123" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Inactivar" })[1]);
    fireEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Inactivar", exact: true }));
    await waitFor(() => expect(api.deactivateUser).toHaveBeenCalledWith({ id: 7 }));
  });

  it("redirects a professor without rendering the user directory", async () => {
    useAuth.mockReturnValue({ identity: { id: 7, name: "Ana", email: "ana@umg.edu.gt" }, isAdmin: false });
    renderPage();
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/portal"));
    expect(api.listUsers).not.toHaveBeenCalled();
    expect(screen.queryByRole("heading", { name: "Usuarios" })).not.toBeInTheDocument();
  });
});
