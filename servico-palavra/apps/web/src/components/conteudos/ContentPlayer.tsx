import { Card } from "@/components/ui/Card";
import type { Conteudo } from "@/types/conteudo";

export function ContentPlayer({ conteudo }: { conteudo: Conteudo }) {
  if (conteudo.tipo === "audio") {
    return (
      <Card>
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">Player de áudio</p>
        <div className="rounded-xl bg-blue-50 p-8 text-gray-500">Áudio preparado para receber a URL da API.</div>
      </Card>
    );
  }

  if (conteudo.tipo === "video") {
    return (
      <div className="aspect-video rounded-2xl bg-[#004B87] p-6 text-white shadow-lg">
        <div className="flex h-full items-center justify-center text-lg font-bold">Player de vídeo preparado para a URL da API</div>
      </div>
    );
  }

  return (
    <Card>
      <p className="text-gray-500">Conteúdo em formato {conteudo.tipo}. O material será carregado pela API externa.</p>
    </Card>
  );
}
