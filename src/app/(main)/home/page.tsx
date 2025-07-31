// src/app/(main)/home/page.tsx

"use client";

import { HeroSection } from "@/components/modules/homepage/HeroSection";
import { FeaturedProducts } from "@/components/modules/homepage/FeaturedProducts";
import { motion } from "framer-motion";
import { BrandManifesto } from "@/components/modules/homepage/BrandManifesto";
import GlitchMarquee  from "@/components/modules/homepage/GlitchMarquee"; // <-- Import the new, correct component

const HomePage = () => {
  return (
    <main>
        <HeroSection />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <FeaturedProducts />
      </motion.div>
      
      <BrandManifesto />
      
      {/* --- THIS IS THE FIX: The new interactive art piece is here --- */}
      <GlitchMarquee />
      
    </main>
  );
};

export default HomePage;
