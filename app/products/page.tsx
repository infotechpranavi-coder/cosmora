"use client"

import { Suspense, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import { MarketplaceProductCard } from "@/components/marketplace-section"
import { ALL_CATALOG, CATEGORY_TREE } from "@/data/print-marketplace"
import Link from "next/link"

function ProductsCatalog() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category") || ""

  const items = useMemo(() => {
    if (!category) return ALL_CATALOG
    const q = category.toLowerCase()
    const exact = ALL_CATALOG.filter((item) => item.name.toLowerCase() === q)
    if (exact.length) return exact
    return ALL_CATALOG.filter((item) => item.name.toLowerCase().includes(q))
  }, [category])

  const shown = items.length ? items : ALL_CATALOG

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
            {CATEGORY_TREE.flatMap((g) => g.items).map((c) => (
              <Link
                key={c.name}
                href={c.href}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  category === c.name ? "bg-[#14243D] text-white" : "bg-white text-[#172033]"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {shown.map((item) => (
              <MarketplaceProductCard key={item.name} {...item} />
            ))}
          </div>
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
