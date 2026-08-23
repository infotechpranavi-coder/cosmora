"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, Menu, X, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { useCart } from "@/contexts/cart-context"

import CartIcon from "./cart-icon"
import CurrencySelector from "./currency-selector"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { state } = useCart()

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50"
      style={{ background: "linear-gradient(to right, #FFFFFF 0%, #F5EEDC 12%, #8B7355 80%, #D4AF37 93%)" }}
    >
      <div className="w-full max-w-[100vw] px-3 sm:px-4 lg:px-8 mx-auto">
        <div className="flex items-center justify-between min-h-[72px] sm:min-h-[68px] lg:min-h-[80px] py-2 sm:py-1">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center shrink-0 max-w-[180px] sm:max-w-[200px]">
            <Image
              src="/logo/alankarika_logo-tm-removebg-preview.png"
              alt="Alankarika Logo"
              width={160}
              height={64}
              className="h-14 sm:h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-10 flex-1 min-w-0">
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/logo/alankarika_logo-tm-removebg-preview.png"
                alt="Alankarika Logo"
                width={140}
                height={56}
                className="h-14 w-auto object-contain"
                priority
              />
            </Link>

            <form action="/search" method="GET" className="relative flex-1 max-w-md xl:max-w-lg">
              <input
                type="text"
                name="q"
                placeholder="Search for jewelry..."
                className="w-full pl-5 pr-10 py-2 rounded-lg border border-[#D4AF37]/30 text-[#010101] placeholder-[#8B7355] bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 text-sm"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </form>

            <div className="flex items-center gap-4 xl:gap-5 shrink-0">
              <Link href="/" className="text-white hover:text-[#D4AF37] transition-colors font-medium text-sm whitespace-nowrap">
                Home
              </Link>
              <Link href="/about" className="text-white hover:text-[#D4AF37] transition-colors font-medium text-sm whitespace-nowrap">
                About
              </Link>
              <Link href="/products" className="text-white hover:text-[#D4AF37] transition-colors font-medium text-sm whitespace-nowrap">
                Products
              </Link>
              <Link href="/contact" className="text-white hover:text-[#D4AF37] transition-colors font-medium text-sm whitespace-nowrap">
                Contact
              </Link>
              <div className="pl-3 border-l border-white/30">
                <CurrencySelector variant="dark" compact />
              </div>
              <CartIcon />
            </div>
          </div>

          {/* Mobile toolbar */}
          <div className="lg:hidden flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/cart" className="relative p-2.5 text-white hover:text-[#D4AF37]">
              <ShoppingCart className="w-6 h-6" />
              {state.itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen)
                if (isMenuOpen) setIsMenuOpen(false)
              }}
              className="p-2.5 text-white"
              aria-label="Search"
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen)
                if (isSearchOpen) setIsSearchOpen(false)
              }}
              className="p-2.5 text-white"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="lg:hidden pb-3">
            <form action="/search" method="GET" className="relative">
              <input
                type="text"
                name="q"
                placeholder="Search for jewelry..."
                className="w-full px-4 py-2.5 rounded-lg border border-[#D4AF37]/30 text-[#010101] placeholder-[#8B7355] bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu overlay + drawer */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={closeMenu} aria-hidden />
          <div className="fixed top-[72px] sm:top-[68px] left-0 right-0 z-50 lg:hidden max-h-[calc(100vh-72px)] overflow-y-auto">
            <div className="mx-3 mb-4 bg-white rounded-xl shadow-xl p-5">
              <div className="flex flex-col gap-1">
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About" },
                  { href: "/products", label: "Products" },
                  { href: "/contact", label: "Contact" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-gray-900 hover:text-[#D4AF37] hover:bg-[#F5EEDC] font-medium text-base py-3 px-3 rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <div className="my-4 border-y border-[#E8DFD0] py-4">
                <p className="text-xs text-gray-500 mb-2 text-center">Shop in your currency</p>
                <CurrencySelector variant="light" />
              </div>

              <Link
                href="/cart"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#8B7355] hover:bg-[#6F5B44] text-white font-medium"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>View Cart</span>
                {state.itemCount > 0 && (
                  <span className="bg-white text-[#8B7355] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {state.itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
