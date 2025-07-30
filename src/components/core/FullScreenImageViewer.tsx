// src/components/core/FullScreenImageViewer.tsx

"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface FullScreenImageViewerProps {
  imageUrl: string | null;
  onClose: () => void;
}

const getOptimizedShopifyImageUrl = (url: string, size: number) => {
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        const extension = urlObj.pathname.split('.').pop();
        const pathWithoutExtension = urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('.'));
        return `${urlObj.origin}${pathWithoutExtension}_${size}x.${extension}`;
    } catch (e) { return url; }
};

export const FullScreenImageViewer = ({ imageUrl, onClose }: FullScreenImageViewerProps) => {
    return (
        <AnimatePresence>
            {imageUrl && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 cursor-zoom-out"
                >
                    <motion.div 
                        layoutId={`product-image-${imageUrl}`}
                        className="relative w-full h-full max-w-4xl max-h-[80vh]"
                    >
                        <Image
                            src={getOptimizedShopifyImageUrl(imageUrl, 1600)}
                            alt="Full screen product view"
                            fill
                            className="object-contain"
                            quality={90}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};