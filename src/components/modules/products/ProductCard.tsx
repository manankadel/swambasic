// src/components/modules/products/ProductCard.tsx

"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShopifyProduct } from '@/types/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/products/${product.handle}`} passHref>
      <motion.div
        className="group" // Add a group class for hover effects
        whileHover={{ y: -5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="w-full aspect-[3/4] bg-white/5 rounded-lg overflow-hidden relative">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              width={product.featuredImage.width}
              height={product.featuredImage.height}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-sm text-white/50">No Image</span>
            </div>
          )}
        </div>
        <div className="mt-4 text-left">
          <h3 className="font-sans font-semibold text-white">{product.title}</h3>
          <p className="font-mono text-sm text-white/70">${product.priceRange.minVariantPrice.amount}</p>
        </div>
      </motion.div>
    </Link>
  );
};