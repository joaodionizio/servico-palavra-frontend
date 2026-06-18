import { api } from "@/lib/api";
import { TIPO_CONTEUDO_LABELS } from "@/types/conteudo";
import type {
  CategoriaConteudo,
  Conteudo,
  ConteudoListParams,
  ConteudoPage,
  OrigemConteudo,
  TipoConteudo,
  TipoMaterialApoio
} from "@/types/conteudo";

type BackendRecord = Record<string, unknown>;

type BackendConteudoPage = {
  itens?: unknown[];
  pagina?: number;
  tamanhoPagina?: number;
  totalItens?: number;
  totalPaginas?: number;
};

const tipoConteudoMap: Record<number, { tipo: TipoConteudo; label: string }> = {
  1: { tipo: "video", label: TIPO_CONTEUDO_LABELS.video },
  2: { tipo: "audio", label: TIPO_CONTEUDO_LABELS.audio },
  3: { tipo: "documento", label: TIPO_CONTEUDO_LABELS.documento },
  4: { tipo: "link", label: TIPO_CONTEUDO_LABELS.link },
  5: { tipo: "texto", label: TIPO_CONTEUDO_LABELS.texto }
};

const tipoConteudoQueryMap: Record<TipoConteudo, number> = {
  video: 1,
  audio: 2,
  documento: 3,
  link: 4,
  texto: 5
};

const origemConteudoMap: Record<number, { origem: OrigemConteudo; label: string }> = {
  1: { origem: "youtube", label: "YouTube" },
  2: { origem: "google_drive", label: "Google Drive" },
  3: { origem: "externo", label: "Link externo" },
  4: { origem: "interno", label: "Interno" }
};

const tipoMaterialMap: Record<number, TipoMaterialApoio> = {
  1: "pdf",
  2: "slide",
  3: "imagem",
  4: "documento",
  5: "link",
  6: "outro"
};

const tipoConteudoAliases: Record<string, TipoConteudo> = {
  video: "video",
  vídeo: "video",
  audio: "audio",
  áudio: "audio",
  documento: "documento",
  link: "link",
  texto: "texto"
};

const origemConteudoAliases: Record<string, OrigemConteudo> = {
  youtube: "youtube",
  google_drive: "google_drive",
  googledrive: "google_drive",
  "google drive": "google_drive",
  externo: "externo",
  interna: "interno",
  interno: "interno"
};

const tipoMaterialAliases: Record<string, TipoMaterialApoio> = {
  pdf: "pdf",
  slide: "slide",
  imagem: "imagem",
  documento: "documento",
  link: "link",
  outro: "outro"
};

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

function normalizeCategoria(value: unknown): CategoriaConteudo {
  const source = asRecord(value);
  const nome = typeof value === "string" && value.trim() ? value : readString(source, ["nome", "Nome"], "Formação");
  const slug = readString(source, ["slug", "Slug"], undefined);

  return {
    id: readString(source, ["id", "Id"], slug || nome),
    slug,
    nome,
    descricao: readString(source, ["descricao", "Descricao"], undefined)
  };
}

function normalizeOptionalCategoria(value: unknown): CategoriaConteudo | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "string" && !value.trim()) {
    return null;
  }

  return normalizeCategoria(value);
}

function normalizeTipo(value: unknown) {
  if (typeof value === "number") {
    return tipoConteudoMap[value] ?? { tipo: "link" as TipoConteudo, label: `Tipo ${value}` };
  }

  if (typeof value === "string") {
    const tipo = tipoConteudoAliases[value.trim().toLowerCase()];

    if (tipo) {
      return { tipo, label: TIPO_CONTEUDO_LABELS[tipo] };
    }

    return { tipo: "link" as TipoConteudo, label: value };
  }

  return { tipo: "link" as TipoConteudo, label: TIPO_CONTEUDO_LABELS.link };
}

function normalizeOrigem(value: unknown) {
  if (typeof value === "number") {
    return origemConteudoMap[value] ?? { origem: "desconhecida" as OrigemConteudo, label: `Origem ${value}` };
  }

  if (typeof value === "string") {
    const origem = origemConteudoAliases[value.trim().toLowerCase()];

    if (origem) {
      const known = Object.values(origemConteudoMap).find((item) => item.origem === origem);
      return known ?? { origem, label: value };
    }

    return { origem: "externo" as OrigemConteudo, label: value };
  }

  return { origem: "desconhecida" as OrigemConteudo, label: "Origem não informada" };
}

function normalizeTipoMaterial(value: unknown): TipoMaterialApoio {
  if (typeof value === "number") {
    return tipoMaterialMap[value] ?? "outro";
  }

  if (typeof value === "string") {
    return tipoMaterialAliases[value.trim().toLowerCase()] ?? "outro";
  }

  return "outro";
}

