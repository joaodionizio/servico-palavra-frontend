import type { Conteudo, OrigemConteudo, TipoConteudo } from "@/types/conteudo";

const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be", "youtube-nocookie.com", "www.youtube-nocookie.com"]);

function cleanVideoId(value: string | null) {
  const id = value?.trim();

  if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) {
    return null;
  }

  return id;
}

export function extractYouTubeVideoId(rawUrl?: string | null) {
  if (!rawUrl?.trim()) {
    return null;
  }

  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase();

    if (!YOUTUBE_HOSTS.has(host)) {
      return null;
    }

    if (host.endsWith("youtu.be")) {
      return cleanVideoId(url.pathname.split("/").filter(Boolean)[0] ?? null);
    }

    const watchId = cleanVideoId(url.searchParams.get("v"));

    if (watchId) {
      return watchId;
    }

    const [kind, id] = url.pathname.split("/").filter(Boolean);

    if (kind === "embed" || kind === "shorts") {
      return cleanVideoId(id ?? null);
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeThumbnailUrl(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function getYouTubeEmbedUrl(videoId: string) {
  return `https://www.youtube.com/embed/${videoId}`;
}

type ThumbnailConteudo = {
  origem?: OrigemConteudo | number | string | null;
  tipo?: TipoConteudo | number | string | null;
  url?: string | null;
  urlThumbnail?: string | null;
};

function isVideoTipo(tipo: ThumbnailConteudo["tipo"]) {
  if (typeof tipo === "number") {
    return tipo === 1;
  }

  return typeof tipo === "string" && ["video", "vídeo"].includes(tipo.trim().toLowerCase());
}

function isYouTubeOrigem(origem: ThumbnailConteudo["origem"]) {
  if (typeof origem === "number") {
    return origem === 1;
  }

  return typeof origem === "string" && origem.trim().toLowerCase().includes("youtube");
}

export function getConteudoThumbnailUrl(conteudo: ThumbnailConteudo) {
  if (conteudo.urlThumbnail?.trim()) {
    return conteudo.urlThumbnail;
  }

  if (!isVideoTipo(conteudo.tipo) || !isYouTubeOrigem(conteudo.origem)) {
    return null;
  }

  const videoId = extractYouTubeVideoId(conteudo.url);

  if (!videoId) {
    return null;
  }

  return getYouTubeThumbnailUrl(videoId);
}

export function getConteudoYouTubeEmbedUrl(conteudo: Pick<Conteudo, "origem" | "tipo" | "url">) {
  if (!isVideoTipo(conteudo.tipo) || !isYouTubeOrigem(conteudo.origem)) {
    return null;
  }

  const videoId = extractYouTubeVideoId(conteudo.url);

  if (!videoId) {
    return null;
  }

  return getYouTubeEmbedUrl(videoId);
}
