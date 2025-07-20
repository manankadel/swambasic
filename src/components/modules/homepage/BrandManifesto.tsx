"use client";
import { motion } from 'framer-motion';

const text = "We are not for everyone. SWAMBASIC is a rejection of the ordinary, a uniform for the discerning individual who moves between worlds. This is luxury defined not by a price tag, but by a perspective.";

export const BrandManifesto = () => {
  return (
    <section className="py-12 px-6 md:px-12 bg-black flex justify-center">
      <motion.div 
        className="max-w-3xl text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ staggerChildren: 0.05 }}
      >
        <h2 className="font-display font-bold text-5xl md:text-6xl mb-8">
          <motion.span variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}>
            The Philosophy
          </motion.span>
        </h2>
        <p className="font-sans text-lg md:text-xl leading-relaxed text-white/70">
          {text.split(' ').map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              transition={{ duration: 0.5 }}
            >
              {word} 
            </motion.span>
          ))}
        </p>
      </motion.div>
    </section>
  );
};