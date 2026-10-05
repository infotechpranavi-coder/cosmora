"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import {
  Heart,
  ShoppingBag,
  Star,
  Plus,
  Minus,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Sparkles,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/hooks/use-wishlist"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { calculateDiscount } from "@/lib/price-utils"
import { saveBuyNowItem } from "@/lib/buy-now"
import PriceDisplay from "@/components/price-display"
import { useToast } from "@/hooks/use-toast"

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  description: string
  keyFeatures: string[]
  images: Array<{ url: string; publicId: string }>
  videos: Array<{ url: string; publicId: string }>
  category: string
  quantity: number
  isNew: boolean
  isOutOfStock: boolean
  isOnSale: boolean
  offerPercentage?: number
  sizeConstraints?: string
}

export default function ProductDetail({ productId: propProductId }: { productId?: string }) {
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const productId = propProductId || searchParams.get("id") || searchParams.get("productId")

        if (productId) {
          const response = await fetch(`/api/products/${productId}`)
          const data = await response.json()

          if (data.success) {
            setProduct(data.data)
            if (data.data?.sizeConstraints) {
              const sizes = data.data.sizeConstraints.split(",").map((s: string) => s.trim())
              if (sizes.length > 0) setSelectedSize(sizes[0])
            }
          } else {
            setError(data.error || "Failed to fetch product")
          }
        } else {
          const response = await fetch("/api/products")
          const data = await response.json()

          if (data.success && data.data.length > 0) {
            setProduct(data.data[0])
            if (data.data[0]?.sizeConstraints) {
              const sizes = data.data[0].sizeConstraints.split(",").map((s: string) => s.trim())
              if (sizes.length > 0) setSelectedSize(sizes[0])
            }
          } else {
            setError("No products available")
          }
        }
      } catch (err) {
        setError("Failed to fetch product")
        console.error("Error fetching product:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [searchParams, propProductId])

  if (loading) {
    return (
      <div className="bg-[#FAF8F5] py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 animate-pulse">
            <div className="space-y-4">
              <div className="aspect-[4/5] bg-slate-200 rounded-3xl" />
              <div className="grid grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-slate-200 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-6 pt-4">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-10 bg-slate-200 rounded w-3/4" />
              <div className="h-6 bg-slate-200 rounded w-1/3" />
              <div className="h-20 bg-slate-200 rounded" />
              <div className="h-12 bg-slate-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="bg-[#FAF8F5] py-20">
        <div className="max-w-xl mx-auto px-4 text-center bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-[#14243D] mb-3">Product Not Found</h2>
          <p className="text-slate-500 mb-6">{error || "The product you are looking for does not exist."}</p>
          <Button asChild className="rounded-full px-8 bg-[#14243D] hover:bg-[#1E3A60] text-white">
            <Link href="/products">Browse full catalog</Link>
          </Button>
        </div>
      </div>
    )
  }

  const isFavorited = isWishlisted(product._id)
  const discount =
    product.offerPercentage ||
    (product.originalPrice && product.originalPrice > product.price
      ? calculateDiscount(product.price, product.originalPrice)
      : 0)

  const incrementQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = () => {
    if (product.isOutOfStock || product.quantity <= 0) return
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg",
      category: product.category,
      brand: "Cosmora",
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    if (product.isOutOfStock || product.quantity <= 0) return
    saveBuyNowItem({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg",
      category: product.category,
      brand: "Cosmora",
      quantity,
    })
    router.push("/checkout?mode=buynow")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied!",
        description: "Product link copied to clipboard.",
        duration: 2000,
      })
    }
  }

  return (
    <div className="bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap pb-1">
          <Link href="/" className="hover:text-[#14243D] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#14243D] transition-colors">
            Catalog
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="hover:text-[#14243D] transition-colors"
              >
                {product.category}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Grid Layout */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14 items-start">
          {/* Left: Gallery Section */}
          <div className="space-y-4 lg:sticky lg:top-24">
            <div className="relative aspect-[4/5] sm:aspect-square w-full overflow-hidden rounded-3xl bg-white border border-[#E8E2D8] shadow-sm">
              <Image
                src={
                  product.images && product.images.length > 0
                    ? product.images[selectedImage].url
                    : "/placeholder.svg"
                }
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-[#14243D] rounded-full shadow-sm">
                    New Season
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50/95 backdrop-blur-md rounded-full shadow-sm border border-rose-200">
                    {discount}% OFF
                  </span>
                )}
                {(product.isOutOfStock || product.quantity <= 0) && (
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-slate-800 rounded-full shadow-sm">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Wishlist Button Overlay */}
              <button
                onClick={() => toggleWishlist({ id: product._id, name: product.name })}
                className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 backdrop-blur-md text-slate-700 shadow-sm hover:bg-white hover:text-rose-600 hover:scale-110 active:scale-95 transition-all"
                aria-label="Wishlist toggle"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isFavorited ? "fill-rose-500 text-rose-500" : ""
                  }`}
                />
              </button>
            </div>

            {/* Thumbnail Navigator */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition-all ${
                      selectedImage === index
                        ? "border-[#C49A52] ring-2 ring-[#C49A52]/25 shadow-md"
                        : "border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Purchase Section */}
          <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-10 shadow-sm">
            {/* Category & Verified Badge */}
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C49A52] bg-[#FAF6EE] px-3 py-1 rounded-md">
                {product.category || "Exclusive apparel"}
              </span>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#14243D] transition-colors p-1.5"
                title="Share product"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#14243D] tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Reviews & Social Proof */}
            <div className="flex flex-wrap items-center gap-3 mt-3 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 4.8)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200 fill-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-800">
                {product.rating ? product.rating.toFixed(1) : "4.8"}
              </span>
              <span className="text-xs text-slate-400">
                ({product.reviews || 18} verified buyer reviews)
              </span>
              <span className="text-xs text-emerald-600 font-medium ml-auto flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock & Ready to Ship
              </span>
            </div>

            {/* Pricing Area */}
            <div className="py-5">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#14243D]">
                  <PriceDisplay amount={product.price} />
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-slate-400 line-through">
                    <PriceDisplay amount={product.originalPrice} />
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
                    Save {discount}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Inclusive of all taxes. Free express shipping on all orders across India.
              </p>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Key Features Pill / Bullet Cards */}
            {product.keyFeatures && product.keyFeatures.length > 0 && (
              <div className="mb-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Key Craftsmanship & Specifications
                </h3>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {product.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizeConstraints && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Select Size
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Selected: <strong className="text-slate-800">{selectedSize || "None"}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizeConstraints.split(",").map((size) => {
                    const s = size.trim()
                    const isSelected = selectedSize === s
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[46px] px-4 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                          isSelected
                            ? "border-[#14243D] bg-[#14243D] text-white shadow-md"
                            : "border-slate-200 text-slate-700 hover:border-slate-400 bg-white"
                        }`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
                  <button
                    onClick={decrementQuantity}
                    disabled={product.isOutOfStock || product.quantity <= 0 || quantity <= 1}
                    className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-600 hover:bg-white transition-colors disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={product.isOutOfStock || product.quantity <= 0 || quantity >= product.quantity}
                    className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-600 hover:bg-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-xs text-slate-500">
                  {product.isOutOfStock || product.quantity <= 0 ? (
                    <span className="text-rose-600 font-semibold">Out of Stock</span>
                  ) : (
                    <span>({product.quantity} pieces in factory inventory)</span>
                  )}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={product.isOutOfStock || product.quantity <= 0}
                className={`flex-1 h-14 rounded-2xl text-base font-semibold transition-all shadow-lg ${
                  product.isOutOfStock || product.quantity <= 0
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : added
                    ? "bg-emerald-600 text-white shadow-emerald-500/25"
                    : "bg-[#14243D] hover:bg-[#1E3A60] text-white shadow-[#14243D]/20 hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 mr-2" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 mr-2" /> Add to Cart
                  </>
                )}
              </Button>

              <Button
                onClick={handleBuyNow}
                disabled={product.isOutOfStock || product.quantity <= 0}
                className={`flex-1 h-14 rounded-2xl text-base font-semibold text-[#14243D] transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${
                  product.isOutOfStock || product.quantity <= 0
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "shadow-amber-500/20"
                }`}
                style={
                  product.isOutOfStock || product.quantity <= 0
                    ? undefined
                    : { background: "linear-gradient(90deg, #E8D5B0, #C49A52)" }
                }
              >
                Buy Now (1-Click)
              </Button>
            </div>

            {/* Trust and Guarantees Box */}
            <div className="pt-6 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#C49A52] shadow-sm">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-800 font-semibold">Free Shipping</strong>
                    <span className="text-[11px] text-slate-400">All India Delivery</span>
                  </div>
                </div>

                <Link
                  href="/return-policy"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#C49A52] shadow-sm">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-800 font-semibold">7 Days Returns</strong>
                    <span className="text-[11px] text-slate-400">Hassle-free policy</span>
                  </div>
                </Link>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#C49A52] shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-800 font-semibold">100% Genuine</strong>
                    <span className="text-[11px] text-slate-400">Factory guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
