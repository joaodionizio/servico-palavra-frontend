import type { Conteudo } from "@/types/conteudo";

export type TrilhaConteudo = {
  ordem: number;
  conteudo: Conteudo;
  concluido: boolean;
  emAndamento?: boolean;
};

export type Trilha = {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  progresso: number;
  conteudos: TrilhaConteudo[];
};
