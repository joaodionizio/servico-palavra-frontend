"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const items = [
  ["Início", "/app"],
  ["Formações", "/app/formacoes"],
  ["Favoritos", "/app/favoritos"],
  ["Plano", "/app/plano-biblico"],
  ["Cronograma", "/app/cronograma"],
  ["Perfil", "/app/perfil"]
];

function hasAdminRole(roles?: string[]) {
  return roles?.some((role) => ["admin", "administrador"].includes(role.trim().toLowerCase())) ?? false;
}

function isActivePath(pathname: string, href: string) {
  if (href === "/app") {
    return pathname === "/app" || pathname === "/app/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut, usuario } = useAuth();
  const showAdminLink = admin || hasAdminRole(usuario?.roles);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = (() => {
      try {
        return window.localStorage.getItem("servico-palavra-theme");
      } catch {
        return null;
      }
    })();
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    const initialTheme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : prefersDark ? "dark" : "light";

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  function toggleTheme() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      try {
        window.localStorage.setItem("servico-palavra-theme", nextTheme);
      } catch {
        // Preferencia visual apenas; se o browser bloquear storage, mantemos o tema da sessao.
      }
      return nextTheme;
    });
  }

  async function sair() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-800">
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/app" className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#FFCC00]">Serviço</span>
            <span className="text-xl font-black text-[#004B87] sm:text-2xl">
              {admin ? "Admin Serviço da Palavra" : "Serviço da Palavra"}
            </span>
          </Link>

          <nav className="flex gap-2 overflow-x-auto pb-1 text-sm font-semibold lg:overflow-visible lg:pb-0">
            {items.map(([label, href]) => {
              const active = !admin && isActivePath(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-4 py-2 transition ${
                    active ? "bg-[#004B87] text-white shadow-sm" : "text-gray-500 hover:bg-blue-50 hover:text-[#004B87]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            {showAdminLink && (
              <Link
                href="/app/admin/conteudos"
                aria-current={admin || pathname.startsWith("/admin") || pathname.startsWith("/app/admin") ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-4 py-2 transition ${
                  admin || pathname.startsWith("/admin") || pathname.startsWith("/app/admin")
                    ? "bg-[#004B87] text-white shadow-sm"
                    : "text-gray-500 hover:bg-blue-50 hover:text-[#004B87]"
                }`}
              >
                Admin
              </Link>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
              className="whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-gray-500 transition hover:bg-blue-50 hover:text-[#004B87]"
            >
              {theme === "dark" ? "Claro" : "Escuro"}
            </button>
            <button
              onClick={sair}
              className="whitespace-nowrap rounded-full bg-[#004B87] px-5 py-2 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#003366] hover:shadow-md"
            >
              Sair
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-8">
        <div className="animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
