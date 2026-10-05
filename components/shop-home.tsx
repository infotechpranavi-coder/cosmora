"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowUpRight,
  Star,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Check,
  Eye,
  Truck,
  RotateCcw,
  ShieldCheck,
  Layers,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Film,
} from "lucide-react"
import { MarketplaceProductCard } from "@/components/marketplace-section"
import PriceDisplay from "@/components/price-display"
import { QuickViewModal } from "@/components/quick-view-modal"
import { useCart } from "@/contexts/cart-context"
import {
  categoryHref,
  productToCatalogItem,
  type DbProduct,
} from "@/lib/catalog-live"
import type { CatalogItem } from "@/data/print-marketplace"

const CATEGORY_META: Record<
  string,
  {
    tag: string
    title: string
    highlight: string
    description: string
    features: string[]
    href: string
  }
> = {
  all: {
    tag: "SIGNATURE 2026 EDIT",
    title: "Dress the day.",
    highlight: "Carry the rest.",
    description:
      "Curated apparel & luggage from Cosmora — heavy-duty bags, heavyweight combed tees, and crisp Oxford shirts at factory rates.",
    features: ["Factory-Direct Rates", "100% Premium Fabrics", "Ready to Wear or Print"],
    href: "/products",
  },
  bags: {
    tag: "ENGINEERED CARRY",
    title: "Carry comfort.",
    highlight: "Travel prepared.",
    description:
      "Heavy-duty canvas and water-resistant builds for daily commutes, weekend trips, and gear protection with reinforced stitching.",
    features: ["Water-Resistant Base", "Reinforced Stitching", "Padded Laptop Sleeves"],
    href: "/products?category=Bags",
  },
  "t-shirts": {
    tag: "DAILY LUXURY",
    title: "Heavyweight cotton.",
    highlight: "Clean minimalist drape.",
    description:
      "240 GSM combed cotton round-necks and breathable pique polos designed for rich texture, supreme drape, and all-day comfort.",
    features: ["240 GSM Combed Cotton", "Bio-Washed Finish", "Pre-Shrunk Ribbed Collar"],
    href: "/products?category=T-Shirts",
  },
  "formal shirts": {
    tag: "EXECUTIVE TAILORED",
    title: "Crisp Oxford cuts.",
    highlight: "Executive poise.",
    description:
      "Sharp formal shirts tailored with structured spread collars, breathable fine weaves, and clean modern silhouettes.",
    features: ["Breathable Cotton Weave", "Structured Spread Collar", "Easy-Care Fabric"],
    href: "/products?category=Formal%20Shirts",
  },
}

const CATEGORY_VIDEOS: Record<
  string,
  {
    src: string
    title: string
    tag: string
    badge: string
    description: string
  }
> = {
  all: {
    src: "/fashion-hero.mp4",
    title: "Cosmora Motion Reel 2026",
    tag: "Signature Apparel & Luggage",
    badge: "Official Film",
    description: "Factory-direct custom apparel, heavyweight tees & travel gear in action.",
  },
  bags: {
    src: "/hero-bags.mp4",
    title: "Engineered Carry In Motion",
    tag: "Heavy-Duty Duffle & Daypacks",
    badge: "Luggage Motion",
    description: "Reinforced stitching, laptop compartments and rugged waterproof builds.",
  },
  "t-shirts": {
    src: "/hero-tees.mp4",
    title: "Heavyweight 240 GSM Drape",
    tag: "Combed Cotton Streetwear",
    badge: "T-Shirt Reel",
    description: "Premium combed cotton with zero fabric deformation and clean drop.",
  },
  "formal shirts": {
    src: "/hero-shirts.mp4",
    title: "Tailored Spread Collar Motion",
    tag: "Fine Oxford Executive Cut",
    badge: "Tailored Reel",
    description: "Sharp structured spread collars, breathable fine weaves & executive poise.",
  },
}

function firstImage(products: DbProduct[], category: string) {
  const match = products.find(
    (p) => (p.category || "").toLowerCase() === category.toLowerCase() && p.images?.[0]?.url
  )
  return match?.images?.[0]?.url || ""
}

function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  )
}

