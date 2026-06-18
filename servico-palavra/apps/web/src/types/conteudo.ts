export type TipoConteudo = "video" | "audio" | "documento" | "link" | "texto";
export type OrigemConteudo = "youtube" | "google_drive" | "externo" | "interno" | "desconhecida";
export type TipoMaterialApoio = "pdf" | "slide" | "imagem" | "documento" | "link" | "outro";

export const TIPO_CONTEUDO_LABELS: Record<TipoConteudo, string> = {
  video: "Vídeo",
  audio: "Áudio",
  documento: "Documento",
  link: "Link",
  texto: "Texto"
};

export const TIPO_MATERIAL_APOIO_LABELS: Record<TipoMaterialApoio, string> = {
  pdf: "PDF",
  slide: "Slide",
  imagem: "Imagem",
  documento: "Documento",
  link: "Link",
  outro: "Outro"
};

export type CategoriaConteudo = {
  id: string;
  slug?: string;
  nome: string;
  descricao?: string;
  cor?: string;
  icone?: string;
  ordem?: number;
};

export type MaterialApoio = {
  id: string;
  titulo: string;
  tipo: TipoMaterialApoio;
  url: string;
};

export type AdminMaterialApoio = MaterialApoio & {
  descricao?: string;
  ordem?: number;
  ativo?: boolean;
};

export type Conteudo = {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  resumo?: string;
  categoria: CategoriaConteudo | null;
  tipo: TipoConteudo;
  tipoLabel?: string;
  origem?: OrigemConteudo;
  origemLabel?: string;
  duracao?: string;
  duracaoMinutos?: number;
  url?: string;
  urlThumbnail?: string;
  publicado: boolean;
  favorito?: boolean;
  concluido?: boolean;
  materiais?: MaterialApoio[];
};

export type AdminConteudo = Omit<Conteudo, "materiais"> & {
  categoriaConteudoId?: string;
  destaque?: boolean;
  ordem?: number;
  materiais?: AdminMaterialApoio[];
};

export type ConteudoListParams = {
  busca?: string;
  categoriaSlug?: string;
  tipo?: TipoConteudo | "";
  pagina?: number;
  tamanhoPagina?: number;
};

export type ConteudoPage = {
  itens: Conteudo[];
  pagina: number;
  tamanhoPagina: number;
  totalItens: number;
  totalPaginas: number;
};

export type AdminConteudoPage = Omit<ConteudoPage, "itens"> & {
  itens: AdminConteudo[];
};
