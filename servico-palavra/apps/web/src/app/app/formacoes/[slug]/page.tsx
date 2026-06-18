import { FormacaoDetailContent } from "@/components/conteudos/FormacaoDetailContent";

export default async function FormacaoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <FormacaoDetailContent slug={slug} />;
}
