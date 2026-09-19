import type { Metadata } from 'next'
import Script from 'next/script'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Poppins, Allura } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/cart-context'
import { AuthProvider } from '@/contexts/auth-context'
import { CurrencyProvider } from '@/contexts/currency-context'
import { Toaster } from '@/components/ui/toaster'

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
})

const allura = Allura({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-allura',
})

export const metadata: Metadata = {
  title: 'Customized T Shirt Printers in Mumbai | Inktantra',
  description: "India's First Print Marketplace. Buy directly from Manufacturer — factory sourcing, free sample visit, editable design and door delivery.",
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/logo/alankarika-newlogo.jpeg', type: 'image/jpeg' },
    ],
    apple: '/logo/alankarika-newlogo.jpeg',
    shortcut: '/logo/alankarika-newlogo.jpeg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={allura.variable} suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${poppins.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
  --font-allura: ${allura.variable};
}
        `}</style>
      </head>
      <body className={`${poppins.className} overflow-x-hidden`} suppressHydrationWarning>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
