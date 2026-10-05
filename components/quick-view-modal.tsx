"use client"

import React, { useState } from "react"
import Link from "next/link"
import { X, Star, ShoppingBag, Heart, Check, ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react"
import type { CatalogItem } from "@/data/print-marketplace"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/hooks/use-wishlist"
import PriceDisplay from "@/components/price-display"

interface QuickViewModalProps {
  item: CatalogItem | null
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ item, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  // Reset when item opens
  React.useEffect(() => {
    if (item) {
      setSelectedImage(item.image)
      setQuantity(1)
      setAdded(false)
      if (item.sizeConstraints) {
        const sizes = item.sizeConstraints.split(",").map((s) => s.trim())
        if (sizes.length > 0) setSelectedSize(sizes[0])
      } else {
        setSelectedSize("")
      }
    }
  }, [item])

  if (!isOpen || !item) return null

  const images = [item.image, item.secondImage].filter(Boolean) as string[]
  const currentImage = selectedImage || item.image
  const price = item.price ?? 0
  const originalPrice = item.originalPrice
  const discount =
    item.offerPercentage ||
    (originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0)

  const sizes = item.sizeConstraints
    ? item.sizeConstraints.split(",").map((s) => s.trim()).filter(Boolean)
    : []

  const handleAddToCart = () => {
    if (item.isOutOfStock) return
    addItem({
      id: item.id || item.name,
      name: item.name,
      price: item.price || 0,
      originalPrice: item.originalPrice,
      image: item.image,
      category: item.category || item.subtitle || "Apparel",
      brand: "Cosmora",
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const isFavorited = isWishlisted(item.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-white/20 animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors shadow-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-6 sm:p-8">
          {/* Images Section */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt={item.name}
                className="h-full w-full object-cover transition-all duration-500"
              />

              {/* Badges */}
              <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5">
                {item.isNew && (
                  <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white bg-[#14243D] rounded-full shadow-sm">
                    New Season
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 rounded-full shadow-sm">
                    {discount}% OFF
                  </span>
                )}
                {item.isOutOfStock && (
                  <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white bg-slate-800 rounded-full shadow-sm">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      currentImage === img
                        ? "border-[#C49A52] ring-2 ring-[#C49A52]/20"
                        : "border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Wishlist */}
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C49A52] bg-[#FAF6EE] px-2.5 py-0.5 rounded-md">
                  {item.category || item.subtitle || "Exclusive"}
                </span>

                <button
                  onClick={() => toggleWishlist(item)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                    isFavorited
                      ? "text-rose-600 bg-rose-50 border-rose-200"
                      : "text-slate-600 hover:text-rose-600 hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorited ? "fill-rose-500" : ""}`} />
                  <span>{isFavorited ? "Saved" : "Save"}</span>
                </button>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14243D] leading-tight">
                {item.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2.5 mb-4">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(item.rating || 4.8)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200 fill-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-800">
                  {item.rating ? item.rating.toFixed(1) : "4.8"}
                </span>
                <span className="text-xs text-slate-500">
                  ({item.reviews || 18} reviews)
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 py-3 border-y border-slate-100 my-4">
                <span className="text-3xl font-extrabold text-[#14243D]">
                  {price > 0 ? (
                    <PriceDisplay amount={price} />
                  ) : (
                    item.priceLabel || "Price on request"
                  )}
                </span>

                {originalPrice && originalPrice > price && (
                  <span className="text-base text-slate-400 line-through">
                    <PriceDisplay amount={originalPrice} />
                  </span>
                )}

                {discount > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Save {discount}%
                  </span>
                )}
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-sm text-slate-600 leading-relaxed mb-5 line-clamp-3">
                  {item.description}
                </p>
              )}

              {/* Size Selector */}
              {sizes.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Select Size
                    </span>
                    <span className="text-xs text-slate-500">{selectedSize || "Select one"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[42px] px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                          selectedSize === s
                            ? "border-[#14243D] bg-[#14243D] text-white shadow-sm"
                            : "border-slate-200 text-slate-700 hover:border-slate-400 bg-white"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Quantity
                </span>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white transition-colors disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500">In stock, ready to dispatch</span>
              </div>
            </div>

            {/* Actions & Links */}
            <div>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                  onClick={handleAddToCart}
                  disabled={item.isOutOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 px-6 font-semibold text-sm transition-all shadow-md ${
                    item.isOutOfStock
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : added
                      ? "bg-emerald-600 text-white shadow-emerald-500/20"
                      : "bg-[#14243D] hover:bg-[#1E3A60] text-white shadow-[#14243D]/20 hover:-translate-y-0.5 active:translate-y-0"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Bag
                    </>
                  )}
                </button>

                <Link
                  href={item.href}
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-[#14243D] hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  View full details
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-[11px] text-slate-500 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-[#C49A52]" />
                  <span>Free express delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-[#C49A52]" />
                  <span>7 days easy return</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#C49A52]" />
                  <span>100% verified quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
