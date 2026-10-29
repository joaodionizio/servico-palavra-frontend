"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { requestPasswordReset } from "@/lib/auth";

const SUCCESS_MESSAGE = "Se existir uma conta com esse e-mail, enviaremos as instruções de recuperação.";

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();

    try {
      await requestPasswordReset({ email });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível solicitar a recuperação agora.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col justify-center p-8 md:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D3A900]">Recuperação</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#003A70]">Confira seu e-mail</h2>
        <p className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm leading-6 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200" role="status">
          {SUCCESS_MESSAGE}
        </p>
        <p className="mt-5 text-sm leading-6 text-slate-500">
          Por segurança, mostramos a mesma confirmação mesmo quando não encontramos uma conta cadastrada.
        </p>
        <Link href="/login" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#004B87] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#003366] motion-reduce:transition-none">
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center p-8 md:p-12">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D3A900]">Recuperação</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-[#003A70]">Esqueceu sua senha?</h2>
      <p className="mt-2 text-slate-500">Informe o e-mail da sua conta para receber um link temporário.</p>

      <div className="mt-8">
        <label htmlFor="recovery-email" className="text-sm font-bold text-[#003A70]">E-mail</label>
        <input
          id="recovery-email"
          className="auth-line-input mt-2"
          placeholder="Seu email"
          type="email"
          name="email"
          autoComplete="email"
          required
        />
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="mt-8 min-h-12 w-full rounded-full bg-[#004B87] px-5 py-4 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#003366] hover:shadow-lg disabled:transform-none disabled:opacity-60 motion-reduce:transform-none motion-reduce:transition-none"
      >
        {loading ? "Enviando instruções..." : "Enviar link de recuperação"}
      </button>

      <p className="mt-8 text-center text-sm text-slate-500">
        Lembrou sua senha?{" "}
        <Link href="/login" className="font-bold text-[#004B87] transition-colors hover:text-[#D3A900] motion-reduce:transition-none">
          Voltar para entrar
        </Link>
      </p>
    </form>
  );
}
