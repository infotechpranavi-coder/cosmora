"use client"

import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import MarketplaceHero from "@/components/marketplace-hero"
import HomeModernSections from "@/components/home-modern-sections"

export default function Home() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <MarketplaceHero />
      <HomeModernSections />
      <Footer />
    </div>
  )
}
