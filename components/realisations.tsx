"use client";

import { useState } from "react";
import { ImageSlideshow, type ImageSlide } from "@/components/image-slideshow";
import { SectionHeading } from "@/components/section-heading";

const projects: ImageSlide[] = [
  {
    label: "T-shirt personnalisé",
    alt: "T-shirt personnalisé avec impression photo",
    src: "/tshirt.png",
  },
  {
    label: "Collection The Movements",
    alt: "T-shirt imprimé de la collection The Movements",
    src: "/111.png",
  },
  {
    label: "Collection capsule",
    alt: "Sélection de créations textiles personnalisées",
    src: "/df/dfs.jpg",
  },
  {
    label: "Sweatshirts personnalisés",
    alt: "Sweatshirts et T-shirts personnalisés portés par des modèles",
    src: "/df/nb.jpg",
  },
  {
    label: "Impression textile",
    alt: "Plusieurs vêtements personnalisés en impression textile",
    src: "/df/UII.jpg",
  },
  {
    label: "Collection textile",
    alt: "Collection de vêtements personnalisés présentée sur des modèles",
    src: "/112.png",
  },
  {
    label: "T-shirt graphique",
    alt: "T-shirt personnalisé de la collection The Movements",
    src: "/df/wx.jpg",
  },
  {
    label: "Création textile",
    alt: "Création personnalisée sur textile",
    src: "/df/vv.jpg",
  },
  {
    label: "T-shirt — vue avant",
    alt: "Modèle de T-shirt noir vu de face",
    src: "/mockups/tshirt-front.png",
  },
  {
    label: "T-shirt — vue arrière",
    alt: "Modèle de T-shirt noir vu de dos",
    src: "/mockups/tshirt-back.png",
  },
];

export function Realisations() {
  const [activeProject, setActiveProject] = useState(projects[0]);

  return (
    <section className="realisations section-shell" id="realisations">
      <SectionHeading
        eyebrow="Réalisation | Portfolio"
        title="Des pièces conçues pour laisser une impression durable."
        description="Nous créons des collections premium pour les marques, groupes, événements et ateliers qui veulent une image forte et mémorable."
      />

      <div className="realisation-card">
        <ImageSlideshow
          slides={projects}
          label="Diaporama de dix réalisations"
          className="realisation-card__slideshow"
          autoPlayMs={5000}
          onSlideChange={setActiveProject}
        />
        <div className="realisation-card__body" aria-live="polite">
          <span>Réalisation {projects.indexOf(activeProject) + 1} / {projects.length}</span>
          <h3>{activeProject.label}</h3>
        </div>
      </div>
    </section>
  );
}
