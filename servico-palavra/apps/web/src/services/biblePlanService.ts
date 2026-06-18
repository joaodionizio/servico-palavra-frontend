import { api, ApiError } from "@/lib/api";
import type { AlterarPlanoBiblicoPayload, CriarPlanoBiblicoPayload, DiaPlanoBiblico, DuracaoPlano, PlanoBiblico } from "@/types/planoBiblico";

type ApiEnvelope<T> = {
  data?: T;
  success?: boolean;
  message?: string | null;
  errors?: string[] | Record<string, string[]> | null;
};

type BackendRecord = Record<string, unknown>;

type BackendCreatePlanPayload = {
  nome: string;
  duracaoAnos: number;
  duracaoMeses: number;
  dataInicio: string;
};

type BackendChangePlanPayload = {
  duracaoAnos: number;
  duracaoMeses: number;
  modo: 1 | 2;
};

export class BiblePlanNotFoundError extends Error {
  constructor() {
    super("Nenhum plano bíblico ativo encontrado.");
    this.name = "BiblePlanNotFoundError";
  }
}

export class BiblePlanUnauthorizedError extends Error {
  constructor() {
    super("Entre na sua conta para acessar o plano bíblico.");
    this.name = "BiblePlanUnauthorizedError";
  }
}

function unwrap<T>(response: ApiEnvelope<T> | T) {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data as T;
  }

  return response as T;
}

function readString(source: BackendRecord, keys: string[], fallback: string | undefined = "") {
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

function asRecord(value: unknown): BackendRecord {
  return value && typeof value === "object" ? (value as BackendRecord) : {};
}

function hasPayload(value: unknown) {
  if (!value) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return typeof value !== "object" || Object.keys(value).length > 0;
}

function getDurationParts(duracaoMeses: number) {
  return {
    duracaoAnos: Math.floor(duracaoMeses / 12),
    duracaoMeses: duracaoMeses % 12
  };
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function getDuracaoPlano(duracaoAnos: number, duracaoMeses: number, duracaoDias: number): DuracaoPlano {
  const totalMeses = duracaoAnos * 12 + duracaoMeses;

  if (totalMeses === 6 || duracaoDias === 180) {
    return "6_meses";
  }

  if (totalMeses === 24 || duracaoDias === 730) {
    return "2_anos";
  }

  if (totalMeses === 12 || duracaoDias === 365) {
    return "1_ano";
  }

  return "personalizado";
}

function normalizeStatus(source: BackendRecord): DiaPlanoBiblico["status"] {
  const status = readString(source, ["status", "Status"]).toLowerCase();
  const concluido = readBoolean(source, ["concluido", "Concluido", "estaConcluido", "EstaConcluido"]);

  return concluido || status === "concluido" || status === "concluído" ? "concluido" : "pendente";
}

function normalizeDia(value: unknown): DiaPlanoBiblico {
  const source = asRecord(value);
  const dia = readNumber(source, ["diaNumero", "DiaNumero", "dia", "Dia", "numeroDia", "NumeroDia", "ordem", "Ordem"], 1);
  const id = readString(source, ["id", "Id", "planoDiaId", "PlanoDiaId", "planoBiblicoDiaId", "PlanoBiblicoDiaId", "diaPlanoId", "DiaPlanoId"], String(dia));
  const actionId = readString(
    source,
    [
      "diaId",
      "DiaId",
      "planoDiaId",
      "PlanoDiaId",
      "planoBiblicoDiaId",
      "PlanoBiblicoDiaId",
      "diaPlanoId",
      "DiaPlanoId",
      "progressoId",
      "ProgressoId",
      "planoBiblicoProgressoId",
      "PlanoBiblicoProgressoId",
      "id",
      "Id"
    ],
    id
  );
  const leitura =
    readString(source, [
      "leiturasTexto",
      "LeiturasTexto",
      "leitura",
      "Leitura",
      "referencia",
      "Referencia",
      "referencias",
      "Referencias",
      "descricao",
      "Descricao"
    ]) ||
    readArray(source, ["leituras", "Leituras", "capitulos", "Capitulos"])
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        const record = asRecord(item);
        const livro = readString(record, ["livro", "Livro", "nome", "Nome"]);
        const capitulo = readNumber(record, ["capitulo", "Capitulo"], 0);

        if (livro && capitulo > 0) {
          return `${livro} ${capitulo}`;
        }

        return readString(record, ["referencia", "Referencia", "texto", "Texto", "titulo", "Titulo"]);
      })
      .filter(Boolean)
      .join(", ");

  return {
    id,
    actionId,
    dia,
    mes: readNumber(source, ["mesNumero", "MesNumero", "mes", "Mes"], Math.max(1, Math.ceil(dia / 30))),
    data: readString(source, ["dataPrevista", "DataPrevista"], undefined),
    dataPrevista: readString(source, ["dataPrevista", "DataPrevista"], undefined),
    leitura: leitura || "Meditação livre",
    salmoNumero: readNumber(source, ["salmoNumero", "SalmoNumero"], 0) || null,
    status: normalizeStatus(source)
  };
}

