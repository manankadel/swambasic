// src/components/modules/homepage/FeaturedProducts.tsx

"use client";

import { useState, useEffect } from 'react';
// THE FIX: We now import our new, reusable component
import { ProductCard } from '@/components/modules/products/ProductCard'; 
import { getProducts } from '@/lib/shopify';
import { ShopifyProduct } from '@/types/shopify';

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts(4); // Fetch the first 4 products
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
      {/* THE FIX: The layout now uses a grid for better responsiveness */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </section>
  );
};