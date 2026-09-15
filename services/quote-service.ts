import { site } from "@/constants/site";
import type { StudioState } from "@/types/studio";

export function buildWhatsAppUrl(state: StudioState) {
  const message = [
    "Bonjour Deep Digital, je souhaite finaliser ma maquette.",
    `Support : ${state.product.name}`,
    `Couleur : ${state.color} · Taille : ${state.size}`,
    `Tissu : ${state.fabric} · Technique : ${state.technique}`,
    `Face : ${state.side === "front" ? "Recto" : "Verso"}`,
    `Estimation : ${state.product.price.toLocaleString("fr-FR")} F CFA HT`,
  ].join("\n");

  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildCartWhatsAppUrl(items: Array<{ state: StudioState; quantity: number }>) {
  const lines = items.map(({ state, quantity }, index) => `${index + 1}. ${state.product.name} x${quantity} · ${state.color} · ${state.size} · ${state.technique}`);
  const message = ["Bonjour Deep Digital, voici ma sélection à finaliser :", ...lines, "Merci de me confirmer le devis et les délais."].join("\n");
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
