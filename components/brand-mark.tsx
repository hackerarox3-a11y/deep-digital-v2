import Image from "next/image";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-mark${compact ? " brand-mark--compact" : ""}`} aria-label="Deep Digital">
      <Image className="brand-mark__symbol" src="/brand-symbol.png" alt="" width={831} height={768} />
      <span className="brand-mark__name"><span className="brand-mark__deep">DEEP</span><span className="brand-mark__digital"> DIGITAL</span></span>
    </span>
  );
}
