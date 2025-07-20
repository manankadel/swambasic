"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState, useEffect } from 'react'; // NEW: Import hooks

// --- All variants and layout components remain the same as before ---

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
const mobileContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.5, delayChildren: 0.5 } },
};
const mobileLogoVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 1, ease: "easeInOut" } }
};

const DesktopLayout = () => {
    const text = "SWAMBASIC";
    return (
        <motion.div layout className="flex items-center justify-center" variants={desktopContainerVariants} initial="hidden" animate="visible">
            <span className="font-heading text-4xl md:text-6xl font-extrabold tracking-widest uppercase overflow-hidden text-shadow-glow">
                {text.slice(0, 4).split('').map((letter, index) => (
                    <motion.span key={index} className="inline-block" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                        {letter}
                    </motion.span>
                ))}
            </span>
            <motion.div className="flex items-center justify-center mx-3 md:mx-4" variants={desktopLogoContainerVariants}>
                <motion.div variants={desktopImageVariants} className="relative w-36 h-36 md:w-56 md:h-56">
                    <Image src="/logo-rotating.GIF" alt="SWAMBASIC Logo" fill className="object-contain" unoptimized={true} />
                </motion.div>
            </motion.div>
            <span className="font-heading text-4xl md:text-6xl font-extrabold tracking-widest uppercase overflow-hidden text-shadow-glow">
                {text.slice(4).split('').map((letter, index) => (
                    <motion.span key={index} className="inline-block" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: (4 + index) * 0.1 }}>
                        {letter}
                    </motion.span>
                ))}
            </span>
        </motion.div>
    );
};
const MobileLayout = () => {
    const text = "SWAMBASIC";
    return (
        <motion.div className="flex flex-col items-center justify-center gap-1" variants={mobileContainerVariants} initial="hidden" animate="visible">
            <motion.div variants={mobileLogoVariants}>
                 <div className="relative w-60 h-60">
                    <Image src="/logo-rotating.GIF" alt="SWAMBASIC Logo" fill className="object-contain" unoptimized={true}/>
                </div>
            </motion.div>
            <motion.span 
                className="font-heading text-4xl font-extrabold tracking-widest uppercase overflow-hidden text-shadow-glow"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
            >
                {text}
            </motion.span>
        </motion.div>
    );
};


export const GatewayAnimation = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  // ==================================================================
  // THE HYDRATION FIX IS HERE.
  // ==================================================================
  const [hasMounted, setHasMounted] = useState(false);

  // This effect runs only on the client, after the initial render.
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // On the server and during the initial client render, hasMounted is false,
  // so we render nothing. This guarantees the server and client HTML match.
  if (!hasMounted) {
    return null;
  }
  
  // After mounting, hasMounted becomes true, and we can safely render the
  // correct layout based on the now-available screen size.
  return isMobile ? <MobileLayout key="mobile" /> : <DesktopLayout key="desktop" />;
};