"use client";
import Link from 'next/link';

// Self-contained SVG icons for a clean look
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const TwitterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black z-40 relative px-6 md:px-12 py-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-white/50">
        {/* Left: Copyright */}
        <div>
          © {currentYear} SWAMBASIC. All Rights Reserved.
        </div>
        
        {/* Right: Social & Legal Links */}
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
                <a href="https://www.instagram.com/swambasic/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><InstagramIcon /></a>
            </div>
            <div className="flex items-center gap-4 font-sans uppercase tracking-wider text-xs">
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
        </div>
      </div>
    </footer>
  );
};