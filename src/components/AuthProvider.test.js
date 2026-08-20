import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, isAdminIdentity, useAuth } from "./AuthProvider";

const login = jest.fn();
const listUsers = jest.fn();
jest.mock("@/services/render-api", () => ({ createRenderApiClient: () => ({ login, listUsers }) }));

function Probe() {
  const { identity, ready, isAdmin, signIn, signOut } = useAuth();
  return <><p>{ready ? "ready" : "loading"}</p><p>{identity?.email ?? "guest"}</p><p>{isAdmin ? "admin" : "member"}</p><button onClick={() => signIn({ username: "chrisadmin@umg.edu.gt", password: "secret" })}>sign in</button><button onClick={signOut}>sign out</button></>;
}

describe("AuthProvider", () => {
  beforeEach(() => { sessionStorage.clear(); jest.clearAllMocks(); });

  it("creates a password-free in-tab identity from the login response", async () => {
    login.mockResolvedValue({ raw: { UMG_ID: 18, UMG_Usuario: "chrisadmin@umg.edu.gt", UMG_Nombre: "Chris", UMG_Apellido: "Admin", UMG_Rol_ID: 1, UMG_Rol_Nombre: "Admin" } });
    render(<AuthProvider><Probe /></AuthProvider>);
    await screen.findByText("ready");
    fireEvent.click(screen.getByRole("button", { name: "sign in" }));
    await waitFor(() => expect(screen.getByText("chrisadmin@umg.edu.gt")).toBeInTheDocument());
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(login).toHaveBeenCalledWith({ username: "chrisadmin@umg.edu.gt", password: "secret" });
    expect(sessionStorage.getItem("reservas-session-v1")).not.toContain("secret");
  });

  it("uses the published user list only when login omits identity fields", async () => {
    login.mockResolvedValue({ raw: { mensaje: "Acceso correcto" } });
    listUsers.mockResolvedValue([{ id: 18, email: "chrisadmin@umg.edu.gt", name: "Chris", roleId: 1, roleName: "Admin" }]);
    render(<AuthProvider><Probe /></AuthProvider>);
    await screen.findByText("ready");
    fireEvent.click(screen.getByRole("button", { name: "sign in" }));
    await waitFor(() => expect(screen.getByText("chrisadmin@umg.edu.gt")).toBeInTheDocument());
    expect(listUsers).toHaveBeenCalledWith();
  });

  it("restores and clears identity for the current browser tab", async () => {
    sessionStorage.setItem("reservas-session-v1", JSON.stringify({ id: 2, email: "docente@umg.edu.gt", name: "Docente", roleId: 2, roleName: "Profesor" }));
    render(<AuthProvider><Probe /></AuthProvider>);
    expect(await screen.findByText("docente@umg.edu.gt")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "sign out" }));
    expect(screen.getByText("guest")).toBeInTheDocument();
    expect(sessionStorage.getItem("reservas-session-v1")).toBeNull();
  });

  it("recognizes administrators by published role id or label", () => {
    expect(isAdminIdentity({ roleId: 1 })).toBe(true);
    expect(isAdminIdentity({ roleName: "Admin" })).toBe(true);
    expect(isAdminIdentity({ roleId: 2, roleName: "Profesor" })).toBe(false);
  });
});
