import { api } from "@/lib/api";
import { TIPO_CONTEUDO_LABELS, TIPO_MATERIAL_APOIO_LABELS } from "@/types/conteudo";
import type {
  AdminConteudo,
  AdminConteudoPage,
  AdminMaterialApoio,
  CategoriaConteudo,
  OrigemConteudo,
  TipoConteudo,
  TipoMaterialApoio
} from "@/types/conteudo";

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
};

type BackendRecord = Record<string, unknown>;

export const TIPO_CONTEUDO_OPTIONS: Array<{ value: number; tipo: TipoConteudo; label: string }> = [
  { value: 1, tipo: "video", label: TIPO_CONTEUDO_LABELS.video },
  { value: 2, tipo: "audio", label: TIPO_CONTEUDO_LABELS.audio },
  { value: 3, tipo: "documento", label: TIPO_CONTEUDO_LABELS.documento },
  { value: 4, tipo: "link", label: TIPO_CONTEUDO_LABELS.link },
  { value: 5, tipo: "texto", label: TIPO_CONTEUDO_LABELS.texto }
];

export const ORIGEM_CONTEUDO_OPTIONS: Array<{ value: number; origem: OrigemConteudo; label: string }> = [
  { value: 1, origem: "youtube", label: "YouTube" },
  { value: 2, origem: "google_drive", label: "Google Drive" },
  { value: 3, origem: "externo", label: "Link externo" },
  { value: 4, origem: "interno", label: "Interno" }
];

export const TIPO_MATERIAL_APOIO_OPTIONS: Array<{ value: number; tipo: TipoMaterialApoio; label: string }> = [
  { value: 1, tipo: "pdf", label: TIPO_MATERIAL_APOIO_LABELS.pdf },
  { value: 2, tipo: "slide", label: TIPO_MATERIAL_APOIO_LABELS.slide },
  { value: 3, tipo: "imagem", label: TIPO_MATERIAL_APOIO_LABELS.imagem },
  { value: 4, tipo: "documento", label: TIPO_MATERIAL_APOIO_LABELS.documento },
  { value: 5, tipo: "link", label: TIPO_MATERIAL_APOIO_LABELS.link },
  { value: 6, tipo: "outro", label: TIPO_MATERIAL_APOIO_LABELS.outro }
];

export type AdminConteudoListParams = {
  busca?: string;
  categoriaSlug?: string;
  tipo?: number | "";
  publicado?: boolean | "";
  pagina?: number;
  tamanhoPagina?: number;
};

export type AdminMaterialApoioPayload = {
  titulo: string;
  descricao?: string;
  tipo: number;
  url: string;
};

export type AdminConteudoPayload = {
  titulo: string;
  descricao?: string;
  resumo?: string;
  tipo: number;
  origem: number;
  url: string;
  urlThumbnail?: string;
  duracaoMinutos?: number;
  categoriaConteudoId?: string | null;
  publicado?: boolean;
  destaque?: boolean;
  ordem?: number;
  materiaisApoio?: AdminMaterialApoioPayload[];
};

const tipoByNumber = new Map(TIPO_CONTEUDO_OPTIONS.map((option) => [option.value, option]));
const tipoByName = new Map(TIPO_CONTEUDO_OPTIONS.map((option) => [option.tipo, option]));
const origemByNumber = new Map(ORIGEM_CONTEUDO_OPTIONS.map((option) => [option.value, option]));
const origemByName = new Map(ORIGEM_CONTEUDO_OPTIONS.map((option) => [option.origem, option]));
const materialByNumber = new Map(TIPO_MATERIAL_APOIO_OPTIONS.map((option) => [option.value, option]));
const materialByName = new Map(TIPO_MATERIAL_APOIO_OPTIONS.map((option) => [option.tipo, option]));

function asRecord(value: unknown): BackendRecord {
  return value && typeof value === "object" ? (value as BackendRecord) : {};
}

function unwrap<T>(response: ApiEnvelope<T> | T): T {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data as T;
  }

  return response as T;
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

