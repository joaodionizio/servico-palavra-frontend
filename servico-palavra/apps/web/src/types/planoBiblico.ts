export type DuracaoPlano = "6_meses" | "1_ano" | "2_anos" | "personalizado";

export type PlanoBiblico = {
  id: string;
  nome: string;
  ativo: boolean;
  duracao: DuracaoPlano;
  duracaoAnos: number;
  duracaoMeses: number;
  totalDias: number;
  diasConcluidos: number;
  progresso: number;
  sequencia: number;
  dataInicio?: string;
  dataFimPrevista?: string;
  status?: string;
  leituraHoje?: DiaPlanoBiblico;
};

export type DiaPlanoBiblico = {
  id: string;
  actionId?: string;
  dia: number;
  mes?: number;
  data?: string;
  dataPrevista?: string;
  leitura: string;
  salmoNumero?: number | null;
  status: "pendente" | "concluido";
};

export type CriarPlanoBiblicoPayload = {
  nome: string;
  duracaoMeses: number;
};

export type AlterarPlanoBiblicoPayload = CriarPlanoBiblicoPayload & {
  manterProgresso: boolean;
};
