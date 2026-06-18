import type { Conteudo } from "@/types/conteudo";
import type { DiaPlanoBiblico, PlanoBiblico } from "@/types/planoBiblico";

export type Dashboard = {
  continuarAssistindo: Conteudo[];
  ultimasFormacoes: Conteudo[];
  favoritos: Conteudo[];
  recomendados: Conteudo[];
  planoBiblicoAtivo?: PlanoBiblico | null;
};

export type ConteudoComProgresso = Conteudo & {
  progresso?: number;
  ultimoAcessoEm?: string | null;
};

export type DashboardEstatisticas = {
  totalFavoritos: number;
  totalConteudosConcluidos: number;
  percentualPlanoBiblico: number;
};

export type DashboardMe = {
  conteudosConcluidos: number;
  favoritos: number;
  possuiPlanoBiblicoAtivo: boolean;
  formacoesRecentes: Conteudo[];
  favoritosRecentes: Conteudo[];
  conteudosComProgresso: ConteudoComProgresso[];
  planoBiblicoAtivo: PlanoBiblico | null;
  leituraHoje: DiaPlanoBiblico | null;
  estatisticas: DashboardEstatisticas;
};
