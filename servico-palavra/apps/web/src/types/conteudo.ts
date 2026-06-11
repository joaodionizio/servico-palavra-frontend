export type TipoConteudo = "video" | "audio" | "documento" | "link" | "texto";

export type CategoriaConteudo = {
  id: string;
  nome: string;
  descricao?: string;
};

export type MaterialApoio = {
  id: string;
  titulo: string;
  tipo: "pdf" | "link" | "arquivo";
  url: string;
};

export type Conteudo = {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  categoria: CategoriaConteudo;
  tipo: TipoConteudo;
  duracao?: string;
  url?: string;
  publicado: boolean;
  favorito?: boolean;
  concluido?: boolean;
  materiais?: MaterialApoio[];
};
