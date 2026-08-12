import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";

export const metadata = { title: "Sin conexión", robots: { index: false, follow: false } };

export default function OfflinePage() {
  return (
    <main id="contenido-principal" className="centered-state">
      <BrandMark />
      <p className="eyebrow">Modo sin conexión</p>
      <h1>No podemos actualizar esta vista</h1>
      <p>Las reservas nunca se crean, modifican ni cancelan sin validar la disponibilidad actual.</p>
      <Link className="button is-primary" href="/portal">Intentar de nuevo</Link>
    </main>
  );
}
