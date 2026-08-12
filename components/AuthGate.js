"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSession } from "@/providers/SessionProvider";

export function AuthGate({ children }) {
  const router = useRouter();
  const { status, user } = useSession();

  useEffect(() => {
    if (status === "anonymous") router.replace("/acceso");
    if (status === "authenticated" && user?.mustChangePassword) router.replace("/cambiar-contrasena");
  }, [router, status, user]);

  if (status !== "authenticated" || user?.mustChangePassword) {
    return (
      <main className="portal-loading" aria-live="polite">
        <span className="portal-loading__mark" aria-hidden="true" />
        <p>Preparando tu espacio…</p>
      </main>
    );
  }

  return children;
}
