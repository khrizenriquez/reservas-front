"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { BrandMark } from "@/components/BrandMark";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useSession } from "@/providers/SessionProvider";

const commonNavigation = [
  ["/portal", "Resumen", "R"],
  ["/portal/disponibilidad", "Disponibilidad", "D"],
  ["/portal/reservas", "Reservas", "C"],
];
const adminNavigation = [
  ["/portal/administracion", "Administración", "A"],
];

export function PortalShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, legacy } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const online = useOnlineStatus();
  const isAdmin = user?.role?.name === "ADMIN";
  const navigation = useMemo(
    () => (isAdmin ? [...commonNavigation, ...adminNavigation] : commonNavigation),
    [isAdmin],
  );

  async function handleLogout() {
    await logout();
    router.replace("/acceso");
  }

  return (
    <div className="portal-layout">
      <header className="portal-mobile-header">
        <Link href="/portal" aria-label="Reservas UMG, resumen">
          <BrandMark />
        </Link>
        <button
          className="portal-menu-button"
          type="button"
          aria-label={menuOpen ? "Cerrar navegación" : "Abrir navegación"}
          aria-expanded={menuOpen}
          aria-controls="portal-sidebar"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </header>

      <aside id="portal-sidebar" className={`portal-sidebar${menuOpen ? " is-open" : ""}`}>
        <Link className="portal-sidebar__brand" href="/portal" aria-label="Reservas UMG, resumen">
          <BrandMark />
        </Link>
        <div className="portal-sidebar__context">
          <span>Portal académico</span>
          <strong>{isAdmin ? "Administración" : "Docencia"}</strong>
        </div>
        <nav className="portal-navigation" aria-label="Navegación del portal">
          {navigation.map(([href, label, marker]) => {
            const active = href === "/portal" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                className={active ? "is-active" : ""}
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <span aria-hidden="true">{marker}</span>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="portal-sidebar__account">
          <div className="portal-avatar" aria-hidden="true">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <strong>{user?.firstName} {user?.lastName}</strong>
            <span>{user?.role?.name === "ADMIN" ? "Administrador" : "Docente"}</span>
          </div>
          <Link href="/portal/perfil" aria-label="Abrir perfil">•••</Link>
        </div>
        <button className="portal-logout" type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>

      <div className="portal-main-column">
        {legacy && (
          <div className="notification is-warning is-light" role="status">
            Modo legacy sin autenticación: esta sesión solo personaliza la interfaz y no protege la API.
          </div>
        )}
        {!online && (
          <div className="offline-banner" role="status">
            Sin conexión · Puedes consultar esta vista, pero las acciones están pausadas.
          </div>
        )}
        <main id="contenido-principal" className="portal-content">
          {children}
        </main>
      </div>
      {menuOpen && <button className="portal-backdrop" type="button" aria-label="Cerrar navegación" onClick={() => setMenuOpen(false)} />}
    </div>
  );
}