function normalizeMaterial(value: unknown, index: number) {
  const source = asRecord(value);
  const tipo = source.tipo ?? source.Tipo;

  return {
    id: readString(source, ["id", "Id"], `material-${index}`),
    titulo: readString(source, ["titulo", "Titulo"], `Material ${index + 1}`),
    tipo: normalizeTipoMaterial(tipo),
    url: readString(source, ["url", "Url"])
  };
}

function normalizeConteudo(value: unknown): Conteudo {
  const source = asRecord(value);
  const tipo = normalizeTipo(source.tipo ?? source.Tipo);
  const origem = normalizeOrigem(source.origem ?? source.Origem);
  const duracaoMinutos = readNumber(source, ["duracaoMinutos", "DuracaoMinutos"], 0);
  const resumo = readString(source, ["resumo", "Resumo"], undefined);
  const descricao = readString(source, ["descricao", "Descricao"], resumo || "Conteúdo de formação disponível.");

  return {
    id: readString(source, ["id", "Id"]),
    titulo: readString(source, ["titulo", "Titulo"], "Formação"),
    slug: readString(source, ["slug", "Slug"]),
    resumo,
    descricao,
    tipo: tipo.tipo,
    tipoLabel: tipo.label,
    origem: origem.origem,
    origemLabel: origem.label,
    url: readString(source, ["url", "Url"], undefined),
    urlThumbnail: readString(source, ["urlThumbnail", "UrlThumbnail", "thumbnail", "Thumbnail"], undefined),
    duracaoMinutos: duracaoMinutos || undefined,
    duracao: duracaoMinutos ? `${duracaoMinutos} min` : readString(source, ["duracao", "Duracao"], undefined),
    categoria: normalizeOptionalCategoria(
      source.categoria && typeof source.categoria === "object"
        ? source.categoria
        : source.Categoria && typeof source.Categoria === "object"
          ? source.Categoria
          : readString(source, ["categoria", "Categoria"])
            ? {
              id: readString(source, ["categoriaConteudoId", "CategoriaConteudoId", "categoriaId", "CategoriaId"]),
              nome: readString(source, ["categoria", "Categoria"])
            }
            : null
    ),
    materiais: readArray(source, ["materiaisApoio", "MateriaisApoio", "materiais", "Materiais"])
      .map(normalizeMaterial)
      .filter((material) => material.url),
    publicado: readBoolean(source, ["publicado", "Publicado"], true),
    favorito: readBoolean(source, ["favorito", "Favorito"], false),
    concluido: readBoolean(source, ["concluido", "Concluido"], false)
  };
}

function buildQuery(params: ConteudoListParams) {
  const query = new URLSearchParams();

  query.set("pagina", String(params.pagina ?? 1));
  query.set("tamanhoPagina", String(params.tamanhoPagina ?? 12));

  if (params.busca?.trim()) {
    query.set("busca", params.busca.trim());
  }

  if (params.categoriaSlug?.trim()) {
    query.set("categoriaSlug", params.categoriaSlug.trim());
  }

  if (params.tipo) {
    query.set("tipo", String(tipoConteudoQueryMap[params.tipo]));
  }

  return query.toString();
}

export async function listConteudos(params: ConteudoListParams = {}): Promise<ConteudoPage> {
  const response = await api.get<BackendConteudoPage>(`/api/conteudos?${buildQuery(params)}`);

  return {
    itens: (response.itens ?? []).map(normalizeConteudo),
    pagina: response.pagina ?? params.pagina ?? 1,
    tamanhoPagina: response.tamanhoPagina ?? params.tamanhoPagina ?? 12,
    totalItens: response.totalItens ?? 0,
    totalPaginas: response.totalPaginas ?? 1
  };
}

export async function getConteudoBySlug(slug: string) {
  const response = await api.get<unknown>(`/api/conteudos/${encodeURIComponent(slug)}`);
  return normalizeConteudo(response);
}

export async function favoritarConteudo(conteudoId: string) {
  await api.post<void>(`/api/favoritos/${conteudoId}`);
}

export async function desfavoritarConteudo(conteudoId: string) {
  await api.delete<void>(`/api/favoritos/${conteudoId}`);
}

export async function concluirConteudo(conteudoId: string) {
  await api.post<void>(`/api/progresso/conteudos/${conteudoId}/concluir`);
}

export async function desmarcarConclusaoConteudo(conteudoId: string) {
  await api.delete<void>(`/api/progresso/conteudos/${conteudoId}/concluir`);
}
