import { Poppins, Unbounded } from 'next/font/google';
import localFont from 'next/font/local'; // <-- IMPORT THIS

export const fontPoppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

export const fontUnbounded = Unbounded({
    subsets: ['latin'],
    weight: ['700', '900'],
    variable: '--font-unbounded',
});

// DEFINE THE NEW LOCAL FONT HERE
export const fontGenoa = localFont({
  src: '../assets/fonts/genoa.ttf', // <-- PATH TO YOUR FONT FILE
  display: 'swap',
  variable: '--font-genoa', // <-- CSS variable we will use
});