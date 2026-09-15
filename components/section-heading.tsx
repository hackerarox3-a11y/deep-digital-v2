import { Reveal } from "@/animations/reveal";

type Props = { eyebrow: string; title: string; description?: string; className?: string };

export function SectionHeading({ eyebrow, title, description, className }: Props) {
  return (
    <Reveal className={className}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-heading">{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </Reveal>
  );
}
