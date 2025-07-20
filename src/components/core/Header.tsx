"use client";
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
const UserIcon = () => <span>AC</span>;
const CartIcon = () => <span>CT</span>;
const MenuIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const CloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 p-6">
                <div className="mx-auto max-w-7xl px-6 py-4 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-sm">
                    {/* 
                      THE FIX FOR THE OVERLAP IS HERE:
                      - We are now using a 3-column CSS Grid.
                      - This is the professional way to ensure the center element never overlaps the sides.
                    */}
                    <nav className="grid grid-cols-3 items-center">
                        
                        {/* Left Column */}
                        <div className="flex justify-start">
                            {/* DESKTOP: Left Navigation */}
                            <div className="hidden md:flex items-center gap-8 font-sans text-sm uppercase tracking-wider text-white/80">
                                <Link href="/catalog" className="hover:text-white transition-colors">Catalog</Link>
                                <Link href="/contact" className="hover:text-white transition-colors">Reach Out</Link>
                            </div>
                            {/* MOBILE: Hamburger Menu Icon */}
                            <div className="md:hidden">
                                <button onClick={() => setIsMenuOpen(true)} className="text-white">
                                    <MenuIcon />
                                </button>
                            </div>
                        </div>

                        {/* Center Column: Logo */}
                        <div className="flex justify-center">
                            <Link href="/home">
                                {/* 
                                  THE FIX FOR THE GLOW IS HERE:
                                  - The 'style' object with the textShadow is restored.
                                */}
                                <span 
                                    className="font-display font-bold text-white text-xl md:text-2xl"
                                    style={{ textShadow: '0 0 15px rgba(255, 255, 255, 1)' }}
                                >
                                    SWAMBASIC
                                </span>
                            </Link>
                        </div>

                        {/* Right Column: User Actions */}
                        <div className="flex justify-end items-center gap-6 md:gap-8 font-sans text-sm text-white/80">
                            <Link href="/account" className="hover:text-white transition-colors"><UserIcon /></Link>
                            <Link href="/cart" className="hover:text-white transition-colors"><CartIcon /></Link>
                        </div>
                    </nav>
                </div>
            </header>

            {/* MOBILE: Full-screen Menu Overlay (No changes needed here) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 p-6"
                    >
                        <div className="flex justify-end">
                            <button onClick={() => setIsMenuOpen(false)} className="text-white"><CloseIcon /></button>
                        </div>
                        <nav className="flex flex-col items-center justify-center h-full gap-8 text-white font-display text-3xl uppercase">
                            <Link href="/catalog" onClick={() => setIsMenuOpen(false)}>Catalog</Link>
                            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Reach Out</Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};