"use client"

import Navbar from "@/components/navbar"
import ProductDetail from "@/components/product-detail"
import Footer from "@/components/footer"
import { MarketplaceCategoryRow } from "@/components/marketplace-section"
import { FEATURED_APPARELS, APPARELS } from "@/data/print-marketplace"

export default function ViewDetailsPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <ProductDetail />
      <MarketplaceCategoryRow title="Popular T-Shirts" items={[...FEATURED_APPARELS, ...APPARELS]} />
      <Footer />
    </div>
  )
}
