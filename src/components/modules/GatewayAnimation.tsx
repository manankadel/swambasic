"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState, useEffect } from 'react';

// ==================================================================
// DESKTOP LAYOUT AND VARIANTS - NO CHANGES HERE, THEY WORK FINE.
// ==================================================================
const desktopContainerVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 1.2, staggerChildren: 1.2 } },
};
const desktopLogoContainerVariants = {
  hidden: { width: 0, opacity: 0, scale: 0 },
  visible: { width: 'auto', opacity: 1, scale: 1, transition: { duration: 1.2, ease: "easeInOut" } },
};
const desktopImageVariants = {
  hidden: { rotate: -180 },
  visible: { rotate: 0, transition: { duration: 1, delay: 1.2 } }
};

const DesktopLayout = () => {
    const text = "SWAMBASIC";
    return (
        <motion.div layout className="flex items-center justify-center" variants={desktopContainerVariants} initial="hidden" animate="visible">
            <span className="font-heading text-4xl md:text-6xl font-extrabold tracking-widest uppercase overflow-hidden text-shadow-glow">{text.slice(0, 4).split('').map((l, i) => (<motion.span key={i} className="inline-block" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>{l}</motion.span>))}</span>
            <motion.div className="flex items-center justify-center mx-3 md:mx-4" variants={desktopLogoContainerVariants}>
                <motion.div variants={desktopImageVariants} className="relative w-36 h-36 md:w-56 md:h-56"><Image src="/logo-rotating.GIF" alt="SWAMBASIC Logo" fill className="object-contain" unoptimized={true} /></motion.div>
            </motion.div>
            <span className="font-heading text-4xl md:text-6xl font-extrabold tracking-widest uppercase overflow-hidden text-shadow-glow">{text.slice(4).split('').map((l, i) => (<motion.span key={i} className="inline-block" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: (4 + i) * 0.1 }}>{l}</motion.span>))}</span>
        </motion.div>
    );
};

// ==================================================================
// MOBILE ANIMATION - COMPLETELY REBUILT FOR SMOOTHNESS
// ==================================================================

// A single, simple variant for both items to follow.
// They will fade in and rise up smoothly.
const mobileItemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1.0, // A smooth, controlled duration
            ease: "easeInOut"
        }
    }
};

const MobileLayout = () => {
    const text = "SWAMBASIC";
    return (
        // The parent container now orchestrates the sequence cleanly.
        <motion.div 
            className="flex flex-col items-center justify-center gap-1"
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        delayChildren: 0.2,
                        staggerChildren: 0.4, // The delay between the logo and text animating in
                    }
                }
            }}
        >
            {/* The logo now uses the single, clean variant. No more conflicts. */}
            <motion.div variants={mobileItemVariant}>
                 <div className="relative w-60 h-60">
                    <Image src="/logo-rotating.GIF" alt="SWAMBASIC Logo" fill className="object-contain" unoptimized={true}/>
                </div>
            </motion.div>

            {/* The text ALSO uses the exact same clean variant. */}
            <motion.span 
                className="font-heading text-4xl font-extrabold tracking-widest uppercase overflow-hidden text-shadow-glow"
                variants={mobileItemVariant}
            >
                {text}
            </motion.span>
        </motion.div>
    );
};


export const GatewayAnimation = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // This placeholder prevents errors and layout shift.
  if (!hasMounted) {
    return <div className="h-[284px] md:h-[224px]" />;
  }
  
  return isMobile ? <MobileLayout key="mobile" /> : <DesktopLayout key="desktop" />;
};