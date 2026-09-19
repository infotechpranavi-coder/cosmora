"use client"

import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import MarketplaceHero from "@/components/marketplace-hero"
import { MarketplaceProductCard } from "@/components/marketplace-section"
import { APPARELS, CLIENT_LOGOS, FEATURED_APPARELS, IMG } from "@/data/print-marketplace"

export default function Home() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <MarketplaceHero />

      <section className="py-8 sm:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block w-3.5 h-7 sm:w-4 sm:h-8 bg-[#1E3A8A] rounded-[3px]" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
              T-Shirt Printing
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {FEATURED_APPARELS.map((item) => (
              <MarketplaceProductCard key={item.name} {...item} />
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {APPARELS.map((item) => (
              <MarketplaceProductCard key={item.name} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMG("/img/homepage-new/grid/6.jpg?var=1789713787")}
            alt="Custom t-shirt printing"
            className="w-full rounded-2xl object-cover max-h-56 sm:max-h-72"
          />
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block w-3.5 h-7 sm:w-4 sm:h-8 bg-[#1E3A8A] rounded-[3px]" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
              More Printed Tees
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...APPARELS, ...FEATURED_APPARELS].map((item) => (
              <MarketplaceProductCard key={`more-${item.name}`} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMG("/img/homepage-new/grid/2.png?var=1789713787")}
            alt="Bulk t-shirt printing"
            className="w-full rounded-2xl object-cover max-h-56 sm:max-h-72"
          />
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-8">Meet our Clients</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {CLIENT_LOGOS.map((src) => (
              <div key={src} className="bg-white rounded-xl p-3 shadow-sm flex items-center justify-center h-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Client logo" className="max-h-16 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
