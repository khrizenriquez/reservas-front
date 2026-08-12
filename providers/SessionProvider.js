"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { apiRequest } from "@/lib/api/client";
import { API_PROFILE, IS_LEGACY, SESSION_NAMESPACE } from "@/lib/api/profile";

const SessionContext = createContext(null);

function loadStoredSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_NAMESPACE) ?? "null");
  } catch {
    return null;
  }
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState({ status: "booting", user: null });
  const tokensRef = useRef({ accessToken: null, refreshToken: null });
  const refreshPromiseRef = useRef(null);

  const clearSession = useCallback(() => {
    tokensRef.current = { accessToken: null, refreshToken: null };
    localStorage.removeItem(SESSION_NAMESPACE);
    setSession({ status: "anonymous", user: null });
  }, []);

  const saveLegacySession = useCallback((user) => {
    localStorage.setItem(SESSION_NAMESPACE, JSON.stringify({ user }));
    setSession({ status: "authenticated", user });
    return user;
  }, []);

  const saveV2Session = useCallback((pair, user) => {
    tokensRef.current = { accessToken: pair.accessToken, refreshToken: pair.refreshToken };
    localStorage.setItem(SESSION_NAMESPACE, JSON.stringify(tokensRef.current));
    setSession({ status: "authenticated", user });
    return user;
  }, []);

  const refresh = useCallback(async () => {
    if (IS_LEGACY) throw new Error("Legacy profile has no refresh session");
    if (!refreshPromiseRef.current) {
      refreshPromiseRef.current = (async () => {
        const refreshToken = tokensRef.current.refreshToken;
        if (!refreshToken) throw new Error("No refresh token is available");
        const pair = await apiRequest("refreshSession", { body: { refreshToken } });
        tokensRef.current = { accessToken: pair.accessToken, refreshToken: pair.refreshToken };
        const user = await apiRequest("getCurrentUser", { accessToken: pair.accessToken });
        return saveV2Session(pair, user);
      })().finally(() => {
        refreshPromiseRef.current = null;
      });
    }
    return refreshPromiseRef.current;
  }, [saveV2Session]);

  useEffect(() => {
    const stored = loadStoredSession();
    if (IS_LEGACY) {
      queueMicrotask(() => stored?.user ? saveLegacySession(stored.user) : clearSession());
      return;
    }
    if (!stored?.refreshToken) {
      queueMicrotask(clearSession);
      return;
    }
    tokensRef.current = stored;
    refresh().catch(clearSession);
  }, [clearSession, refresh, saveLegacySession]);

  const login = useCallback(async ({ username, password }) => {
    const result = await apiRequest("login", { body: { username, password } });
    return IS_LEGACY
      ? saveLegacySession(result.user)
      : saveV2Session(result, result.user);
  }, [saveLegacySession, saveV2Session]);

  const request = useCallback(async (operationId, options = {}) => {
    const invoke = () => apiRequest(operationId, {
      ...options,
      actor: session.user,
      accessToken: tokensRef.current.accessToken,
    });
    try {
      return await invoke();
    } catch (error) {
      if (IS_LEGACY || error?.status !== 401 || operationId === "refreshSession") throw error;
      await refresh();
      return invoke();
    }
  }, [refresh, session.user]);

  const logout = useCallback(async () => {
    try {
      if (!IS_LEGACY && tokensRef.current.refreshToken) {
        await apiRequest("logout", {
          accessToken: tokensRef.current.accessToken,
          body: { refreshToken: tokensRef.current.refreshToken },
        });
      }
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(() => ({
    ...session,
    apiProfile: API_PROFILE,
    legacy: IS_LEGACY,
    login,
    logout,
    request,
    clearSession,
  }), [clearSession, login, logout, request, session]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used inside SessionProvider");
  return context;
}
