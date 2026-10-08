"use client"

import Link from "next/link"
import {
  Search,
  Menu,
  X,
  MapPin,
  Info,
  Mail,
  ShoppingBag,
  ChevronDown,
  Package,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useCart } from "@/contexts/cart-context"
import CartIcon from "./cart-icon"
import ProductSearchBar from "./product-search-bar"
import { SHOP_NAV } from "@/lib/shop-nav"

const UTILITY_LINKS = [
  { href: "/", label: "Home", Icon: null as null },
  { href: "/about", label: "About Us", Icon: Info },
  { href: "/contact", label: "Contact Us", Icon: Mail },
  { href: "/locations", label: "Locations", Icon: MapPin },
]

const BULK_ORDERS_LINK = { href: "/bulk-orders", label: "Bulk Orders", Icon: Package }

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null)
  const { state } = useCart()

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const closeMenu = () => {
    setIsMenuOpen(false)
    setMobileOpenGroup(null)
  }

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-5 lg:gap-8 min-h-[68px] lg:min-h-[76px]">
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

            <div className="hidden lg:block flex-1 max-w-xl xl:max-w-2xl">
              <ProductSearchBar />
            </div>

            <nav className="hidden lg:flex items-center gap-4 xl:gap-5 shrink-0 ml-auto">
              {UTILITY_LINKS.map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#172033] hover:text-[#14243D]"
                >
                  {Icon ? <Icon className="w-4 h-4 text-[#667085]" /> : null}
                  {label}
                </Link>
              ))}
              <div className="flex items-center gap-2 ml-1">
                <CartIcon variant="light" />
                <Link
                  href={BULK_ORDERS_LINK.href}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#14243D] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1E3A60] transition-colors"
                >
                  <Package className="w-4 h-4 text-[#E8D5B0]" />
                  Bulk Orders
                </Link>
              </div>
            </nav>

            <div className="lg:hidden flex items-center gap-1.5 ml-auto shrink-0">
              <Link href="/cart" className="relative p-2 text-[#172033]" aria-label="Cart">
                <ShoppingBag className="w-5 h-5" />
                {state.itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#C49A52] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {state.itemCount}
                  </span>
                )}
              </Link>
              <Link
                href={BULK_ORDERS_LINK.href}
                className="inline-flex items-center gap-1 rounded-full bg-[#14243D] px-2.5 py-1.5 text-[11px] font-semibold text-white"
              >
                <Package className="w-3.5 h-3.5 text-[#E8D5B0]" />
                Bulk
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

      {/* Blue bar — Clothing / Bags / Accessories with dropdowns */}
      <div
        className="text-white relative z-40"
        style={{
          background: "linear-gradient(90deg, #14243D 0%, #14243D 55%, #243B5A 100%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8">
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2 py-2 lg:min-h-12 overflow-visible">
            <Link
              href="/"
              className="px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-white/95 hover:bg-white/15 transition-colors whitespace-nowrap"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-white/95 hover:bg-white/15 transition-colors whitespace-nowrap"
            >
              All
            </Link>

            {SHOP_NAV.map((group) => (
              <div
                key={group.name}
                className="relative"
                onMouseEnter={() => setOpenDropdown(group.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-white/95 hover:bg-white/15 transition-colors whitespace-nowrap"
                  onClick={() =>
                    setOpenDropdown((prev) => (prev === group.name ? null : group.name))
                  }
                  aria-expanded={openDropdown === group.name}
                >
                  {group.name}
                  <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                </button>

                {openDropdown === group.name && (
                  <div className="absolute left-0 top-full pt-1 min-w-[220px] z-50">
                    <div className="rounded-xl bg-white shadow-xl border border-slate-200 py-2 overflow-hidden">
                      <Link
                        href={group.href}
                        className="block px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#14243D] hover:bg-[#EEF2F7]"
                        onClick={() => setOpenDropdown(null)}
                      >
                        All {group.name}
                      </Link>
                      <div className="border-t border-slate-100 my-1" />
                      {group.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-[#172033] hover:bg-[#EEF2F7]"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
              <p className="text-xs uppercase tracking-wide text-[#667085] px-3 mt-4 mb-1">Shop</p>
              <Link
                href="/products"
                className="block text-[#172033] hover:bg-[#EEF2F7] font-medium text-sm py-2 px-3 rounded-lg"
                onClick={closeMenu}
              >
                All Products
              </Link>
              {SHOP_NAV.map((group) => (
                <div key={group.name} className="mt-1">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-[#14243D] hover:bg-[#EEF2F7] rounded-lg"
                    onClick={() =>
                      setMobileOpenGroup((prev) => (prev === group.name ? null : group.name))
                    }
                  >
                    {group.name}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        mobileOpenGroup === group.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {mobileOpenGroup === group.name && (
                    <div className="ml-2 border-l border-slate-200 pl-2">
                      <Link
                        href={group.href}
                        className="block text-[#667085] hover:bg-[#EEF2F7] text-sm py-1.5 px-3 rounded-lg"
                        onClick={closeMenu}
                      >
                        All {group.name}
                      </Link>
                      {group.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block text-[#172033] hover:bg-[#EEF2F7] text-sm py-1.5 px-3 rounded-lg"
                          onClick={closeMenu}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  )
}
