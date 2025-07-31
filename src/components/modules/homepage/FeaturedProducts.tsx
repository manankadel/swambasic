// src/components/modules/homepage/FeaturedProducts.tsx

"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '@/components/modules/products/ProductCard'; 
import { getProducts } from '@/lib/shopify';
import { ShopifyProduct } from '@/types/shopify';

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts(6); // Get more products for rotation
        setProducts(fetchedProducts);
      } catch (error) { 
        console.error("Failed to fetch products:", error); 
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchProducts();
  }, []);

  // Auto-rotate products
  useEffect(() => {
    if (!isHovered && products.length > 3) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % (products.length - 2));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [products.length, isHovered]);

  if (isLoading) {
    return (
      <section className="py-24 px-6 md:px-12 bg-black text-center overflow-hidden">
        <div className="relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{ x: [-1000, 1000] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="font-display text-4xl mb-12 text-white relative z-10">Featured Collection</h2>
          <div className="flex justify-center items-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white/30 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const displayProducts = products.slice(activeIndex, activeIndex + 3);

  return (
    <section className="py-24 px-6 md:px-12 bg-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full"
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 bg-white/5 rounded-full"
          animate={{ 
            y: [-20, 20, -20],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-1 h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="font-display text-4xl md:text-5xl mb-4 text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            Featured Collection
          </motion.h2>
          <motion.div
            className="w-20 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </motion.div>

        {/* Dynamic product showcase */}
        <div 
          className="max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="grid md:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, staggerChildren: 0.2 }}
            >
              {displayProducts.map((product, index) => (
                <motion.div
                  key={`${activeIndex}-${index}`}
                  className="relative group"
                  initial={{ opacity: 0, y: 60, rotateX: -15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Glowing border effect */}
                  <motion.div
                    className="absolute -inset-0.5 bg-gradient-to-r from-white/20 via-white/5 to-white/20 rounded-lg opacity-0 group-hover:opacity-100 blur-sm"
                    initial={false}
                    animate={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Product card with enhanced styling */}
                  <div className="relative bg-zinc-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 group-hover:border-white/20 transition-all duration-300">
                    <ProductCard product={product} />
                  </div>

                  {/* Floating accent */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-4 h-4 bg-white/20 rounded-full opacity-0 group-hover:opacity-100"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation dots */}
          {products.length > 3 && (
            <motion.div 
              className="flex justify-center mt-12 space-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {Array.from({ length: products.length - 2 }).map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Call to action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.button
            className="group relative px-8 py-3 bg-transparent border border-white/20 text-white font-medium rounded-full overflow-hidden hover:border-white/40 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-white/5 translate-x-full group-hover:translate-x-0 transition-transform duration-300"
            />
            <span 
              className="relative z-10 cursor-pointer"
              onClick={() => window.location.href = "/catalog"}
            >
              View All Products
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};