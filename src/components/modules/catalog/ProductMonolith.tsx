// src/components/modules/catalog/ProductMonolith.tsx

"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { ShopifyProduct } from '@/types/shopify';

// Assuming GlitchCanvas is a placeholder for a visual effect. 
// A simple div will suffice for now to show/hide the effect.
const GlitchOverlay = () => (
    <div className="absolute inset-0 bg-black/50" />
);

interface ProductMonolithProps {
  product: ShopifyProduct;
  scrollX: MotionValue<number>;
  index: number;
}

const ITEM_WIDTH = 320; // w-80 from Tailwind
const GAP_WIDTH = 96; // gap-24 from Tailwind
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + GAP_WIDTH;

export const ProductMonolith = ({ product, scrollX, index }: ProductMonolithProps) => {
  const inputRange = [
    (index - 1) * TOTAL_ITEM_WIDTH,
    index * TOTAL_ITEM_WIDTH,
    (index + 1) * TOTAL_ITEM_WIDTH,
  ];

  const focus = useTransform(scrollX, inputRange, [-1, 0, 1]);
  const scale = useTransform(focus, [-1, 0, 1], [0.85, 1, 0.85]);
  const imageOpacity = useTransform(focus, [-0.5, 0, 0.5], [0.3, 1, 0.3]);
  const glitchOpacity = useTransform(focus, [-0.6, 0, 0.6], [1, 0, 1]);
  const pointerEvents = useTransform(focus, (v) => (Math.abs(v) < 0.3 ? 'auto' : 'none'));

  const titleChars = product.title.split('');

  return (
    <Link href={`/products/${product.handle}`} scroll={false}>
      <motion.div
        style={{ scale, pointerEvents }}
        className="relative w-80 h-[480px] rounded-md flex-shrink-0 flex items-center justify-center snap-center"
      >
        {/* Layer 1: The Product Image */}
        {product.featuredImage && (
          <motion.div style={{ opacity: imageOpacity }} className="w-full h-full">
            <Image
              src={product.featuredImage.url}
              alt={product.title}
              width={product.featuredImage.width}
              height={product.featuredImage.height}
              className="w-full h-full object-cover rounded-md"
              priority={index < 3}
            />
          </motion.div>
        )}
        
        {/* Layer 2: The Glitch Overlay */}
        <motion.div 
            className="absolute inset-0 w-full h-full overflow-hidden rounded-md"
            style={{ opacity: glitchOpacity }}
        >
            <GlitchOverlay />
        </motion.div>

        {/* Layer 3: The Deconstructing Title */}
        <h3 className="absolute bottom-8 font-display text-4xl font-bold text-white z-20 pointer-events-none">
          {titleChars.map((char, i) => {
            const y = useTransform(focus, [-1, 0, 1], [(i - titleChars.length/2) * 20, 0, (i - titleChars.length/2) * -20]);
            const rotate = useTransform(focus, [-1, 0, 1], [-20, 0, 20]);
            const charOpacity = useTransform(focus, [-0.6, 0, 0.6], [0, 1, 0]);
            return (
              <motion.span key={i} className="inline-block" style={{ y, rotate, opacity: charOpacity }}>
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            );
          })}
        </h3>
      </motion.div>
    </Link>
  );
};