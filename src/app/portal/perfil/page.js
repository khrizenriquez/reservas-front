"use client";
import { useSession } from "@/components/SessionProvider";
export default function ProfilePage(){const {session}=useSession();return <section><h1>Perfil</h1><p>{session?.name||"Usuario institucional"}</p><p>Esta sesión existe solo en memoria del navegador.</p></section>}
