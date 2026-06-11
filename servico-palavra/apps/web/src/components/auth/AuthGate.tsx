"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMe } from "@/lib/auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    getMe()
      .then(() => {
        if (active) {
          setAllowed(true);
        }
      })
      .catch(() => {
        if (active) {
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      })
      .finally(() => {
        if (active) {
          setChecking(false);
        }
      });

    return () => {
      active = false;
    };
  }, [pathname, router]);

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
