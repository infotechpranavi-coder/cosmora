"use client"

import Link from "next/link"
import {
  Search,
  Menu,
  X,
  MapPin,
  LogIn,
  Info,
  Mail,
  ShoppingBag,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import CartIcon from "./cart-icon"
import ProductSearchBar from "./product-search-bar"
import {
  categoryHref,
  flatCategoryNames,
  type DbCategory,
} from "@/lib/catalog-live"

const UTILITY_LINKS = [
  { href: "/about", label: "About", Icon: Info },
  { href: "/contact", label: "Contact", Icon: Mail },
  { href: "/locations", label: "Locations", Icon: MapPin },
]

const FALLBACK_CATEGORIES = ["Bags", "T-Shirts", "Formal Shirts"]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [categories, setCategories] = useState<DbCategory[]>([])
  const { state } = useCart()
  const { user, openLoginModal } = useAuth()

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/categories")
        const data = await res.json()
        if (!cancelled && data.success && Array.isArray(data.data)) {
          setCategories(data.data as DbCategory[])
        }
      } catch {
        if (!cancelled) setCategories([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const categoryNames = useMemo(() => {
    const names = flatCategoryNames(categories)
    return names.length ? names : FALLBACK_CATEGORIES
  }, [categories])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      {/* Main navbar — logo + About / Contact / Locations / Admin */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-5 lg:gap-8 min-h-[68px] lg:min-h-[76px]">
            {/* Left — logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cosmora-mark.png"
                alt=""
                className="h-11 sm:h-12 lg:h-14 w-auto object-contain shrink-0"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cosmora-wordmark.png"
                alt="COSMORA"
                className="h-5 sm:h-6 lg:h-7 w-auto object-contain max-w-[140px] sm:max-w-[180px] lg:max-w-none"
              />
            </Link>

            {/* Center — product search */}
            <div className="hidden lg:block flex-1 max-w-xl xl:max-w-2xl">
              <ProductSearchBar />
            </div>

            {/* Right — links + cart */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6 shrink-0 ml-auto">
              {UTILITY_LINKS.map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#172033] hover:text-[#14243D]"
                >
                  <Icon className="w-4 h-4 text-[#667085]" />
                  {label}
                </Link>
              ))}
              {user ? (
                <Link
                  href="/account"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#172033] hover:text-[#14243D]"
                >
                  <LogIn className="w-4 h-4 text-[#667085]" />
                  {user.firstName || "Account"}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={openLoginModal}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#172033] hover:text-[#14243D]"
                >
                  <LogIn className="w-4 h-4 text-[#667085]" />
                  Admin
                </button>
              )}
              <CartIcon variant="light" />
            </nav>

            {/* Mobile actions */}
            <div className="lg:hidden flex items-center gap-1 ml-auto shrink-0">
              <Link href="/cart" className="relative p-2 text-[#172033]" aria-label="Cart">
                <ShoppingBag className="w-5 h-5" />
                {state.itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#C49A52] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
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
                className="p-2 text-[#172033]"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen)
                  if (isSearchOpen) setIsSearchOpen(false)
                }}
                className="p-2 text-[#172033]"
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile search panel */}
          {isSearchOpen && (
            <div className="pb-3 lg:hidden">
              <ProductSearchBar
                autoFocus
                onNavigate={() => {
                  setIsSearchOpen(false)
                  setIsMenuOpen(false)
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Blue bar — category names only (no dropdown) */}
      <div
        className="text-white"
        style={{
          background: "linear-gradient(90deg, #14243D 0%, #14243D 55%, #243B5A 100%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8">
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2 py-2 lg:min-h-12">
            <Link
              href="/products"
              className="px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-white/95 hover:bg-white/15 transition-colors whitespace-nowrap"
            >
              All
            </Link>
            {categoryNames.map((name) => (
              <Link
                key={name}
                href={categoryHref(name)}
                className="px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-white/95 hover:bg-white/15 transition-colors whitespace-nowrap"
              >
                {name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={closeMenu} aria-hidden />
          <div className="absolute left-0 right-0 z-50 lg:hidden">
            <div className="mx-3 mt-2 mb-4 bg-white rounded-xl shadow-xl p-5 max-h-[70vh] overflow-y-auto">
              <p className="text-xs uppercase tracking-wide text-[#667085] px-3 mb-1">Pages</p>
              {UTILITY_LINKS.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="block text-[#172033] hover:bg-[#EEF2F7] font-medium text-sm py-2 px-3 rounded-lg"
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              ))}
              {user ? (
                <Link
                  href="/account"
                  className="block text-[#172033] hover:bg-[#EEF2F7] font-medium text-sm py-2 px-3 rounded-lg"
                  onClick={closeMenu}
                >
                  Account
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    closeMenu()
                    openLoginModal()
                  }}
                  className="block w-full text-left text-[#172033] hover:bg-[#EEF2F7] font-medium text-sm py-2 px-3 rounded-lg"
                >
                  Admin
                </button>
              )}

              <p className="text-xs uppercase tracking-wide text-[#667085] px-3 mt-4 mb-1">Shop</p>
              <Link
                href="/products"
                className="block text-[#172033] hover:bg-[#EEF2F7] font-medium text-sm py-2 px-3 rounded-lg"
                onClick={closeMenu}
              >
                All
              </Link>
              {categoryNames.map((name) => (
                <Link
                  key={name}
                  href={categoryHref(name)}
                  className="block text-[#172033] hover:bg-[#EEF2F7] font-medium text-sm py-2 px-3 rounded-lg"
                  onClick={closeMenu}
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  )
}
