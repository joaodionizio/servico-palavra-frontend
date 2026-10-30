"use client";

import { useRouter } from "next/navigation";
import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getMe, login, logout, register, updateMe } from "@/lib/auth";
import { AUTH_EXPIRED_EVENT, clearCsrfToken } from "@/lib/api";
import type { LoginPayload, RegisterPayload, UpdateProfilePayload, Usuario } from "@/types/auth";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  usuario: Usuario | null;
  loading: boolean;
  status: AuthStatus;
  refreshUsuario: (options?: { force?: boolean }) => Promise<Usuario | null>;
  ensureUsuario: () => Promise<Usuario>;
  signIn: (payload: LoginPayload) => Promise<Usuario>;
  signUp: (payload: RegisterPayload) => Promise<Usuario>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<Usuario>;
  signOut: () => Promise<void>;
};

type AuthRequestCache = {
  current: Promise<Usuario | null> | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [requestCache] = useState<AuthRequestCache>(() => ({ current: null }));

  const refreshUsuario = useCallback(async (options: { force?: boolean } = {}) => {
    if (!options.force && usuario && status === "authenticated") {
      return usuario;
    }

    if (!options.force && status === "unauthenticated") {
      return null;
    }

    if (!options.force && requestCache.current) {
      return requestCache.current;
    }

    if (status !== "authenticated") {
      setStatus("loading");
    }

    const request = getMe()
      .then((currentUsuario) => {
        setUsuario(currentUsuario);
        setStatus("authenticated");
        return currentUsuario;
      })
      .catch(() => {
        setUsuario(null);
        setStatus("unauthenticated");
        return null;
      })
      .finally(() => {
        if (requestCache.current === request) {
          requestCache.current = null;
        }
      });

    requestCache.current = request;
    return request;
  }, [requestCache, status, usuario]);

  const ensureUsuario = useCallback(async () => {
    const currentUsuario = await refreshUsuario();

    if (!currentUsuario) {
      throw new Error("Usuario nao autenticado.");
    }

    return currentUsuario;
  }, [refreshUsuario]);

  const signIn = useCallback(async (payload: LoginPayload) => {
    const response = await login(payload);
    requestCache.current = null;
    setUsuario(response.usuario);
    setStatus("authenticated");
    return response.usuario;
  }, [requestCache]);

  const signUp = useCallback(async (payload: RegisterPayload) => {
    const response = await register(payload);
    const currentUsuario = await getMe().catch(() => response.usuario);
    requestCache.current = null;
    setUsuario(currentUsuario);
    setStatus("authenticated");
    return currentUsuario;
  }, [requestCache]);

  const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
    const currentUsuario = await updateMe(payload);
    setUsuario(currentUsuario);
    setStatus("authenticated");
    return currentUsuario;
  }, []);

  const signOut = useCallback(async () => {
    await logout().catch(() => undefined);
    requestCache.current = null;
    clearCsrfToken();
    setUsuario(null);
    setStatus("unauthenticated");
  }, [requestCache]);

  useEffect(() => {
    function handleAuthExpired() {
      const currentPath = `${window.location.pathname}${window.location.search}`;
      const redirectTarget = currentPath.startsWith("/login") ? "/login?expired=1" : `/login?expired=1&redirect=${encodeURIComponent(currentPath)}`;

      requestCache.current = null;
      clearCsrfToken();
      setUsuario(null);
      setStatus("unauthenticated");
      router.replace(redirectTarget);
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
  }, [requestCache, router]);

  const value = useMemo(
    () => ({ usuario, loading: status === "loading", status, refreshUsuario, ensureUsuario, signIn, signUp, updateProfile, signOut }),
    [ensureUsuario, refreshUsuario, signIn, signOut, signUp, status, updateProfile, usuario]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
