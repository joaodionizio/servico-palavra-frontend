import { BrandEyebrow } from "@/components/branding/BrandEyebrow";

export function Loading({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="animate-slide-up rounded-[1.5rem] border border-[var(--sp-border)] bg-[var(--sp-surface)] px-8 py-10 text-center text-[var(--sp-text)] shadow-sm">
      <div className="mx-auto mb-5 h-2 w-24 overflow-hidden rounded-full bg-[var(--sp-surface-muted)]"><span className="block h-full w-1/2 animate-pulse rounded-full bg-[var(--sp-accent)]" /></div>
      <BrandEyebrow variant="light" className="text-sm font-bold tracking-wide" />
      <p className="mt-2 animate-pulse text-lg font-bold text-[var(--sp-brand)] dark:text-white">{label}</p>
      <p className="mt-2 text-sm text-[var(--sp-text-muted)]">Buscando dados atualizados.</p>
    </div>
  );
}
