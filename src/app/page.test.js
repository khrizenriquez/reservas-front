import { fireEvent, render, screen } from "@testing-library/react";

import HomePage from "./page";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

describe("HomePage", () => {
  it("renders the application title", () => {
    render(<ThemeProvider><LanguageProvider><HomePage /></LanguageProvider></ThemeProvider>);

    expect(
      screen.getByRole("heading", { name: "Reserva el laboratorio que tu clase necesita." })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Acceso institucional" })).toHaveAttribute("href", "/acceso");
  });

  it("changes all landing interface text when the language changes", () => {
    render(<ThemeProvider><LanguageProvider><HomePage /></LanguageProvider></ThemeProvider>);
    fireEvent.change(screen.getByLabelText("Idioma"), { target: { value: "en" } });
    expect(screen.getByRole("heading", { name: "Reserve the laboratory your class needs." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Institutional access" })).toBeInTheDocument();
  });
});
