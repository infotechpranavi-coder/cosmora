"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Heart, ShoppingBag, Eye, Star, Check } from "lucide-react"
import type { CatalogItem } from "@/data/print-marketplace"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/hooks/use-wishlist"
import PriceDisplay from "@/components/price-display"
import { QuickViewModal } from "@/components/quick-view-modal"

export function MarketplaceProductCard(props: CatalogItem) {
  const {
    id,
    href,
    image,
    secondImage,
    name,
    price,
    originalPrice,
    priceLabel,
    subtitle,
    category,
    rating = 4.8,
    reviews = 18,
    isNew = false,
    isOnSale = false,
    isOutOfStock = false,
    offerPercentage,
    colors = [],
  } = props

  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [added, setAdded] = useState(false)

  const effectivePrice = price ?? 0
  const discount =
    offerPercentage ||
    (originalPrice && originalPrice > effectivePrice
      ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100)
      : 0)

  const isFavorited = isWishlisted(id)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) return

    addItem({
      id: id || href || name,
      name,
      price: effectivePrice,
      originalPrice,
      image,
      category: category || subtitle || "Catalog",
      brand: "Cosmora",
      quantity: 1,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuickViewOpen(true)
  }

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist({ id, name })
  }

  return (
    <>
      <div className="group relative flex flex-col h-full bg-white rounded-2xl border border-[#ECE7DE] hover:border-[#C49A52]/40 shadow-[0_4px_16px_rgba(20,36,61,0.03)] hover:shadow-[0_20px_35px_rgba(20,36,61,0.1)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
        {/* Clickable Image Container */}
        <div className="relative aspect-[4/5] bg-[#F7F5F0] overflow-hidden">
          <Link href={href} className="block h-full w-full">
            {/* Primary Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={name}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                secondImage ? "group-hover:opacity-0" : ""
              }`}
            />

            {/* Secondary Image on Hover */}
            {secondImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={secondImage}
                alt={`${name} preview`}
                className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out group-hover:scale-105"
              />
            )}
          </Link>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
            {isNew && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#14243D] bg-white/95 backdrop-blur-md rounded-full shadow-sm border border-slate-200">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50/95 backdrop-blur-md rounded-full shadow-sm border border-rose-200">
                {discount}% OFF
              </span>
            )}
            {isOutOfStock && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-slate-800/90 backdrop-blur-md rounded-full shadow-sm">
                Sold Out
              </span>
            )}
          </div>

          {/* Wishlist Button (Floating Top Right) */}
          <button
            onClick={handleWishlistClick}
            aria-label="Add to wishlist"
            className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 backdrop-blur-md text-slate-700 shadow-sm hover:bg-white hover:text-rose-600 hover:scale-110 active:scale-95 transition-all"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorited ? "fill-rose-500 text-rose-500" : ""
              }`}
            />
          </button>

          {/* Quick Action Overlay (Slide-up on Card Hover) */}
          <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:flex items-center gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={handleOpenQuickView}
              className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl bg-white/95 hover:bg-white text-[#14243D] text-xs font-semibold shadow-md backdrop-blur-md border border-slate-200 hover:border-slate-300 transition-all active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick view
            </button>

            {!isOutOfStock && (
              <button
                onClick={handleQuickAdd}
                aria-label="Quick add to cart"
                className={`flex items-center justify-center h-10 px-3.5 rounded-xl font-semibold text-xs shadow-md transition-all active:scale-95 ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-[#14243D] hover:bg-[#1E3A60] text-white"
                }`}
              >
                {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Card Body Information */}
        <div className="flex flex-col flex-1 p-4 sm:p-4.5 justify-between">
          <div>
            {/* Category / Subtitle */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C49A52] line-clamp-1">
                {category || subtitle || "Cosmora Edit"}
              </span>

              {/* Rating */}
              <div className="flex items-center gap-1 shrink-0">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-[11px] font-medium text-slate-700">
                  {rating ? rating.toFixed(1) : "4.8"}
                </span>
                <span className="text-[10px] text-slate-400">({reviews || 16})</span>
              </div>
            </div>

            {/* Product Title */}
            <Link href={href} className="block group/title">
              <h3 className="text-sm sm:text-[15px] font-semibold text-[#172033] leading-snug line-clamp-2 group-hover/title:text-[#C49A52] transition-colors">
                {name}
              </h3>
            </Link>

            {colors.length > 0 && (
              <div className="mt-2 flex items-center gap-1.5">
                {colors.slice(0, 5).map((color) => (
                  <span
                    key={`${color.name}-${color.hex}`}
                    title={color.name}
                    className={`h-3.5 w-3.5 rounded-full border ${
                      color.hex.toLowerCase() === "#f5f5f5" || color.hex.toLowerCase() === "#ffffff"
                        ? "border-slate-300"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
                {colors.length > 5 && (
                  <span className="text-[10px] text-slate-400 font-medium">+{colors.length - 5}</span>
                )}
              </div>
            )}
          </div>

          {/* Pricing & Cart Action Row */}
          <div className="pt-3 mt-3 border-t border-[#F2ECE1] flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-[#14243D]">
                {effectivePrice > 0 ? (
                  <PriceDisplay amount={effectivePrice} />
                ) : (
                  priceLabel || "—"
                )}
              </span>

              {originalPrice && originalPrice > effectivePrice && (
                <span className="text-xs text-slate-400 line-through">
                  <PriceDisplay amount={originalPrice} />
                </span>
              )}
            </div>

            {/* Mobile quick-add icon or Free delivery pill */}
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className={`sm:hidden flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm transition-all ${
                isOutOfStock
                  ? "bg-slate-300"
                  : added
                  ? "bg-emerald-600"
                  : "bg-[#14243D]"
              }`}
              aria-label="Add to cart"
            >
              {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            </button>

            <span className="hidden sm:inline-block text-[11px] text-slate-400">
              Free delivery
            </span>
          </div>
        </div>
      </div>

      {/* Quick View Dialog */}
      <QuickViewModal
        item={props}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  )
}

