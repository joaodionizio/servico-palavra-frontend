"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

function isStrongEnoughPassword(senha: string) {
  return senha.length >= 6 && senha.length <= 8 && /[a-z]/.test(senha) && /[A-Z]/.test(senha) && /\d/.test(senha);
}

function getRegisterErrorMessage(err: unknown) {
  const fallback = "Não foi possível criar sua conta. Verifique os dados e tente novamente.";

  if (!(err instanceof Error)) {
    return fallback;
  }

  if (err.message === "Nao foi possivel concluir o cadastro.") {
    return "Não foi possível concluir o cadastro. Verifique se o e-mail já não está cadastrado e use uma senha de 6 a 8 caracteres, com letra maiúscula, letra minúscula e número.";
  }

  return err.message;
}

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
    const nome = String(form.get("nome") ?? "").trim();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const senha = String(form.get("senha"));
    const confirmarSenha = String(form.get("confirmarSenha"));

    if (!nome || !email) {
      setError("Informe nome e email para criar sua conta.");
      setLoading(false);
      return;
    }

    if (senha !== confirmarSenha) {
      setError("As senhas não conferem.");
      setLoading(false);
      return;
    }

    if (!isStrongEnoughPassword(senha)) {
      setError("Use uma senha de 6 a 8 caracteres, com letra maiúscula, letra minúscula e número.");
      setLoading(false);
      return;
    }

    try {
      await signUp({
        nome,
        email,
        senha
      });
      router.push("/app");
    } catch (err) {
      setError(getRegisterErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D3A900]">Nova conta</p>

      <h2 className="mt-3 text-4xl font-black tracking-tight text-[#003A70]">Criar cadastro</h2>

      <p className="mt-2 text-gray-500">Informe seus dados para salvar seu progresso.</p>

      <div className="mt-8 space-y-4">
        <input
          className="auth-line-input"
          placeholder="Seu nome"
          name="nome"
          autoComplete="name"
          required
        />
        <input
          className="auth-line-input"
          placeholder="Seu email"
          type="email"
          name="email"
          autoComplete="email"
          required
        />
        <input
          className="auth-line-input"
          placeholder="Crie uma senha"
          type="password"
          name="senha"
          autoComplete="new-password"
          minLength={6}
          maxLength={8}
          required
        />
        <input
          className="auth-line-input"
          placeholder="Confirme sua senha"
          type="password"
          name="confirmarSenha"
          autoComplete="new-password"
          minLength={6}
          maxLength={8}
          required
        />
      </div>

      {error && <p className="mt-5 animate-fade-in rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">{error}</p>}

      <button
        disabled={loading}
        className="mt-8 w-full rounded-full bg-[#004B87] px-5 py-4 font-bold text-white transition-all hover:-translate-y-1 hover:bg-[#003366] hover:shadow-xl disabled:transform-none disabled:opacity-60"
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
