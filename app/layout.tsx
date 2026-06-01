import './globals.css'
import type { Metadata } from 'next'
import { EB_Garamond, DM_Sans } from 'next/font/google'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react"

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${ebGaramond.variable} ${dmSans.variable} font-serif bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 min-h-screen`}>
        <NavBar />
        {children}
        <Analytics />
        <SpeedInsights />
        <Footer />
        <BackToTop />
      </body>
    </html>
  )
}
