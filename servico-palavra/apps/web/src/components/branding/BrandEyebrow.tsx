type BrandEyebrowProps = {
  className?: string;
  variant?: "light" | "onBlue";
};

const sentinelasColorByVariant = {
  light: "text-[#004B87] dark:text-white",
  onBlue: "text-[#BFECEF] dark:text-white"
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
