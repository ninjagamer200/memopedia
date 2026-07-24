import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'MemoPedia - Browse Unlimited Memes',
  description: 'MemoPedia is your ultimate destination for endless memes. Scroll through thousands of funny memes just like YouTube Shorts. Like, save, and share your favorite memes!',
  generator: 'MemoPedia',
  icons: {
    icon: '/favicon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-black text-white overflow-hidden">
        {children}
        <Footer />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
