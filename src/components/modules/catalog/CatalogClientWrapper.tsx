// src/components/modules/catalog/CatalogClientWrapper.tsx

"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopifyProductDetailed } from '@/types/shopify';
import { CatalogControls } from './CatalogControls';
import { ImmersiveView } from './ImmersiveView';
import { GridView } from './GridView';
import { LiquidGrainBackground } from '@/components/core/LiquidGrainBackground';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const CollectionSplash = ({ onReveal, isClosing = false }: { onReveal: () => void; isClosing?: boolean }) => {
  const BAR_HEIGHT = 176;
  const isDesktop = useMediaQuery('(min-width: 640px)');

  const textContent = (
    <div className="text-center px-4">
      <div className="transform -translate-y-4 sm:-translate-y-10">
        <p className="font-sans uppercase tracking-widest text-lg sm:text-xl text-white/50 mb-6 sm:mb-8">Collection Vol. 1</p>
        <h1 className="font-display font-black text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] leading-none">
          Sins  of
        </h1>
      </div>
      <div className="transform translate-y-4 sm:translate-y-10">
        <h1 className="font-display font-black text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] leading-none">
          Saints
        </h1>
        <p className="font-sans uppercase tracking-widest text-lg sm:text-xl text-white/50 mt-8 sm:mt-12">
          Click to Explore The Collection.
        </p>
      </div>
    </div>
  );

  const clipPathOpen = 'polygon(0 0, 100% 0, 100% calc(50% - 88px), 0 calc(50% - 88px), 0 calc(50% + 88px), 100% calc(50% + 88px), 100% 100%, 0 100%)';
  const clipPathClosed = 'polygon(0 0, 100% 0, 100% 0, 0 0, 0 100%, 100% 100%, 100% 100%, 0 100%)';

  return (
    <motion.div
      key="splash"
      initial={isClosing ? {} : undefined}
      animate={isClosing ? {} : undefined}
      exit={{}}
      className="fixed inset-0 z-20 cursor-pointer overflow-hidden" // Changed to fixed positioning
      onClick={!isClosing ? onReveal : undefined}
    >
      {/* Top panel */}
      <motion.div 
        initial={isClosing ? { y: '-100%' } : undefined} 
        animate={isClosing ? { y: 0 } : undefined} 
        exit={!isClosing ? { y: '-100%' } : undefined} 
        transition={{ 
          duration: isDesktop ? 1.2 : 0.6, // Faster on mobile
          ease: [0.76, 0, 0.24, 1] 
        }} 
        className="absolute top-0 left-0 w-full bg-black border-b border-white/20 will-change-transform"
        style={{ 
          height: `calc(50% - ${BAR_HEIGHT / 2}px)`,
          transform: 'translateZ(0)'
        }} 
      />
      
      {/* Bottom panel */}
      <motion.div 
        initial={isClosing ? { y: '100%' } : undefined} 
        animate={isClosing ? { y: 0 } : undefined} 
        exit={!isClosing ? { y: '100%' } : undefined} 
        transition={{ 
          duration: isDesktop ? 1.2 : 0.6, // Faster on mobile
          ease: [0.76, 0, 0.24, 1] 
        }} 
        className="absolute bottom-0 left-0 w-full bg-black border-t border-white/20 will-change-transform"
        style={{ 
          height: `calc(50% - ${BAR_HEIGHT / 2}px)`,
          transform: 'translateZ(0)'
        }} 
      />
      
      {/* Text content with clipping */}
      <motion.div 
        className="absolute inset-0 grid place-items-center text-black overflow-hidden"
        style={{ 
          clipPath: isDesktop ? clipPathOpen : 'none',
          transform: 'translateZ(0)'
        }} 
        initial={isClosing && isDesktop ? { clipPath: clipPathClosed } : undefined}
        animate={isClosing && isDesktop ? { clipPath: clipPathOpen } : undefined}
        exit={!isClosing ? { 
          clipPath: isDesktop ? clipPathClosed : 'none',
          opacity: 0 
        } : undefined}
        transition={{ 
          duration: isDesktop ? 1.2 : 0.6, // Faster on mobile
          ease: [0.76, 0, 0.24, 1] 
        }}
      >
        {textContent}
      </motion.div>
      
      <motion.div 
        className="absolute inset-0 grid place-items-center text-white overflow-hidden"
        style={{ 
          mixBlendMode: 'difference', 
          clipPath: isDesktop ? clipPathOpen : 'none',
          transform: 'translateZ(0)'
        }}
        initial={isClosing && isDesktop ? { clipPath: clipPathClosed } : undefined}
        animate={isClosing && isDesktop ? { clipPath: clipPathOpen } : undefined}
        exit={!isClosing ? { 
          clipPath: isDesktop ? clipPathClosed : 'none',
          opacity: 0 
        } : undefined}
        transition={{ 
          duration: isDesktop ? 1.2 : 0.6, // Faster on mobile
          ease: [0.76, 0, 0.24, 1] 
        }}
      >
        {textContent}
      </motion.div>
    </motion.div>
  );
};

type ViewMode = 'immersive' | 'grid';
interface CatalogClientWrapperProps {
  products: ShopifyProductDetailed[];
}

export const CatalogClientWrapper = ({ products }: CatalogClientWrapperProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('immersive');
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Manage scroll behavior during different states
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    if (!isRevealed || isClosing) {
      // During splash/closing: hide scroll completely
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      html.classList.remove('catalog-revealed');
    } else {
      // Content revealed: enable scroll but hide scrollbar
      html.style.overflow = '';
      body.style.overflow = '';
      html.classList.add('catalog-revealed');
    }

    return () => {
      // Cleanup
      html.style.overflow = '';
      body.style.overflow = '';
      html.classList.remove('catalog-revealed');
    };
  }, [isRevealed, isClosing]);

  const handleGoBack = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsRevealed(false);
      setIsClosing(false);
    }, 1200);
  };

  return (
    <div className="relative"> {/* Remove min-h-screen constraint that was hiding footer */}
      {/* Background - always present */}
      <LiquidGrainBackground />
      
      {/* Splash screen overlay */}
      <AnimatePresence>
        {(!isRevealed || isClosing) && (
          <CollectionSplash onReveal={() => setIsRevealed(true)} isClosing={isClosing} />
        )}
      </AnimatePresence>
      
      {/* Main content - scrollable when revealed */}
      <AnimatePresence>
        {isRevealed && !isClosing && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.4 } }} // Faster fade in
            exit={{ opacity: 0, transition: { duration: 0.3 } }} // Faster fade out
            className="relative z-10" // Remove min-h-screen to let content flow naturally
          >
            {viewMode === 'immersive' && (
              <ImmersiveView products={products} focusedIndex={focusedIndex} setFocusedIndex={setFocusedIndex} />
            )}
            {viewMode === 'grid' && <GridView products={products} />}
            <CatalogControls viewMode={viewMode} setViewMode={setViewMode} goBack={handleGoBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};