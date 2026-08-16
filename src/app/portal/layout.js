"use client";
import Link from "next/link";
import { useSession } from "@/components/SessionProvider";
import { LanguageSelector } from "@/components/LanguageSelector";
export default function PortalLayout({children}) { const {session}=useSession(); if(!session)return <main className="section"><h1>Acceso requerido</h1><Link href="/acceso">Ingresar</Link></main>; return <div className="portal"><aside><strong>Reservas UMG</strong><nav><Link href="/portal">Resumen</Link><Link href="/portal/disponibilidad">Disponibilidad</Link><Link href="/portal/perfil">Perfil</Link></nav><LanguageSelector /></aside><main>{children}</main></div>; }
