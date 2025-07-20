"use client";
import Link from 'next/link';

// Placeholders for icons
const UserIcon = () => <span>AC</span>;
const WishlistIcon = () => <span>WS</span>;
const CartIcon = () => <span>CT</span>;

export const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full z-50 p-6">
            {/* 
              THE FIX FOR ROUNDNESS IS HERE:
              - Changed 'rounded-md' to 'rounded-xl' for a softer, more noticeable curve.
            */}
            <div className="mx-auto max-w-7xl px-6 py-4 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-sm">
                <nav className="flex justify-between items-center">
                    
                    {/* Left Navigation */}
                    <div className="flex items-center gap-8 font-sans text-sm uppercase tracking-wider text-white/80">
                        <Link href="/catalog" className="hover:text-white transition-colors">Catalog</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Reach Out</Link>
                    </div>

                    {/* Center: Logo */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Link href="/home">
                            {/*
                              THE FIX FOR THE GLOW IS HERE:
                              - Added a custom text-shadow with a very soft, white glow.
                            */}
                            <span 
                                className="font-display text-2xl font-bold text-white"
                                style={{ textShadow: '0 0 10px rgba(255, 255, 255, 1)' }}
                            >
                                SWAMBASIC
                            </span>
                        </Link>
                    </div>

                    {/* Right: User Actions */}
                    <div className="flex items-center gap-8 font-sans text-sm text-white/80">
                        <Link href="/account" className="hover:text-white transition-colors"><UserIcon /></Link>
                        <Link href="/cart" className="hover:text-white transition-colors"><CartIcon /></Link>
                    </div>
                </nav>
            </div>
        </header>
    );
};