"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduceMotion) return;
    const interval = window.setInterval(() => setActive((current) => (current + 1) % testimonials.length), 5500);
    return () => window.clearInterval(interval);
  }, [reduceMotion]);
  return (
    <section className="testimonials section-shell">
      <SectionHeading eyebrow="Trusted by creators | Avis clients" title="Ceux qui créent avec nous." description="Particuliers, marques émergentes, associations et grandes entreprises confient leur image à notre atelier." />
      <div className="testimonials__viewport">
      <motion.div className="testimonials__track" aria-label="Avis clients" animate={{ x: `${active * -100}%` }} transition={{ type: "spring", stiffness: 105, damping: 19 }}>
        {testimonials.map((item, index) => (
          <motion.figure
            key={item.name}
            className="testimonial"
            initial={{ opacity: 0, x: 26 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            animate={reduceMotion ? {} : { y: [0, index === 1 ? -4 : 3, 0] }}
            whileHover={{ y: -7 }}
          >
            <div className="testimonial__stars" aria-label="Note de 5 sur 5">★★★★★</div>
            <blockquote>« {item.quote} »</blockquote>
            <figcaption><strong>{item.name}</strong><span>{item.role}</span><small>{item.project}</small></figcaption>
          </motion.figure>
        ))}
      </motion.div></div>
      <div className="testimonial-dots" aria-label="Sélectionner un avis">{testimonials.map((item, index) => <button key={item.name} type="button" aria-label={`Afficher l'avis de ${item.name}`} className={index === active ? "is-active" : ""} onClick={() => setActive(index)} />)}</div>
    </section>
  );
}
