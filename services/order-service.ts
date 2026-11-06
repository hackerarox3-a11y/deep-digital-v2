import { site } from "@/constants/site";
import type { Product } from "@/types/catalogue";

export type OrderSelections = {
  size?: string;
  color?: string;
  printMethod?: string;
  pages?: number;
};

export function buildProductOrderWhatsAppMessage(
  product: Product,
  siteOrigin: string,
  selectedImage = product.image,
  selectedModelLabel = product.name,
  selections: OrderSelections = {},
) {
  const imageUrl = selectedImage ? new URL(selectedImage, siteOrigin).toString() : undefined;
  const magazineOption = product.magazineOptions?.find((option) => option.pages === selections.pages)
    ?? product.magazineOptions?.[0];
  const price = magazineOption?.price ?? product.price;
  const sizeSelectable = ["tshirt", "hoodie", "sweatshirt", "polo", "boxer", "coussin"].includes(product.kind);

  return [
    "Bonjour Deep Digital, je souhaite commander :",
    `Article : ${product.name}`,
    `Modèle sélectionné : ${selectedModelLabel}`,
    ...(imageUrl ? [`Image exacte du modèle : ${imageUrl}`] : []),
    ...(selections.size ? [`Taille choisie : ${selections.size}`] : []),
    ...(selections.color ? [`Couleur choisie : ${selections.color}`] : []),
    ...(magazineOption ? [`Format choisi : ${magazineOption.pages} pages`] : []),
    `${selections.printMethod ? "Mode d'impression choisi" : "Technique recommandée"} : ${selections.printMethod ?? product.technique}`,
    `Prix indicatif : ${price.toLocaleString("fr-FR")} F CFA${magazineOption ? "" : " HT"}`,
    ...(product.colors.length > 0 ? [`Couleurs disponibles : ${product.colors.join(", ")}`] : []),
    "Quantité : 1",
    ...(!selections.size && sizeSelectable ? ["Taille souhaitée : à préciser"] : []),
    "Merci de confirmer la disponibilité, le montant total et le délai. Je souhaite finaliser ma commande avec vous.",
  ].join("\n");
}

export function buildProductOrderWhatsAppUrl(
  product: Product,
  siteOrigin: string,
  selectedImage = product.image,
  selectedModelLabel = product.name,
  selections: OrderSelections = {},
) {
  const message = buildProductOrderWhatsAppMessage(product, siteOrigin, selectedImage, selectedModelLabel, selections);
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
