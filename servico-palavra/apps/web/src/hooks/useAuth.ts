"use client";

import { useEffect, useState } from "react";
import { getMe, login, logout, register } from "@/lib/auth";
import type { LoginPayload, RegisterPayload, Usuario } from "@/types/auth";

export function useAuth() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setLoading(false));
  }, []);

  async function signIn(payload: LoginPayload) {
    const response = await login(payload);
    setUsuario(response.usuario);
    return response.usuario;
  }

  async function signUp(payload: RegisterPayload) {
    const response = await register(payload);
    setUsuario(response.usuario);
    return response.usuario;
  }

  async function signOut() {
    await logout().catch(() => undefined);
    setUsuario(null);
  }

  return { usuario, loading, signIn, signUp, signOut };
}
