import "./globals.css";

export const metadata = {
  title: "Reservas UMG",
  description: "Gestión de reservas de laboratorios UMG."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
