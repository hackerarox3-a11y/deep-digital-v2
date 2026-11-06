"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ImageSlideshow, type ImageSlide } from "@/components/image-slideshow";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/constants/site";
import { products } from "@/data/catalogue";
import {
  buildProductOrderWhatsAppMessage,
  buildProductOrderWhatsAppUrl,
  type OrderSelections,
} from "@/services/order-service";
import type { Product } from "@/types/catalogue";

const standardSizes = ["S", "M", "L", "XL", "XXL"] as const;
const selectableProductKinds = new Set<Product["kind"]>(["tshirt", "hoodie", "boxer", "polo"]);

export function Catalogue() {
  const [selectedModels, setSelectedModels] = useState<Record<string, ImageSlide>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, OrderSelections>>({});
  const [orderStatus, setOrderStatus] = useState("");

  const shareOrder = async (product: Product, model: ImageSlide, selections: OrderSelections) => {
    const siteOrigin = window.location.origin;
    const imageUrl = new URL(model.src, siteOrigin);
    const whatsappUrl = buildProductOrderWhatsAppUrl(product, siteOrigin, model.src, model.label, selections);
    const fallbackTab = window.open("about:blank", "_blank");

    if (!fallbackTab) {
      window.location.assign(whatsappUrl);
      return;
    }

    try {
      if (typeof navigator.share === "function" && typeof navigator.canShare === "function") {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Impossible de charger l’image du modèle (${response.status}).`);

        const blob = await response.blob();
        const fileName = imageUrl.pathname.split("/").pop() || "modele";
        const fileType = blob.type || (fileName.toLowerCase().endsWith(".jpg") ? "image/jpeg" : "image/png");
        const imageFile = new File([blob], fileName, { type: fileType });

        if (navigator.canShare({ files: [imageFile] })) {
          await navigator.share({
            files: [imageFile],
            text: buildProductOrderWhatsAppMessage(product, siteOrigin, model.src, model.label, selections),
          });
          fallbackTab.close();
          setOrderStatus("Choisissez WhatsApp dans le menu de partage pour joindre l’image sélectionnée.");
          return;
        }
      }

      fallbackTab.location.href = whatsappUrl;
      setOrderStatus("Le lien de l’image sélectionnée est inclus dans le message WhatsApp.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        fallbackTab.close();
        setOrderStatus("Partage annulé. Vous pouvez relancer la commande avec le modèle choisi.");
        return;
      }

      console.error("Impossible de partager l’image du modèle avec WhatsApp.", error);
      fallbackTab.location.href = whatsappUrl;
      setOrderStatus("Le partage de l’image a échoué. Le lien du modèle reste disponible dans le message WhatsApp.");
    }
  };

  return (
    <section id="modeles" className="catalogue section-shell">
      <SectionHeading
        eyebrow="The Essentials Catalogue | Catégories"
        title="Des supports textiles sélectionnés pour leur tenue irréprochable."
        description="Seulement le meilleur pour votre vêtement personnalisé d'exception."
      />
      <div className="catalogue__grid">
        {products.map((product, index) => {
          const hasStandardOptions = selectableProductKinds.has(product.kind);
          const selections = selectedOptions[product.id] ?? {
            size: standardSizes[0],
            color: product.colors[0],
          };

          return (
          <motion.article
            className={`product-card product-card--${product.kind}`}
            key={product.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: index * 0.06, duration: 0.55 }}
            whileHover={{ y: -8 }}
          >
            <div className="product-card__visual">
              <ImageSlideshow
                slides={product.images ?? [{
                  src: product.image ?? "",
                  alt: product.name,
                  label: product.name,
                }]}
                label={`Diaporama des modèles ${product.name}`}
                autoPlayMs={product.kind === "tshirt" ? 6000 : undefined}
                onSlideChange={(slide) => setSelectedModels((current) => ({ ...current, [product.id]: slide }))}
              />
            </div>
            {product.kind === "tshirt" && (
              <p className="product-card__selection">
                Modèle sélectionné : {selectedModels[product.id]?.label ?? product.images?.[0]?.label ?? product.name}
              </p>
            )}
            {hasStandardOptions && (
              <div className="product-card__options">
                <label htmlFor={`size-${product.id}`}>Taille</label>
                <select
                  id={`size-${product.id}`}
                  value={selections.size}
                  onChange={(event) => setSelectedOptions((current) => ({
                    ...current,
                    [product.id]: { ...selections, size: event.target.value },
                  }))}
                  aria-label={`Taille ${product.name}`}
                >
                  {standardSizes.map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
                <label htmlFor={`color-${product.id}`}>Couleur</label>
                <select
                  id={`color-${product.id}`}
                  value={selections.color}
                  onChange={(event) => setSelectedOptions((current) => ({
                    ...current,
                    [product.id]: { ...selections, color: event.target.value },
                  }))}
                  aria-label={`Couleur ${product.name}`}
                >
                  {product.colors.map((color) => <option key={color} value={color}>{color}</option>)}
                </select>
              </div>
            )}
            <div className="product-card__meta"><span>{product.weight}</span><span>{product.label}</span></div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <details className="product-card__details"><summary>Fiche détaillée</summary><span>Grammage {product.weight} · Technique recommandée : {product.technique}.</span></details>
            <div className="product-card__footer">
              <span>Dès {product.price.toLocaleString("fr-FR")} F CFA</span>
              <a
                className="button button--small button--dark"
                href={buildProductOrderWhatsAppUrl(
                  product,
                  site.url,
                  selectedModels[product.id]?.src ?? product.images?.[0]?.src ?? product.image,
                  selectedModels[product.id]?.label ?? product.images?.[0]?.label ?? product.name,
                  selections,
                )}
                onClick={(event) => {
                  event.preventDefault();
                  void shareOrder(
                    product,
                    selectedModels[product.id] ?? {
                      src: product.image ?? "",
                      alt: product.name,
                      label: product.name,
                    },
                    selections,
                  );
                }}
                target="_blank"
                rel="noreferrer"
                aria-label={`Commander ${product.name} sur WhatsApp`}
              >
                Commander <span aria-hidden>↗</span>
              </a>
            </div>
          </motion.article>
          );
        })}
      </div>
      <p className="catalogue__share-note" aria-live="polite">
        {orderStatus || "Sur les appareils compatibles, le menu de partage joint l’image choisie ; sinon son lien exact est ajouté à WhatsApp."}
      </p>
    </section>
  );
}
