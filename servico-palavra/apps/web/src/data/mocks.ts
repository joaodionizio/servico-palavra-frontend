import type { Conteudo } from "@/types/conteudo";
import type { Dashboard } from "@/types/dashboard";
import type { DiaPlanoBiblico, PlanoBiblico } from "@/types/planoBiblico";

export const categorias = [
  { id: "biblia", nome: "Biblia", descricao: "Formacao biblica para leitura, estudo e oracao." },
  { id: "espiritualidade", nome: "Espiritualidade", descricao: "Vida interior, oracao e acompanhamento espiritual." },
  { id: "doutrina", nome: "Doutrina", descricao: "Fundamentos da fe catolica." }
];

export const conteudos: Conteudo[] = [
  {
    id: "1",
    slug: "como-ler-o-evangelho",
    titulo: "Como ler o Evangelho",
    descricao: "Uma introducao pastoral para rezar e estudar os textos evangelicos.",
    categoria: categorias[0],
    tipo: "video",
    duracao: "18 min",
    publicado: true,
    favorito: true,
    materiais: [{ id: "m1", titulo: "Roteiro de leitura orante", tipo: "pdf", url: "#" }]
  },
  {
    id: "2",
    slug: "vida-de-oracao",
    titulo: "Vida de oracao",
    descricao: "Passos simples para sustentar uma rotina de encontro com Deus.",
    categoria: categorias[1],
    tipo: "audio",
    duracao: "12 min",
    publicado: true,
    materiais: [{ id: "m2", titulo: "Perguntas para meditacao", tipo: "link", url: "#" }]
  },
  {
    id: "3",
    slug: "igreja-e-biblia",
    titulo: "A Igreja e a Biblia",
    descricao: "Visao geral sobre interpretacao, Tradicao e Magisterio.",
    categoria: categorias[2],
    tipo: "documento",
    duracao: "8 paginas",
    publicado: true
  }
];

export const planoAtivo: PlanoBiblico | null = null;

export const diasPlano: DiaPlanoBiblico[] = [
  { id: "d1", dia: 1, leitura: "Genesis 1-3; Salmo 1", status: "concluido" },
  { id: "d2", dia: 2, leitura: "Genesis 4-6; Salmo 2", status: "pendente" },
  { id: "d3", dia: 3, leitura: "Genesis 7-9; Salmo 3", status: "pendente" }
];

export const dashboard: Dashboard = {
  continuarAssistindo: [conteudos[0]],
  ultimasFormacoes: conteudos,
  favoritos: conteudos.filter((conteudo) => conteudo.favorito),
  recomendados: [conteudos[1], conteudos[2]],
  planoBiblicoAtivo: planoAtivo
};
