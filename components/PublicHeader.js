"use client";

import Link from "next/link";
import { useState } from "react";

import { BrandMark } from "@/components/BrandMark";

export function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="public-header">
      <nav className="navbar container" aria-label="Navegación principal">
        <div className="navbar-brand">
          <Link className="navbar-item public-header__brand" href="/" aria-label="Reservas UMG, inicio">
            <BrandMark />
          </Link>
          <button
            type="button"
            className={`navbar-burger${open ? " is-active" : ""}`}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="public-navigation"
            onClick={() => setOpen((current) => !current)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
        <div id="public-navigation" className={`navbar-menu${open ? " is-active" : ""}`}>
          <div className="navbar-end">
            <a className="navbar-item" href="#laboratorios" onClick={() => setOpen(false)}>
              Laboratorios
            </a>
            <a className="navbar-item" href="#como-funciona" onClick={() => setOpen(false)}>
              Cómo funciona
            </a>
            <a className="navbar-item" href="#preguntas" onClick={() => setOpen(false)}>
              Preguntas
            </a>
            <div className="navbar-item">
              <Link className="button is-primary" href="/acceso">
                Acceso institucional
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
