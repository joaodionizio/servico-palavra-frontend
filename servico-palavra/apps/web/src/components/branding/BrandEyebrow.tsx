type BrandEyebrowProps = {
  className?: string;
  variant?: "light" | "onBlue";
};

const sentinelasColorByVariant = {
  light: "text-[#004B87] dark:text-[#7BB7F0]",
  onBlue: "text-[#A9D3FF]"
};

export function BrandEyebrow({
  className = "",
  variant = "light"
}: BrandEyebrowProps) {
  return (
    <p className={`font-brand-script ${className}`.trim()}>
      <span className={sentinelasColorByVariant[variant]}>Sentinelas</span>{" "}
      <span className="text-[#FFCC00]">da Manhã</span>
    </p>
  );
}
