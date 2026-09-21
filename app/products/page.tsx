"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import { MarketplaceProductCard } from "@/components/marketplace-section"
import { ALL_CATALOG, CATEGORY_TREE } from "@/data/print-marketplace"
import Link from "next/link"
import {
  categoryHref,
  filterProductsByCategory,
  flatCategoryNames,
  productToCatalogItem,
  toCategoryTree,
  type DbCategory,
  type DbProduct,
} from "@/lib/catalog-live"

function ProductsCatalog() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category") || ""
  const [dbProducts, setDbProducts] = useState<DbProduct[]>([])
  const [dbCategories, setDbCategories] = useState<DbCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
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
        /* fallback to static catalog */
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const chipNames = useMemo(() => {
    if (dbCategories.length) return flatCategoryNames(dbCategories)
    return CATEGORY_TREE.flatMap((g) => g.items.map((i) => i.name))
  }, [dbCategories])

  const liveCards = useMemo(() => {
    const filtered = filterProductsByCategory(dbProducts, category)
    return filtered.map(productToCatalogItem)
  }, [dbProducts, category])

  const staticCards = useMemo(() => {
    if (!category) return ALL_CATALOG
    const q = category.toLowerCase()
    const exact = ALL_CATALOG.filter((item) => item.name.toLowerCase() === q)
    if (exact.length) return exact
    return ALL_CATALOG.filter((item) => item.name.toLowerCase().includes(q))
  }, [category])

  const shown = dbProducts.length > 0 ? liveCards : staticCards.length ? staticCards : ALL_CATALOG
  const usingLive = dbProducts.length > 0

  return (
    <>
      <PageBanner
        title={category ? `Category : ${category}` : "T-Shirt Printing"}
        subtitle={
          category
            ? `Buy ${category} only at COSMORA — factory rates, editable design, door delivery.`
            : "Customized t-shirt printing directly from the manufacturer."
        }
      />

      <section className="py-10">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/products"
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                !category ? "bg-[#14243D] text-white" : "bg-white text-[#172033]"
              }`}
            >
              All
            </Link>
            {chipNames.map((name) => (
              <Link
                key={name}
                href={categoryHref(name)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  category === name ? "bg-[#14243D] text-white" : "bg-white text-[#172033]"
                }`}
              >
                {name}
              </Link>
            ))}
          </div>

          {loading ? (
            <p className="py-16 text-center text-[#667085]">Loading merchandise…</p>
          ) : shown.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[#172033] font-semibold mb-2">
                {usingLive
                  ? category
                    ? `No products in “${category}” yet`
                    : "No products in the catalog yet"
                  : "No products found"}
              </p>
              <p className="text-sm text-[#667085]">
                Add apparel from the dashboard Print Catalog — it will show here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {shown.map((item) => (
                <MarketplaceProductCard key={`${item.href}-${item.name}`} {...item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <Suspense
        fallback={
          <div className="py-20 text-center text-[#667085]">Loading merchandise…</div>
        }
      >
        <ProductsCatalog />
      </Suspense>
      <Footer />
    </div>
  )
}
