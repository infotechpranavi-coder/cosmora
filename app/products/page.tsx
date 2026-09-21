"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
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

  const shown = useMemo(() => {
    return filterProductsByCategory(dbProducts, category).map(productToCatalogItem)
  }, [dbProducts, category])

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
                {category
                  ? `No products in “${category}” yet`
                  : "No products in the catalog yet"}
              </p>
              <p className="text-sm text-[#667085]">
                Add categories and apparel from the dashboard — only those will appear here.
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
