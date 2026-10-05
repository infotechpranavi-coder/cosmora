"use client"

import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import ShopHome from "@/components/shop-home"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F4F1EB]">
      <Navbar />
      <ShopHome />
      <Footer />
    </div>
  )
}
