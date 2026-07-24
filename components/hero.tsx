"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GarmentSilhouette } from "@/components/garment-silhouette";

export function Hero() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="hero" id="top">
      <div className="hero__content">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="eyebrow">Atelier de personnalisation textile — Abidjan</motion.p>
        <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          PERSONNALISEZ<br /><em>VOTRE IDENTITÉ</em>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }} className="hero__lede">T-shirts, hoodies, polos et accessoires créés à votre image.</motion.p>
        <motion.a whileHover={reduceMotion ? {} : { scale: 1.03 }} whileTap={{ scale: 0.98 }} href="#studio" className="button button--light hero__button">Personnaliser <span aria-hidden>↗</span></motion.a>
      </div>
      <motion.div className="hero__product" animate={reduceMotion ? {} : { y: [0, -10, 0], rotate: [0, 1.5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <div className="hero__orb" />
        <GarmentSilhouette product="tshirt" color="#d50f23" label="T-shirt personnalisé Deep Digital" />
        <p className="hero__caption">Atelier ouvert<br />en continu <span>↓</span></p>
      </motion.div>
      <p className="hero__side-note">No cheap fabrics<br />No basic prints</p>
    </section>
  );
}
