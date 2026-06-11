"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export function RegisterForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const senha = String(form.get("senha"));
    const confirmarSenha = String(form.get("confirmarSenha"));

    if (senha !== confirmarSenha) {
      setError("As senhas não conferem.");
      setLoading(false);
      return;
    }

    try {
      await signUp({
        nome: String(form.get("nome")),
        email: String(form.get("email")),
        senha
      });
      router.push("/app/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar sua conta. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center p-8 md:p-12">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#004B87]/50">Nova conta</p>

      <h2 className="mt-3 text-3xl font-black text-[#004B87]">Criar cadastro</h2>

      <p className="mt-2 text-gray-500">Informe seus dados para salvar seu progresso.</p>

      <div className="mt-8 space-y-4">
        <input
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all duration-300 focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10"
          placeholder="Seu nome"
          name="nome"
          required
        />
        <input
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all duration-300 focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10"
          placeholder="Seu email"
          type="email"
          name="email"
          required
        />
        <input
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all duration-300 focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10"
          placeholder="Crie uma senha"
          type="password"
          name="senha"
          required
        />
        <input
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all duration-300 focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10"
          placeholder="Confirme sua senha"
          type="password"
          name="confirmarSenha"
          required
        />
      </div>

      {error && <p className="mt-5 animate-fade-in rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">{error}</p>}

      <button
        disabled={loading}
        className="mt-8 w-full rounded-xl bg-[#004B87] px-5 py-4 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#003366] hover:shadow-lg disabled:transform-none disabled:opacity-60"
      >
        {loading ? "Criando conta..." : "Criar conta"}
      </button>

      <p className="mt-8 text-center text-sm text-gray-500">
        Já tem conta?{" "}
        <Link href="/login" className="font-bold text-[#004B87] transition-colors hover:text-[#FFCC00]">
          Entrar
        </Link>
      </p>
    </form>
  );
}
