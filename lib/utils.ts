export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCfa(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " F CFA";
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
