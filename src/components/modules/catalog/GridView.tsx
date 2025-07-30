// src/components/modules/catalog/GridView.tsx
"use client";
import { motion } from 'framer-motion';
import { ShopifyProductDetailed } from '@/types/shopify';
import { InteractiveProductCard } from '@/components/modules/products/InteractiveProductCard';

interface GridViewProps { products: ShopifyProductDetailed[]; }

export const GridView = ({ products }: GridViewProps) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-12 pt-32 md:pt-40">
      {/* --- THIS IS THE FIX: Filter and Sort UI --- */}
      <div className="max-w-7xl mx-auto mb-12 flex justify-between items-center">
        <h1 className="font-display text-3xl font-bold">The Collection</h1>
        <div className="flex gap-4">
          <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none">
            <option>Sort By: Featured</option>
            <option>Sort By: Newest</option>
          </select>
        </div>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {products.map((product) => ( <InteractiveProductCard key={product.id} product={product} /> ))}
      </div>
    </motion.div>
  );
};