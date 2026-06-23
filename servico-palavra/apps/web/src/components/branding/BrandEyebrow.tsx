type BrandEyebrowProps = {
  className?: string;
  sentinelasClassName?: string;
};

export function BrandEyebrow({
  className = "",
  sentinelasClassName = "text-[#004B87] dark:text-[#7BB7F0]"
}: BrandEyebrowProps) {
  return (
    <p className={`font-brand-script ${className}`.trim()}>
      <span className={sentinelasClassName}>Sentinelas</span>{" "}
      <span className="text-[#FFCC00]">da Manhã</span>
    </p>
  );
}
