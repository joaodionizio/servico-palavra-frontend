"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { signIn } = useAuth();
  const sessionExpired = params.get("expired") === "1";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);

    try {
      await signIn({
        email: String(form.get("email")),
        senha: String(form.get("senha"))
      });
      router.push(params.get("redirect") ?? "/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center p-8 md:p-12">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D3A900]">Bem-vindo</p>

      <h2 className="mt-3 text-3xl font-black tracking-tight text-[#003A70]">Entrar na conta</h2>

      <p className="mt-2 text-slate-500">Acesse para continuar sua formação.</p>

      {sessionExpired && !error && (
        <p className="mt-5 animate-fade-in rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm font-medium text-amber-700">
          Sua sessão expirou por inatividade. Entre novamente para continuar.
        </p>
      )}

      <div className="mt-8 space-y-5">
        <input
          className="w-full rounded-none border-0 border-b border-slate-200 bg-transparent px-0 py-4 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-[#004B87] focus:ring-0"
          placeholder="Seu email"
          type="email"
          name="email"
          required
        />

        <input
          className="w-full rounded-none border-0 border-b border-slate-200 bg-transparent px-0 py-4 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-[#004B87] focus:ring-0"
          placeholder="Sua senha"
          type="password"
          name="senha"
          required
        />
      </div>

      {error && <p className="mt-5 animate-fade-in rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">{error}</p>}

      <button
        disabled={loading}
        className="mt-8 w-full rounded-full bg-[#004B87] px-5 py-4 font-bold text-white transition-all hover:-translate-y-1 hover:bg-[#003366] hover:shadow-[0_18px_40px_rgba(0,75,135,.22)] disabled:transform-none disabled:opacity-60"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <p className="mt-8 text-center text-sm text-slate-500">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-bold text-[#004B87] transition-colors hover:text-[#D3A900]">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
