"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { BrandEyebrow } from "@/components/branding/BrandEyebrow";

const items = [
  ["Início", "/app", "⌂"],
  ["Formações", "/app/formacoes", "◫"],
  ["Favoritos", "/app/favoritos", "◇"],
  ["Plano", "/app/plano-biblico", "✦"],
  ["Cronograma", "/app/cronograma", "◷"],
  ["Perfil", "/app/perfil", "○"]
];

const RAIL_STORAGE_KEY = "servico-palavra-rail";
const RAIL_CHANGE_EVENT = "servico-palavra-rail-change";

function hasAdminRole(roles?: string[]) {
  return roles?.some((role) => ["admin", "administrador"].includes(role.trim().toLowerCase())) ?? false;
}

function isActivePath(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app" || pathname === "/app/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function subscribeRailPreference(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === RAIL_STORAGE_KEY) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(RAIL_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(RAIL_CHANGE_EVENT, onStoreChange);
  };
}

function getRailPreferenceSnapshot() {
  try {
    return window.localStorage.getItem(RAIL_STORAGE_KEY) === "collapsed";
  } catch {
    return false;
  }
}

function getServerRailPreferenceSnapshot() {
  return false;
}

export function AppShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut, usuario } = useAuth();
  const showAdminLink = admin || hasAdminRole(usuario?.roles);
  const [menuOpen, setMenuOpen] = useState(false);
  const railCollapsed = useSyncExternalStore(subscribeRailPreference, getRailPreferenceSnapshot, getServerRailPreferenceSnapshot);
  const [signingOut, setSigningOut] = useState(false);
  const [isMobileNav, setIsMobileNav] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useFocusTrap({
    active: isMobileNav && menuOpen,
    containerRef: drawerRef,
    onEscape: closeMenu,
    initialFocusSelector: ".app-rail-nav a"
  });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const updateMode = () => {
      setIsMobileNav(media.matches);
      if (!media.matches) {
        setMenuOpen(false);
      }
    };

    updateMode();
    media.addEventListener("change", updateMode);
    return () => media.removeEventListener("change", updateMode);
  }, []);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    const shouldHideDrawer = isMobileNav && !menuOpen;
    drawer.inert = shouldHideDrawer;
    if (shouldHideDrawer) {
      drawer.setAttribute("aria-hidden", "true");
    } else {
      drawer.removeAttribute("aria-hidden");
    }

    return () => {
      drawer.inert = false;
      drawer.removeAttribute("aria-hidden");
    };
  }, [isMobileNav, menuOpen]);

  useEffect(() => {
    if (!isMobileNav || !menuOpen) return;

    const main = mainRef.current;
    const previousOverflow = document.body.style.overflow;
    const previousAriaHidden = main?.getAttribute("aria-hidden") ?? null;
    const previousInert = main?.inert ?? false;

    document.body.style.overflow = "hidden";
    if (main) {
      main.inert = true;
      main.setAttribute("aria-hidden", "true");
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      if (main) {
        main.inert = previousInert;
        if (previousAriaHidden === null) {
          main.removeAttribute("aria-hidden");
        } else {
          main.setAttribute("aria-hidden", previousAriaHidden);
        }
      }
    };
  }, [isMobileNav, menuOpen]);

  function toggleTheme() {
    const nextDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextDark);
    try { window.localStorage.setItem("servico-palavra-theme", nextDark ? "dark" : "light"); } catch {}
  }

  async function sair() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      await signOut();
      router.push("/login");
    } finally {
      setSigningOut(false);
    }
  }

  function toggleRail() {
    const next = !railCollapsed;
    try { window.localStorage.setItem(RAIL_STORAGE_KEY, next ? "collapsed" : "expanded"); } catch {}
    window.dispatchEvent(new Event(RAIL_CHANGE_EVENT));
  }

  const navigation = (
    <>
      <nav className="app-rail-nav" aria-label={admin ? "Navegação administrativa" : "Navegação principal"}>
        {items.map(([label, href, icon]) => {
          const active = !admin && isActivePath(pathname, href);
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined} className={active ? "active" : ""} onClick={closeMenu}>
              <span aria-hidden="true">{icon}</span><b>{label}</b>
            </Link>
          );
        })}
        {showAdminLink && (
          <Link href="/app/admin/conteudos" className={admin || pathname.includes("/admin") ? "active" : ""} onClick={closeMenu}>
            <span aria-hidden="true">□</span><b>Admin</b>
          </Link>
        )}
      </nav>
      <div className="app-rail-actions">
        <button type="button" onClick={toggleTheme} aria-label="Alternar tema">
          <span aria-hidden="true" className="dark:hidden">◐</span>
          <span className="dark:hidden">Modo escuro</span>
          <span aria-hidden="true" className="hidden dark:inline">☀</span>
          <span className="hidden dark:inline">Modo claro</span>
        </button>
        <button type="button" onClick={sair} disabled={signingOut} aria-busy={signingOut}>
          {signingOut ? <i className="action-orbit rail-spinner" aria-hidden="true" /> : "↗"}
          <span>{signingOut ? "Saindo..." : "Sair"}</span>
        </button>
      </div>
    </>
  );

  return (
    <div className={`app-experience min-h-screen bg-[#F4F7F8] text-gray-800 dark:bg-[#050505] dark:text-slate-100 ${railCollapsed ? "rail-collapsed" : ""}`}>
      <header className="app-mobile-header">
        <Link href="/app" onClick={closeMenu}><BrandEyebrow variant="light" className="text-lg font-black" /></Link>
        <button
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="app-navigation-drawer"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </header>

      <aside ref={drawerRef} id="app-navigation-drawer" className={`app-rail ${menuOpen ? "open" : ""}`} aria-label="Menu da aplicação">
        <button type="button" className="app-rail-toggle" onClick={toggleRail} aria-label={railCollapsed ? "Expandir menu" : "Recolher menu"} title={railCollapsed ? "Expandir menu" : "Recolher menu"}>{railCollapsed ? "›" : "‹"}</button>
        <Link href="/app" className="app-rail-brand" onClick={closeMenu}>
          <BrandEyebrow variant="onBlue" className="text-xl font-semibold" />
          <strong>{admin ? "Admin Serviço da Palavra" : "Serviço da Palavra"}</strong>
        </Link>
        <div className="app-rail-art" aria-hidden="true"><i /><i /><i /></div>
        {navigation}
      </aside>

      {menuOpen && <button className="app-menu-backdrop" aria-label="Fechar menu" tabIndex={-1} onClick={closeMenu} />}

      <main ref={mainRef} className="app-main" id="main-content"><div className="animate-fade-in">{children}</div></main>
    </div>
  );
}
