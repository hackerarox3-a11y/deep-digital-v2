"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { navigation } from "@/constants/site";
import { BrandMark } from "@/components/brand-mark";

export function SiteHeader() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => setIsScrolled(latest > 32));

  return (
    <motion.header className={`site-header ${isScrolled ? "site-header--scrolled" : ""}`}>
      <a href="#top" className="site-header__brand"><BrandMark /></a>
      <nav aria-label="Navigation principale" className="site-header__nav">
        {navigation.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
      </nav>
      <a href="#studio" className="button button--light site-header__cta">Personnaliser <span aria-hidden>↗</span></a>
    </motion.header>
  );
}
