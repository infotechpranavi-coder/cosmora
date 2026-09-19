"use client"

import Link from "next/link"
import {
  Search,
  Menu,
  X,
  MapPin,
  Package,
  LogIn,
  Info,
  Mail,
  MessageCircle,
  ChevronDown,
  ArrowUpRight,
  ShoppingBag,
  Store,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import CartIcon from "./cart-icon"
import { CATEGORY_TREE, IMG } from "@/data/print-marketplace"

const UTILITY_LINKS = [
  { href: "/locations", label: "Store Locator", Icon: MapPin, featured: true },
  { href: "/account", label: "Track Your Order", Icon: Package },
  { href: "/about", label: "About", Icon: Info },
  { href: "/contact", label: "Contact", Icon: Mail },
  { href: "/locations", label: "Locations", Icon: MapPin },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [catsOpen, setCatsOpen] = useState(false)
  const { state } = useCart()
  const { user, openLoginModal } = useAuth()

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      <div
        className="text-white"
        style={{
          background: "linear-gradient(90deg, #6D28D9 0%, #7C3AED 28%, #A855F7 62%, #E879F9 100%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-2 lg:py-0 lg:h-12">
            <Link href="/" className="font-semibold text-sm sm:text-base tracking-wide shrink-0 mr-2 lg:mr-6">
              Print Marketplace
            </Link>

            <nav className="flex flex-wrap items-center gap-1 sm:gap-0">
              {UTILITY_LINKS.map(({ href, label, Icon, featured }) => (
                <Link
                  key={label}
                  href={href}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium transition-colors ${
                    featured
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-white/95 hover:bg-white/15"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="whitespace-nowrap">{label}</span>
                </Link>
              ))}

              <Link
                href="/contact"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-white/95 hover:bg-white/15"
              >
                <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Merchant
              </Link>

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

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex items-center justify-between min-h-[58px] lg:min-h-[64px] gap-4">
            <Link href="/" className="flex items-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMG("/img/logo.png")}
                alt="Inktantra"
                className="h-10 sm:h-12 w-auto object-contain"
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
                  className="flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-[#7C3AED]"
                >
                  Categories
                  <ChevronDown className={`w-4 h-4 transition-transform ${catsOpen ? "rotate-180" : ""}`} />
                </button>
                {catsOpen && (
                  <div className="absolute left-0 top-full pt-3 z-50">
                    <div className="w-[720px] bg-white rounded-xl shadow-xl border border-gray-100 p-5 grid grid-cols-3 gap-4">
                      {CATEGORY_TREE.map((group) => (
                        <div key={group.name}>
                          <p className="text-sm font-bold text-gray-900 mb-2">{group.name}</p>
                          {group.items.map((c) => (
                            <Link
                              key={c.name}
                              href={c.href}
                              className="block py-1.5 text-sm text-gray-600 hover:text-[#7C3AED]"
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
              <Link href="/products" className="text-sm font-medium text-gray-800 hover:text-[#7C3AED]">
                Merchandise
              </Link>
              <Link href="/products?category=Sports T-Shirt" className="text-sm font-medium text-gray-800 hover:text-[#7C3AED]">
                Sports tees
              </Link>
            </nav>

            <div className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsSearchOpen((v) => !v)}
                className="p-2 text-gray-600 hover:text-[#7C3AED]"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link href="/contact" className="p-2 text-gray-600 hover:text-[#7C3AED]" aria-label="Message">
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="hidden xl:inline-flex p-2 text-gray-600 hover:text-[#7C3AED]" aria-label="Email">
                <Mail className="w-5 h-5" />
              </Link>
              <CartIcon variant="light" />
              <Link
                href="/contact"
                className="ml-1 inline-flex items-center gap-2 rounded-full bg-[#6D28D9] hover:bg-[#5B21B6] text-white pl-4 pr-1 py-1 text-sm font-semibold shadow-md transition-colors whitespace-nowrap"
              >
                Get a quote
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EC4899]">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            </div>

            <div className="lg:hidden flex items-center gap-1">
              <Link href="/cart" className="relative p-2 text-gray-700" aria-label="Cart">
                <ShoppingBag className="w-5 h-5" />
                {state.itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#EC4899] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
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
                className="p-2 text-gray-700"
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
                className="p-2 text-gray-700"
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
                  placeholder="Search products here"
                  className="w-full px-4 py-2.5 rounded-lg border border-violet-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search className="w-4 h-4 text-[#7C3AED]" />
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
              {CATEGORY_TREE.map((group) => (
                <div key={group.name} className="mb-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400 px-3 mb-1">{group.name}</p>
                  {group.items.map((c) => (
                    <Link
                      key={c.name}
                      href={c.href}
                      className="block text-gray-900 hover:text-[#7C3AED] hover:bg-violet-50 font-medium text-sm py-2 px-3 rounded-lg"
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
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#6D28D9] text-white font-semibold"
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
