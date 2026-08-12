"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { messageForError } from "@/lib/api/problem";
import { useSession } from "@/providers/SessionProvider";

export function RequiredPasswordChange() {
  const router = useRouter();
  const { status, user, legacy, request, logout } = useSession();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status === "anonymous") router.replace("/acceso");
    if (status === "authenticated" && !user.mustChangePassword) router.replace("/portal");
  }, [router, status, user]);

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      await request("changePassword", { body: {
        currentPassword: String(form.get("currentPassword")),
        newPassword: String(form.get("newPassword")),
      } });
      await logout();
      router.replace("/acceso");
    } catch (caught) {
      setError(messageForError(caught));
      setBusy(false);
    }
  }

  if (status !== "authenticated") return <main className="portal-loading"><p>Preparando cambio de contraseña…</p></main>;
  return <main className="section"><div className="container is-max-desktop"><section className="portal-panel"><p className="eyebrow">Primer ingreso</p><h1>Cambia tu contraseña</h1><p>Debes completar este paso antes de usar el portal.</p>{error && <div className="notification is-danger is-light" role="alert">{error}</div>}<form className="stack-form" onSubmit={submit}>{!legacy && <div className="field"><label className="label" htmlFor="required-current">Contraseña actual</label><input className="input" id="required-current" name="currentPassword" type="password" minLength={6} required /></div>}<div className="field"><label className="label" htmlFor="required-new">Nueva contraseña</label><input className="input" id="required-new" name="newPassword" type="password" minLength={6} required /></div><button className={`button is-primary${busy ? " is-loading" : ""}`} disabled={busy} type="submit">Guardar contraseña</button></form></section></div></main>;
}
