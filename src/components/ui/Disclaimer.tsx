import { product } from "@/config/product";

export function Disclaimer({ className }: { className?: string }) {
  return <p className={`text-xs leading-relaxed text-ink-faint ${className ?? ""}`}>{product.legalDisclaimer}</p>;
}
