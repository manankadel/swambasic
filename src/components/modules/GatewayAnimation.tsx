"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState, useEffect } from 'react';

// ==================================================================
// DESKTOP LAYOUT - UNCHANGED
// This is the version you approved. It will not be modified.
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
// MOBILE LAYOUT - REBUILT FOR SMOOTHNESS
// This animation is now simple, clean, and performant.
// ==================================================================

// A single variant for the logo and text to follow.
const mobileItemVariant = {
    // Start hidden and slightly down
    hidden: { opacity: 0, y: 15 },
    // Animate to fully visible at its original position
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.9, // A smooth, premium duration
            ease: [0.43, 0.13, 0.23, 0.96] // A standard easing curve for this kind of reveal
        }
    }
};

const MobileLayout = () => {
    const text = "SWAMBASIC";
    return (
        // The parent container orchestrates the sequence.
        <motion.div 
            className="flex flex-col items-center justify-center gap-1"
            initial="hidden"
            animate="visible"
            variants={{
                // This tells the container to stagger the 'visible' animation of its children.
                visible: {
                    transition: {
                        staggerChildren: 0.4, // 0.4s delay between logo and text animating in.
                    }
                }
            }}
        >
            {/* The logo now uses the single, clean variant. */}
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
  
  // This safely renders the correct layout.
  return isMobile ? <MobileLayout key="mobile" /> : <DesktopLayout key="desktop" />;
};