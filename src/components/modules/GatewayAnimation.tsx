"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState, useEffect, useMemo, useCallback } from 'react';

// ==================================================================
// OPTIMIZED CONSTANTS AND VARIANTS
// ==================================================================

// Pre-computed variants for better performance
const DESKTOP_VARIANTS = {
  container: {
    hidden: {},
    visible: { transition: { delayChildren: 1.2, staggerChildren: 1.2 } },
  },
  logoContainer: {
    hidden: { width: 0, opacity: 0, scale: 0 },
    visible: {
      width: 'auto', 
      opacity: 1, 
      scale: 1,
      transition: { duration: 1.2, ease: "easeInOut" },
    },
  },
  image: {
    hidden: { rotate: -180 },
    visible: { rotate: 0, transition: { duration: 1, delay: 1.2 } }
  }
};

const MOBILE_VARIANTS = {
  container: {
    visible: {
      transition: {
        staggerChildren: 0.6,
      }
    }
  },
  logoContainer: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1.0, ease: "easeInOut", delay: 0.4 } }
  },
  logoRotation: {
    hidden: { rotate: -180 },
    visible: { rotate: 0, transition: { duration: 1.2, ease: "easeInOut" } }
  },
  text: {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } }
  }
};

// Pre-computed text split for desktop
const TEXT = "SWAMBASIC";
const TEXT_FIRST_PART = TEXT.slice(0, 4).split('');
const TEXT_SECOND_PART = TEXT.slice(4).split('');

// ==================================================================
// OPTIMIZED DESKTOP LAYOUT
// ==================================================================
const DesktopLayout = () => {
  // Memoized letter animations to prevent re-renders
  const firstPartLetters = useMemo(() => 
    TEXT_FIRST_PART.map((letter, index) => (
      <motion.span 
        key={`first-${index}`}
        className="inline-block" 
        initial={{ y: "100%" }} 
        animate={{ y: 0 }} 
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        {letter}
      </motion.span>
    )), []
  );

  const secondPartLetters = useMemo(() => 
    TEXT_SECOND_PART.map((letter, index) => (
      <motion.span 
        key={`second-${index}`}
        className="inline-block" 
        initial={{ y: "100%" }} 
        animate={{ y: 0 }} 
        transition={{ duration: 0.5, delay: (4 + index) * 0.1 }}
      >
        {letter}
      </motion.span>
    )), []
  );

  return (
    <motion.div 
      layout
      className="flex items-center justify-center" 
      variants={DESKTOP_VARIANTS.container} 
      initial="hidden" 
      animate="visible"
    >
      <span className="font-heading text-4xl md:text-6xl font-extrabold tracking-widest uppercase overflow-hidden text-shadow-glow">
        {firstPartLetters}
      </span>
      <motion.div 
        className="flex items-center justify-center mx-3 md:mx-4" 
        variants={DESKTOP_VARIANTS.logoContainer}
      >
        <motion.div 
          variants={DESKTOP_VARIANTS.image} 
          className="relative w-36 h-36 md:w-56 md:h-56"
        >
          <Image 
            src="https://cdn.jsdelivr.net/gh/manankadel/swambasic@main/public/logo-rotating.GIF"

            alt="SWAMBASIC Logo" 
            fill 
            className="object-contain" 
            unoptimized={true}
            priority={true}
            loading="eager"
            sizes="(max-width: 768px) 144px, 224px"
          />
        </motion.div>
      </motion.div>
      <span className="font-heading text-4xl md:text-6xl font-extrabold tracking-widest uppercase overflow-hidden text-shadow-glow">
        {secondPartLetters}
      </span>
    </motion.div>
  );
};

// ==================================================================
// OPTIMIZED MOBILE LAYOUT
// ==================================================================
const MobileLayout = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center gap-0"
      initial="hidden"
      animate="visible"
      variants={MOBILE_VARIANTS.container}
    >
      <motion.div variants={MOBILE_VARIANTS.logoContainer}>
        <motion.div
          className="relative w-60 h-60"
          variants={MOBILE_VARIANTS.logoRotation}
        >
          <Image 
            src="https://cdn.jsdelivr.net/gh/manankadel/swambasic@main/public/logo-rotating.GIF"
 alt="SWAMBASIC Logo" 
            fill 
            className="object-contain" 
            unoptimized={true}
            priority={true}
            loading="eager"
            sizes="240px"
          />
        </motion.div>
      </motion.div>

      <div className="overflow-hidden">
        <motion.span 
          className="font-heading text-4xl font-extrabold tracking-widest uppercase inline-block text-shadow-glow"
          variants={MOBILE_VARIANTS.text}
        >
          {TEXT}
        </motion.span>
      </div>
    </motion.div>
  );
};

// ==================================================================
// OPTIMIZED MAIN COMPONENT
// ==================================================================
export const GatewayAnimation = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [hasMounted, setHasMounted] = useState(false);

  // Optimized mount effect
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setHasMounted(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  // Memoized layout component selection
  const LayoutComponent = useMemo(() => {
    if (!hasMounted) return null;
    return isMobile ? MobileLayout : DesktopLayout;
  }, [isMobile, hasMounted]);

  // Optimized placeholder with exact dimensions
  if (!hasMounted) {
    return (
      <div 
        className="h-[184px] md:h-[224px]" 
        style={{ 
          contain: 'layout style paint',
          willChange: 'auto'
        }} 
      />
    );
  }
  
  // Render with performance optimizations
  return (
    <div 
      style={{ 
        contain: 'layout style paint',
        willChange: 'transform, opacity'
      }}
    >
      {LayoutComponent && <LayoutComponent key={isMobile ? "mobile" : "desktop"} />}
    </div>
  );
};