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
        title="Search printed tees"
        subtitle="Find round neck, polo, sports, oversized, kids & women’s custom t-shirts."
      />
      <section className="py-10">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <form
            action="/search"
            method="GET"
            className="relative max-w-xl mb-8"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              name="q"
              placeholder="Search t-shirts, polos, hoodies…"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-300 bg-white"
            />
          </form>
          {loading ? (
            <p className="text-sm text-[#667085]">Searching print catalog…</p>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">
                {results.length} tee style{results.length !== 1 ? "s" : ""}
              </p>
              {results.length === 0 ? (
                <p className="py-12 text-center text-[#667085]">
                  No matching tees — try another keyword or browse the full print catalog.
                </p>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <Suspense fallback={<div className="py-20 text-center text-gray-500">Searching printed tees…</div>}>
        <SearchCatalog />
      </Suspense>
      <Footer />
    </div>
  )
}
