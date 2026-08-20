import "./globals.css";
import Script from "next/script";
import { LanguageProvider } from "@/components/LanguageProvider";
import { OfflineNotice } from "@/components/OfflineNotice";
import { ServiceWorker } from "@/components/ServiceWorker";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { messages } from "@/lib/i18n";

export const metadata = {
  title: messages.es.metadata.title,
  description: messages.es.metadata.description,
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Script src="/runtime-config.js" strategy="beforeInteractive" />
        <ThemeProvider><LanguageProvider><AuthProvider><ServiceWorker /><OfflineNotice />{children}</AuthProvider></LanguageProvider></ThemeProvider>
      </body>
    </html>
  );
}
