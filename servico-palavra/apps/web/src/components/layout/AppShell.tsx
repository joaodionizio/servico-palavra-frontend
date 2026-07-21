"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { BrandEyebrow } from "@/components/branding/BrandEyebrow";

const items = [
  ["Início", "/app", "⌂"],
  ["Formações", "/app/formacoes", "◫"],
  ["Favoritos", "/app/favoritos", "◇"],
  ["Plano", "/app/plano-biblico", "✦"],
  ["Cronograma", "/app/cronograma", "◷"],
  ["Perfil", "/app/perfil", "○"]
];

function hasAdminRole(roles?: string[]) {
  return roles?.some((role) => ["admin", "administrador"].includes(role.trim().toLowerCase())) ?? false;
}

function isActivePath(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app" || pathname === "/app/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut, usuario } = useAuth();
  const showAdminLink = admin || hasAdminRole(usuario?.roles);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(false);

  useEffect(() => {
    const savedTheme = (() => { try { return window.localStorage.getItem("servico-palavra-theme"); } catch { return null; } })();
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    const initialTheme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : prefersDark ? "dark" : "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    try { setRailCollapsed(window.localStorage.getItem("servico-palavra-rail") === "collapsed"); } catch {}
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  function toggleTheme() {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try { window.localStorage.setItem("servico-palavra-theme", next); } catch {}
      return next;
    });
  }

  async function sair() { await signOut(); router.push("/login"); }

  function toggleRail() {
    setRailCollapsed((current) => {
      const next = !current;
      try { window.localStorage.setItem("servico-palavra-rail", next ? "collapsed" : "expanded"); } catch {}
      return next;
    });
  }

  const navigation = (
    <>
      <nav className="app-rail-nav">
        {items.map(([label, href, icon]) => {
          const active = !admin && isActivePath(pathname, href);
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined} className={active ? "active" : ""}>
              <span aria-hidden="true">{icon}</span><b>{label}</b>
            </Link>
          );
        })}
        {showAdminLink && (
          <Link href="/app/admin/conteudos" className={admin || pathname.includes("/admin") ? "active" : ""}>
            <span aria-hidden="true">□</span><b>Admin</b>
          </Link>
        )}
      </nav>
      <div className="app-rail-actions">
        <button type="button" onClick={toggleTheme}>{theme === "dark" ? "☀" : "◐"}<span>{theme === "dark" ? "Modo claro" : "Modo escuro"}</span></button>
        <button type="button" onClick={sair}>↗<span>Sair</span></button>
      </div>
    </>
  );

  return (
    <div className={`app-experience min-h-screen bg-[#F4F7F8] text-gray-800 ${railCollapsed ? "rail-collapsed" : ""}`}>
      <header className="app-mobile-header">
        <Link href="/app"><BrandEyebrow variant="light" className="text-lg font-black" /></Link>
        <button type="button" aria-label="Abrir menu" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? "×" : "☰"}</button>
      </header>

      <aside className={`app-rail ${menuOpen ? "open" : ""}`}>
        <button type="button" className="app-rail-toggle" onClick={toggleRail} aria-label={railCollapsed ? "Expandir menu" : "Recolher menu"} title={railCollapsed ? "Expandir menu" : "Recolher menu"}>{railCollapsed ? "›" : "‹"}</button>
        <Link href="/app" className="app-rail-brand">
          <BrandEyebrow variant="onBlue" className="text-xl font-semibold" />
          <strong>{admin ? "Admin Serviço da Palavra" : "Serviço da Palavra"}</strong>
        </Link>
        <div className="app-rail-art" aria-hidden="true"><i /><i /><i /></div>
        {navigation}
      </aside>

      {menuOpen && <button className="app-menu-backdrop" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}

      <main className="app-main"><div className="animate-fade-in">{children}</div></main>
    </div>
  );
}
