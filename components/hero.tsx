"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const heroSlides = [
  { src: "/112.png", alt: "Collection Deep Digital portée par plusieurs modèles" },
  { src: "/111.png", alt: "Deuxième collection Deep Digital portée par plusieurs modèles" },
];

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [isPaused, reduceMotion]);

  return (
    <section className="hero" id="top">
      <div className="hero__content">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="eyebrow">Collection 01 — Abidjan — Sur commande</motion.p>
        <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <span className="hero__deep">Personnalisez</span>
          <span className="hero__digital">votre identité.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }} className="hero__lede">Des pièces pensées pour être vues, portées et reconnues. Choisissez votre support, ajoutez votre univers.</motion.p>
        <div className="hero__actions">
          <motion.a whileHover={reduceMotion ? {} : { scale: 1.03 }} whileTap={{ scale: 0.98 }} href="#studio" className="button button--light hero__button">Personnaliser <span aria-hidden>↗</span></motion.a>
          <a href="#modeles" className="button button--ghost hero__button hero__button--ghost">Voir les modèles</a>
        </div>
      </div>
      <motion.div
        className="hero__product"
        initial={reduceMotion ? false : { opacity: 0, x: 28, scale: 0.96 }}
        animate={reduceMotion ? {} : { opacity: 1, x: 0, scale: [0.96, 1, 0.98, 1] }}
        transition={reduceMotion ? undefined : { opacity: { duration: 0.7 }, x: { duration: 0.7 }, scale: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}
      >
        <div
          className="hero__slider"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {heroSlides.map((slide, index) => (
            <motion.img
              key={slide.src}
              className="hero__image"
              src={slide.src}
              style={{ backgroundColor: "transparent" }}
              alt={slide.alt}
              initial={false}
              animate={{ opacity: activeSlide === index ? 1 : 0, x: activeSlide === index ? 0 : index < activeSlide ? -24 : 24, scale: activeSlide === index ? 1 : 1.02 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden={activeSlide !== index}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
