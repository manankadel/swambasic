"use client";

import { motion } from "framer-motion";
import Image from 'next/image';

// Variants for the main container to orchestrate the sequence
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 1.2, 
      staggerChildren: 1.2,
    },
  },
};

// Variants for the logo container
const logoVariants = {
  hidden: {
    width: 0,
    opacity: 0,
    scale: 0,
  },
  visible: {
    width: 'auto',
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: "easeInOut", // THIS IS THE FIX. Replaced the invalid curve.
    },
  },
};

// Variants for the spinning logo image itself
const imageVariants = {
    hidden: { rotate: -180 },
    visible: {
        rotate: 0,
        transition: {
            duration: 1,
            delay: 1.2,
        }
    }
}

export const GatewayAnimation = () => {
  const text = "SWAMBASIC";

  return (
    <motion.div
      layout // Smoothly animates layout changes
      className="flex items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Renders "SWAM" */}
      <span className="font-heading text-4xl md:text-6xl font-extrabold tracking-widest uppercase overflow-hidden">
        {text.slice(0, 4).split('').map((letter, index) => (
          <motion.span
            key={index}
            className="inline-block"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {letter}
          </motion.span>
        ))}
      </span>
      
      {/* The Logo Container that grows to push the text apart */}
      <motion.div
        className="flex items-center justify-center mx-3 md:mx-5"
        variants={logoVariants}
      >
        <motion.div variants={imageVariants}>
            <Image 
                src="/logo-rotating.GIF" 
                alt="SWAMBASIC Logo" 
                width={250} 
                height={250}
                unoptimized={true}
            />
        </motion.div>
      </motion.div>

      {/* Renders "BASIC" */}
      <span className="font-heading text-4xl md:text-6xl font-extrabold tracking-widest uppercase overflow-hidden">
        {text.slice(4).split('').map((letter, index) => (
          <motion.span
            key={index}
            className="inline-block"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: (4 + index) * 0.1 }} // Delay continues from "SWAM"
          >
            {letter}
          </motion.span>
        ))}
      </span>
    </motion.div>
  );
};