export function MarketplaceCategoryRow({
  title,
  items,
  columns = 4,
}: {
  title: string
  items: CatalogItem[]
  columns?: 2 | 4 | 5
}) {
  const grid =
    columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : columns === 5
      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"

  return (
    <section className="py-10 sm:py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="inline-block w-1.5 h-7 sm:h-8 bg-[#C49A52] rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">{title}</h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-[#14243D] hover:text-[#C49A52] transition-colors"
          >
            Explore all →
          </Link>
        </div>

        <div className={`grid ${grid} gap-4 sm:gap-6`}>
          {items.map((item, idx) => (
            <MarketplaceProductCard key={item.id || item.href || idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}

/** Kept so stale Fast Refresh of page.tsx does not crash on the old import. */
export function MarketplaceSection({
  title,
  products,
  items,
  emptyLabel = "No products available",
}: {
  title: string
  href?: string
  products?: Array<{
    _id: string
    name: string
    price: number
    originalPrice?: number
    images?: Array<{ url: string }>
    isOnSale?: boolean
    rating?: number
    reviews?: number
  }>
  items?: CatalogItem[]
  emptyLabel?: string
}) {
  const cards: CatalogItem[] =
    items ??
    (products || []).map((product) => ({
      id: product._id,
      name: product.name,
      href: `/products/${product._id}`,
      image: product.images?.[0]?.url || "/placeholder.svg",
      price: product.price,
      originalPrice: product.originalPrice,
      priceLabel: `₹${Number(product.price).toLocaleString("en-IN")}`,
      subtitle: product.isOnSale ? "On offer" : undefined,
      rating: product.rating,
      reviews: product.reviews,
    }))

  if (cards.length === 0) {
    return (
      <section className="py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block w-1.5 h-7 bg-[#C49A52] rounded-full" />
            <h2 className="text-2xl font-bold text-[#172033]">{title}</h2>
          </div>
          <p className="text-[#667085] py-10 text-center">{emptyLabel}</p>
        </div>
      </section>
    )
  }

  return <MarketplaceCategoryRow title={title} items={cards} />
}
