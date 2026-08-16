import "./globals.css";
import Script from "next/script";
import { LanguageProvider } from "@/components/LanguageProvider";
import { OfflineNotice } from "@/components/OfflineNotice";
import { SessionProvider } from "@/components/SessionProvider";
import { ServiceWorker } from "@/components/ServiceWorker";

export const metadata = {
  title: "Reservas UMG",
  description: "Gestión de reservas de laboratorios UMG.",
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Script src="/runtime-config.js" strategy="beforeInteractive" />
        <LanguageProvider><SessionProvider><ServiceWorker /><OfflineNotice />{children}</SessionProvider></LanguageProvider>
      </body>
    </html>
  );
}
