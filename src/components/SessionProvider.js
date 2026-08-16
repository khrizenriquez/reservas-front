"use client";
import { createContext, useContext, useState } from "react";
const SessionContext = createContext(null);
export function SessionProvider({ children, initialSession = null }) { const [session,setSession]=useState(initialSession); return <SessionContext value={{session,setSession}}>{children}</SessionContext>; }
export const useSession=()=>useContext(SessionContext);
