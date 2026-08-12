"use client";

import Link from "next/link";

import { useSession } from "@/providers/SessionProvider";

export function AdminGate({ children }) {
  const { user } = useSession();
  if (user?.role?.name === "ADMIN") return children;
  return (
    <section className="resource-state resource-state--error" role="alert">
      <strong>Esta sección es exclusiva para administración</strong>
      <p>Tu cuenta no tiene permiso para consultar estos datos.</p>
      <Link className="button is-light" href="/portal">Volver al resumen</Link>
    </section>
  );
}
