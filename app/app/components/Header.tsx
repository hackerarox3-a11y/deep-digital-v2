"use client";

import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const links = [
  {
    title: "Modèles",
    href: "#modeles",
  },
  {
    title: "Studio",
    href: "#studio",
  },
  {
    title: "Contact",
    href: "#contact",
  },
];

export default function Header() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handle);

    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: .8 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/70 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-20">

        {/* Logo */}

        <Link href="/" className="group">

          <motion.h1
            whileHover={{ scale: 1.04 }}
            className="text-2xl font-black tracking-tight"
          >
            DEEP
            <span className="text-[#D50F23]"> DIGITAL</span>
          </motion.h1>

        </Link>

        {/* Desktop */}

        <nav className="hidden lg:flex items-center gap-10">

          {links.map((link) => (

            <a
              key={link.title}
              href={link.href}
              className="relative text-sm uppercase tracking-wider text-white/80 hover:text-white transition"
            >
              {link.title}

              <span className="absolute left-0 -bottom-2 w-0 h-[2px] bg-[#D50F23] transition-all duration-300 hover:w-full"></span>

            </a>

          ))}

        </nav>

        {/* CTA */}

        <Link
          href="#studio"
          className="hidden lg:flex btn btn-primary gap-2"
        >
          Personnaliser

          <ArrowRight size={18} />

        </Link>

        {/* Mobile */}

        <button
          onClick={() => setMenu(!menu)}
          className="lg:hidden"
        >
          {menu ? <X /> : <Menu />}
        </button>

      </div>

      {/* Mobile Menu */}

      <AnimatePresence>

        {menu && (

          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="lg:hidden bg-[#090909] border-t border-white/10"
          >
            <div className="container py-8 flex flex-col gap-6">

              {links.map((link) => (

                <a
                  key={link.title}
                  href={link.href}
                  onClick={() => setMenu(false)}
                  className="text-lg"
                >
                  {link.title}
                </a>

              ))}

              <a
                href="#studio"
                className="btn btn-primary mt-2"
              >
                Personnaliser
              </a>

            </div>
          </motion.div>

        )}

      </AnimatePresence>

    </motion.header>
  );
}
