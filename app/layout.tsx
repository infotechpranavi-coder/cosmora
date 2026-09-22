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
  title: 'COSMORA | Custom T-Shirt Printing',
  description:
    'COSMORA — custom t-shirt printing from the manufacturer. Round neck, polo, sports & bulk tees with factory rates, editable design, and door delivery across India.',
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/cosmora-logo.png?v=2', type: 'image/png' },
    ],
    apple: '/cosmora-logo.png?v=2',
    shortcut: '/cosmora-logo.png?v=2',
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
