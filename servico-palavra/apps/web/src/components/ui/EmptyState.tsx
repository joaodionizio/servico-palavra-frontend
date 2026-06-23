import { Card } from "@/components/ui/Card";
import { BrandEyebrow } from "@/components/branding/BrandEyebrow";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="text-center">
      <BrandEyebrow variant="light" className="text-sm font-bold tracking-wide" />
      <h3 className="mt-3 text-2xl font-black text-[#004B87]">{title}</h3>
      <p className="mt-2 leading-6 text-gray-500">{description}</p>
    </Card>
  );
}
