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
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await updateProfile({
        nome: nome.trim(),
        email: email.trim()
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
      <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Perfil</p>
        <h1 className="mt-3 text-3xl font-black text-[#004B87]">Perfil</h1>
        <p className="mt-2 text-gray-500">Confira e atualize seus dados básicos de acesso.</p>
      </section>

      <Card>
        {loading && <p className="font-semibold text-[#004B87]">Carregando perfil...</p>}

        {!loading && !usuario && <p className="text-gray-500">Não foi possível carregar os dados do perfil. Entre novamente para continuar.</p>}

        {usuario && (
          <form className="grid gap-6" onSubmit={handleSubmit}>
            {message && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{message}</p>}
            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-gray-600">
                Nome
                <input
                  value={editing ? nome : usuario.nome}
                  onChange={(event) => setNome(event.target.value)}
                  disabled={!editing || saving}
                  required
                  className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all disabled:text-gray-500 focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-gray-600">
                Email
                <input
                  type="email"
                  value={editing ? email : usuario.email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={!editing || saving}
                  required
                  className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all disabled:text-gray-500 focus:border-[#004B87] focus:bg-white focus:ring-4 focus:ring-[#004B87]/10"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Tipo de acesso</p>
                <p className="mt-2 font-bold text-[#004B87]">{accessLabel}</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Roles</p>
                <p className="mt-2 font-bold text-[#004B87]">{roles}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {editing ? (
                <>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button type="button" variant="secondary" disabled={saving} onClick={cancelEditing}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={startEditing}>
                  Editar perfil
                </Button>
              )}
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
