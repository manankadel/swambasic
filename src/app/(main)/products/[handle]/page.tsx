// src/app/(main)/products/[handle]/page.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@shopify/hydrogen-react';
import { ShopifyProductDetailed } from '@/types/shopify';
import { getProductByHandle } from '@/lib/shopify';
import Image from 'next/image';
import { useCartNotification } from '@/hooks/useCartNotification';
import { FullScreenImageViewer } from '@/components/core/FullScreenImageViewer';

const getOptimizedShopifyImageUrl = (url: string, size: number) => { if (!url) return ''; try { const urlObj = new URL(url); const extension = urlObj.pathname.split('.').pop(); const pathWithoutExtension = urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('.')); return `${urlObj.origin}${pathWithoutExtension}_${size}x.${extension}`; } catch (e) { return url; } };
const ExpandIcon = () => ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg> );

const ProductDetailsClient = ({ product }: { product: ShopifyProductDetailed }) => {
    const { linesAdd, status: cartStatus } = useCart();
    const { showNotification } = useCartNotification();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedVariantId, setSelectedVariantId] = useState(product.variants.edges.find(v => v.node.availableForSale)?.node.id || product.variants.edges[0]?.node.id);
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

    const imageGallery = useMemo(() => { if (!product?.featuredImage) return []; const otherImages = product.images?.edges.map(edge => edge.node) || []; return [product.featuredImage, ...otherImages.filter(img => img.url !== product.featuredImage.url)]; }, [product]);
    const selectedVariant = useMemo(() => product.variants.edges.find(edge => edge.node.id === selectedVariantId)?.node, [product, selectedVariantId]);
    const isAddingToCart = cartStatus === 'updating';

    const handleAddToCart = () => { if (selectedVariant) { linesAdd([{ merchandiseId: selectedVariant.id, quantity: 1 }]); showNotification(`${product.title} added to cart`); } };

    return (
        <>
            <FullScreenImageViewer imageUrl={fullScreenImage} onClose={() => setFullScreenImage(null)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                <div className="w-full flex flex-col gap-4">
                    <div className="relative w-full aspect-square">
                        <AnimatePresence mode="wait">
                            <motion.div key={currentImageIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="w-full h-full">
                                {imageGallery[currentImageIndex] && (
                                    <Image
                                        src={getOptimizedShopifyImageUrl(imageGallery[currentImageIndex].url, 800)}
                                        alt={imageGallery[currentImageIndex].altText || product.title}
                                        fill
                                        className="object-contain rounded-lg"
                                        priority
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                        <button onClick={() => setFullScreenImage(imageGallery[currentImageIndex].url)} className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:text-white"> <ExpandIcon /> </button>
                    </div>
                    <div className="flex justify-center items-center gap-3">
                        {imageGallery.map((image, index) => (
                            <button key={image.url} onClick={() => setCurrentImageIndex(index)} className={`w-16 h-20 rounded-md overflow-hidden border-2 transition-colors ${currentImageIndex === index ? 'border-white' : 'border-transparent hover:border-white/50'}`}>
                                <Image src={getOptimizedShopifyImageUrl(image.url, 100)} alt={`Thumbnail ${index + 1}`} width={64} height={80} className="object-cover w-full h-full" />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col">
                    <h1 className="font-display text-4xl md:text-5xl font-bold">{product.title}</h1>
                    {selectedVariant && <div className="inline-block my-4"> <p className="font-mono text-xl text-white/90 bg-white/5 px-3 py-1 rounded-md">${selectedVariant.price.amount}</p> </div>}
                    <div className="font-sans text-white/70 space-y-4 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <h2 className="font-sans text-sm uppercase tracking-wider text-white/50"> Size </h2>
                        <div className="flex flex-wrap gap-3 mt-4">
                            {product.variants?.edges.map(({ node: variant }) => ( <button key={variant.id} onClick={() => setSelectedVariantId(variant.id)} disabled={!variant.availableForSale} className={`px-4 py-2 rounded-md font-sans text-sm font-semibold border transition-colors duration-200 ${selectedVariantId === variant.id ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white/20'} ${!variant.availableForSale ? 'opacity-30 cursor-not-allowed line-through' : 'hover:border-white/70'}`}> {variant.title} </button> ))}
                        </div>
                        <button onClick={handleAddToCart} disabled={!selectedVariant?.availableForSale || isAddingToCart} className="w-full mt-8 py-4 bg-white text-black font-sans font-bold uppercase tracking-widest disabled:opacity-50 enabled:hover:bg-white/80 transition-all rounded-full">
                            {isAddingToCart ? 'Adding...' : !selectedVariant?.availableForSale ? 'Sold Out' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

// This is the server component that fetches the data
export default function ProductPage({ params }: { params: { handle: string } }) {
    const [product, setProduct] = useState<ShopifyProductDetailed | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const fetchedProduct = await getProductByHandle(params.handle);
            if (!fetchedProduct) {
                notFound();
            }
            setProduct(fetchedProduct);
        };
        fetchProduct();
    }, [params.handle]);

    if (!product) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <main className="min-h-screen bg-black pt-40 pb-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <ProductDetailsClient product={product} />
            </div>
        </main>
    );
}