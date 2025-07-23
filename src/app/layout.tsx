import type { Metadata } from 'next'
import './globals.css'
import { fontPoppins, fontUnbounded, fontGenoa } from './fonts';
import { BackgroundMusicPlayer } from '@/components/core/BackgroundMusicPlayer';
import { GlobalSoundEffects } from '@/components/core/GlobalSoundEffects';
import { AppHeightProvider } from '@/components/core/AppHeightProvider'; // <-- IMPORT THE NEW PROVIDER
import { Analytics } from "@vercel/analytics/next"

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
        <Analytics/>
        {/* WRAP everything in the AppHeightProvider */}
        <AppHeightProvider>
            <GlobalSoundEffects />
            {children}
            <BackgroundMusicPlayer />
        </AppHeightProvider>
      </body>
    </html>
  )
}