function readNumber(source: BackendRecord, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }

  return fallback;
}

function readBoolean(source: BackendRecord, keys: string[], fallback = false) {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "boolean") {
      return value;
    }
  }

  return fallback;
}

function readArray(source: BackendRecord, keys: string[]) {
  for (const key of keys) {
    const value = source[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function normalizeCategoria(value: unknown, fallbackId = ""): CategoriaConteudo {
  const source = asRecord(value);
  const nome = typeof value === "string" && value.trim() ? value : readString(source, ["nome", "Nome"], "Categoria");
  const slug = readString(source, ["slug", "Slug"], undefined);

  return {
    id: readString(source, ["id", "Id"], fallbackId || slug || nome),
    slug,
    nome,
    descricao: readString(source, ["descricao", "Descricao"], undefined)
  };
}

function normalizeOptionalCategoria(value: unknown, fallbackId = ""): CategoriaConteudo | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "string" && !value.trim()) {
    return null;
  }

  return normalizeCategoria(value, fallbackId);
}

function normalizeTipo(value: unknown) {
  const option =
    typeof value === "number"
      ? tipoByNumber.get(value)
      : typeof value === "string"
        ? tipoByName.get(value.trim().toLowerCase() as TipoConteudo)
        : undefined;

  return option ?? tipoByNumber.get(1)!;
}

function normalizeOrigem(value: unknown) {
  const option =
    typeof value === "number"
      ? origemByNumber.get(value)
      : typeof value === "string"
        ? origemByName.get(value.trim().toLowerCase() as OrigemConteudo)
        : undefined;

  return option ?? origemByNumber.get(3)!;
}

function normalizeMaterialTipo(value: unknown) {
  const option =
    typeof value === "number"
      ? materialByNumber.get(value)
      : typeof value === "string"
        ? materialByName.get(value.trim().toLowerCase() as TipoMaterialApoio)
        : undefined;

  return option ?? materialByNumber.get(6)!;
}

function normalizeMaterial(value: unknown, index: number): AdminMaterialApoio {
  const source = asRecord(value);
  const tipo = normalizeMaterialTipo(source.tipo ?? source.Tipo);

  return {
    id: readString(source, ["id", "Id"], `material-${index}`),
    titulo: readString(source, ["titulo", "Titulo"], `Material ${index + 1}`),
    descricao: readString(source, ["descricao", "Descricao"], undefined),
    tipo: tipo.tipo,
    url: readString(source, ["url", "Url"]),
    ordem: readNumber(source, ["ordem", "Ordem"], index + 1),
    ativo: readBoolean(source, ["ativo", "Ativo"], true)
  };
}

function normalizeConteudo(value: unknown): AdminConteudo {
  const source = asRecord(value);
  const categoriaConteudoId = readString(source, ["categoriaConteudoId", "CategoriaConteudoId", "categoriaId", "CategoriaId"]);
  const categoriaValue = source.categoria ?? source.Categoria;
  const tipo = normalizeTipo(source.tipo ?? source.Tipo);
  const origem = normalizeOrigem(source.origem ?? source.Origem);
  const duracaoMinutos = readNumber(source, ["duracaoMinutos", "DuracaoMinutos"], 0);
  const resumo = readString(source, ["resumo", "Resumo"], undefined);

  return {
    id: readString(source, ["id", "Id"]),
    slug: readString(source, ["slug", "Slug"]),
    titulo: readString(source, ["titulo", "Titulo"], "Formação"),
    descricao: readString(source, ["descricao", "Descricao"], ""),
    resumo,
    categoriaConteudoId,
    categoria:
      categoriaValue && typeof categoriaValue === "object"
        ? normalizeOptionalCategoria(categoriaValue, categoriaConteudoId)
        : normalizeOptionalCategoria(readString(source, ["categoria", "Categoria"], ""), categoriaConteudoId),
    tipo: tipo.tipo,
    tipoLabel: tipo.label,
    origem: origem.origem,
    origemLabel: origem.label,
    url: readString(source, ["url", "Url"], undefined),
    urlThumbnail: readString(source, ["urlThumbnail", "UrlThumbnail"], undefined),
    duracaoMinutos: duracaoMinutos || undefined,
    duracao: duracaoMinutos ? `${duracaoMinutos} min` : readString(source, ["duracao", "Duracao"], undefined),
    publicado: readBoolean(source, ["publicado", "Publicado"], false),
    destaque: readBoolean(source, ["destaque", "Destaque"], false),
    ordem: readNumber(source, ["ordem", "Ordem"], 0),
    materiais: readArray(source, ["materiaisApoio", "MateriaisApoio", "materiais", "Materiais"]).map(normalizeMaterial)
  };
}

function buildQuery(params: AdminConteudoListParams) {
  const query = new URLSearchParams();

  query.set("pagina", String(params.pagina ?? 1));
  query.set("tamanhoPagina", String(params.tamanhoPagina ?? 20));

  if (params.busca?.trim()) {
    query.set("busca", params.busca.trim());
  }

  if (params.categoriaSlug?.trim()) {
    query.set("categoriaSlug", params.categoriaSlug.trim());
  }

  if (params.tipo) {
    query.set("tipo", String(params.tipo));
  }

  if (typeof params.publicado === "boolean") {
    query.set("publicado", String(params.publicado));
  }

  return query.toString();
}

export function getTipoConteudoNumber(tipo: TipoConteudo) {
  return tipoByName.get(tipo)?.value ?? 1;
}

export function getOrigemConteudoNumber(origem: OrigemConteudo) {
  return origemByName.get(origem)?.value ?? 3;
}

export function getTipoMaterialApoioNumber(tipo: TipoMaterialApoio) {
  return materialByName.get(tipo)?.value ?? 6;
}

export async function listAdminConteudos(params: AdminConteudoListParams = {}): Promise<AdminConteudoPage> {
  const response = await api.get<ApiEnvelope<unknown> | unknown>(`/api/admin/conteudos?${buildQuery(params)}`);
  const data = unwrap(response);
  const source = asRecord(data);
  const itens = Array.isArray(data) ? data : readArray(source, ["itens", "Itens"]);

  return {
    itens: itens.map(normalizeConteudo),
    pagina: readNumber(source, ["pagina", "Pagina"], params.pagina ?? 1),
    tamanhoPagina: readNumber(source, ["tamanhoPagina", "TamanhoPagina"], params.tamanhoPagina ?? 20),
    totalItens: readNumber(source, ["totalItens", "TotalItens"], itens.length),
    totalPaginas: readNumber(source, ["totalPaginas", "TotalPaginas"], 1)
  };
}

export async function getAdminConteudo(id: string) {
  const response = await api.get<ApiEnvelope<unknown> | unknown>(`/api/admin/conteudos/${encodeURIComponent(id)}`);
  return normalizeConteudo(unwrap(response));
}

export async function createAdminConteudo(payload: AdminConteudoPayload) {
  const response = await api.post<ApiEnvelope<unknown> | unknown, AdminConteudoPayload>("/api/admin/conteudos", payload);
  return normalizeConteudo(unwrap(response));
}

export async function updateAdminConteudo(id: string, payload: AdminConteudoPayload) {
  const response = await api.put<ApiEnvelope<unknown> | unknown, AdminConteudoPayload>(`/api/admin/conteudos/${encodeURIComponent(id)}`, payload);
  return normalizeConteudo(unwrap(response));
}

export async function updateAdminConteudoPublicacao(id: string, publicado: boolean) {
  await api.patch<void, { publicado: boolean }>(`/api/admin/conteudos/${encodeURIComponent(id)}/publicacao`, { publicado });
}

export async function deleteAdminConteudo(id: string) {
  await api.delete<void>(`/api/admin/conteudos/${encodeURIComponent(id)}`);
}
