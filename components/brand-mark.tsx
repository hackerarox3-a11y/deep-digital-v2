export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-mark" aria-label="Deep Digital">
      <span className="brand-mark__dot" />
      <span>{compact ? "DD" : "DEEP DIGITAL"}</span>
    </span>
  );
}
