import { api } from "@/lib/api";
import type { CategoriaConteudo, Conteudo, TipoConteudo } from "@/types/conteudo";
import type { ConteudoComProgresso, DashboardEstatisticas, DashboardMe } from "@/types/dashboard";
import type { DiaPlanoBiblico, DuracaoPlano, PlanoBiblico } from "@/types/planoBiblico";

type ApiEnvelope<T> = {
  data?: T;
  success?: boolean;
  message?: string | null;
  errors?: string[] | Record<string, string[]> | null;
};

type BackendRecord = Record<string, unknown>;

const conteudoTipos: TipoConteudo[] = ["video", "audio", "documento", "link", "texto"];

function unwrap<T>(response: ApiEnvelope<T> | T) {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data as T;
  }

  return response as T;
}

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

function normalizeTipo(value: string): TipoConteudo {
  const normalized = value.toLowerCase();
  return conteudoTipos.includes(normalized as TipoConteudo) ? (normalized as TipoConteudo) : "video";
}

function normalizeCategoria(value: unknown): CategoriaConteudo {
  const source = asRecord(value);
  const id = readString(source, ["id", "Id", "slug", "Slug"], "formacao");
  const nome = readString(source, ["nome", "Nome", "titulo", "Titulo"], "Formação");

  return {
    id,
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

function normalizeConteudo(value: unknown): ConteudoComProgresso {
  const source = asRecord(value);
  const categoriaValue = source.categoria ?? source.Categoria;
  const categoria =
    categoriaValue && typeof categoriaValue === "object"
      ? normalizeOptionalCategoria(categoriaValue)
      : normalizeOptionalCategoria(
          readString(source, ["categoriaNome", "CategoriaNome", "categoria", "Categoria"])
            ? {
                id: readString(source, ["categoriaId", "CategoriaId"]),
                nome: readString(source, ["categoriaNome", "CategoriaNome", "categoria", "Categoria"])
              }
            : null
        );

  const titulo = readString(source, ["titulo", "Titulo", "nome", "Nome"], "Formação");
  const id = readString(source, ["id", "Id", "conteudoId", "ConteudoId"], titulo);

  return {
    id,
    slug: readString(source, ["slug", "Slug"], id),
    titulo,
    descricao: readString(source, ["descricao", "Descricao", "resumo", "Resumo"], "Conteúdo de formação disponível."),
    categoria,
    tipo: normalizeTipo(readString(source, ["tipo", "Tipo"], "video")),
    duracao: readString(source, ["duracao", "Duracao", "tempoEstimado", "TempoEstimado"], undefined),
    url: readString(source, ["url", "Url"], undefined),
    publicado: readBoolean(source, ["publicado", "Publicado"], true),
    favorito: readBoolean(source, ["favorito", "Favorito"], false),
    concluido: readBoolean(source, ["concluido", "Concluido"], false),
    progresso: readNumber(source, ["progresso", "Progresso", "percentual", "Percentual", "percentualProgresso", "PercentualProgresso"], 0),
    ultimoAcessoEm: readString(source, ["ultimoAcessoEm", "UltimoAcessoEm", "atualizadoEm", "AtualizadoEm"], undefined)
  };
}

function normalizeStatus(source: BackendRecord): DiaPlanoBiblico["status"] {
  const status = readString(source, ["status", "Status"]).toLowerCase();
  const concluido = readBoolean(source, ["concluido", "Concluido", "estaConcluido", "EstaConcluido"]);

  return concluido || status === "concluido" || status === "concluído" ? "concluido" : "pendente";
}

function normalizeDia(value: unknown): DiaPlanoBiblico | null {
  if (!value) {
    return null;
  }

  const source = asRecord(value);
  const dia = readNumber(source, ["diaNumero", "DiaNumero", "dia", "Dia", "numeroDia", "NumeroDia", "ordem", "Ordem"], 0);
  const leitura = readString(source, ["leiturasTexto", "LeiturasTexto", "leitura", "Leitura", "referencia", "Referencia", "descricao", "Descricao"], "");

  if (dia === 0 && !leitura) {
    return null;
  }

  return {
    id: readString(source, ["id", "Id", "planoDiaId", "PlanoDiaId", "diaId", "DiaId"], String(dia || "leitura-hoje")),
    actionId: readString(source, ["actionId", "ActionId", "diaId", "DiaId", "planoDiaId", "PlanoDiaId"], undefined),
    dia: dia || 1,
    mes: readNumber(source, ["mesNumero", "MesNumero", "mes", "Mes"], undefined),
    data: readString(source, ["dataPrevista", "DataPrevista", "data", "Data"], undefined),
    dataPrevista: readString(source, ["dataPrevista", "DataPrevista"], undefined),
    leitura: leitura || "Meditação livre",
    salmoNumero: readNumber(source, ["salmoNumero", "SalmoNumero"], 0) || null,
    status: normalizeStatus(source)
  };
}

function normalizeDuracaoPlano(totalMeses: number, totalDias: number): DuracaoPlano {
  if (totalMeses === 6 || totalDias === 180) {
    return "6_meses";
  }

  if (totalMeses === 24 || totalDias === 730) {
    return "2_anos";
  }

  if (totalMeses === 12 || totalDias === 365) {
    return "1_ano";
  }

  return "personalizado";
}

function normalizePlano(value: unknown, leituraHoje: DiaPlanoBiblico | null): PlanoBiblico | null {
  if (!value) {
    return null;
  }

  const source = asRecord(value);
  const id = readString(source, ["id", "Id", "planoId", "PlanoId"]);

  if (!id) {
    return null;
  }

  const duracaoAnos = readNumber(source, ["duracaoAnos", "DuracaoAnos"], 0);
  const duracaoMeses = readNumber(source, ["duracaoMeses", "DuracaoMeses", "meses", "Meses"], 0);
  const totalMeses = duracaoAnos * 12 + duracaoMeses;
  const totalDias = readNumber(source, ["duracaoDias", "DuracaoDias", "totalDias", "TotalDias", "diasTotais", "DiasTotais"], totalMeses * 30);
  const diasConcluidos = readNumber(source, ["diasConcluidos", "DiasConcluidos", "leiturasConcluidas", "LeiturasConcluidas"], 0);
  const progresso = readNumber(
    source,
    ["progresso", "Progresso", "percentual", "Percentual", "percentualProgresso", "PercentualProgresso"],
    totalDias > 0 ? (diasConcluidos / totalDias) * 100 : 0
  );
  const leituraHojeFromPlan = normalizeDia(source.leituraHoje ?? source.LeituraHoje);

  return {
    id,
    nome: readString(source, ["nome", "Nome"], "Plano bíblico"),
    ativo: readBoolean(source, ["ativo", "Ativo"], true),
    duracao: normalizeDuracaoPlano(totalMeses, totalDias),
    duracaoAnos,
    duracaoMeses,
    totalDias,
    diasConcluidos,
    progresso: Math.max(0, Math.min(100, progresso)),
    sequencia: readNumber(source, ["sequencia", "Sequencia", "sequenciaDias", "SequenciaDias"], diasConcluidos),
    dataInicio: readString(source, ["dataInicio", "DataInicio"], undefined),
    dataFimPrevista: readString(source, ["dataFimPrevista", "DataFimPrevista"], undefined),
    status: readString(source, ["status", "Status"], undefined),
    leituraHoje: leituraHojeFromPlan ?? leituraHoje ?? undefined
  };
}

function normalizeEstatisticas(value: unknown, dashboard: Pick<DashboardMe, "favoritos" | "conteudosConcluidos" | "planoBiblicoAtivo">): DashboardEstatisticas {
  const source = asRecord(value);

  return {
    totalFavoritos: readNumber(source, ["totalFavoritos", "TotalFavoritos"], dashboard.favoritos),
    totalConteudosConcluidos: readNumber(source, ["totalConteudosConcluidos", "TotalConteudosConcluidos"], dashboard.conteudosConcluidos),
    percentualPlanoBiblico: readNumber(source, ["percentualPlanoBiblico", "PercentualPlanoBiblico"], dashboard.planoBiblicoAtivo?.progresso ?? 0)
  };
}

function normalizeDashboard(value: unknown): DashboardMe {
  const source = asRecord(value);
  const leituraHoje = normalizeDia(source.leituraHoje ?? source.LeituraHoje);
  const dashboard = {
    conteudosConcluidos: readNumber(source, ["conteudosConcluidos", "ConteudosConcluidos"], 0),
    favoritos: readNumber(source, ["favoritos", "Favoritos"], 0),
    possuiPlanoBiblicoAtivo: readBoolean(source, ["possuiPlanoBiblicoAtivo", "PossuiPlanoBiblicoAtivo"], false),
    formacoesRecentes: readArray(source, ["formacoesRecentes", "FormacoesRecentes"]).map(normalizeConteudo),
    favoritosRecentes: readArray(source, ["favoritosRecentes", "FavoritosRecentes"]).map((conteudo) => ({ ...normalizeConteudo(conteudo), favorito: true })),
    conteudosComProgresso: readArray(source, ["conteudosComProgresso", "ConteudosComProgresso"]).map(normalizeConteudo),
    planoBiblicoAtivo: normalizePlano(source.planoBiblicoAtivo ?? source.PlanoBiblicoAtivo, leituraHoje),
    leituraHoje
  };

  return {
    ...dashboard,
    estatisticas: normalizeEstatisticas(source.estatisticas ?? source.Estatisticas, dashboard)
  };
}

export async function getDashboardMe() {
  const response = await api.get<ApiEnvelope<unknown>>("/api/dashboard/me");
  return normalizeDashboard(unwrap(response));
}
