import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from './components/NavBar'
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mihir Deshpande',
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
        <div className='mb-32'></div>
        <Footer />
      </body>
    </html>
  )
}
