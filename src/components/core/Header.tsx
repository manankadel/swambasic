// src/components/core/Header.tsx

"use client";
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartNotification } from '@/hooks/useCartNotification'; // Import the new hook

const UserIcon = () => ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> );
const CartIcon = () => {
    const { cartCount } = useCartNotification(); // Get the cart count from our global hook
    return (
        <div className="relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            {cartCount > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                </div>
            )}
        </div>
    );
};

const MenuIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const CloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 p-6">
                <div className="mx-auto max-w-7xl px-6 py-4 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-sm">
                    <nav className="grid grid-cols-3 items-center">
                        <div className="flex justify-start">
                            <div className="hidden md:flex items-center gap-8 font-sans text-sm uppercase tracking-wider text-white/80">
                                <Link href="/catalog" className="hover:text-white transition-colors">Catalog</Link>
                                <Link href="/reach-out" className="hover:text-white transition-colors">Reach Out</Link>
                            </div>
                            <div className="md:hidden"> <button onClick={() => setIsMenuOpen(true)} className="text-white"> <MenuIcon /> </button> </div>
                        </div>
                        <div className="flex justify-center">
                            <Link href="/home"> <span className="font-display font-bold text-white text-xl md:text-2xl" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 1)' }}> SWAMBASIC </span> </Link>
                        </div>
                        <div className="flex justify-end items-center gap-6 md:gap-8 text-white/80">
                            <Link href="/account" className="hover:text-white transition-colors"><UserIcon /></Link>
                            <Link href="/cart" className="hover:text-white transition-colors"><CartIcon /></Link>
                        </div>
                    </nav>
                </div>
            </header>
            <AnimatePresence>
                {isMenuOpen && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 p-6"> <div className="flex justify-end"> <button onClick={() => setIsMenuOpen(false)} className="text-white"><CloseIcon /></button> </div> <nav className="flex flex-col items-center justify-center h-full gap-8 text-white font-display text-3xl uppercase"> <Link href="/catalog" onClick={() => setIsMenuOpen(false)}>Catalog</Link> <Link href="/reach-out" onClick={() => setIsMenuOpen(false)}>Reach Out</Link> </nav> </motion.div> )}
            </AnimatePresence>
        </>
    );
};