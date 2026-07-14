"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ProductCard({ product }: any) {
  return (
    <motion.article
      whileHover={{
        y: -10,
      }}
      className="card overflow-hidden group"
    >
      <div className="relative h-72 bg-[#111] flex items-center justify-center">

        <Image
          src={product.image}
          alt={product.title}
          width={350}
          height={350}
          className="transition duration-700 group-hover:scale-110"
        />

      </div>

      <div className="p-8">

        <span className="text-sm text-[#D50F23]">
          {product.weight}
        </span>

        <h3 className="text-2xl mt-3 mb-4">
          {product.title}
        </h3>

        <p className="mb-6">
          {product.description}
        </p>

        <div className="flex justify-between items-center">

          <strong className="text-xl">
            {product.price}
          </strong>

          <button className="btn btn-primary">
            Voir

            <ArrowRight
              className="ml-2"
              size={18}
            />

          </button>

        </div>

      </div>
    </motion.article>
  );
}
