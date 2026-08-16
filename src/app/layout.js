import "./globals.css";
import Script from "next/script";
import { LanguageProvider } from "@/components/LanguageProvider";
import { SessionProvider } from "@/components/SessionProvider";

export const metadata = {
  title: "Reservas UMG",
  description: "Gestión de reservas de laboratorios UMG."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Script src="/runtime-config.js" strategy="beforeInteractive" />
        <LanguageProvider><SessionProvider>{children}</SessionProvider></LanguageProvider>
      </body>
    </html>
  );
}
