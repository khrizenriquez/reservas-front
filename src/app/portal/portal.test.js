import { render, screen } from "@testing-library/react";
import PortalLayout from "./layout";
import PortalPage from "./page";
import ProfilePage from "./perfil/page";
import { SessionProvider } from "@/components/SessionProvider";
import { LanguageProvider } from "@/components/LanguageProvider";

describe("portal shell", () => {
  it("requires an in-memory session", () => { render(<LanguageProvider><SessionProvider><PortalLayout>child</PortalLayout></SessionProvider></LanguageProvider>); expect(screen.getByRole("link", {name:"Ingresar"})).toHaveAttribute("href","/acceso"); });
  it("renders the summary and profile for the active session", () => { render(<LanguageProvider><SessionProvider initialSession={{name:"Ana"}}><PortalLayout><PortalPage /><ProfilePage /></PortalLayout></SessionProvider></LanguageProvider>); expect(screen.getByText("Sesión institucional activa para Ana.")).toBeInTheDocument(); expect(screen.getByText("Esta sesión existe solo en memoria del navegador.")).toBeInTheDocument(); });
});
