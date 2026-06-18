"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Usuario } from "@/types/auth";

type AuthGateProps = {
  children: React.ReactNode;
  requiredRole?: string;
  unauthorizedRedirect?: string;
};

function hasRole(usuario: Usuario, requiredRole: string) {
  return usuario.roles.some((role) => role.toLowerCase() === requiredRole.toLowerCase());
}

export function AuthGate({ children, requiredRole, unauthorizedRedirect = "/app" }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { ensureUsuario, status, usuario } = useAuth();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(status !== "authenticated");

  useEffect(() => {
    let active = true;

    async function validateAccess() {
      if (status === "authenticated" && usuario) {
        if (requiredRole && !hasRole(usuario, requiredRole)) {
          router.replace(unauthorizedRedirect);
          return;
        }

        setAllowed(true);
        setChecking(false);
        return;
      }

      setAllowed(false);
      setChecking(true);

      try {
        const currentUsuario = await ensureUsuario();

        if (!active) {
          return;
        }

        if (requiredRole && !hasRole(currentUsuario, requiredRole)) {
          router.replace(unauthorizedRedirect);
          return;
        }

        setAllowed(true);
      } catch {
        if (active) {
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    }

    void validateAccess();

    return () => {
      active = false;
    };
  }, [ensureUsuario, pathname, requiredRole, router, status, unauthorizedRedirect, usuario]);

  if (checking || !allowed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">
        <div className="animate-slide-up rounded-2xl border border-gray-100 bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#FFCC00]">Serviço</p>
          <p className="mt-2 animate-pulse text-lg font-bold text-[#004B87]">Carregando...</p>
        </div>
      </main>
    );
  }

  return children;
}
