"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shirt, Palette } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center hero-grid overflow-hidden">

      {/* Glow Background */}

      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#D50F23]/20 blur-[180px] -top-40 -right-40" />

      <div className="container relative z-10 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}

        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 mb-8 glass">
            <Sparkles size={16} color="#D50F23" />

            <span className="text-sm text-white/80">
              Studio créatif Deep Digital
            </span>
          </div>

          <h1 className="leading-none mb-8">
            PERSONNALISEZ
            <br />
            <span className="gradient">
              VOTRE IDENTITÉ
            </span>
          </h1>

          <p className="max-w-xl text-lg mb-10">
            Créez des vêtements premium à votre image.
            T-shirts, Hoodies, Polos, Tote Bags,
            Casquettes et bien plus avec impression
            DTF, Sérigraphie ou Broderie.
          </p>

          <div className="flex flex-wrap gap-5">

            <a
              href="#studio"
              className="btn btn-primary"
            >
              Commencer

              <ArrowRight
                size={18}
                className="ml-2"
              />
            </a>

            <a
              href="#modeles"
              className="btn btn-outline"
            >
              Voir les modèles
            </a>

          </div>

          {/* Stats */}

          <div className="grid grid-cols-3 gap-8 mt-16">

            <div>

              <h2 className="text-4xl font-bold">
                500+
              </h2>

              <p>Clients satisfaits</p>

            </div>

            <div>

              <h2 className="text-4xl font-bold">
                1000+
              </h2>

              <p>Créations réalisées</p>

            </div>

            <div>

              <h2 className="text-4xl font-bold">
                24H
              </h2>

              <p>Réponse moyenne</p>

            </div>

          </div>

        </motion.div>

        {/* RIGHT */}

        <motion.div
          initial={{ opacity: 0, scale: .9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative flex justify-center"
        >

          <motion.div
            animate={{
              y: [0, -20, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 5
            }}
            className="card p-10 max-w-md w-full"
          >

            <div className="aspect-square rounded-3xl bg-[#111] flex items-center justify-center border border-white/10">

              <Shirt
                size={160}
                strokeWidth={1.2}
                color="#ffffff"
              />

            </div>

            <div className="mt-8 space-y-4">

              <div className="flex items-center justify-between">

                <span>T-shirt Premium</span>

                <span className="text-[#D50F23]">
                  16 000 FCFA
                </span>

              </div>

              <div className="w-full h-2 rounded-full bg-white/10">

                <div className="w-2/3 h-full bg-[#D50F23] rounded-full" />

              </div>

              <div className="flex items-center gap-2 text-white/70">

                <Palette size={16} />

                Studio prêt à personnaliser

              </div>

            </div>

          </motion.div>

        </motion.div>

      </div>

    </section>
  );
}
