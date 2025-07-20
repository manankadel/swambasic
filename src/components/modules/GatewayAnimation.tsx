"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState, useEffect } from 'react';

// ==================================================================
// DESKTOP LAYOUT AND VARIANTS - UNCHANGED
// This code is correct and is NOT being modified.
// ==================================================================
const desktopContainerVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 1.2, staggerChildren: 1.2 } },
};
const desktopLogoContainerVariants = {
  hidden: { width: 0, opacity: 0, scale: 0 },
  visible: {
    width: 'auto', opacity: 1, scale: 1,
    transition: { duration: 1.2, ease: "easeInOut" },
  },
};
const desktopImageVariants = {
  hidden: { rotate: -180 },
  visible: { rotate: 0, transition: { duration: 1, delay: 1.2 } }
};

const DesktopLayout = () => {
    const text = "SWAMBASIC";
    return (
        <motion.div layout className="flex items-center justify-center" variants={desktopContainerVariants} initial="hidden" animate="visible">
            <span className="font-heading text-4xl md:text-6xl font-extrabold tracking-widest uppercase overflow-hidden text-shadow-glow">{text.slice(0, 4).split('').map((letter, index) => (<motion.span key={index} className="inline-block" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>{letter}</motion.span>))}</span>
            <motion.div className="flex items-center justify-center mx-3 md:mx-4" variants={desktopLogoContainerVariants}>
                <motion.div variants={desktopImageVariants} className="relative w-36 h-36 md:w-56 md:h-56"><Image src="/logo-rotating.GIF" alt="SWAMBASIC Logo" fill className="object-contain" unoptimized={true} /></motion.div>
            </motion.div>
            <span className="font-heading text-4xl md:text-6xl font-extrabold tracking-widest uppercase overflow-hidden text-shadow-glow">{text.slice(4).split('').map((letter, index) => (<motion.span key={index} className="inline-block" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: (4 + index) * 0.1 }}>{letter}</motion.span>))}</span>
        </motion.div>
    );
};


// ==================================================================
// MOBILE LAYOUT - REBUILT TO USE THE CORRECT SPINNING ANIMATION
// ==================================================================
const MobileLayout = () => {
    const text = "SWAMBASIC";
    return (
        // The parent container orchestrates the animation sequence.
        <motion.div 
            className="flex flex-col items-center justify-center gap-0"
            
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.6, // Stagger the logo and text animations
                    }
                }
            }}
        >
            {/* 1. The Logo's main container. It will scale into view. */}
            <motion.div
                variants={{
                    hidden: { opacity: 0, scale: 0.5 },
                    visible: { opacity: 1, scale: 1, transition: { duration: 1.0, ease: "easeInOut" } }
                }}
            >
                {/* 
                  THE FIX: This inner div uses the SAME spinning animation as the desktop version.
                  This is the part that was missing. It makes the logo rotate into place.
                */}
                <motion.div
                    className="relative w-60 h-60"
                    variants={{
                        hidden: { rotate: -180 },
                        visible: { rotate: 0, transition: { duration: 1.2, ease: "easeInOut" } }
                    }}
                >
                    <Image src="/logo-rotating.GIF" alt="SWAMBASIC Logo" fill className="object-contain" unoptimized={true}/>
                </motion.div>
            </motion.div>

            {/* 2. The Text container. It animates up from the bottom. */}
            <div className="overflow-hidden">
                <motion.span 
                    className="font-heading text-4xl font-extrabold tracking-widest uppercase inline-block text-shadow-glow"
                    variants={{
                        hidden: { y: "100%", opacity: 0 },
                        visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } }
                    }}
                >
                    {text}
                </motion.span>
            </div>
        </motion.div>
    );
};


export const GatewayAnimation = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // This placeholder prevents hydration errors and layout shifts.
  if (!hasMounted) {
    return <div className="h-[184px] md:h-[224px]" />;
  }
  
  // This safely renders the correct layout based on the actual screen size.
  return isMobile ? <MobileLayout key="mobile" /> : <DesktopLayout key="desktop" />;
};