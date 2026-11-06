import { site } from "@/constants/site";
import type { Product } from "@/types/catalogue";

export function buildProductOrderWhatsAppMessage(
  product: Product,
  siteOrigin: string,
  selectedImage = product.image,
  selectedModelLabel = product.name,
) {
  const imageUrl = selectedImage ? new URL(selectedImage, siteOrigin).toString() : undefined;

  return [
    "Bonjour Deep Digital, je souhaite commander :",
    `Article : ${product.name}`,
    `Modèle sélectionné : ${selectedModelLabel}`,
    ...(imageUrl ? [`Image exacte du modèle : ${imageUrl}`] : []),
    `Prix indicatif : ${product.price.toLocaleString("fr-FR")} F CFA HT`,
    `Technique recommandée : ${product.technique}`,
    `Couleurs disponibles : ${product.colors.join(", ")}`,
    "Quantité : 1",
    "Taille et couleur souhaitées : à préciser",
    "Merci de confirmer la disponibilité, le montant total et le délai. Je souhaite finaliser ma commande avec vous.",
  ].join("\n");
}

export function buildProductOrderWhatsAppUrl(
  product: Product,
  siteOrigin: string,
  selectedImage = product.image,
  selectedModelLabel = product.name,
) {
  const message = buildProductOrderWhatsAppMessage(product, siteOrigin, selectedImage, selectedModelLabel);
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
