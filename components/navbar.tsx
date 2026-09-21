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
  MessageCircle,
  ChevronDown,
  ArrowUpRight,
  ShoppingBag,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import CartIcon from "./cart-icon"
import { CATEGORY_TREE } from "@/data/print-marketplace"
import { toCategoryTree, type DbCategory } from "@/lib/catalog-live"

const UTILITY_LINKS = [
  { href: "/about", label: "About", Icon: Info },
  { href: "/contact", label: "Contact", Icon: Mail },
  { href: "/locations", label: "Locations", Icon: MapPin },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [catsOpen, setCatsOpen] = useState(false)
  const [categoryTree, setCategoryTree] = useState(CATEGORY_TREE)
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
        if (!cancelled && data.success && Array.isArray(data.data) && data.data.length) {
          setCategoryTree(toCategoryTree(data.data as DbCategory[]))
        }
      } catch {
        /* keep static fallback */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      <div
        className="text-white"
        style={{
          background: "linear-gradient(90deg, #14243D 0%, #14243D 55%, #243B5A 100%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-2 lg:py-0 lg:h-12">
            <nav className="flex flex-wrap items-center gap-1 sm:gap-0">
              {UTILITY_LINKS.map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-white/95 hover:bg-white/15 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="whitespace-nowrap">{label}</span>
                </Link>
              ))}

              {user ? (
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-white/95 hover:bg-white/15"
                >
                  <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {user.firstName || "Account"}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={openLoginModal}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-white/95 hover:bg-white/15"
                >
                  <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Register or Sign In
                </button>
              )}
            </nav>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex items-center justify-between min-h-[68px] lg:min-h-[76px] gap-4">
            <Link href="/" className="flex items-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cosmora-logo.png"
                alt="COSMORA"
                className="h-16 sm:h-[4.5rem] w-auto object-contain"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-7 flex-1">
              <div
                className="relative"
                onMouseEnter={() => setCatsOpen(true)}
                onMouseLeave={() => setCatsOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setCatsOpen((v) => !v)}
                  className="flex items-center gap-1 text-sm font-medium text-[#172033] hover:text-[#14243D]"
                >
                  Categories
                  <ChevronDown className={`w-4 h-4 transition-transform ${catsOpen ? "rotate-180" : ""}`} />
                </button>
                {catsOpen && (
                  <div className="absolute left-0 top-full pt-3 z-50">
                    <div className="w-[320px] bg-white rounded-xl shadow-xl border border-[#E5E7EB] p-5">
                      {categoryTree.map((group) => (
                        <div key={group.name} className="mb-3 last:mb-0">
                          <p className="text-sm font-bold text-[#172033] mb-2">{group.name}</p>
                          {group.items.map((c) => (
                            <Link
                              key={c.name}
                              href={c.href}
                              className="block py-1.5 text-sm text-[#667085] hover:text-[#14243D]"
                            >
                              {c.name}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link href="/products" className="text-sm font-medium text-[#172033] hover:text-[#14243D]">
                T-Shirt Printing
              </Link>
            </nav>

            <div className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsSearchOpen((v) => !v)}
                className="p-2 text-[#667085] hover:text-[#14243D]"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link href="/contact" className="p-2 text-[#667085] hover:text-[#14243D]" aria-label="Message">
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="hidden xl:inline-flex p-2 text-[#667085] hover:text-[#14243D]" aria-label="Email">
                <Mail className="w-5 h-5" />
              </Link>
              <CartIcon variant="light" />
              <Link
                href="/contact"
                className="ml-1 inline-flex items-center gap-2 rounded-full text-white pl-4 pr-1 py-1 text-sm font-semibold shadow-md transition-all whitespace-nowrap hover:opacity-95"
                style={{ background: "linear-gradient(90deg, #C49A52 0%, #E8D5B0 100%)" }}
              >
                Get a quote
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#14243D]">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            </div>

            <div className="lg:hidden flex items-center gap-1">
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

          {isSearchOpen && (
            <div className="pb-3">
              <form action="/search" method="GET" className="relative">
                <input
                  type="text"
                  name="q"
                  placeholder="Search t-shirts here"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-[#172033] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14243D]/40 text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search className="w-4 h-4 text-[#14243D]" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={closeMenu} aria-hidden />
          <div className="absolute left-0 right-0 z-50 lg:hidden">
            <div className="mx-3 mt-2 mb-4 bg-white rounded-xl shadow-xl p-5 max-h-[70vh] overflow-y-auto">
              {categoryTree.map((group) => (
                <div key={group.name} className="mb-4">
                  <p className="text-xs uppercase tracking-wide text-[#667085] px-3 mb-1">{group.name}</p>
                  {group.items.map((c) => (
                    <Link
                      key={c.name}
                      href={c.href}
                      className="block text-[#172033] hover:text-[#14243D] hover:bg-[#EEF2F7] font-medium text-sm py-2 px-3 rounded-lg"
                      onClick={closeMenu}
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              ))}
              <Link
                href="/contact"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-full text-white font-semibold"
                style={{ background: "linear-gradient(90deg, #C49A52 0%, #E8D5B0 100%)" }}
              >
                Get a quote
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
