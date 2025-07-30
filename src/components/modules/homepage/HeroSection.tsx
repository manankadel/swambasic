"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export const HeroSection = () => {
  return (
    <section className="relative h-screen w-screen flex items-center justify-center">
      {/* Video Background */}
      <video
        src="/hero-video.mp4"
        autoPlay
        loop
        muted
        playsInline // Important for mobile browsers
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      />
      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 -z-10" />

      {/* Centered Content */}
      <motion.div 
        className="text-center text-white z-10 "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h1 className="font-display font-black text-5xl md:text-8xl uppercase">
          First Drop Is Live
        </h1>
        <p className="font-sans text-center mt-4 max-w-lg">
          Explore the inaugural collection. Limited quantities available.
        </p>
        <Link href="/catalog" passHref>
          <motion.button 
            className="mt-8 px-8 py-4 bg-white/90 rounded-3xl text-black font-sans font-bold uppercase tracking-widest"
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