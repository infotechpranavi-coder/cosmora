"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, ChevronDown, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="bg-transparent sticky top-0 z-50 backdrop-blur-none" style={{ backgroundColor: 'transparent' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">


        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 -ml-32">
            <Image
              src="/cosmora-logo.png"
              alt="COSMORA Logo"
              width={120}
              height={120}
              className="w-28 h-28 object-contain"
            />
            <span className="text-white text-2xl font-bold tracking-tight">COSMORA</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for jewelry..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C4A484] focus:border-transparent"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <Link href="/" className="flex items-center text-white hover:text-white/80 transition-colors">
                <span className="font-medium">Home</span>
                <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform" />
              </Link>
            </div>
            <div className="relative group">
              <Link href="/products" className="flex items-center text-white hover:text-white/80 transition-colors">
                <span className="font-medium">Products</span>
                <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform" />
              </Link>
            </div>

            <Link href="/coupons" className="text-white hover:text-white/80 transition-colors font-medium">
              Coupons
            </Link>
            <div className="relative group">
              <Link href="/blog" className="flex items-center text-white hover:text-white/80 transition-colors">
                <span className="font-medium">Blog</span>
                <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform" />
              </Link>
            </div>
            <Link href="/contact" className="text-white hover:text-white/80 transition-colors font-medium">
              Contact
            </Link>
          </nav>

          {/* Mobile buttons */}
          <div className="lg:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white hover:text-white/80 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search bar - Mobile */}
        {isSearchOpen && (
          <div className="lg:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for jewelry..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C4A484] focus:border-transparent"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-[#C4A484]">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-[#C4A484]">
                Products
              </Link>

              <Link href="/coupons" className="text-gray-700 hover:text-[#C4A484]">
                Coupons
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-[#C4A484]">
                Blog
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-[#C4A484]">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
