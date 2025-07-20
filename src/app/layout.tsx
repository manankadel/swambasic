import type { Metadata } from 'next'
import './globals.css'
import { fontPoppins, fontUnbounded, fontGenoa } from './fonts';
import { BackgroundMusicPlayer } from '@/components/core/BackgroundMusicPlayer';
import { GlobalSoundEffects } from '@/components/core/GlobalSoundEffects'; // NEW: Import global SFX

export const metadata = {
  title: 'SWAMBASIC - Coming Soon',
  description: 'Luxury Streetwear. Join the waitlist.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={[
        fontPoppins.variable, 
        fontUnbounded.variable, 
        fontGenoa.variable, 
        'dark'
      ].join(' ')}>
      <body>
        <GlobalSoundEffects /> {/* NEW: Activate global sounds */}
        {children}
        <BackgroundMusicPlayer />
      </body>
    </html>
  )
}