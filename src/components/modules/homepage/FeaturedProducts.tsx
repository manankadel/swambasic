"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Import our Shopify functions and types
import { getProducts } from '@/lib/shopify';
import { ShopifyProduct } from '@/types/shopify';

// This is the new Product Card component. It is designed to accept REAL Shopify data.
const ProductCard = ({ product }: { product: ShopifyProduct }) => (
  <Link href={`/products/${product.handle}`} passHref>
    <motion.div className="flex-shrink-0 w-80" whileHover={{ y: -5 }}>
      <div className="w-full h-96 bg-white/5 flex items-center justify-center rounded-md overflow-hidden">
          {product.featuredImage ? (
            <Image 
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                width={product.featuredImage.width}
                height={product.featuredImage.height}
                className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm">No Image</span>
          )}
      </div>
      <div className="mt-4 text-left">
        <h3 className="font-sans font-semibold">{product.title}</h3>
        <p className="font-mono text-sm">${product.priceRange.minVariantPrice.amount}</p>
      </div>
    </motion.div>
  </Link>
);

// This is the updated main component that fetches live data.
export const FeaturedProducts = () => {
  // State to hold the live products from Shopify
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  // State to handle loading feedback
  const [isLoading, setIsLoading] = useState(true);

  // This useEffect hook runs once when the component mounts
  useEffect(() => {
    // We create an async function inside to fetch the data
    const fetchProducts = async () => {
      try {
        // We call our getProducts function from shopify.ts
        const fetchedProducts = await getProducts(4); // Fetch the first 4 products
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // The empty array means this effect only runs once

  // Handle the loading state
  if (isLoading) {
    return (
        <section className="py-24 px-6 md:px-12 bg-black text-center">
            <h2 className="font-display text-4xl mb-12">Featured Collection</h2>
            <p className="font-sans text-white/50">Loading Products...</p>
        </section>
    );
  }

  return (
    <section className="py-24 px-6 md:px-12 bg-black">
      <h2 className="font-display text-4xl mb-12 text-center">Featured Collection</h2>
      <div className="flex justify-center">
        <div className="flex gap-8 overflow-x-auto pb-4 max-w-7xl">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    </section>
  );
};