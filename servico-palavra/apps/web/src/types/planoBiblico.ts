export type DuracaoPlano = "6_meses" | "1_ano" | "2_anos" | "personalizado";

export type PlanoBiblico = {
  id: string;
  ativo: boolean;
  duracao: DuracaoPlano;
  progresso: number;
  sequencia: number;
  leituraHoje?: DiaPlanoBiblico;
};

export type DiaPlanoBiblico = {
  id: string;
  dia: number;
  leitura: string;
  status: "pendente" | "concluido";
};
