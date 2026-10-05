"use client"

import { Suspense } from "react"
import Navbar from "@/components/navbar"
import ProductDetail from "@/components/product-detail"
import Footer from "@/components/footer"
import { MarketplaceCategoryRow } from "@/components/marketplace-section"
import { FEATURED_APPARELS, APPARELS } from "@/data/print-marketplace"

export default function ViewDetailsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading product details…</div>}>
        <ProductDetail />
      </Suspense>
      <MarketplaceCategoryRow title="Popular T-Shirts" items={[...FEATURED_APPARELS, ...APPARELS]} />
      <Footer />
    </div>
  )
}
