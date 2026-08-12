import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LandingPage from "@/app/page";
import { PublicHeader } from "@/components/PublicHeader";

describe("public experience", () => {
  it("explains the three laboratories and exposes institutional access", () => {
    render(<LandingPage />);
    expect(screen.getAllByRole("heading", { name: /Laboratorio de cómputo/i })).toHaveLength(3);
    expect(screen.getAllByRole("link", { name: /Ingresar|Acceso|Acceder/i }).length).toBeGreaterThan(0);
  });

  it("provides an accessible mobile navigation toggle", () => {
    render(<PublicHeader />);
    const toggle = screen.getByRole("button", { name: "Abrir menú" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Cerrar menú" })).toHaveAttribute("aria-expanded", "true");
  });
});
