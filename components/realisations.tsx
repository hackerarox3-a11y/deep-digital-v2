"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";

const projects = [
  {
    title: "Capsule Love Edition",
    category: "T-Shirts & Hoodies",
    image: "/df/dfs.jpg",
  },
  {
    title: "Signature Set",
    category: "Casquettes & imprimés",
    image: "/df/wx.jpg",
  },
] as const;

export function Realisations() {
  return (
    <section className="realisations section-shell" id="realisations">
      <SectionHeading
        eyebrow="Réalisation | Portfolio"
        title="Des pièces conçues pour laisser une impression durable."
        description="Nous créons des collections premium pour les marques, groupes, événements et ateliers qui veulent une image forte et mémorable."
      />

      <div className="realisations__grid">
        {projects.map((project, index) => (
          <motion.article
            key={project.title}
            className="realisation-card"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            whileHover={{ y: -6 }}
          >
            <div className="realisation-card__media">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="realisation-card__body">
              <span>{project.category}</span>
              <h3>{project.title}</h3>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
