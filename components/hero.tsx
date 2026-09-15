"use client";

import { motion, useReducedMotion } from "framer-motion";

export function Hero() {
  const reduceMotion = useReducedMotion();

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
        <img
          className="hero__image"
          src="/112-cutout-trimmed.png"
          alt="Collection Deep Digital portée par plusieurs modèles"
        />
        <p className="hero__caption">Votre image<br />sur textile <span>↓</span></p>
      </motion.div>
      <div className="hero__meta" aria-label="Informations de collection">
        <span>01 / 03</span>
        <span>Pièces uniques</span>
        <span>Livraison à Abidjan</span>
      </div>
      <div className="hero__ticker" aria-hidden="true">Personnalisez votre identité <span>✦</span> Personnalisez votre identité <span>✦</span> Personnalisez votre identité</div>
    </section>
  );
}
