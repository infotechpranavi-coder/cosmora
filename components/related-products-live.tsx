"use client"

import { useEffect, useState } from "react"
import { MarketplaceProductCard } from "@/components/marketplace-section"
import { productToCatalogItem, type DbProduct } from "@/lib/catalog-live"

export default function RelatedProductsLive({ currentId }: { currentId: string }) {
  const [items, setItems] = useState<ReturnType<typeof productToCatalogItem>[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/products?_=${Date.now()}`, { cache: "no-store" })
        const data = await res.json()
        if (!cancelled && data.success && Array.isArray(data.data)) {
          const cards = (data.data as DbProduct[])
            .filter((p) => p._id !== currentId)
            .slice(0, 4)
            .map(productToCatalogItem)
          setItems(cards)
        }
      } catch {
        /* no related */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [currentId])

  if (!items.length) return null

  return (
    <section className="bg-[#FAF8F5] py-12 sm:py-16 border-t border-[#E8E2D8]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C49A52] block mb-1">
              Complete Your Look
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
              You May Also Like
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <MarketplaceProductCard key={item.href} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
