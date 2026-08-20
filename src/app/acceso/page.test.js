import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AccessPage from "./page";
import { LanguageProvider } from "@/components/LanguageProvider";
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: mockReplace }) }));

const signIn = jest.fn();
jest.mock("@/components/AuthProvider", () => ({ useAuth: () => ({ signIn }) }));

const renderPage = () => render(<LanguageProvider><AccessPage /></LanguageProvider>);

describe("AccessPage", () => {
  it("submits institutional credentials without persisting a token", async () => {
    signIn.mockResolvedValue({ id: 18 }); renderPage();
    fireEvent.change(screen.getByLabelText("Correo institucional"), { target: { value: "docente@umg.edu.gt" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "secret" } });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    await waitFor(() => expect(signIn).toHaveBeenCalledWith({ username: "docente@umg.edu.gt", password: "secret" }));
    expect(mockReplace).toHaveBeenCalledWith("/portal");
  });

  it("shows a localized error after a failed login", async () => {
    signIn.mockRejectedValue({ code: "api.unauthorized" }); renderPage();
    fireEvent.change(screen.getByLabelText("Correo institucional"), { target: { value: "docente@umg.edu.gt" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("No fue posible iniciar sesión."));
  });

  it("does not offer unauthenticated portal navigation", () => {
    renderPage();
    expect(screen.queryByRole("link", { name: /continuar sin iniciar sesión/i })).not.toBeInTheDocument();
  });
});
