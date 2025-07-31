// src/components/modules/homepage/HeroSection.tsx

"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export const HeroSection = () => {
  return (
    <section className="relative h-screen w-screen flex items-center justify-center">
     <video
  src="https://cdn.jsdelivr.net/gh/manankadel/swambasic/public/hero-video.mp4"
  autoPlay
  loop
  muted
  playsInline
  className="absolute top-0 left-0 w-full h-full object-cover -z-10"
/>

      <div className="absolute top-0 left-0 w-full h-full bg-black/50 -z-10" />
      <motion.div 
        className="text-center text-white z-10 flex flex-col items-center" // --- FIX: Added flexbox for alignment
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h1 className="font-display font-black text-5xl md:text-8xl uppercase">
          First Drop Is Live
        </h1>
        {/* --- FIX: max-w-lg ensures this text wraps correctly relative to the heading --- */}
        <p className="font-sans text-center mt-4 max-w-lg">
          Explore the inaugural collection. Limited quantities available.
        </p>
        <Link href="/catalog" passHref>
          <motion.button 
            className="mt-8 px-8 py-4 bg-white/90 text-black font-sans font-bold uppercase tracking-widest rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Shop Now
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
};