function normalizePlano(value: unknown, dias: DiaPlanoBiblico[] = []): PlanoBiblico {
  if (!hasPayload(value)) {
    throw new BiblePlanNotFoundError();
  }

  const source = asRecord(value);
  const id = readString(source, ["id", "Id", "planoId", "PlanoId"]);

  if (!id) {
    throw new BiblePlanNotFoundError();
  }

  const duracaoAnos = readNumber(source, ["duracaoAnos", "DuracaoAnos"], 0);
  const duracaoMeses = readNumber(source, ["duracaoMeses", "DuracaoMeses", "meses", "Meses"], 0);
  const duracaoDias = readNumber(source, ["duracaoDias", "DuracaoDias", "totalDias", "TotalDias", "diasTotais", "DiasTotais"], duracaoAnos * 365 + duracaoMeses * 30);
  const diasConcluidosFromApi = readNumber(source, ["diasConcluidos", "DiasConcluidos", "leiturasConcluidas", "LeiturasConcluidas"], -1);
  const diasConcluidos = diasConcluidosFromApi >= 0 ? diasConcluidosFromApi : dias.filter((dia) => dia.status === "concluido").length;
  const progresso = readNumber(source, ["progresso", "Progresso", "percentualProgresso", "PercentualProgresso"], duracaoDias > 0 ? (diasConcluidos / duracaoDias) * 100 : 0);
  const leituraHojeValue = source.leituraHoje ?? source.LeituraHoje ?? source.diaAtual ?? source.DiaAtual ?? source.proximaLeitura ?? source.ProximaLeitura;
  const leituraHoje = leituraHojeValue ? normalizeDia(leituraHojeValue) : dias.find((dia) => dia.status === "pendente") ?? dias[0];

  return {
    id,
    nome: readString(source, ["nome", "Nome"], "Plano bíblico"),
    ativo: readBoolean(source, ["ativo", "Ativo"], readString(source, ["status", "Status"]).toLowerCase() !== "substituido"),
    duracao: getDuracaoPlano(duracaoAnos, duracaoMeses, duracaoDias),
    duracaoAnos,
    duracaoMeses,
    totalDias: duracaoDias,
    diasConcluidos,
    progresso: Math.max(0, Math.min(100, progresso)),
    sequencia: readNumber(source, ["sequencia", "Sequencia", "sequenciaDias", "SequenciaDias"], diasConcluidos),
    dataInicio: readString(source, ["dataInicio", "DataInicio"], undefined),
    dataFimPrevista: readString(source, ["dataFimPrevista", "DataFimPrevista"], undefined),
    status: readString(source, ["status", "Status"], undefined),
    leituraHoje
  };
}

function translateApiError(error: unknown): never {
  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 403) {
      throw new BiblePlanUnauthorizedError();
    }

    if (error.status === 404) {
      throw new BiblePlanNotFoundError();
    }

    if (error.status === 400) {
      throw new ApiError(error.message || "A API recusou os dados enviados para o plano bíblico.", error.status);
    }

    if (error.status === 422) {
      throw new ApiError(error.message || "A BaseBiblica ainda não está disponível para gerar o plano.", error.status);
    }
  }

  throw error;
}

function getDebuggablePlanError(error: unknown) {
  if (error instanceof ApiError) {
    return translateApiError(error);
  }

  return error;
}

function toCreatePayload(payload: CriarPlanoBiblicoPayload): BackendCreatePlanPayload {
  return {
    nome: payload.nome,
    ...getDurationParts(payload.duracaoMeses),
    dataInicio: getTodayIsoDate()
  };
}

function toChangePayload(payload: AlterarPlanoBiblicoPayload): BackendChangePlanPayload {
  return {
    ...getDurationParts(payload.duracaoMeses),
    modo: payload.manterProgresso ? 1 : 2
  };
}

export async function getPlanoAtivo(): Promise<PlanoBiblico> {
  try {
    const response = await api.get<ApiEnvelope<unknown>>("/api/planos-biblicos/ativo");
    return normalizePlano(unwrap(response));
  } catch (error) {
    translateApiError(error);
  }
}

export async function getCronograma(planoId?: string): Promise<DiaPlanoBiblico[]> {
  try {
    const resolvedPlanId = planoId ?? (await getPlanoAtivo()).id;
    const response = await api.get<ApiEnvelope<unknown[]>>(`/api/planos-biblicos/${resolvedPlanId}/dias`);
    return (unwrap(response) ?? []).map(normalizeDia);
  } catch (error) {
    translateApiError(error);
  }
}

export async function criarPlano(payload: CriarPlanoBiblicoPayload) {
  try {
    const response = await api.post<ApiEnvelope<unknown>, BackendCreatePlanPayload>("/api/planos-biblicos", toCreatePayload(payload));
    return normalizePlano(unwrap(response));
  } catch (error) {
    throw getDebuggablePlanError(error);
  }
}

export async function alterarPlano(payload: AlterarPlanoBiblicoPayload) {
  try {
    const response = await api.post<ApiEnvelope<unknown>, BackendChangePlanPayload>("/api/planos-biblicos/alterar", toChangePayload(payload));
    return normalizePlano(unwrap(response));
  } catch (error) {
    throw getDebuggablePlanError(error);
  }
}

export async function concluirDia(diaId: string) {
  try {
    await api.post<void>(`/api/planos-biblicos/dias/${diaId}/concluir`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new ApiError("Não foi possível encontrar este dia do plano para concluir.", error.status);
    }

    translateApiError(error);
  }
}

export async function desmarcarDia(diaId: string) {
  try {
    await api.post<void>(`/api/planos-biblicos/dias/${diaId}/desmarcar`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new ApiError("Não foi possível encontrar este dia do plano para desmarcar.", error.status);
    }

    translateApiError(error);
  }
}

export const getActiveBiblePlan = getPlanoAtivo;
export const getBiblePlanDays = getCronograma;
export const createBiblePlan = criarPlano;
export const changeBiblePlan = alterarPlano;
export const completeBiblePlanDay = concluirDia;
export const uncompleteBiblePlanDay = desmarcarDia;
