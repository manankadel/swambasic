// src/components/modules/products/ProductDetails.tsx

"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useCart } from '@shopify/hydrogen-react';
import { ShopifyProductDetailed, ShopifyProductVariant } from '@/types/shopify';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductDetailsProps {
  product: ShopifyProductDetailed;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  // Use the useCart hook to get the linesAdd function and cart status
  const { linesAdd, status } = useCart();

  // Find the first available variant to set as the initial state
  const firstAvailableVariant = useMemo(() => 
    product.variants.edges.find(edge => edge.node.availableForSale)?.node || product.variants.edges[0].node,
    [product.variants.edges]
  );
  
  // State to track the ID of the currently selected variant
  const [selectedVariantId, setSelectedVariantId] = useState<string>(firstAvailableVariant.id);

  // Derive the full variant object from the selected ID
  const selectedVariant = useMemo((): ShopifyProductVariant | undefined => {
    return product.variants.edges.find(edge => edge.node.id === selectedVariantId)?.node;
  }, [selectedVariantId, product.variants]);

  // Handle adding the selected variant to the cart
  const handleAddToCart = () => {
    if (!selectedVariant) return;
    linesAdd([{
      merchandiseId: selectedVariant.id,
      quantity: 1,
    }]);
  };

  const isAdding = status === 'updating';


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      
      {/* Column 1: Image Gallery */}
      <div className="w-full aspect-square bg-white/5 rounded-lg overflow-hidden">
         {product.featuredImage && (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              width={product.featuredImage.width}
              height={product.featuredImage.height}
              className="w-full h-full object-cover"
              priority
            />
          )}
      </div>

      {/* Column 2: Product Information & Actions */}
      <div className="flex flex-col">
        <h1 className="font-display text-4xl md:text-5xl font-bold">{product.title}</h1>
        
        {/* Price display that updates based on the selected variant */}
        <p className="font-mono text-xl text-white/80 my-4">
          ${selectedVariant?.price.amount}
        </p>

        {/* This renders the HTML description from Shopify */}
        <div 
          className="font-sans text-white/70 space-y-4 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} 
        />
        
        <div className="mt-8 pt-8 border-t border-white/10">
            <h2 className="font-sans text-sm uppercase tracking-wider text-white/50">
              Select Size
            </h2>
            <div className="flex flex-wrap gap-3 mt-4">
              {product.variants.edges.map(({ node: variant }) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  disabled={!variant.availableForSale}
                  className={`px-4 py-2 rounded-md font-sans text-sm font-semibold border transition-colors duration-200
                    ${selectedVariantId === variant.id
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white border-white/20'
                    }
                    ${!variant.availableForSale
                      ? 'opacity-30 cursor-not-allowed line-through'
                      : 'hover:border-white/70'
                    }
                  `}
                >
                  {variant.title}
                </button>
              ))}
            </div>

            <button 
              onClick={handleAddToCart}
              // Disable button if variant isn't available or if adding is in progress
              disabled={!selectedVariant?.availableForSale || isAdding}
              className="w-full mt-8 py-4 bg-white text-black font-sans font-bold uppercase tracking-widest disabled:opacity-50 enabled:hover:bg-white/80 transition-all"
            >
              {isAdding
                ? 'Adding...'
                : !selectedVariant?.availableForSale
                ? 'Sold Out'
                : 'Add to Cart'
              }
            </button>
        </div>

      </div>
    </div>
  );
};