import { BrandEyebrow } from "@/components/branding/BrandEyebrow";

export function Loading({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="animate-slide-up rounded-[1.5rem] border border-slate-200/70 bg-[#FDFDFB] px-8 py-10 text-center shadow-sm">
      <div className="mx-auto mb-5 h-2 w-24 overflow-hidden rounded-full bg-slate-100"><span className="block h-full w-1/2 animate-pulse rounded-full bg-[#FFCC00]" /></div>
      <BrandEyebrow variant="light" className="text-sm font-bold tracking-wide" />
      <p className="mt-2 animate-pulse text-lg font-bold text-[#004B87]">{label}</p>
      <p className="mt-2 text-sm text-gray-500">Buscando dados atualizados.</p>
    </div>
  );
}
