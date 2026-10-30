import { Card } from "@/components/ui/Card";
import { BrandEyebrow } from "@/components/branding/BrandEyebrow";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="relative overflow-hidden py-14 text-center">
      <div className="mx-auto mb-6 h-16 w-16 rotate-45 rounded-2xl bg-[var(--sp-accent)] shadow-[14px_14px_0_#004B87] dark:shadow-[14px_14px_0_#0B5F9F]" aria-hidden="true" />
      <BrandEyebrow variant="light" className="text-sm font-bold tracking-wide" />
      <h3 className="mt-3 text-2xl font-black text-[var(--sp-brand)] dark:text-white">{title}</h3>
      <p className="mt-2 leading-6 text-[var(--sp-text-muted)]">{description}</p>
    </Card>
  );
}
