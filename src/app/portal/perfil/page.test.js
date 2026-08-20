import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Page from "./page";
import { LanguageProvider } from "@/components/LanguageProvider";

const changePassword = jest.fn();
jest.mock("@/services/render-api", () => ({ createRenderApiClient: () => ({ changePassword }) }));
jest.mock("@/components/AuthProvider", () => ({ useAuth: () => ({ identity: { id: 7, name: "Docente UMG", email: "docente@umg.edu.gt" }, isAdmin: false }) }));

describe("ProfilePage", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("changes only the current user's password through Render", async () => {
    changePassword.mockResolvedValue({});
    render(<LanguageProvider><Page /></LanguageProvider>);
    expect(screen.getByText("Docente UMG")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Nueva contraseña"), { target: { value: "Nueva123" } });
    fireEvent.click(screen.getByRole("button", { name: "Actualizar contraseña" }));
    await waitFor(() => expect(changePassword).toHaveBeenCalledWith({ userId: 7, newPassword: "Nueva123" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Contraseña actualizada.");
  });

  it("shows a localized password change error", async () => {
    changePassword.mockRejectedValue({ code: "api.validation" });
    render(<LanguageProvider><Page /></LanguageProvider>);
    fireEvent.change(screen.getByLabelText("Nueva contraseña"), { target: { value: "Nueva123" } });
    fireEvent.click(screen.getByRole("button", { name: "Actualizar contraseña" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Revisa los datos ingresados.");
  });
});
