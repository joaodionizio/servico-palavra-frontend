"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { resetPassword } from "@/lib/auth";
import { isStrongEnoughPassword, PASSWORD_REQUIREMENTS } from "@/lib/passwordPolicy";

const INVALID_RESET_ERROR = "Link de recuperacao invalido ou expirado.";

function getResetErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "Não foi possível redefinir sua senha agora.";
  }

  if (error.message === INVALID_RESET_ERROR) {
    return "Este link de recuperação é inválido ou expirou. Solicite um novo link.";
  }

  if (error.message === "A nova senha nao atende aos requisitos de seguranca.") {
    return PASSWORD_REQUIREMENTS;
  }

  return error.message;
}

export function ResetPasswordForm() {
  const params = useSearchParams();
  const userId = params.get("userId")?.trim() ?? "";
  const token = params.get("token")?.trim() ?? "";
  const invalidLink = !userId || !token;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invalidResetLink, setInvalidResetLink] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setInvalidResetLink(false);

    const form = new FormData(event.currentTarget);
    const novaSenha = String(form.get("novaSenha") ?? "");
    const confirmarSenha = String(form.get("confirmarSenha") ?? "");

    if (novaSenha !== confirmarSenha) {
      setError("As senhas não conferem.");
      setLoading(false);
      return;
    }

    if (!isStrongEnoughPassword(novaSenha)) {
      setError(PASSWORD_REQUIREMENTS);
      setLoading(false);
      return;
    }

    try {
      await resetPassword({ userId, token, novaSenha });
      setSuccess(true);
    } catch (err) {
      setInvalidResetLink(err instanceof Error && err.message === INVALID_RESET_ERROR);
      setError(getResetErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (invalidLink) {
    return (
      <div className="flex flex-col justify-center p-8 md:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D3A900]">Recuperação</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#003A70]">Link inválido</h2>
        <p className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200" role="alert">
          Este link não contém todas as informações necessárias. Solicite uma nova recuperação de senha.
        </p>
        <Link href="/esqueci-senha" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#004B87] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#003366] motion-reduce:transition-none">
          Solicitar novo link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col justify-center p-8 md:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D3A900]">Recuperação</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#003A70]">Senha redefinida</h2>
        <p className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm leading-6 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200" role="status">
          Sua senha foi alterada com sucesso. Você já pode entrar usando a nova senha.
        </p>
        <Link href="/login" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#004B87] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#003366] motion-reduce:transition-none">
          Entrar com a nova senha
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center p-8 md:p-12">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D3A900]">Recuperação</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-[#003A70]">Crie uma nova senha</h2>
      <p className="mt-2 text-slate-500">Escolha uma senha forte para voltar a acessar sua conta.</p>

      <div className="mt-8 space-y-5">
        <div>
          <label htmlFor="new-password" className="text-sm font-bold text-[#003A70]">Nova senha</label>
          <input
            id="new-password"
            className="auth-line-input mt-2"
            type="password"
            name="novaSenha"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="text-sm font-bold text-[#003A70]">Confirme a nova senha</label>
          <input
            id="confirm-password"
            className="auth-line-input mt-2"
            type="password"
            name="confirmarSenha"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-500">{PASSWORD_REQUIREMENTS}</p>

      {error && (
        <div className="mt-5 space-y-3">
          <p className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200" role="alert">
            {error}
          </p>
          {invalidResetLink && (
            <Link href="/esqueci-senha" className="inline-flex min-h-11 items-center text-sm font-bold text-[#004B87] underline decoration-[#FFCC00] decoration-2 underline-offset-4 motion-reduce:transition-none">
              Solicitar novo link
            </Link>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="mt-8 min-h-12 w-full rounded-full bg-[#004B87] px-5 py-4 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#003366] hover:shadow-lg disabled:transform-none disabled:opacity-60 motion-reduce:transform-none motion-reduce:transition-none"
      >
        {loading ? "Redefinindo senha..." : "Redefinir senha"}
      </button>

      <Link href="/login" className="mt-6 text-center text-sm font-bold text-[#004B87] transition-colors hover:text-[#D3A900] motion-reduce:transition-none">
        Voltar para o login
      </Link>
    </form>
  );
}
