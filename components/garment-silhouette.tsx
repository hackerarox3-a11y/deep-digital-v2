import { cn } from "@/lib/utils";
import type { Product } from "@/types/catalogue";

type Props = { product: Product["kind"]; color?: string; className?: string; label?: string };

/** A crisp vector garment keeps the catalogue fast and avoids an image payload before the customer uploads artwork. */
export function GarmentSilhouette({ product, color = "#18191c", className, label }: Props) {
  const isTote = product === "tote";
  const isCap = product === "cap";
  return (
    <svg viewBox="0 0 320 360" role="img" aria-label={label ?? product} className={cn("garment", className)}>
      <defs>
        <linearGradient id="fabric" x1="0" y1="0" x2="1" y2="1"><stop stopColor={color}/><stop offset="1" stopColor="#050506" stopOpacity=".38" /></linearGradient>
      </defs>
      {isTote ? <>
        <path d="M92 116h136l13 190H79l13-190Z" fill="url(#fabric)" />
        <path d="M120 117V83c0-39 80-39 80 0v34" fill="none" stroke={color} strokeWidth="18" strokeLinecap="round" />
      </> : isCap ? <>
        <path d="M67 190c12-104 173-127 202-11l-5 51H65l2-40Z" fill="url(#fabric)" />
        <path d="M51 228c72-18 144-11 229 14-62 31-169 32-229-14Z" fill={color} />
      </> : <>
        {product === "hoodie" && <path d="M120 89c6-55 75-55 81 0l-7 33h-66l-8-33Z" fill={color} opacity=".95" />}
        {product === "polo" && <path d="M130 89h60l-8 47h-44l-8-47Z" fill="#f5f4f1" opacity=".88" />}
        <path d="M119 91 62 121 26 203l57 23 22-55v141h110V171l22 55 57-23-36-82-57-30c-19 15-43 18-62 0Z" fill="url(#fabric)" />
        {product === "sweatshirt" && <path d="M105 284h110" stroke="#fff" strokeOpacity=".18" strokeWidth="5" />}
      </>}
    </svg>
  );
}
