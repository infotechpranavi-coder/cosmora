"use client"

import React, { Suspense } from "react"
import Navbar from "@/components/navbar"
import ProductDetail from "@/components/product-detail"
import Footer from "@/components/footer"
import RelatedProductsLive from "@/components/related-products-live"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = React.use(params)

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading product…</div>}>
        <ProductDetail productId={id} />
      </Suspense>
      <RelatedProductsLive currentId={id} />
      <Footer />
    </div>
  )
}
