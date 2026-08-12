"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { messageForError } from "@/lib/api/problem";
import { useSession } from "@/providers/SessionProvider";

export function LoginForm() {
  const router = useRouter();
  const { status, login } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const online = useOnlineStatus();

  useEffect(() => {
    if (status === "authenticated") router.replace("/portal");
  }, [router, status]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      const user = await login({
        username: String(form.get("username")).trim(),
        password: String(form.get("password")),
      });
      router.replace(user.mustChangePassword ? "/cambiar-contrasena" : "/portal");
    } catch (requestError) {
      setError(messageForError(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="access-card">
      <div className="access-card__heading">
        <p className="eyebrow">Cuenta institucional</p>
        <h1 id="access-title">Bienvenido de nuevo</h1>
        <p>Ingresa para consultar disponibilidad y administrar tus reservas.</p>
      </div>

      {!online && (
        <div className="notification is-warning is-light" role="status">
          Estás sin conexión. Podrás ingresar cuando la red esté disponible.
        </div>
      )}
      {error && (
        <div className="notification is-danger is-light" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} aria-labelledby="access-title">
        <div className="field">
          <label className="label" htmlFor="username">
            Correo institucional
          </label>
          <div className="control">
            <input
              className="input"
              id="username"
              name="username"
              type="email"
              autoComplete="username"
              inputMode="email"
              maxLength={254}
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="password">
            Contraseña
          </label>
          <div className="control">
            <input
              className="input"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={6}
              maxLength={1024}
              required
            />
          </div>
        </div>
        <button
          className={`button is-primary is-fullwidth${submitting ? " is-loading" : ""}`}
          type="submit"
          disabled={!online || submitting || status === "booting"}
        >
          Iniciar sesión
        </button>
      </form>

      <p className="access-card__help">
        ¿Problemas con tu acceso? Contacta al administrador de la plataforma.
      </p>
      <Link className="access-card__back" href="/">
        ← Volver al inicio
      </Link>
    </div>
  );
}
