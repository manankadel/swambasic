"use client";

import { HeroSection } from "@/components/modules/homepage/HeroSection";
import { FeaturedProducts } from "@/components/modules/homepage/FeaturedProducts";
import { motion } from "framer-motion";
import { BrandManifesto } from "@/components/modules/homepage/BrandManifesto"; // <-- IMPORT THE NEW COMPONENT

const HomePage = () => {
  return (
    <main>
        <HeroSection />

      {/* This ensures the content below fades in as you scroll to it */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <FeaturedProducts />
      </motion.div>
      <BrandManifesto />
      
      {/* We will design and build out the full homepage content here */}
    </main>
  );
};

export default HomePage;