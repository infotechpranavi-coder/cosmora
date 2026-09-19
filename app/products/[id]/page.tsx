"use client"

import React from "react"
import Navbar from "@/components/navbar"
import ProductDetail from "@/components/product-detail"
import Footer from "@/components/footer"
import { MarketplaceCategoryRow } from "@/components/marketplace-section"
import { APPARELS, FEATURED_APPARELS } from "@/data/print-marketplace"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = React.use(params)

  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <ProductDetail productId={id} />
      <MarketplaceCategoryRow title="You May Also Like" items={[...FEATURED_APPARELS, ...APPARELS]} />
      <Footer />
    </div>
  )
}
