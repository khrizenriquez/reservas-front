import "./globals.scss";
import { SessionProvider } from "@/providers/SessionProvider";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

export const metadata = {
  metadataBase: new URL("https://reservas.umg.example"),
  title: {
    default: "Reservas de laboratorios | UMG",
    template: "%s | Reservas UMG",
  },
  description:
    "Consulta disponibilidad y reserva los laboratorios de cómputo de forma clara y segura.",
  applicationName: "Reservas UMG",
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Reservas de laboratorios UMG",
    description: "Disponibilidad, reservas y seguimiento en un solo lugar.",
    type: "website",
    locale: "es_GT",
  },
};

export const viewport = {
  themeColor: "#17355F",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#contenido-principal">
          Saltar al contenido principal
        </a>
        <SessionProvider>{children}</SessionProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
