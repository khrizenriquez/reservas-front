import { fireEvent, render, screen } from "@testing-library/react";
import { LanguageProvider } from "./LanguageProvider";
import { LanguageSelector } from "./LanguageSelector";
import { StatusMessage } from "./StatusMessage";

describe("shared UI foundation", () => {
  it("persists language selection and localizes error status", () => {
    const retry = jest.fn();
    render(<LanguageProvider><LanguageSelector /><StatusMessage code="api.network" onRetry={retry} /></LanguageProvider>);
    fireEvent.change(screen.getByLabelText("Idioma"), { target: { value: "en" } });
    expect(screen.getByRole("alert")).toHaveTextContent("Check your connection");
    expect(sessionStorage.getItem("reservas-language")).toBe("en");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
