import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getConteudoThumbnailUrl, getConteudoYouTubeEmbedUrl } from "@/lib/youtube";
import type { Conteudo } from "@/types/conteudo";

export function ContentPlayer({ conteudo }: { conteudo: Conteudo }) {
  const actionLabel = conteudo.tipo === "audio" ? "Abrir áudio" : conteudo.tipo === "video" ? "Abrir vídeo" : "Abrir conteúdo";

  const icon = conteudo.tipo === "audio" ? "🎧" : conteudo.tipo === "documento" ? "📄" : conteudo.tipo === "texto" ? "✍️" : "🎬";
  const thumbnailUrl = getConteudoThumbnailUrl(conteudo);
  const embedUrl = getConteudoYouTubeEmbedUrl(conteudo);

  if (embedUrl) {
    return (
      <Card className="overflow-hidden rounded-[2rem] p-0">
        <div className="aspect-video w-full bg-[#001B35]">
          <iframe
            src={embedUrl}
            title={`Vídeo: ${conteudo.titulo}`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--sp-text-muted)]">
            {conteudo.tipoLabel ?? conteudo.tipo} {conteudo.origemLabel ? `• ${conteudo.origemLabel}` : ""}
          </p>
          <h2 className="mt-3 text-2xl font-black text-[var(--sp-brand)] dark:text-white">Assista à formação</h2>
          <p className="mt-2 leading-6 text-[var(--sp-text-muted)]">O vídeo está incorporado pelo YouTube. O link externo continua disponível para abrir em outra aba.</p>
          {conteudo.url && (
            <LinkButton href={conteudo.url} target="_blank" rel="noreferrer" variant="primary" className="mt-6">
              Abrir no YouTube
            </LinkButton>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="grid gap-8 rounded-[2rem] md:grid-cols-[260px_1fr] md:items-center">
      {thumbnailUrl ? (
        <img src={thumbnailUrl} alt={`Capa de ${conteudo.titulo}`} className="aspect-video w-full rounded-xl object-cover md:aspect-square" />
      ) : (
        <div className="ui-media-placeholder flex aspect-video w-full items-center justify-center rounded-xl text-5xl md:aspect-square">{icon}</div>
      )}
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-[var(--sp-text-muted)]">
          {conteudo.tipoLabel ?? conteudo.tipo} {conteudo.origemLabel ? `• ${conteudo.origemLabel}` : ""}
        </p>
        <h2 className="mt-3 text-2xl font-black text-[var(--sp-brand)] dark:text-white">Acesse a mídia da formação</h2>
        <p className="mt-2 leading-6 text-[var(--sp-text-muted)]">
          Vídeos e áudios são abertos por URL externa. O Serviço da Palavra guarda apenas os metadados e o link do conteúdo.
        </p>
        {conteudo.url ? (
          <LinkButton href={conteudo.url} target="_blank" rel="noreferrer" variant="primary" className="mt-6">
            {actionLabel}
          </LinkButton>
        ) : (
          <p className="mt-5 rounded-xl border border-[var(--sp-border)] bg-[var(--sp-surface-muted)] px-4 py-3 text-sm font-semibold text-[var(--sp-text-muted)]">Esta formação ainda não possui link de mídia cadastrado.</p>
        )}
      </div>
    </Card>
  );
}
