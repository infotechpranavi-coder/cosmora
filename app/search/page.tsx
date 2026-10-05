"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { MarketplaceProductCard } from "@/components/marketplace-section"
import ProductSearchBar from "@/components/product-search-bar"
import { productToCatalogItem, type DbProduct } from "@/lib/catalog-live"
import { filterCatalogByQuery } from "@/lib/product-search"
import type { CatalogItem } from "@/data/print-marketplace"

function SearchCatalog() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = (searchParams.get("q") || "").trim()
  const [items, setItems] = useState<CatalogItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
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

  const results = useMemo(() => filterCatalogByQuery(items, query), [query, items])

  return (
    <>
      <section className="py-12 bg-[#FAF8F5] min-h-[600px]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#14243D] tracking-tight mb-6 text-center sm:text-left">
            Search
          </h1>
          <div className="relative max-w-xl mx-auto sm:mx-0 mb-10">
            <ProductSearchBar />
          </div>

          {loading ? (
            <p className="text-sm text-center text-slate-500 py-12">Searching catalog…</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
                <p className="text-sm font-semibold text-slate-700">
                  {query
                    ? `${results.length} product${results.length !== 1 ? "s" : ""} for “${query}”`
                    : `${results.length} product${results.length !== 1 ? "s" : ""} in catalog`}
                </p>
                {query && (
                  <button
                    type="button"
                    onClick={() => router.push("/search")}
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
