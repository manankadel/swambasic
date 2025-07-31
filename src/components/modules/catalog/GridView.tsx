// src/components/modules/catalog/GridView.tsx

"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopifyProductDetailed } from '@/types/shopify';
import { InteractiveProductCard } from '@/components/modules/products/InteractiveProductCard';

const ChevronDown = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg> );

const sortOptions = [
    { key: 'FEATURED', label: 'Sort: Featured' },
    { key: 'PRICE_LOW_TO_HIGH', label: 'Price: Low to High' },
    { key: 'PRICE_HIGH_TO_LOW', label: 'Price: High to Low' },
];

interface GridViewProps {
  products: ShopifyProductDetailed[];
}

export const GridView = ({ products }: GridViewProps) => {
  const [sortKey, setSortKey] = useState(sortOptions[0].key);
  
  // --- FIX: Logic for the custom dropdown is now embedded here ---
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // --- END OF DROPDOWN LOGIC ---

  const sortedProducts = useMemo(() => {
    const newArray = [...products];
    switch (sortKey) {
      case 'PRICE_LOW_TO_HIGH':
        return newArray.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
      case 'PRICE_HIGH_TO_LOW':
        return newArray.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
      default:
        return products;
    }
  }, [products, sortKey]);

  const selectedOption = sortOptions.find(opt => opt.key === sortKey) || sortOptions[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-12 pt-32 md:pt-40">
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <h1 className="font-display text-4xl font-bold">The Collection</h1>
        
        {/* --- FIX: The custom dropdown UI is now directly here --- */}
        <div className="relative w-full md:w-48" ref={dropdownRef}>
          <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm font-sans focus:outline-none transition-colors hover:border-white/30">
            <span>{selectedOption.label}</span>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}> <ChevronDown /> </motion.div>
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full right-0 mt-2 w-full bg-black/50 border border-white/10 rounded-lg backdrop-blur-xl shadow-lg z-30 overflow-hidden">
                {sortOptions.map((option) => (
                  <button key={option.key} onClick={() => { setSortKey(option.key); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-sans hover:bg-white/10 transition-colors">
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* --- END OF DROPDOWN UI --- */}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {sortedProducts.map((product) => (
          <InteractiveProductCard key={product.id} product={product} />
        ))}
      </div>
    </motion.div>
  );
};