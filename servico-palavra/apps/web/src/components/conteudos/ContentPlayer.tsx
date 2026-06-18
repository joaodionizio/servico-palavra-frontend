import { Card } from "@/components/ui/Card";
import type { Conteudo } from "@/types/conteudo";

export function ContentPlayer({ conteudo }: { conteudo: Conteudo }) {
  const actionLabel = conteudo.tipo === "audio" ? "Abrir áudio" : conteudo.tipo === "video" ? "Abrir vídeo" : "Abrir conteúdo";

  const icon = conteudo.tipo === "audio" ? "🎧" : conteudo.tipo === "documento" ? "📄" : conteudo.tipo === "texto" ? "✍️" : "🎬";

  return (
    <Card className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
      {conteudo.urlThumbnail ? (
        <img src={conteudo.urlThumbnail} alt="" className="aspect-video w-full rounded-xl object-cover md:aspect-square" />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-blue-50 text-5xl md:aspect-square">{icon}</div>
      )}
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-gray-500">
          {conteudo.tipoLabel ?? conteudo.tipo} {conteudo.origemLabel ? `• ${conteudo.origemLabel}` : ""}
        </p>
        <h2 className="mt-3 text-2xl font-black text-[#004B87]">Acesse a mídia da formação</h2>
        <p className="mt-2 leading-6 text-gray-500">
          Vídeos e áudios são abertos por URL externa. O Serviço da Palavra guarda apenas os metadados e o link do conteúdo.
        </p>
        {conteudo.url ? (
          <a
            href={conteudo.url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-xl bg-[#004B87] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#003366]"
          >
            {actionLabel}
          </a>
        ) : (
          <p className="mt-5 rounded-xl bg-yellow-50 px-4 py-3 text-sm font-semibold text-gray-600">Esta formação ainda não possui link de mídia cadastrado.</p>
        )}
      </div>
    </Card>
  );
}
