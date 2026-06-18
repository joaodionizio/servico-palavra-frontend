import { redirect } from "next/navigation";

export default async function AppAdminEditarConteudoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  redirect(`/admin/conteudos/${id}/editar`);
}
