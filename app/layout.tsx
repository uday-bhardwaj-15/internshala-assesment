import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const font = Inter({ 
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'CarRent - Need For Speed Edition',
  description: 'Easy car rental for customers and agencies. Book and manage vehicles efficiently.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
