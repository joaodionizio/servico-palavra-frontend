"use client";

import { createContext, createElement, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { getMe, login, logout, register } from "@/lib/auth";
import type { LoginPayload, RegisterPayload, Usuario } from "@/types/auth";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  usuario: Usuario | null;
  loading: boolean;
  status: AuthStatus;
  refreshUsuario: (options?: { force?: boolean }) => Promise<Usuario | null>;
  ensureUsuario: () => Promise<Usuario>;
  signIn: (payload: LoginPayload) => Promise<Usuario>;
  signUp: (payload: RegisterPayload) => Promise<Usuario>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const requestRef = useRef<Promise<Usuario | null> | null>(null);

  const refreshUsuario = useCallback(async (options: { force?: boolean } = {}) => {
    if (!options.force && usuario && status === "authenticated") {
      return usuario;
    }

    if (!options.force && status === "unauthenticated") {
      return null;
    }

    if (!options.force && requestRef.current) {
      return requestRef.current;
    }

    if (status !== "authenticated") {
      setStatus("loading");
    }

    requestRef.current = getMe()
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
        requestRef.current = null;
      });

    return requestRef.current;
  }, [status, usuario]);

  const ensureUsuario = useCallback(async () => {
    const currentUsuario = await refreshUsuario();

    if (!currentUsuario) {
      throw new Error("Usuario nao autenticado.");
    }

    return currentUsuario;
  }, [refreshUsuario]);

  const signIn = useCallback(async (payload: LoginPayload) => {
    const response = await login(payload);
    const currentUsuario = await getMe().catch(() => response.usuario);
    setUsuario(currentUsuario);
    setStatus("authenticated");
    return currentUsuario;
  }, []);

  const signUp = useCallback(async (payload: RegisterPayload) => {
    const response = await register(payload);
    const currentUsuario = await getMe().catch(() => response.usuario);
    setUsuario(currentUsuario);
    setStatus("authenticated");
    return currentUsuario;
  }, []);

  const signOut = useCallback(async () => {
    await logout().catch(() => undefined);
    setUsuario(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({ usuario, loading: status === "loading", status, refreshUsuario, ensureUsuario, signIn, signUp, signOut }),
    [ensureUsuario, refreshUsuario, signIn, signOut, signUp, status, usuario]
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
