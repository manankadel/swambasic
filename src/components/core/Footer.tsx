// src/components/core/Footer.tsx
"use client";
import Link from 'next/link';

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black z-40 relative px-6 md:px-12 py-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-white/50">
        {/* Left: Copyright */}
        <div className="mb-4 md:mb-0">
          © {currentYear} SWAMBASIC. All Rights Reserved.
        </div>
        
        {/* Right: Social & Legal Links */}
        <div className="flex items-center gap-4 md:gap-8 flex-wrap justify-center">
            <a href="https://www.instagram.com/swambasic/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><InstagramIcon /></a>
            <div className="w-px h-4 bg-white/20 hidden md:block"></div>
            {/* --- THIS IS THE FIX --- */}
            <div className="flex items-center gap-4 md:gap-6 font-sans uppercase tracking-wider text-xs flex-wrap justify-center">
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/shipping" className="hover:text-white transition-colors">Shipping</Link>
                <Link href="/refunds" className="hover:text-white transition-colors">Refunds</Link>
                <Link href="/reach-out" className="hover:text-white transition-colors">Contact Us</Link>
            </div>
        </div>
      </div>
    </footer>
  );
};