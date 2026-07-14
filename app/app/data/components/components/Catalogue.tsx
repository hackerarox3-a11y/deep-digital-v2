"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { products } from "@/data/products";

export default function Catalogue() {
  return (
    <section
      id="modeles"
      className="section"
    >
      <div className="container">

        <motion.div
          initial={{
            opacity:0,
            y:50
          }}
          whileInView={{
            opacity:1,
            y:0
          }}
          viewport={{
            once:true
          }}
        >
          <span className="text-[#D50F23] uppercase tracking-[4px]">
            Collection
          </span>

          <h2 className="mt-4">
            Nos modèles Premium
          </h2>

          <p className="max-w-2xl mt-5 mb-16">
            Une sélection de textiles haut de gamme
            pensée pour les créateurs, entreprises
            et marques qui recherchent une qualité
            irréprochable.
          </p>

        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">

          {products.map((product)=>(

            <ProductCard
              key={product.id}
              product={product}
            />

          ))}

        </div>

      </div>
    </section>
  );
}
