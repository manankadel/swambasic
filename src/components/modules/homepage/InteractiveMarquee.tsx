// src/components/modules/homepage/InteractiveMarquee.tsx
"use client";
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const MarqueeText = ({ children, speed }: { children: React.ReactNode, speed: number }) => {
    return (
        <div className="flex" style={{ transform: `translateX(${speed}%)` }}>
            <span className="font-display text-6xl md:text-8xl text-stroke whitespace-nowrap pr-16">{children}</span>
            <span className="font-display text-6xl md:text-8xl text-stroke whitespace-nowrap pr-16">{children}</span>
        </div>
    );
}

export const InteractiveMarquee = () => {
    const marqueeRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: marqueeRef,
        offset: ['start end', 'end start']
    });

    // This transforms the scroll progress (0 to 1) into a motion value
    const speed = useTransform(scrollYProgress, [0, 1], [-20, 0]);

    return (
        <section ref={marqueeRef} className="py-16 md:py-24 bg-black overflow-hidden">
            <MarqueeText speed={speed.get()}>
                Form     Function     Perspective    
            </MarqueeText>
        </section>
    );
};