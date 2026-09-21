"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Factory, Store, PenTool, Truck } from "lucide-react"
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

const SLIDE_MS = 4200

export default function MarketplaceHero() {
  const slides = HERO_SLIDES
  const count = slides.length
  const [index, setIndex] = useState(0)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), 40)
    return () => window.clearTimeout(t)
  }, [])

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
    <section className="relative overflow-hidden min-h-[88vh] lg:min-h-[92vh] flex flex-col justify-end">
      {/* Full-bleed slide plane */}
      <div className="absolute inset-0">
        {slides.map((item, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`bg-${item.image}`}
            src={item.image}
            alt=""
            aria-hidden
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1400ms] ease-out ${
              i === index
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(20,36,61,0.96) 0%, rgba(20,36,61,0.88) 38%, rgba(36,59,90,0.55) 62%, rgba(20,36,61,0.35) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 80% 40%, rgba(196,154,82,0.22), transparent 55%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-10 pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-16 lg:pb-20">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-end">
          {/* Copy */}
          <div
            className={`max-w-xl transition-all duration-700 ease-out ${
              entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-[#E8D5B0] text-[11px] sm:text-xs font-semibold tracking-[0.35em] uppercase mb-5">
              India&apos;s first print marketplace
            </p>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-[0.12em] leading-[0.95] mb-4"
              style={{
                background: "linear-gradient(100deg, #FFF8E7 0%, #E8D5B0 45%, #C49A52 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              COSMORA
            </h1>

            <p className="text-white/90 text-lg sm:text-xl font-medium tracking-wide mb-3">
              Wear Your Universe
            </p>
            <p className="text-white/70 text-sm sm:text-base max-w-md mb-8 leading-relaxed">
              Custom printed apparel, bought directly from the manufacturer — factory rates,
              editable design, door delivery.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-10">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-[#14243D] transition-transform hover:scale-[1.02]"
                style={{ background: "linear-gradient(90deg, #C49A52 0%, #E8D5B0 100%)" }}
              >
                Shop printed tees
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Get a quote
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-5 border-t border-white/15 pt-6">
              {FEATURES.map(({ label, Icon }, i) => (
                <div
                  key={label}
                  className={`flex items-start gap-2.5 transition-all duration-700 ease-out ${
                    entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${180 + i * 80}ms` }}
                >
                  <Icon className="w-4 h-4 text-[#C49A52] mt-0.5 shrink-0" strokeWidth={1.75} />
                  <span className="text-[11px] sm:text-xs font-medium text-white/85 leading-snug">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Product visual — edge plane, not floating cards */}
          <div
            className={`relative transition-all duration-1000 ease-out delay-150 ${
              entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] max-h-[560px] w-full overflow-hidden">
              <div className="absolute inset-0 bg-[#0A1628]/40" />
              {slides.map((item, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`hero-${item.image}`}
                  src={item.image}
                  alt={i === index ? "COSMORA custom printed apparel" : ""}
                  aria-hidden={i !== index}
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
                    i === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}

              {/* Soft gold frame accent — not a sticker/badge */}
              <div className="absolute inset-3 sm:inset-4 border border-[#C49A52]/35 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 bg-gradient-to-t from-[#14243D]/95 via-[#14243D]/55 to-transparent">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[#E8D5B0] text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-1">
                      Starting at
                    </p>
                    <p className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
                      ₹{slide.buyAt.replace("/-", "")}
                      <span className="text-base font-semibold text-white/60">/-</span>
                    </p>
                  </div>
                  <p className="text-white/50 text-xs sm:text-sm line-through">
                    MRP {slide.mrp}
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary thumb strip — integrated, not floating card */}
            <div className="mt-3 flex gap-2 overflow-hidden">
              {PRODUCT_THUMBS.slice(0, 4).map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setIndex(i % count)}
                  className={`relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden shrink-0 transition-opacity ${
                    i === index % PRODUCT_THUMBS.length ? "opacity-100 ring-1 ring-[#C49A52]" : "opacity-50 hover:opacity-80"
                  }`}
                  aria-label={`Show look ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {count > 1 && (
          <div className="mt-10 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/15" />
            <div className="flex gap-2">
              {slides.map((item, i) => (
                <button
                  key={`${item.image}-dot-${i}`}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-400 ${
                    i === index ? "w-10 bg-[#C49A52]" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
            <div className="h-px flex-1 bg-white/15" />
          </div>
        )}
      </div>
    </section>
  )
}
