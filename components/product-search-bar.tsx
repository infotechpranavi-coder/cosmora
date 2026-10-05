"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { productToCatalogItem, type DbProduct } from "@/lib/catalog-live"
import { filterCatalogByQuery } from "@/lib/product-search"
import type { CatalogItem } from "@/data/print-marketplace"
import PriceDisplay from "@/components/price-display"

type ProductSearchBarProps = {
  className?: string
  autoFocus?: boolean
  onNavigate?: () => void
}

let cachedProducts: CatalogItem[] | null = null
let cachePromise: Promise<CatalogItem[]> | null = null

async function loadCatalogProducts(): Promise<CatalogItem[]> {
  if (cachedProducts) return cachedProducts
  if (cachePromise) return cachePromise

  cachePromise = (async () => {
    try {
      const res = await fetch(`/api/products?_=${Date.now()}`, { cache: "no-store" })
      const data = await res.json()
      const items =
        data.success && Array.isArray(data.data)
          ? (data.data as DbProduct[]).map(productToCatalogItem)
          : []
      cachedProducts = items
      return items
    } catch {
      return []
    } finally {
      cachePromise = null
    }
  })()

  return cachePromise
}

export default function ProductSearchBar({
  className = "",
  autoFocus = false,
  onNavigate,
}: ProductSearchBarProps) {
  const router = useRouter()
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<CatalogItem[]>(cachedProducts || [])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(!cachedProducts)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const items = await loadCatalogProducts()
      if (!cancelled) {
        setProducts(items)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  const suggestions = useMemo(() => {
    const q = query.trim()
    if (!q) return []
    return filterCatalogByQuery(products, q).slice(0, 8)
  }, [products, query])

  const goToSearchPage = (value = query) => {
    const q = value.trim()
    if (!q) return
    setOpen(false)
    onNavigate?.()
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  const goToProduct = (item: CatalogItem) => {
    setOpen(false)
    setQuery("")
    onNavigate?.()
    router.push(item.href)
  }

  return (
    <div ref={rootRef} className={`relative w-full ${className}`}>
      <form
        action="/search"
        method="GET"
        onSubmit={(e) => {
          e.preventDefault()
          goToSearchPage()
        }}
      >
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF] z-10" />
        <input
          type="search"
          name="q"
          value={query}
          autoFocus={autoFocus}
          autoComplete="off"
          placeholder="Search products"
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          className="w-full rounded-md border-0 bg-[#F3F4F6] py-2.5 pl-10 pr-4 text-sm text-[#172033] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#14243D]/25"
        />
      </form>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[60] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          {loading ? (
            <p className="px-4 py-3 text-sm text-slate-500">Searching products…</p>
          ) : suggestions.length === 0 ? (
            <div className="px-4 py-3">
              <p className="text-sm text-slate-600">No products match “{query.trim()}”.</p>
              <button
                type="button"
                onClick={() => goToSearchPage()}
                className="mt-2 text-xs font-semibold text-[#14243D] hover:underline"
              >
                Search all results
              </button>
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {suggestions.map((item) => (
                <li key={item.id || item.href}>
                  <button
                    type="button"
                    onClick={() => goToProduct(item)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt=""
                      className="h-11 w-11 shrink-0 rounded-lg object-cover border border-slate-100"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-[#172033]">
                        {item.name}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {item.category || item.subtitle || "Apparel"}
                      </span>
                    </span>
                    {typeof item.price === "number" && item.price > 0 && (
                      <span className="shrink-0 text-sm font-semibold text-[#14243D]">
                        <PriceDisplay amount={item.price} />
                      </span>
                    )}
                  </button>
                </li>
              ))}
              <li className="border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => goToSearchPage()}
                  className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#14243D] hover:bg-slate-50"
                >
                  View all results for “{query.trim()}”
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
