import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageProvider } from "./LanguageProvider";

describe("ThemeProvider", () => {
  beforeEach(() => { localStorage.clear(); document.documentElement.dataset.theme = ""; window.matchMedia = jest.fn().mockReturnValue({ matches: true }); });
  it("uses the system preference then persists an explicit toggle", () => {
    render(<ThemeProvider><LanguageProvider><ThemeToggle /></LanguageProvider></ThemeProvider>);
    expect(document.documentElement.dataset.theme).toBe("dark");
    fireEvent.click(screen.getByRole("button", { name: "Usar tema claro" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("reservas-theme")).toBe("light");
  });
});
