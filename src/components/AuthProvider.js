"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createRenderApiClient } from "@/services/render-api";

const AuthContext = createContext(null);
const storageKey = "reservas-session-v1";

const normalized = (value) => value?.raw ?? value ?? {};
const candidateFor = (response) => {
  const raw = normalized(response);
  return raw.usuario ?? raw.user ?? raw.data?.usuario ?? raw.data ?? raw;
};

const identityFrom = (response) => {
  const candidate = candidateFor(response);
  const raw = normalized(candidate);
  const id = candidate.id ?? raw.UMG_ID ?? raw.umg_id;
  if (!id) return null;
  const roleId = candidate.roleId ?? raw.UMG_Rol_ID ?? raw.umg_rol_id;
  const roleName = candidate.roleName ?? raw.UMG_Rol_Nombre ?? raw.umg_rol_nombre ?? "";
  const firstName = candidate.name ?? raw.UMG_Nombre ?? raw.umg_nombre ?? "";
  const lastName = raw.UMG_Apellido ?? raw.umg_apellido ?? "";
  return {
    id: Number(id),
    email: candidate.email ?? raw.UMG_Usuario ?? raw.umg_usuario ?? "",
    name: [firstName, lastName].filter(Boolean).join(" ") || "Usuario UMG",
    roleId: Number(roleId),
    roleName
  };
};

const readSession = () => {
  try {
    const value = JSON.parse(sessionStorage.getItem(storageKey));
    return value?.id && value?.email ? value : null;
  } catch {
    return null;
  }
};

export const isAdminIdentity = (identity) => identity?.roleId === 1 || /admin/i.test(identity?.roleName ?? "");

export function AuthProvider({ children }) {
  const [identity, setIdentity] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setIdentity(readSession());
      setReady(true);
    });
    return () => { active = false; };
  }, []);

  const signIn = useCallback(async ({ username, password }) => {
    const api = createRenderApiClient();
    const loginResponse = await api.login({ username, password });
    let nextIdentity = identityFrom(loginResponse);
    if (!nextIdentity) {
      const users = await api.listUsers();
      nextIdentity = (Array.isArray(users) ? users : [users]).map(identityFrom).find((user) => user?.email.toLowerCase() === username.toLowerCase()) ?? null;
    }
    if (!nextIdentity) throw new Error("login.identityMissing");
    sessionStorage.setItem(storageKey, JSON.stringify(nextIdentity));
    setIdentity(nextIdentity);
    return nextIdentity;
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(storageKey);
    setIdentity(null);
  }, []);

  const value = useMemo(() => ({
    identity,
    ready,
    isAdmin: isAdminIdentity(identity),
    signIn,
    signOut
  }), [identity, ready, signIn, signOut]);

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("AuthProvider is required");
  return value;
}
