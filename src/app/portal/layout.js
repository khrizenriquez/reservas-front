"use client";
import Link from "next/link";
import { useSession } from "@/components/SessionProvider";
import { LanguageSelector } from "@/components/LanguageSelector";
const isAdministrator = (session) => /admin/i.test(session?.roleName ?? session?.raw?.UMG_Rol_Nombre ?? "");

export default function PortalLayout({children}) { const {session}=useSession(); if(!session)return <main className="section"><h1>Acceso requerido</h1><Link href="/acceso">Ingresar</Link></main>; return <div className="portal"><aside><strong>Reservas UMG</strong><nav><Link href="/portal">Resumen</Link><Link href="/portal/disponibilidad">Disponibilidad</Link><Link href="/portal/reservas">Reservas</Link>{isAdministrator(session)?<Link href="/portal/administracion">Administración</Link>:null}<Link href="/portal/perfil">Perfil</Link></nav><LanguageSelector /></aside><main>{children}</main></div>; }
