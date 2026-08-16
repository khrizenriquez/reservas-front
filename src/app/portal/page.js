"use client";
import { useSession } from "@/components/SessionProvider";
export default function PortalPage(){const {session}=useSession();return <section><h1>Resumen</h1><p>Sesión institucional activa para {session?.name||"usuario"}.</p><p>Consulta disponibilidad para iniciar una reserva.</p></section>}
