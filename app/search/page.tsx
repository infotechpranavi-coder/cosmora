"use client"

import { Suspense, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import { MarketplaceProductCard } from "@/components/marketplace-section"
import { ALL_CATALOG } from "@/data/print-marketplace"
import { Search } from "lucide-react"

function SearchCatalog() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ALL_CATALOG
    return ALL_CATALOG.filter(
      (item) => item.name.toLowerCase().includes(q) || (item.subtitle || "").toLowerCase().includes(q)
    )
  }, [query])

  return (
    <>
      <PageBanner title="Search Products" subtitle="Find round neck tees, polos, sports tees, hoodies and more." />
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
              placeholder="Search products here"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-violet-200 bg-white"
            />
          </form>
          <p className="text-sm text-gray-500 mb-6">{results.length} products</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {results.map((item) => (
              <MarketplaceProductCard key={item.name} {...item} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <Suspense fallback={<div className="py-20 text-center text-gray-500">Searching…</div>}>
        <SearchCatalog />
      </Suspense>
      <Footer />
    </div>
  )
}
