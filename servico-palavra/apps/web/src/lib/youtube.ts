import type { Conteudo } from "@/types/conteudo";

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

export function getConteudoThumbnailUrl(conteudo: Pick<Conteudo, "origem" | "tipo" | "url" | "urlThumbnail">) {
  if (conteudo.urlThumbnail?.trim()) {
    return conteudo.urlThumbnail;
  }

  if (conteudo.tipo !== "video") {
    return null;
  }

  const videoId = extractYouTubeVideoId(conteudo.url);

  if (!videoId) {
    return null;
  }

  if (conteudo.origem && conteudo.origem !== "youtube") {
    return null;
  }

  return getYouTubeThumbnailUrl(videoId);
}

export function getConteudoYouTubeEmbedUrl(conteudo: Pick<Conteudo, "origem" | "tipo" | "url">) {
  if (conteudo.tipo !== "video") {
    return null;
  }

  if (conteudo.origem && conteudo.origem !== "youtube") {
    return null;
  }

  const videoId = extractYouTubeVideoId(conteudo.url);

  if (!videoId) {
    return null;
  }

  return getYouTubeEmbedUrl(videoId);
}
