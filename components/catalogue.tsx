"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { GarmentSilhouette } from "@/components/garment-silhouette";
import { products } from "@/data/catalogue";

export function Catalogue() {
  return (
    <section id="modeles" className="catalogue section-shell">
      <SectionHeading
        eyebrow="The Essentials Catalogue | Catégories"
        title="Des supports textiles sélectionnés pour leur tenue irréprochable."
        description="Seulement le meilleur pour votre vêtement personnalisé d'exception."
      />
      <div className="catalogue__grid">
        {products.map((product, index) => (
          <motion.article
            className={`product-card product-card--${product.kind}`}
            key={product.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: index * 0.06, duration: 0.55 }}
            whileHover={{ y: -8 }}
          >
            <div className="product-card__visual"><GarmentSilhouette product={product.kind} color={index % 3 === 2 ? "#d50f23" : "#111216"} label={product.name} /></div>
            <div className="product-card__meta"><span>{product.weight}</span><span>{product.label}</span></div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <details className="product-card__details"><summary>Fiche détaillée</summary><span>Grammage {product.weight} · Technique recommandée : {product.technique}.</span></details>
            <div className="product-card__footer"><span>{product.technique}</span><a href="#studio" aria-label={`Personnaliser ${product.name}`}>↗</a></div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
