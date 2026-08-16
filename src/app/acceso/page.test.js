import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AccessPage from "./page";
import { LanguageProvider } from "@/components/LanguageProvider";
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }));

const login = jest.fn();
jest.mock("@/services/render-api", () => ({ createRenderApiClient: () => ({ login }), RenderApiError: class RenderApiError extends Error { constructor(value) { super(value.code); Object.assign(this, value); } } }));

const renderPage = () => render(<LanguageProvider><AccessPage /></LanguageProvider>);

describe("AccessPage", () => {
  it("submits institutional credentials without persisting a token", async () => {
    login.mockResolvedValue({}); renderPage();
    fireEvent.change(screen.getByLabelText("Correo institucional"), { target: { value: "docente@umg.edu.gt" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "secret" } });
    fireEvent.click(screen.getByRole("button", { name: "Comprobar login" }));
    await waitFor(() => expect(login).toHaveBeenCalledWith({ username: "docente@umg.edu.gt", password: "secret" }));
    expect(mockPush).toHaveBeenCalledWith("/portal");
  });

  it("shows a localized error after a failed login", async () => {
    login.mockRejectedValue({ code: "api.unauthorized" }); renderPage();
    fireEvent.change(screen.getByLabelText("Correo institucional"), { target: { value: "docente@umg.edu.gt" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: "Comprobar login" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("No fue posible iniciar sesión."));
  });

  it("offers direct portal navigation without credentials", () => {
    renderPage();
    expect(screen.getByRole("link", { name: "Continuar sin iniciar sesión" })).toHaveAttribute("href", "/portal");
  });
});
