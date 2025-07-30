// src/components/modules/catalog/Viewfinder.tsx

"use client";

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ShopifyProduct } from '@/types/shopify';
import { ProductMonolith } from './ProductMonolith';

interface ViewfinderProps {
  products: ShopifyProduct[];
  onFocusChange: (intensity: number) => void;
}

const ITEM_WIDTH = 320;
const GAP_WIDTH = 96;
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + GAP_WIDTH;

export const Viewfinder = ({ products, onFocusChange }: ViewfinderProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollX } = useScroll({ container: trackRef });
  const [viewportCenter, setViewportCenter] = useState(0);

  useEffect(() => {
    const updateCenter = () => setViewportCenter(window.innerWidth / 2);
    updateCenter();
    window.addEventListener('resize', updateCenter);
    return () => window.removeEventListener('resize', updateCenter);
  }, []);

  useMotionValueEvent(scrollX, "change", (latestScrollX) => {
    const centerIndex = Math.round(latestScrollX / TOTAL_ITEM_WIDTH);
    const centerOfClosestItem = centerIndex * TOTAL_ITEM_WIDTH + (ITEM_WIDTH / 2);
    const currentCenterOfViewport = latestScrollX + viewportCenter;
    
    const distance = Math.abs(currentCenterOfViewport - centerOfClosestItem);
    const intensity = Math.min(1, distance / (TOTAL_ITEM_WIDTH / 2));
    onFocusChange(intensity);
  });

  return (
    <motion.div
      ref={trackRef}
      className="absolute inset-0 flex overflow-x-scroll snap-x snap-mandatory hide-scrollbar cursor-grab active:cursor-grabbing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div 
        className="flex items-center gap-24 h-full"
        style={{ 
          paddingLeft: `calc(50vw - ${ITEM_WIDTH / 2}px)`, 
          paddingRight: `calc(50vw - ${ITEM_WIDTH / 2}px)` 
        }}
      >
        {products.map((product, i) => (
          <ProductMonolith
            key={product.id}
            product={product}
            index={i}
            scrollX={scrollX}
          />
        ))}
      </div>
    </motion.div>
  );
};

// A helper style to hide the scrollbar across browsers
const scrollbarHideStyle = `
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = scrollbarHideStyle;
  document.head.appendChild(styleSheet);
}