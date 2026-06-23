import { BrandEyebrow } from "@/components/branding/BrandEyebrow";

export function Loading({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="animate-slide-up rounded-2xl border border-gray-100 bg-white px-8 py-6 text-center shadow-sm">
      <BrandEyebrow variant="light" className="text-sm font-bold tracking-wide" />
      <p className="mt-2 animate-pulse text-lg font-bold text-[#004B87]">{label}</p>
      <p className="mt-2 text-sm text-gray-500">Buscando dados atualizados.</p>
    </div>
  );
}
