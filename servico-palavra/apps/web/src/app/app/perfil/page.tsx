"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

function getProfileErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 409) {
    return "Este email já está em uso por outra conta.";
  }

  if (error instanceof Error && error.message) {
    const normalized = error.message
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    if (normalized.includes("email") && (normalized.includes("uso") || normalized.includes("existe") || normalized.includes("duplic"))) {
      return "Este email já está em uso por outra conta.";
    }

    return error.message;
  }

  return "Não foi possível atualizar seu perfil. Verifique os dados e tente novamente.";
}

export default function PerfilPage() {
  const { usuario, loading, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!usuario || editing) {
      return;
    }

    setNome(usuario.nome);
    setEmail(usuario.email);
  }, [editing, usuario]);

  function startEditing() {
    setNome(usuario?.nome ?? "");
    setEmail(usuario?.email ?? "");
    setMessage("");
    setError("");
    setEditing(true);
  }

  function cancelEditing() {
    setNome(usuario?.nome ?? "");
    setEmail(usuario?.email ?? "");
    setMessage("");
    setError("");
    setEditing(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    const normalizedNome = nome.trim();
    const normalizedEmail = email.trim();

    if (!normalizedNome) {
      setError("Informe seu nome.");
      return;
    }

    if (!normalizedEmail) {
      setError("Informe seu email.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError("Informe um email válido.");
      return;
    }

    setSaving(true);

    try {
      await updateProfile({
        nome: normalizedNome,
        email: normalizedEmail
      });
      setEditing(false);
      setMessage("Perfil atualizado com sucesso.");
    } catch (currentError) {
      setError(getProfileErrorMessage(currentError));
    } finally {
      setSaving(false);
    }
  }

  const roles = usuario?.roles?.length ? usuario.roles.join(", ") : "Usuário";
  const accessLabel = usuario?.perfil === "admin" ? "Admin" : "Usuário";

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      <section className="page-stage page-stage-profile">
        <div className="profile-monogram" aria-hidden="true">{usuario?.nome?.charAt(0) ?? "S"}</div>
        <div className="relative z-10">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Perfil</p>
        <h1 className="mt-3 text-5xl font-black tracking-[-.05em] text-[#004B87] md:text-7xl">Perfil</h1>
        <p className="mt-2 text-gray-500">Confira e atualize seus dados básicos de acesso.</p>
        </div>
      </section>

      <Card className="profile-card p-6 md:p-10">
        {loading && <p className="font-semibold text-[#004B87]">Carregando perfil...</p>}

        {!loading && !usuario && <p className="text-gray-500">Não foi possível carregar os dados do perfil. Entre novamente para continuar.</p>}

        {usuario && (
          <div className="grid gap-6">
            {message && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{message}</p>}
            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

            {editing ? (
              <form className="grid gap-6" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-gray-600 dark:text-slate-300">
                    Nome
                    <input
                      value={nome}
                      onChange={(event) => setNome(event.target.value)}
                      disabled={saving}
                      autoComplete="name"
                      className="rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-gray-900 outline-none transition-all disabled:text-gray-500 focus:border-[#004B87] focus:ring-4 focus:ring-[#004B87]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-bold text-gray-600 dark:text-slate-300">
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={saving}
                      autoComplete="email"
                      className="rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-gray-900 outline-none transition-all disabled:text-gray-500 focus:border-[#004B87] focus:ring-4 focus:ring-[#004B87]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar alterações"}
                  </Button>
                  <Button type="button" variant="secondary" disabled={saving} onClick={cancelEditing}>
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Nome</p>
                    <p className="mt-2 font-bold text-[#004B87] dark:text-white">{usuario.nome}</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Email</p>
                    <p className="mt-2 break-all font-bold text-[#004B87] dark:text-white">{usuario.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="button" onClick={startEditing}>
                    Editar perfil
                  </Button>
                </div>
              </>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Tipo de acesso</p>
                <p className="mt-2 font-bold text-[#004B87] dark:text-white">{accessLabel}</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Roles</p>
                <p className="mt-2 font-bold text-[#004B87] dark:text-white">{roles}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
