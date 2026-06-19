import { api } from "@/lib/api";
import { normalizeCategoriaConteudo } from "@/services/categoryService";
import type { CategoriaConteudo } from "@/types/categoria";

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
};

export type AdminCategoriaPayload = {
  nome: string;
  descricao?: string;
  cor?: string;
  icone?: string;
  ordem?: number;
  ativo?: boolean;
};

function unwrap<T>(response: ApiEnvelope<T> | T): T {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data as T;
  }

  return response as T;
}

function sortCategorias(categorias: CategoriaConteudo[]) {
  return [...categorias].sort((a, b) => {
    const ordemDiff = (a.ordem ?? 0) - (b.ordem ?? 0);
    return ordemDiff || a.nome.localeCompare(b.nome, "pt-BR");
  });
}

export async function listAdminCategorias(): Promise<CategoriaConteudo[]> {
  const response = await api.get<ApiEnvelope<unknown[]> | unknown[]>("/api/admin/categorias");
  const categorias = unwrap(response);

  if (!Array.isArray(categorias)) {
    return [];
  }

  return sortCategorias(categorias.map(normalizeCategoriaConteudo));
}

export async function getAdminCategoria(id: string): Promise<CategoriaConteudo> {
  const response = await api.get<ApiEnvelope<unknown> | unknown>(`/api/admin/categorias/${encodeURIComponent(id)}`);
  return normalizeCategoriaConteudo(unwrap(response));
}

export async function createAdminCategoria(payload: AdminCategoriaPayload): Promise<CategoriaConteudo> {
  const response = await api.post<ApiEnvelope<unknown> | unknown, AdminCategoriaPayload>("/api/admin/categorias", payload);
  return normalizeCategoriaConteudo(unwrap(response));
}

export async function updateAdminCategoria(id: string, payload: AdminCategoriaPayload): Promise<CategoriaConteudo> {
  const response = await api.put<ApiEnvelope<unknown> | unknown, AdminCategoriaPayload>(`/api/admin/categorias/${encodeURIComponent(id)}`, payload);
  return normalizeCategoriaConteudo(unwrap(response));
}

export async function updateAdminCategoriaStatus(id: string, ativo: boolean): Promise<void> {
  await api.patch<void, { ativo: boolean }>(`/api/admin/categorias/${encodeURIComponent(id)}/status`, { ativo });
}

export async function deleteAdminCategoria(id: string): Promise<void> {
  await api.delete<void>(`/api/admin/categorias/${encodeURIComponent(id)}`);
}

