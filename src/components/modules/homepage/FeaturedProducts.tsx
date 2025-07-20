"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

// This is a temporary placeholder for product data.
// Later, we will fetch this directly from Shopify.
const placeholderProducts = [
  { id: 1, name: 'Obsidian Hoodie', price: '250.00', image: '/placeholder-product.png' },
  { id: 2, name: 'Midnight Cargos', price: '300.00', image: '/placeholder-product.png' },
  { id: 3, name: 'Onyx Tee', price: '120.00', image: '/placeholder-product.png' },
  { id: 4, name: 'Shadow Cap', price: '80.00', image: '/placeholder-product.png' },
];

const ProductCard = ({ product }: { product: any }) => (
  <motion.div className="flex-shrink-0 w-80" whileHover={{ y: -5 }}>
    <div className="w-full h-96 bg-white/5 flex items-center justify-center">
        {/* Placeholder - We'll use Shopify product images here */}
        <span className="text-sm">Product Image</span>
    </div>
    <div className="mt-4 text-left">
      <h3 className="font-sans font-semibold">{product.name}</h3>
      <p className="font-mono text-sm">${product.price}</p>
    </div>
  </motion.div>
);

export const FeaturedProducts = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-black">
      <h2 className="font-display text-4xl mb-12 text-center">Featured Collection</h2>
      <div className="flex gap-8 overflow-x-auto pb-4">
        {placeholderProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};