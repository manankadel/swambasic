// src/components/modules/catalog/CatalogClientWrapper.tsx

"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopifyProductDetailed } from '@/types/shopify';
import { CatalogControls } from './CatalogControls';
import { ImmersiveView } from './ImmersiveView';
import { GridView } from './GridView';
import { LiquidGrainBackground } from '@/components/core/LiquidGrainBackground';

const CollectionSplash = ({ onReveal, isClosing = false }: { onReveal: () => void; isClosing?: boolean }) => {
  const BAR_HEIGHT = 176;

  // --- THIS IS THE FINAL FIX ---
  // The text is now split into two independent blocks: top and bottom.
  // Each block has its own transform class, so they can be moved separately.
  //
  // TO ADJUST THE TOP TEXT:
  // - Mobile: Edit `-translate-y-5` in the first block.
  // - Desktop: Edit `sm:-translate-y-10` in the first block.
  //
  // TO ADJUST THE BOTTOM TEXT:
  // - Mobile: Edit `translate-y-5` in the second block.
  // - Desktop: Edit `sm:translate-y-10` in the second block.
  //
  // They will NOT affect each other.
  const textContent = (
    <div className="text-center px-4">
      {/* --- TOP TEXT BLOCK --- */}
      <div className="transform -translate-y-20 sm:-translate-y-10">
        <p className="font-sans uppercase tracking-widest text-lg sm:text-xl text-white/50 mb-6 sm:mb-8">Collection Vol. 1</p>
        <h1 className="font-display font-black text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] leading-none">
          Sins &nbsp;of
        </h1>
      </div>

      {/* --- BOTTOM TEXT BLOCK --- */}
      <div className="transform translate-y-20 sm:translate-y-10">
        <h1 className="font-display font-black text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] leading-none">
          Saints
        </h1>
        
        <p className="font-sans uppercase tracking-widest text-lg sm:text-xl text-white/50 mt-8 sm:mt-12">
          Click to Explore The Collection.
        </p>
      </div>
    </div>
  );
  // --- END OF FIX ---

  return (
    <motion.div
      key="splash"
      initial={isClosing ? {} : undefined}
      animate={isClosing ? {} : undefined}
      exit={{}}
      className="absolute inset-0 z-20 cursor-pointer"
      onClick={!isClosing ? onReveal : undefined}
    >
      <motion.div initial={isClosing ? { y: '-100%' } : undefined} animate={isClosing ? { y: 0 } : undefined} exit={!isClosing ? { y: '-100%' } : undefined} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} className="absolute top-0 left-0 w-full bg-black border-b border-white/20" style={{ height: `calc(50% - ${BAR_HEIGHT / 2}px)` }} />
      <motion.div initial={isClosing ? { y: '100%' } : undefined} animate={isClosing ? { y: 0 } : undefined} exit={!isClosing ? { y: '100%' } : undefined} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} className="absolute bottom-0 left-0 w-full bg-black border-t border-white/20" style={{ height: `calc(50% - ${BAR_HEIGHT / 2}px)` }} />
      <motion.div className="absolute inset-0 grid place-items-center text-black" style={{ clipPath: isClosing ? 'polygon(0 0, 100% 0, 100% 0, 0 0, 0 100%, 100% 100%, 100% 100%, 0 100%)' : 'polygon(0 0, 100% 0, 100% calc(50% - 88px), 0 calc(50% - 88px), 0 calc(50% + 88px), 100% calc(50% + 88px), 100% 100%, 0 100%)' }} initial={isClosing ? { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0, 0 100%, 100% 100%, 100% 100%, 0 100%)' } : undefined} animate={isClosing ? { clipPath: 'polygon(0 0, 100% 0, 100% calc(50% - 88px), 0 calc(50% - 88px), 0 calc(50% + 88px), 100% calc(50% + 88px), 100% 100%, 0 100%)' } : undefined} exit={!isClosing ? { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0, 0 100%, 100% 100%, 100% 100%, 0 100%)' } : undefined} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}>{textContent}</motion.div>
      <motion.div className="absolute inset-0 grid place-items-center text-white" style={{ mixBlendMode: 'difference', clipPath: isClosing ? 'polygon(0 0, 100% 0, 100% 0, 0 0, 0 100%, 100% 100%, 100% 100%, 0 100%)' : 'polygon(0 0, 100% 0, 100% calc(50% - 88px), 0 calc(50% - 88px), 0 calc(50% + 88px), 100% calc(50% + 88px), 100% 100%, 0 100%)' }} initial={isClosing ? { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0, 0 100%, 100% 100%, 100% 100%, 0 100%)' } : undefined} animate={isClosing ? { clipPath: 'polygon(0 0, 100% 0, 100% calc(50% - 88px), 0 calc(50% - 88px), 0 calc(50% + 88px), 100% calc(50% + 88px), 100% 100%, 0 100%)' } : undefined} exit={!isClosing ? { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0, 0 100%, 100% 100%, 100% 100%, 0 100%)' } : undefined} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}>{textContent}</motion.div>
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

  const handleGoBack = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsRevealed(false);
      setIsClosing(false);
    }, 1200);
  };

  return (
    <>
      <LiquidGrainBackground />
      <AnimatePresence>
        {(!isRevealed || isClosing) && <CollectionSplash onReveal={() => setIsRevealed(true)} isClosing={isClosing} />}
      </AnimatePresence>
      <AnimatePresence>
        {isRevealed && !isClosing && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.8 } }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            {viewMode === 'immersive' && (
              <ImmersiveView products={products} focusedIndex={focusedIndex} setFocusedIndex={setFocusedIndex} />
            )}
            {viewMode === 'grid' && <GridView products={products} />}
            <CatalogControls viewMode={viewMode} setViewMode={setViewMode} goBack={handleGoBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};