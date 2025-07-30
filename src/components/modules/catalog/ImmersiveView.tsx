// src/components/modules/catalog/ImmersiveView.tsx

"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useCart } from '@shopify/hydrogen-react';
import { ShopifyProductDetailed } from '@/types/shopify';
import Image from 'next/image';

const ArrowLeft = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg> );
const ArrowRight = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg> );

const getOptimizedShopifyImageUrl = (url: string, size: number) => {
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        const extension = urlObj.pathname.split('.').pop();
        const pathWithoutExtension = urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('.'));
        return `${urlObj.origin}${pathWithoutExtension}_${size}x.${extension}`;
    } catch (e) { return url; }
};

interface ImmersiveViewProps {
  products: ShopifyProductDetailed[];
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
}

export const ImmersiveView = ({ products, focusedIndex, setFocusedIndex }: ImmersiveViewProps) => {
    const router = useRouter();
    const { linesAdd, status: cartStatus } = useCart();
    const product = products[focusedIndex];
    const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const currentProduct = products[focusedIndex];
        if (currentProduct) {
            const firstAvailable = currentProduct.variants.edges.find(v => v.node.availableForSale)?.node;
            setSelectedVariantId(firstAvailable?.id || currentProduct.variants.edges[0]?.node.id);
            setCurrentImageIndex(0);
        }
    }, [focusedIndex, products]);
    
    const selectedVariant = useMemo(() => product?.variants.edges.find(edge => edge.node.id === selectedVariantId)?.node, [product, selectedVariantId]);
    const imageGallery = useMemo(() => {
        if (!product?.featuredImage) return [];
        const otherImages = product.images?.edges.map(edge => edge.node) || [];
        return [product.featuredImage, ...otherImages.filter(img => img.url !== product.featuredImage.url)];
    }, [product]);

    const goToNext = () => { setDirection(1); setFocusedIndex((focusedIndex + 1) % products.length); };
    const goToPrev = () => { setDirection(-1); setFocusedIndex((focusedIndex - 1 + products.length) % products.length); };
    
    const handleDrag = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const swipePower = info.offset.x;
        if (swipePower < -100) goToNext();
        else if (swipePower > 100) goToPrev();
    };

    const handleAddToCart = () => { if (selectedVariant) linesAdd([{ merchandiseId: selectedVariant.id, quantity: 1 }]); };
    const isAddingToCart = cartStatus === 'updating';
    
    const cardVariants = {
        enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
    };

    if (!product) return <div className="w-full h-full grid place-items-center text-white/50">Loading...</div>;

    return (
        // --- MARGIN FIX: pt-28 is now applied to ALL screen sizes ---
        <div className="relative w-full flex items-start md:items-center justify-center pt-28 pb-12 px-4">
            
            <button onClick={goToPrev} className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-colors p-3"> <ArrowLeft /> </button>
            <button onClick={goToNext} className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-colors p-3"> <ArrowRight /> </button>
            
            <div className="relative w-full max-w-5xl h-full">
                <div className="relative w-full h-full overflow-hidden">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div 
                            key={focusedIndex}
                            custom={direction}
                            variants={cardVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={handleDrag}
                            // --- MOBILE LAYOUT FIX: The card is now a flex column on mobile ---
                            className="w-full h-auto md:h-[75vh] md:max-h-[650px] rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl shadow-2xl flex flex-col md:grid md:grid-cols-2 md:grid-rows-1 cursor-grab active:cursor-grabbing"
                        >
                            <div className="w-full aspect-square md:aspect-auto md:h-full relative bg-black/20 flex flex-col p-4">
                                <div className="w-full flex-grow relative">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={`${focusedIndex}-${currentImageIndex}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full h-full"
                                        >
                                            <Image
                                                src={getOptimizedShopifyImageUrl(imageGallery[currentImageIndex]?.url, 800)}
                                                alt={imageGallery[currentImageIndex]?.altText || product.title}
                                                fill
                                                className="object-contain rounded-lg pointer-events-none"
                                                style={{ filter: 'drop-shadow(0 10px 15px rgb(0 0 0 / 0.4))' }}
                                                priority={true}
                                                quality={85}
                                                sizes="(max-width: 768px) 100vw, 40vw"
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                                <div className="flex-shrink-0 flex justify-center items-center gap-3 pt-4">
                                    {imageGallery.map((image, index) => (
                                        <button key={`${image?.url}-${index}`} onClick={() => setCurrentImageIndex(index)} className={`w-10 h-14 md:w-12 md:h-16 rounded-md overflow-hidden border-2 transition-colors ${currentImageIndex === index ? 'border-white' : 'border-transparent hover:border-white/50'}`}>
                                            <Image src={getOptimizedShopifyImageUrl(image?.url, 100)} alt={`Thumbnail ${index + 1}`} width={48} height={64} className="object-cover w-full h-full" quality={60} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full h-full flex flex-col p-6 md:p-10">
                                <div className="flex flex-col flex-grow min-h-0">
                                    <div>
                                        <h1 className="font-display text-3xl md:text-4xl font-bold">{product.title}</h1>
                                        {selectedVariant && <div className="inline-block mt-3"> <p className="font-mono text-xl text-white/90 bg-white/5 px-3 py-1 rounded-md">${selectedVariant.price.amount}</p> </div> }
                                    </div>
                                    <div className="font-sans text-sm text-white/70 my-4 md:my-6 space-y-4 prose prose-invert max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                                    <div className="mt-auto pt-4 md:pt-6 border-t border-white/10">
                                        <div>
                                            <h2 className="font-sans text-xs uppercase tracking-wider text-white/50">Size</h2>
                                            <div className="flex flex-wrap gap-3 mt-3">
    {/* --- THIS IS THE SIZES FIX --- */}
    {/* The `?.` prevents the code from crashing if a product has no variants */}
    {product.variants?.edges.map(({ node: variant }) => (
        <button key={variant.id} onClick={() => setSelectedVariantId(variant.id)} disabled={!variant.availableForSale} className={`px-3 py-1.5 rounded-md font-sans text-xs font-semibold border transition-colors duration-200 ${selectedVariantId === variant.id ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white/20'} ${!variant.availableForSale ? 'opacity-30 cursor-not-allowed line-through' : 'hover:border-white/70'}`} >
            {variant.title}
        </button>
    ))}
</div>
                                        </div>
                                        <button onClick={handleAddToCart} disabled={!selectedVariant?.availableForSale || isAddingToCart} className="w-full mt-6 py-3 bg-white text-black font-sans font-bold uppercase tracking-widest disabled:opacity-50 enabled:hover:bg-white/80 transition-all rounded-full">
                                            {isAddingToCart ? 'Processing...' : !selectedVariant?.availableForSale ? 'Sold Out' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};