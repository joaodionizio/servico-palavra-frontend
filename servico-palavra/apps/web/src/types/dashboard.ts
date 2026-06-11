import type { Conteudo } from "@/types/conteudo";
import type { PlanoBiblico } from "@/types/planoBiblico";
import type { Trilha } from "@/types/trilha";

export type Dashboard = {
  continuarAssistindo: Conteudo[];
  trilhasEmAndamento: Trilha[];
  ultimasFormacoes: Conteudo[];
  favoritos: Conteudo[];
  recomendados: Conteudo[];
  planoBiblicoAtivo?: PlanoBiblico | null;
};
