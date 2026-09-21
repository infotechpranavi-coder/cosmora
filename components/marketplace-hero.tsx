"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Factory, Store, PenTool, Truck } from "lucide-react"
import {
  APPARELS,
  FEATURED_APPARELS,
  HERO_SLIDES,
} from "@/data/print-marketplace"

const FEATURES = [
  { label: "Factory Sourcing", Icon: Factory },
  { label: "Free Sample Visit", Icon: Store },
  { label: "Editable Design", Icon: PenTool },
  { label: "Door Delivery", Icon: Truck },
]

const PRODUCT_THUMBS = [...FEATURED_APPARELS, ...APPARELS]
  .map((item) => item.image)
  .slice(0, HERO_SLIDES.length)

const SLIDE_MS = 3500

export default function MarketplaceHero() {
  const slides = HERO_SLIDES
  const count = slides.length
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (count <= 1) return
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, SLIDE_MS)
    return () => window.clearInterval(t)
  }, [count])

  useEffect(() => {
    slides.forEach((slide) => {
      const img = new window.Image()
      img.src = slide.image
    })
    PRODUCT_THUMBS.forEach((src) => {
      const img = new window.Image()
      img.src = src
    })
  }, [slides])

  const slide = slides[index] || slides[0]

  return (
    <section className="relative overflow-hidden bg-cosmora-gradient">
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
        background: "radial-gradient(circle at 75% 40%, rgba(196,154,82,0.35), transparent 40%), radial-gradient(circle at 20% 80%, rgba(20,36,61,0.45), transparent 35%)",
      }} />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-16 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center min-h-[420px] lg:min-h-[520px]">
          <div className="text-center lg:text-left z-10">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
              <span className="hidden lg:inline-block h-px w-12 bg-[#E8D5B0]/80" />
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                India&apos;s First
              </h1>
              <span className="hidden lg:inline-block h-px w-12 bg-[#E8D5B0]/80" />
            </div>
            <p
              className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-tight mb-2 tracking-[0.18em]"
              style={{
                background: "linear-gradient(90deg, #FFF8E7 0%, #E8D5B0 40%, #C49A52 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              COSMORA
            </p>
            <p className="text-[#E8D5B0] text-xs sm:text-sm font-medium tracking-[0.35em] uppercase mb-6">
              Wear Your Universe
            </p>
            <p className="text-white text-lg sm:text-xl font-semibold mb-8">
              Buy directly from Manufacturer
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
              {FEATURES.map(({ label, Icon }, i) => {
                const tones = ["#14243D", "#C49A52", "#C49A52", "#14243D"]
                return (
                <div
                  key={label}
                  className="w-[104px] sm:w-[118px] rounded-xl bg-white/95 px-2 pt-3 pb-2.5 shadow-lg text-center"
                >
                  <div
                    className="mx-auto mb-1.5 flex h-10 w-10 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: tones[i % tones.length] }}
                  >
                    <Icon className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <p className="text-[11px] sm:text-xs font-semibold text-[#172033] leading-tight">{label}</p>
                </div>
              )})}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] h-[340px] sm:h-[420px] lg:h-[500px]">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[78%] aspect-square rounded-full overflow-hidden shadow-2xl ring-4 ring-white/25 bg-black/10">
              {slides.map((item, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`circle-${item.image}`}
                  src={item.image}
                  alt={i === index ? "COSMORA print merchandise" : ""}
                  aria-hidden={i !== index}
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${
                    i === index ? "opacity-100 z-[1]" : "opacity-0 z-0"
                  }`}
                />
              ))}
            </div>

            <Link
              href="/products"
              className="absolute right-0 top-[6%] w-[44%] max-w-[230px] bg-white rounded-[28px] shadow-2xl p-4 z-10"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
                {PRODUCT_THUMBS.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={`thumb-${src}`}
                    src={src}
                    alt={i === index % PRODUCT_THUMBS.length ? "Featured print product" : ""}
                    aria-hidden={i !== index % PRODUCT_THUMBS.length}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                      i === index % PRODUCT_THUMBS.length ? "opacity-100 z-[1]" : "opacity-0 z-0"
                    }`}
                  />
                ))}
              </div>
              <div className="absolute -top-1 right-2 bg-white rounded-md shadow px-2 py-1 text-right min-w-[72px]">
                <p className="text-[10px] font-semibold text-[#667085] leading-none">BUY AT</p>
                <p className="text-lg sm:text-xl font-extrabold text-[#C49A52] leading-tight">{slide.buyAt}</p>
              </div>
            </Link>

            <div className="absolute right-4 bottom-8 bg-white rounded-lg shadow-lg px-3 py-1.5 z-10 min-w-[96px] text-center">
              <p className="text-sm sm:text-base font-extrabold text-[#172033]">MRP {slide.mrp}</p>
            </div>
          </div>
        </div>
      </div>

      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((item, i) => (
            <button
              key={`${item.image}-${i}`}
              type="button"
              aria-label={`Go to banner ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
