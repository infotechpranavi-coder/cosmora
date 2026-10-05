"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { MarketplaceProductCard } from "@/components/marketplace-section"
import Link from "next/link"
import {
  categoryHref,
  filterProductsByCategory,
  flatCategoryNames,
  productToCatalogItem,
  type DbCategory,
  type DbProduct,
} from "@/lib/catalog-live"
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  Grid3X3,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from "lucide-react"

function ProductsCatalog() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category") || ""

  const [dbProducts, setDbProducts] = useState<DbProduct[]>([])
  const [dbCategories, setDbCategories] = useState<DbCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<"new" | "low" | "high" | "rating">("new")
  const [searchQuery, setSearchQuery] = useState("")
  const [onlyOnSale, setOnlyOnSale] = useState(false)
  const [columnCount, setColumnCount] = useState<3 | 4>(4)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/products?_=${Date.now()}`, { cache: "no-store" }),
          fetch(`/api/categories?_=${Date.now()}`, { cache: "no-store" }),
        ])
        const prodData = await prodRes.json()
        const catData = await catRes.json()
        if (cancelled) return
        if (prodData.success && Array.isArray(prodData.data)) {
          setDbProducts(prodData.data)
        }
        if (catData.success && Array.isArray(catData.data)) {
          setDbCategories(catData.data)
        }
      } catch {
        /* keep empty */
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const chipNames = useMemo(() => flatCategoryNames(dbCategories), [dbCategories])

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: dbProducts.length }
    for (const p of dbProducts) {
      const cat = p.category || "Other"
      counts[cat] = (counts[cat] || 0) + 1
      if (p.subCategory) {
        counts[p.subCategory] = (counts[p.subCategory] || 0) + 1
      }
    }
    return counts
  }, [dbProducts])

  // Filtered & sorted list
  const filteredProducts = useMemo(() => {
    let list = [...filterProductsByCategory(dbProducts, categoryParam)]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      )
    }

    if (onlyOnSale) {
      list = list.filter((p) => p.isOnSale || (p.originalPrice && p.originalPrice > p.price))
    }

    if (sort === "low") {
      list.sort((a, b) => a.price - b.price)
    } else if (sort === "high") {
      list.sort((a, b) => b.price - a.price)
    } else if (sort === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    return list.map(productToCatalogItem)
  }, [dbProducts, categoryParam, searchQuery, onlyOnSale, sort])

  const clearFilters = () => {
    setSearchQuery("")
    setOnlyOnSale(false)
    setSort("new")
    router.push("/products")
  }

  const hasActiveFilters = Boolean(categoryParam || searchQuery || onlyOnSale || sort !== "new")

  return (
    <>
      {/* Modern Luxury Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#14243D] via-[#1A2E4C] to-[#14243D] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        {/* Ambient lighting glows */}
        <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-[#C49A52]/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#E8D5B0]/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"
          aria-hidden="true"
        />

        <div className="relative max-w-[1400px] mx-auto text-center">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-white/60 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition-colors">
              Catalog
            </Link>
            {categoryParam && (
              <>
                <span>/</span>
                <span className="text-[#E8D5B0] font-semibold">{categoryParam}</span>
              </>
            )}
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#E8D5B0] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Collection</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] max-w-3xl mx-auto">
            {categoryParam ? categoryParam : "Signature Apparel & Bags"}
          </h1>

          <p className="mt-4 text-white/75 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {categoryParam
              ? `Explore all premium ${categoryParam.toLowerCase()} crafted with high-grade fabrics and factory precision.`
              : "Discover precision-stitched bags, tailored formal shirts, and heavyweight tees built for everyday luxury."}
          </p>

          {/* Quick Search Input */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title, style or keyword…"
              className="w-full pl-11 pr-10 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#C49A52] focus:bg-white/15 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1 rounded-full"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-8 sm:py-12 bg-[#FAF8F5] min-h-[600px]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Control Bar: Category Pills + Filters + Sort */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-[#E8E2D8]">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              <Link
                href="/products"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
                  !categoryParam
                    ? "bg-[#14243D] text-white shadow-[#14243D]/15"
                    : "bg-white text-[#172033] hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span>All Products</span>
                <span
                  className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                    !categoryParam ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {categoryCounts["all"] || dbProducts.length}
                </span>
              </Link>

              {chipNames.map((name) => {
                const isActive = categoryParam.toLowerCase() === name.toLowerCase()
                const count = categoryCounts[name]
                return (
                  <Link
                    key={name}
                    href={categoryHref(name)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
                      isActive
                        ? "bg-[#14243D] text-white shadow-[#14243D]/15"
                        : "bg-white text-[#172033] hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    <span>{name}</span>
                    {count !== undefined && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                          isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Controls: Sale Toggle, Sort, Grid View */}
            <div className="flex flex-wrap items-center gap-3">
              {/* On Sale Pill Toggle */}
              <button
                onClick={() => setOnlyOnSale(!onlyOnSale)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${
                  onlyOnSale
                    ? "bg-rose-50 border-rose-300 text-rose-700 shadow-sm"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${onlyOnSale ? "bg-rose-500" : "bg-slate-300"}`}
                />
                On Sale
              </button>

              {/* Modern Sort Select */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value as "new" | "low" | "high" | "rating")
                  }
                  className="appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-full pl-3.5 pr-8 py-2 text-xs sm:text-sm font-semibold text-[#14243D] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C49A52] cursor-pointer"
                >
                  <option value="new">Sort by: Newest</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>

              {/* Grid Column Switcher (Hidden on Mobile) */}
              <div className="hidden sm:flex items-center rounded-full bg-white border border-slate-200 p-1 shadow-sm">
                <button
                  onClick={() => setColumnCount(3)}
                  className={`p-1.5 rounded-full transition-all ${
                    columnCount === 3
                      ? "bg-[#14243D] text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                  aria-label="3 columns grid"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setColumnCount(4)}
                  className={`p-1.5 rounded-full transition-all ${
                    columnCount === 4
                      ? "bg-[#14243D] text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                  aria-label="4 columns grid"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Summary Bar */}
          <div className="flex items-center justify-between gap-4 py-4 text-xs sm:text-sm text-slate-600">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-900">
                {loading
                  ? "Loading styles…"
                  : `${filteredProducts.length} style${filteredProducts.length === 1 ? "" : "s"}`}
              </span>
              {categoryParam && <span>in &ldquo;{categoryParam}&rdquo;</span>}
              {searchQuery && <span>matching &ldquo;{searchQuery}&rdquo;</span>}

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
                >
                  Reset all
                </button>
              )}
            </div>

            <span className="hidden md:inline-block text-slate-400 text-xs">
              ⚡ Guaranteed factory pricing & fast delivery
            </span>
          </div>

          {/* Product Grid Area */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse flex flex-col"
                >
                  <div className="aspect-[4/5] bg-slate-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 rounded w-4/5" />
                    <div className="h-5 bg-slate-200 rounded w-1/2 pt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Modern Empty State */
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto my-8 p-8">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-[#C49A52] flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#14243D]">No matching products found</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                We couldn&apos;t find any items matching your active filters or search terms. Try
                broadening your search or reset filters.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 rounded-full bg-[#14243D] text-white text-xs sm:text-sm font-semibold hover:bg-[#1E3A60] transition-colors shadow-sm"
                >
                  Reset all filters
                </button>
                <Link
                  href="/contact"
                  className="px-6 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Request custom style
                </Link>
              </div>
            </div>
          ) : (
            /* Active Grid */
            <div
              className={`grid grid-cols-2 ${
                columnCount === 3 ? "md:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-4"
              } gap-4 sm:gap-6 pt-2`}
            >
              {filteredProducts.map((item) => (
                <MarketplaceProductCard key={`${item.href}-${item.name}`} {...item} />
              ))}
            </div>
          )}

          {/* Bottom Custom Bulk Order Banner */}
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-[#14243D] via-[#1B3252] to-[#14243D] p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#C49A52]/20 blur-2xl" />
            <div className="relative max-w-xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8D5B0]">
                Wholesale & Team Orders
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Ordering for a team, company or event?
              </h3>
              <p className="text-white/70 text-sm mt-2">
                Get tiered bulk pricing starting from 25 units. Free digital mockups, logo embroidery,
                and direct doorstep delivery across India.
              </p>
            </div>
            <Link
              href="/contact"
              className="relative inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-[#14243D] transition-transform duration-300 hover:-translate-y-0.5 shrink-0 shadow-lg"
              style={{ background: "linear-gradient(90deg, #E8D5B0, #C49A52)" }}
            >
              <span>Get bulk quotation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <Suspense
        fallback={
          <div className="py-24 text-center text-slate-500 font-medium">Loading catalog…</div>
        }
      >
        <ProductsCatalog />
      </Suspense>
      <Footer />
    </div>
  )
}
