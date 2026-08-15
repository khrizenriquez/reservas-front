import "./globals.css";
import Script from "next/script";
import { LanguageProvider } from "@/components/LanguageProvider";

export const metadata = {
  title: "Reservas UMG",
  description: "Gestión de reservas de laboratorios UMG."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Script src="/runtime-config.js" strategy="beforeInteractive" />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
