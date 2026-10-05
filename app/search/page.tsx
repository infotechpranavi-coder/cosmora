"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import { MarketplaceProductCard } from "@/components/marketplace-section"
import { productToCatalogItem, type DbProduct } from "@/lib/catalog-live"
import type { CatalogItem } from "@/data/print-marketplace"
import { Search } from "lucide-react"

function SearchCatalog() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [items, setItems] = useState<CatalogItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/products?_=${Date.now()}`, { cache: "no-store" })
        const data = await res.json()
        if (!cancelled && data.success && Array.isArray(data.data)) {
          setItems((data.data as DbProduct[]).map(productToCatalogItem))
        }
      } catch {
        /* empty */
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.subtitle || "").toLowerCase().includes(q)
    )
  }, [query, items])

  return (
    <>
      <PageBanner
        title="Search Collection"
        subtitle="Explore luxury bags, heavyweight t-shirts, and tailored formal shirts."
      />
      <section className="py-12 bg-[#FAF8F5] min-h-[600px]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <form
            action="/search"
            method="GET"
            className="relative max-w-xl mx-auto mb-10"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              name="q"
              placeholder="Search products by name, category or style…"
              className="w-full pl-11 pr-4 py-3.5 rounded-full border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C49A52] text-sm text-[#14243D]"
            />
          </form>
          {loading ? (
            <p className="text-sm text-center text-slate-500 py-12">Searching catalog…</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
                <p className="text-sm font-semibold text-slate-700">
                  {results.length} product{results.length !== 1 ? "s" : ""} found
                </p>
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                  >
                    Clear search
                  </button>
                )}
              </div>
              {results.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
                  <p className="font-bold text-[#14243D] text-lg mb-1">No products found</p>
                  <p className="text-sm text-slate-500">
                    No matching items for &ldquo;{query}&rdquo;. Try another term or browse all styles.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {results.map((item) => (
                    <MarketplaceProductCard key={`${item.href}-${item.name}`} {...item} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <Suspense fallback={<div className="py-20 text-center text-gray-500">Searching catalog…</div>}>
        <SearchCatalog />
      </Suspense>
      <Footer />
    </div>
  )
}
