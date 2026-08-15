import { render, screen } from "@testing-library/react";

import HomePage from "./page";
import { LanguageProvider } from "@/components/LanguageProvider";

describe("HomePage", () => {
  it("renders the application title", () => {
    render(<LanguageProvider><HomePage /></LanguageProvider>);

    expect(
      screen.getByRole("heading", { name: "Reserva el laboratorio que tu clase necesita." })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Acceso institucional" })).toHaveAttribute("href", "/acceso");
  });
});
