"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Factory, Store, PenTool, Truck } from "lucide-react"
import { HERO_SLIDES, IMG } from "@/data/print-marketplace"
import { getCloudinaryDeliveryUrl } from "@/lib/cloudinary-url"

const FEATURES = [
  { label: "Factory Sourcing", Icon: Factory },
  { label: "Free Sample Visit", Icon: Store },
  { label: "Editable Design", Icon: PenTool },
  { label: "Door Delivery", Icon: Truck },
]

type Banner = {
  _id: string
  image: { url: string; publicId: string }
  title?: string
  link?: string
}

type Slide = {
  image: string
  buyAt: string
  mrp: string
  link?: string
  title?: string
}

const FALLBACK_PRODUCT = IMG("/printtool/data/thumbnails/lumise-media-Bottle-thumbn.jpg")

export default function MarketplaceHero() {
  const [slides, setSlides] = useState<Slide[]>(HERO_SLIDES)
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    fetch("/api/banners")
      .then((r) => r.json())
      .then((data) => {
        const banners = (data?.data || []) as Banner[]
        if (!banners.length) return
        setSlides(
          banners.map((banner, i) => ({
            image: getCloudinaryDeliveryUrl(banner.image?.url, { width: 1600, quality: "auto:best" }),
            buyAt: HERO_SLIDES[i % HERO_SLIDES.length].buyAt,
            mrp: HERO_SLIDES[i % HERO_SLIDES.length].mrp,
            link: banner.link || "/contact",
            title: banner.title,
          }))
        )
        setIndex(0)
      })
      .catch(() => {})
  }, [])

  const count = slides.length
  const slide = slides[index] || HERO_SLIDES[0]
  const productImage = slides[(index + 1) % count]?.image || FALLBACK_PRODUCT

  const next = useCallback(() => {
    if (count <= 1) return
    setFade(false)
    setTimeout(() => {
      setIndex((i) => (i + 1) % count)
      setFade(true)
    }, 350)
  }, [count])

  useEffect(() => {
    if (count <= 1) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [count, next])

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(105deg, #5B21B6 0%, #7C3AED 32%, #C026D3 68%, #F0ABFC 100%)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center min-h-[420px] lg:min-h-[520px]">
          <div className="text-center lg:text-left z-10">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
              <span className="hidden lg:inline-block h-px w-12 bg-white/70" />
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                India&apos;s First
              </h1>
              <span className="hidden lg:inline-block h-px w-12 bg-white/70" />
            </div>
            <p
              className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-tight mb-3"
              style={{
                background: "linear-gradient(90deg, #FDE68A 0%, #F59E0B 45%, #EA580C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Print Marketplace
            </p>
            <p className="text-white text-lg sm:text-xl font-semibold mb-8">
              Buy directly from Manufacturer
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
              {FEATURES.map(({ label, Icon }) => (
                <div
                  key={label}
                  className="w-[104px] sm:w-[118px] rounded-xl bg-white/95 px-2 pt-3 pb-2.5 shadow-lg text-center"
                >
                  <div className="mx-auto mb-1.5 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-[#7C3AED]">
                    <Icon className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <p className="text-[11px] sm:text-xs font-semibold text-gray-800 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] h-[340px] sm:h-[420px] lg:h-[500px]">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[78%] aspect-square rounded-full overflow-hidden shadow-2xl ring-4 ring-white/25 bg-black/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.title || "Hero banner"}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
                  fade ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>

            <Link
              href={slide.link || "/contact"}
              className="absolute right-0 top-[6%] w-[44%] max-w-[230px] bg-white rounded-[28px] shadow-2xl p-4 z-10"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={productImage}
                  alt={slide.title || "Featured print product"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-1 right-2 bg-white rounded-md shadow px-2 py-1 text-right">
                <p className="text-[10px] font-semibold text-gray-500 leading-none">BUY AT</p>
                <p className="text-lg sm:text-xl font-extrabold text-[#7C3AED] leading-tight">{slide.buyAt}</p>
              </div>
            </Link>

            <div className="absolute right-4 bottom-8 bg-white rounded-lg shadow-lg px-3 py-1.5 z-10">
              <p className="text-sm sm:text-base font-extrabold text-gray-800">MRP {slide.mrp}</p>
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
              onClick={() => {
                setFade(false)
                setTimeout(() => {
                  setIndex(i)
                  setFade(true)
                }, 200)
              }}
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
