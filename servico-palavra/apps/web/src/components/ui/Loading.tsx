export function Loading({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="animate-slide-up rounded-2xl border border-gray-100 bg-white px-8 py-6 text-center shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#FFCC00]">Serviço</p>
      <p className="mt-2 animate-pulse text-lg font-bold text-[#004B87]">{label}</p>
    </div>
  );
}
