import Link from "next/link";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function PortalLayout({children}) { return <div className="portal"><aside><strong>Reservas UMG</strong><nav><Link href="/portal">Resumen</Link><Link href="/portal/disponibilidad">Disponibilidad</Link><Link href="/portal/reservas">Reservas</Link><Link href="/portal/administracion">Administración</Link><Link href="/portal/perfil">Perfil</Link></nav><LanguageSelector /></aside><main>{children}</main></div>; }
