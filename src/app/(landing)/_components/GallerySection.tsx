"use client";

import { ParallaxScrollSecond } from "@/components/ui/parallax-scroll";
import { motion } from "framer-motion";
import { assets } from "@/config/assets";

export function GallerySection() {

  return (
    <section className="relative py-20 bg-background overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Notre Galerie
          </h2>
          <p className="text-lg text-muted-foreground">
            Découvrez notre collection de véhicules d&#39;exception et les services 
            que nous offrons. Chaque véhicule est soigneusement sélectionné et préparé 
            pour vous offrir la meilleure expérience.
          </p>
        </motion.div>

        {/* Parallax Scroll Gallery */}
        <ParallaxScrollSecond images={[...assets.galleryImages]} />
      </div>
    </section>
  );
}
