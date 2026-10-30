"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { BrandEyebrow } from "@/components/branding/BrandEyebrow";
import type { Usuario } from "@/types/auth";

type AuthGateProps = {
  children: React.ReactNode;
  requiredRole?: string;
  unauthorizedRedirect?: string;
};

function hasRole(usuario: Usuario, requiredRole: string) {
  return usuario.roles.some((role) => role.trim().toLowerCase() === requiredRole.trim().toLowerCase());
}

export function AuthGate({ children, requiredRole, unauthorizedRedirect = "/app" }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { ensureUsuario, status, usuario } = useAuth();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(status !== "authenticated");
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    let active = true;

    async function validateAccess() {
      setUnauthorized(false);

      try {
        const hasAuthenticatedUsuario = status === "authenticated" && usuario;

        if (!hasAuthenticatedUsuario) {
          setAllowed(false);
          setChecking(true);
        }

        const currentUsuario = hasAuthenticatedUsuario ? usuario : await ensureUsuario();

        if (!active) {
          return;
        }

        if (requiredRole && !hasRole(currentUsuario, requiredRole)) {
          setAllowed(false);
          setUnauthorized(true);
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
  }, [ensureUsuario, pathname, requiredRole, router, status, usuario]);

  if (unauthorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6 dark:bg-slate-950">
        <div className="animate-slide-up max-w-md rounded-2xl border border-gray-100 bg-white px-8 py-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#FFCC00]">Acesso restrito</p>
          <h1 className="mt-3 text-2xl font-black text-[#004B87] dark:text-blue-200">Área administrativa</h1>
          <p className="mt-2 text-gray-500 dark:text-slate-300">Sua conta não possui permissão de administrador para acessar esta área.</p>
          <button
            type="button"
            onClick={() => router.replace(unauthorizedRedirect)}
            className="mt-6 rounded-xl bg-[#004B87] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#003366] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/60 motion-reduce:transform-none motion-reduce:transition-none"
          >
            Voltar
          </button>
        </div>
      </main>
    );
  }

  if (checking || !allowed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6 dark:bg-slate-950">
        <div className="animate-slide-up rounded-2xl border border-gray-100 bg-white px-8 py-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <BrandEyebrow variant="light" className="text-sm font-bold tracking-wide" />
          <p className="mt-2 animate-pulse text-lg font-bold text-[#004B87] dark:text-blue-200">Carregando...</p>
        </div>
      </main>
    );
  }

  return children;
}
