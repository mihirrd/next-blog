import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from './components/NavBar'
import Footer from './components/Footer'

import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Mihir Deshpande',
    template: '%s | Mihir Deshpande'
  },
  description: "Welcome to Mihir's blog",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="retro">
      <body className={inter.className}>
        <NavBar />        
        {children}
        <Analytics />
        <SpeedInsights />
        <div className='mb-32'></div>
        <Footer />
      </body>
    </html>
  )
}
