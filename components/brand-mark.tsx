export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-mark" aria-label="Deep Digital">
      <span className="brand-mark__dot" />
      <span>
        <span className="brand-mark__deep">DEEP</span>
        <span className="brand-mark__digital"> DIGITAL</span>
      </span>
    </span>
  );
}
