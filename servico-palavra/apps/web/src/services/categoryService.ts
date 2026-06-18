import { api } from "@/lib/api";
import type { CategoriaConteudo } from "@/types/conteudo";

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
};

type BackendRecord = Record<string, unknown>;

function asRecord(value: unknown): BackendRecord {
  return value && typeof value === "object" ? (value as BackendRecord) : {};
}

function readString(source: BackendRecord, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return fallback;
}

function readNumber(source: BackendRecord, keys: string[]) {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }

  return undefined;
}

function unwrap<T>(response: ApiEnvelope<T> | T): T {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data as T;
  }

  return response as T;
}

function normalizeCategoria(value: unknown): CategoriaConteudo {
  const source = asRecord(value);
  const nome = readString(source, ["nome", "Nome"], "Categoria");
  const slug = readString(source, ["slug", "Slug"], undefined);

  return {
    id: readString(source, ["id", "Id"], slug || nome),
    nome,
    slug,
    descricao: readString(source, ["descricao", "Descricao"], undefined),
    cor: readString(source, ["cor", "Cor"], undefined),
    icone: readString(source, ["icone", "Icone"], undefined),
    ordem: readNumber(source, ["ordem", "Ordem"])
  };
}

export async function listCategoriasConteudo(): Promise<CategoriaConteudo[]> {
  const response = await api.get<ApiEnvelope<unknown[]> | unknown[]>("/api/categorias");
  const categorias = unwrap(response);

  if (!Array.isArray(categorias)) {
    return [];
  }

  return categorias.map(normalizeCategoria).sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
}