export default function ShopHome() {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(0)
  const [quickViewProduct, setQuickViewProduct] = useState<CatalogItem | null>(null)
  const [heroAdded, setHeroAdded] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [videoFailed, setVideoFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/products?_=${Date.now()}`, { cache: "no-store" })
        const data = await res.json()
        if (!cancelled && data.success && Array.isArray(data.data)) {
          setProducts(data.data)
        }
      } catch {
        /* empty catalog */
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const items = useMemo(() => products.map(productToCatalogItem), [products])

  /** Products assigned to a homepage section in the Apparel modal. Falls back when none assigned. */
  const byHomeSection = (section: string, fallback: DbProduct[]) => {
    const assigned = products.filter((p) => (p.homeSection || "") === section)
    const source = assigned.length ? assigned : fallback
    return source.map(productToCatalogItem)
  }

  const unassigned = useMemo(
    () => products.filter((p) => !p.homeSection),
    [products]
  )

  const bags = useMemo(
    () =>
      byHomeSection(
        "bags",
        unassigned.filter((p) => (p.category || "").toLowerCase() === "bags")
      ),
    [products, unassigned]
  )
  const tees = useMemo(
    () =>
      byHomeSection(
        "tees",
        unassigned.filter((p) => (p.category || "").toLowerCase() === "t-shirts")
      ),
    [products, unassigned]
  )
  const shirts = useMemo(
    () =>
      byHomeSection(
        "shirts",
        unassigned.filter((p) => (p.category || "").toLowerCase() === "formal shirts")
      ),
    [products, unassigned]
  )
  const marqueeItems = useMemo(
    () => byHomeSection("marquee", unassigned.length ? unassigned : products),
    [products, unassigned]
  )
  const spotlight = useMemo(
    () => byHomeSection("spotlight", (unassigned.length ? unassigned : products).slice(0, 4)),
    [products, unassigned]
  )
  const railItems = useMemo(
    () => byHomeSection("rail", unassigned.length ? unassigned : products),
    [products, unassigned]
  )
  const lookbookItems = useMemo(
    () => byHomeSection("lookbook", unassigned.length ? unassigned : products),
    [products, unassigned]
  )

  const categoryTabs = [
    { key: "all", label: "All Styles", icon: "✨", count: items.length },
    { key: "bags", label: "Bags", icon: "👜", count: bags.length },
    { key: "t-shirts", label: "T-Shirts", icon: "👕", count: tees.length },
    { key: "formal shirts", label: "Formal Shirts", icon: "👔", count: shirts.length },
  ]

  const activeCategoryItems = useMemo(() => {
    if (activeCategory === "bags") return bags
    if (activeCategory === "t-shirts") return tees
    if (activeCategory === "formal shirts") return shirts
    return items
  }, [activeCategory, items, bags, tees, shirts])

  const meta = CATEGORY_META[activeCategory] || CATEGORY_META["all"]
  const activeVideo = CATEGORY_VIDEOS[activeCategory] || CATEGORY_VIDEOS["all"]
  const featuredProduct = activeCategoryItems[selectedProductIndex] || activeCategoryItems[0] || items[0]
  const heroPoster =
    firstImage(
      products,
      activeCategory === "bags"
        ? "Bags"
        : activeCategory === "t-shirts"
          ? "T-Shirts"
          : activeCategory === "formal shirts"
            ? "Formal Shirts"
            : "T-Shirts"
    ) ||
    products[0]?.images?.[0]?.url ||
    ""

  useEffect(() => {
    setVideoFailed(false)
    setIsPlaying(true)
  }, [activeVideo.src])

  const toggleVideoPlayback = () => {
    if (!videoRef.current || videoFailed) return
    if (videoRef.current.paused) {
      void videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleHeroQuickAdd = (item: CatalogItem) => {
    if (item.isOutOfStock) return
    addItem({
      id: item.id || item.href || item.name,
      name: item.name,
      price: item.price || 0,
      originalPrice: item.originalPrice,
      image: item.image,
      category: item.category || "Apparel",
      brand: "Cosmora",
      quantity: 1,
    })
    setHeroAdded(true)
    setTimeout(() => setHeroAdded(false), 2000)
  }

  return (
    <div className="bg-[#FAF8F5]">
      {/* Landscape Hero Video Section */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-4 sm:pt-6">
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.35/1] max-h-[620px] min-h-[300px] sm:min-h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-[#14243D] border border-slate-200/80 group">
          {heroPoster && (
            <Photo
              src={heroPoster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {!videoFailed && (
            <video
              ref={videoRef}
              key={activeVideo.src}
              src={activeVideo.src}
              poster={heroPoster || undefined}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              onClick={toggleVideoPlayback}
              onError={() => setVideoFailed(true)}
              onLoadedData={() => {
                setVideoFailed(false)
                void videoRef.current?.play().catch(() => setIsPlaying(false))
              }}
              className="absolute inset-0 h-full w-full object-cover cursor-pointer"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

          {/* Minimal Floating Controls (Top-Right) */}
          {!videoFailed && (
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 z-20">
              <button
                type="button"
                onClick={() => setIsMuted((m) => !m)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-medium border border-white/20 transition-all shadow-lg"
                title={isMuted ? "Unmute video sound" : "Mute video sound"}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-white/80" />
                    <span className="text-[11px] hidden sm:inline">Muted</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#E8D5B0]" />
                    <span className="text-[11px] text-[#E8D5B0] hidden sm:inline">Sound On</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={toggleVideoPlayback}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 transition-all shadow-lg"
                title={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                )}
              </button>
            </div>
          )}

          {/* Minimal Floating Category Switcher (Bottom-Left) */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex flex-wrap items-center gap-2 z-20">
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
              {categoryTabs.map((tab) => {
                const isActive = activeCategory === tab.key
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveCategory(tab.key)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-[#E8D5B0] to-[#C49A52] text-[#14243D] shadow-md"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Large Centered Play Overlay when paused */}
          {!videoFailed && !isPlaying && (
            <button
              type="button"
              onClick={toggleVideoPlayback}
              className="absolute inset-0 m-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-110 z-20"
              aria-label="Play video"
            >
              <Play className="w-8 h-8 fill-white translate-x-0.5" />
            </button>
          )}
        </div>
      </section>

      {/* Quick View Dialog for Hero Featured Products */}
      <QuickViewModal
        item={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />

      {loading ? (
        <p className="py-16 text-center text-[#667085]">Loading products…</p>
      ) : (
        <>
          <ImageMarquee items={marqueeItems} />
          <Spotlight items={spotlight} />
          <ProductRail items={railItems} />
          <Lookbook items={lookbookItems} />
          <BagRows items={bags} />
          <TeeGrid items={tees} />
          <ShirtBento items={shirts} />
        </>
      )}

      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-16 pt-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#14243D] text-white px-6 sm:px-12 py-10 sm:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#C49A52]/25 blur-3xl animate-float" />
          <div className="relative">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#E8D5B0] mb-2">Teams & events</p>
            <h2 className="text-3xl font-semibold tracking-tight">Need 50 pieces or 500?</h2>
            <p className="mt-2 text-white/70 max-w-lg">
              Tell us the style, sizes, and print placement. We reply with factory rates on WhatsApp.
            </p>
          </div>
          <Link
            href="/contact"
            className="relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#14243D] shrink-0 transition-transform duration-300 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(90deg, #E8D5B0, #C49A52)" }}
          >
            Get a quote
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

function SectionHead({
  kicker,
  title,
  href,
}: {
  kicker: string
  title: string
  href: string
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#C49A52] mb-1">{kicker}</p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#172033]">{title}</h2>
      </div>
      <Link href={href} className="text-sm font-medium text-[#14243D] inline-flex items-center gap-1 shrink-0 hover:gap-2 transition-all">
        View all <ArrowUpRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

function ImageMarquee({ items }: { items: CatalogItem[] }) {
  if (items.length < 2) return null
  const loop = [...items, ...items]
  return (
    <section className="pt-8 overflow-hidden">
      <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused]">
        {loop.map((item, index) => (
          <Link
            key={`${item.href}-${index}`}
            href={item.href}
            className="relative h-28 w-44 sm:h-36 sm:w-56 shrink-0 overflow-hidden rounded-2xl"
          >
            <Photo src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-xs text-white">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Spotlight({ items }: { items: CatalogItem[] }) {
  const [lead, ...rest] = items
  if (!lead) return null
  const leadPrice = lead.price ?? 0
  const leadDiscount =
    lead.offerPercentage ||
    (lead.originalPrice && lead.originalPrice > leadPrice
      ? Math.round(((lead.originalPrice - leadPrice) / lead.originalPrice) * 100)
      : 0)

  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-12 animate-fade-in-up">
      <SectionHead kicker="Editor's Choice" title="Spotlight Collection" href="/products" />
      <div className="grid lg:grid-cols-[1.3fr_0.8fr] gap-5">
        {/* Main Hero Showcase */}
        <Link
          href={lead.href}
          className="group relative overflow-hidden rounded-[2rem] min-h-[440px] lg:min-h-[500px] bg-[#14243D] border border-white/10 shadow-xl"
        >
          <Photo
            src={lead.image}
            alt={lead.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14243D] via-[#14243D]/40 to-transparent" />

          {/* Floating Badges */}
          <div className="absolute top-5 left-5 flex gap-2">
            <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#14243D] bg-white/95 backdrop-blur-md rounded-full shadow-sm">
              Trending Edit
            </span>
            {leadDiscount > 0 && (
              <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50/95 backdrop-blur-md rounded-full shadow-sm border border-rose-200">
                {leadDiscount}% OFF
              </span>
            )}
          </div>

          <div className="relative z-10 h-full min-h-[440px] lg:min-h-[500px] p-8 sm:p-10 flex flex-col justify-end text-white">
            <span className="text-xs uppercase tracking-[0.25em] text-[#E8D5B0] font-semibold">
              {lead.subtitle || "Premium Quality"}
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white">
              {lead.name}
            </h3>

            <div className="flex items-center gap-2 mt-2 text-amber-400">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs text-white/80 font-medium">
                4.9 ({lead.reviews || 24} customer reviews)
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  {leadPrice > 0 ? <PriceDisplay amount={leadPrice} /> : lead.priceLabel}
                </span>
                {lead.originalPrice && lead.originalPrice > leadPrice && (
                  <span className="text-base text-white/50 line-through">
                    <PriceDisplay amount={lead.originalPrice} />
                  </span>
                )}
              </div>

              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold group-hover:bg-white group-hover:text-[#14243D] transition-all">
                Shop now <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </Link>

        {/* Supporting Secondary Cards */}
        <div className="flex flex-col gap-3.5">
          {rest.map((item, index) => {
            const itemPrice = item.price ?? 0
            const itemDiscount =
              item.offerPercentage ||
              (item.originalPrice && item.originalPrice > itemPrice
                ? Math.round(((item.originalPrice - itemPrice) / item.originalPrice) * 100)
                : 0)

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex gap-4 rounded-2xl bg-white border border-[#E8E2D8] p-3.5 hover:border-[#C49A52]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${0.15 * (index + 1)}s` }}
              >
                <div className="relative h-28 w-24 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                  <Photo
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {itemDiscount > 0 && (
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 bg-white/90 rounded-md">
                      {itemDiscount}% OFF
                    </span>
                  )}
                </div>

                <div className="min-w-0 py-1 flex flex-col justify-between flex-1">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#C49A52]">
                      {item.subtitle || "Trending"}
                    </span>
                    <h4 className="font-semibold text-sm sm:text-base text-[#172033] mt-1 line-clamp-2 group-hover:text-[#C49A52] transition-colors">
                      {item.name}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm sm:text-base font-bold text-[#14243D]">
                        {itemPrice > 0 ? <PriceDisplay amount={itemPrice} /> : item.priceLabel}
                      </span>
                      {item.originalPrice && item.originalPrice > itemPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          <PriceDisplay amount={item.originalPrice} />
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[#14243D] group-hover:translate-x-1 transition-transform">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ProductRail({ items }: { items: CatalogItem[] }) {
  if (!items.length) return null
  const loop = [...items, ...items]
  return (
    <section className="pt-14 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <SectionHead kicker="Trending Now" title="Moving Through The Floor" href="/products" />
      </div>
      <div className="flex gap-4 w-max animate-scroll hover:[animation-play-state:paused] px-4 py-2">
        {loop.map((item, index) => {
          const itemPrice = item.price ?? 0
          return (
            <Link
              key={`${item.href}-${index}`}
              href={item.href}
              className="shrink-0 w-[220px] sm:w-[250px] group"
            >
              <div className="rounded-2xl overflow-hidden bg-white border border-[#E8E2D8] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:border-[#C49A52]/40">
                <div className="relative h-64 w-full overflow-hidden bg-slate-50">
                  <Photo
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {item.isOnSale && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold text-rose-700 bg-white/95 rounded-full shadow-sm">
                      Sale
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C49A52] block mb-1">
                    {item.subtitle || "Catalog"}
                  </span>
                  <p className="text-sm font-semibold text-[#172033] line-clamp-1 group-hover:text-[#C49A52] transition-colors">
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <span className="text-sm font-bold text-[#14243D]">
                      {itemPrice > 0 ? <PriceDisplay amount={itemPrice} /> : item.priceLabel}
                    </span>
                    <span className="text-[11px] text-slate-400">View details →</span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function Lookbook({ items }: { items: CatalogItem[] }) {
  const tiles = items.slice(0, 7)
  if (tiles.length < 3) return null
  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-16">
      <SectionHead kicker="Gallery & Styling" title="The Cosmora Lookbook" href="/products" />
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] sm:auto-rows-[220px] gap-3.5">
        {tiles.map((item, index) => {
          const span =
            index === 0 ? "md:col-span-2 md:row-span-2" : index === 3 ? "md:row-span-2" : ""
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative overflow-hidden rounded-2xl bg-[#14243D] border border-white/10 shadow-sm animate-fade-in-up ${span}`}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <Photo
                src={item.image}
                alt={item.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                <span className="block text-sm font-semibold leading-tight line-clamp-1 group-hover:text-[#E8D5B0] transition-colors">
                  {item.name}
                </span>
                <span className="block text-xs font-medium text-[#E8D5B0] mt-1">
                  {item.price ? <PriceDisplay amount={item.price} /> : item.priceLabel}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function BagRows({ items }: { items: CatalogItem[] }) {
  if (!items.length) return null
  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-16">
      <SectionHead kicker="Luggage & Carry" title="Engineered Bags & Duffles" href={categoryHref("Bags")} />
      <div className="grid sm:grid-cols-2 gap-5">
        {items.map((item, index) => {
          const price = item.price ?? 0
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-stretch overflow-hidden rounded-2xl bg-white border border-[#E8E2D8] hover:border-[#C49A52]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-40 w-36 sm:h-48 sm:w-48 bg-slate-50 shrink-0 overflow-hidden">
                <Photo
                  src={item.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#14243D] bg-white/90 rounded-md">
                  0{index + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0 p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C49A52]">
                    Premium Luggage
                  </span>
                  <h4 className="font-semibold text-lg text-[#172033] mt-1 group-hover:text-[#C49A52] transition-colors leading-snug">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-1 mt-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-xs font-semibold text-slate-700">4.8</span>
                    <span className="text-xs text-slate-400">(18 reviews)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-[#14243D]">
                      {price > 0 ? <PriceDisplay amount={price} /> : item.priceLabel}
                    </span>
                    {item.originalPrice && item.originalPrice > price && (
                      <span className="text-xs text-slate-400 line-through">
                        <PriceDisplay amount={item.originalPrice} />
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-[#14243D] group-hover:translate-x-1 transition-transform">
                    View bag →
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function TeeGrid({ items }: { items: CatalogItem[] }) {
  if (!items.length) return null
  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-16">
      <SectionHead kicker="Everyday Wardrobe" title="Heavyweight T-Shirts & Polos" href={categoryHref("T-Shirts")} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item, index) => (
          <div key={item.href} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.08}s` }}>
            <MarketplaceProductCard {...item} />
          </div>
        ))}
      </div>
    </section>
  )
}

function ShirtBento({ items }: { items: CatalogItem[] }) {
  if (!items.length) return null
  const [lead, ...rest] = items
  const leadPrice = lead.price ?? 0

  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-16 pb-8">
      <SectionHead kicker="Tailored Office" title="Formal & Oxford Shirts" href={categoryHref("Formal Shirts")} />
      <div className="grid md:grid-cols-2 gap-5">
        <Link
          href={lead.href}
          className="group relative overflow-hidden rounded-[2rem] min-h-[440px] md:row-span-2 bg-[#14243D] border border-white/10 shadow-xl"
        >
          <Photo
            src={lead.image}
            alt={lead.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14243D] via-[#14243D]/40 to-transparent" />
          <div className="relative z-10 h-full min-h-[440px] p-8 sm:p-10 flex flex-col justify-end text-white">
            <span className="text-xs uppercase tracking-[0.2em] text-[#E8D5B0] font-semibold">
              Signature Formal
            </span>
            <h3 className="text-3xl font-bold mt-2">{lead.name}</h3>
            <div className="flex items-center justify-between mt-4">
              <span className="text-2xl font-bold text-white">
                {leadPrice > 0 ? <PriceDisplay amount={leadPrice} /> : lead.priceLabel}
              </span>
              <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold group-hover:bg-white group-hover:text-[#14243D] transition-all">
                Shop style →
              </span>
            </div>
          </div>
        </Link>

        <div className="grid sm:grid-cols-2 md:grid-cols-1 gap-4">
          {rest.map((item) => {
            const price = item.price ?? 0
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex gap-4 rounded-2xl bg-white border border-[#E8E2D8] hover:border-[#C49A52]/40 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative w-32 sm:w-40 h-32 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                  <Photo
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 py-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C49A52]">
                      Formal Wear
                    </span>
                    <h4 className="font-semibold text-base text-[#172033] mt-1 group-hover:text-[#C49A52] transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-base font-bold text-[#14243D]">
                      {price > 0 ? <PriceDisplay amount={price} /> : item.priceLabel}
                    </span>
                    <span className="text-xs font-semibold text-[#14243D] group-hover:translate-x-1 transition-transform">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
