"use client";
import { useState } from "react";
import Link from "next/link";
import { createRenderApiClient } from "@/services/render-api";
import { StatusMessage } from "@/components/StatusMessage";
import { useSession } from "@/components/SessionProvider";
import { useRouter } from "next/navigation";
export default function AccessPage() { const [status,setStatus]=useState("idle"); const [error,setError]=useState(null); const {setSession}=useSession(); const router=useRouter(); const submit=async(e)=>{e.preventDefault();const form=new FormData(e.currentTarget);setStatus("loading");setError(null);try{const session=await createRenderApiClient().login({username:form.get("username"),password:form.get("password")});setSession(session);router.push("/portal");}catch(caught){setError(caught?.code||"api.network");setStatus("idle");}};return <main className="section access-page"><div className="access-panel"><Link href="/">← UMG Ingeniería</Link><h1>Acceso institucional</h1><p>Ingresa con tus credenciales institucionales para continuar.</p><form onSubmit={submit}><label>Correo institucional<input name="username" type="email" autoComplete="username" required /></label><label>Contraseña<input name="password" type="password" autoComplete="current-password" required /></label><button className="button is-primary is-fullwidth" disabled={status==="loading"}>{status==="loading"?"Verificando…":"Ingresar"}</button></form>{error?<StatusMessage code={error}/>:null}</div></main>; }
