"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { PageHeader } from "@/components/PageHeader";
import { messageForError } from "@/lib/api/problem";
import { useSession } from "@/providers/SessionProvider";

export function ProfileSessions() {
  const router = useRouter();
  const { user, legacy, request, logout } = useSession();
  const [state, setState] = useState({ busy: false, error: "", success: "" });

  async function changePassword(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const currentPassword = String(form.get("currentPassword"));
    const newPassword = String(form.get("newPassword"));
    setState({ busy: true, error: "", success: "" });
    try {
      await request("changePassword", { body: { currentPassword, newPassword } });
      await logout();
      router.replace("/acceso");
    } catch (error) {
      setState({ busy: false, error: messageForError(error), success: "" });
    }
  }

  return (
    <>
      <PageHeader eyebrow="Cuenta" title="Perfil" description="Identidad usada por este cliente y cambio de contraseña." />
      {legacy && <div className="notification is-warning is-light">La API legacy no permite verificar ni revocar sesiones.</div>}
      <section className="portal-panel">
        <h2>{user.firstName} {user.lastName}</h2>
        <p>{user.username} · {user.role.name}</p>
      </section>
      <section className="portal-panel">
        <h2>Cambiar contraseña</h2>
        {state.error && <div className="notification is-danger is-light" role="alert">{state.error}</div>}
        <form className="stack-form" onSubmit={changePassword}>
          {!legacy && <div className="field"><label className="label" htmlFor="current-password">Contraseña actual</label><input className="input" id="current-password" name="currentPassword" type="password" minLength={6} required /></div>}
          <div className="field"><label className="label" htmlFor="new-password-profile">Nueva contraseña</label><input className="input" id="new-password-profile" name="newPassword" type="password" minLength={6} required /></div>
          <button className={`button is-primary${state.busy ? " is-loading" : ""}`} disabled={state.busy} type="submit">Cambiar y volver a ingresar</button>
        </form>
      </section>
    </>
  );
}
