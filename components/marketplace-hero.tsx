"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Factory, Store, PenTool, Truck } from "lucide-react"
import { HERO_SLIDES } from "@/data/print-marketplace"
import { getCloudinaryDeliveryUrl } from "@/lib/cloudinary-url"
import { DEFAULT_SETTINGS } from "@/lib/store-settings"

type HeroSlide = {
  image: string
  buyAt: string
  mrp: string
}

type HeroCopy = {
  eyebrow: string
  tagline: string
  description: string
}

const FEATURES = [
  { label: "Factory Sourcing", Icon: Factory },
  { label: "Free Sample Visit", Icon: Store },
  { label: "Editable Design", Icon: PenTool },
  { label: "Door Delivery", Icon: Truck },
]

const SLIDE_MS = 5000
const FALLBACK_PRICE = { buyAt: "299/-", mrp: "699/-" }

function normalizePrice(value: unknown, fallback: string) {
  const raw = typeof value === "string" ? value.trim() : ""
  if (!raw) return fallback
  return raw.includes("/-") ? raw : `${raw}/-`
}

export default function MarketplaceHero() {
  const [remoteSlides, setRemoteSlides] = useState<HeroSlide[] | null>(null)
  const [copy, setCopy] = useState<HeroCopy>({
    eyebrow: DEFAULT_SETTINGS.heroEyebrow,
    tagline: DEFAULT_SETTINGS.heroTagline,
    description: DEFAULT_SETTINGS.heroDescription,
  })
  const [index, setIndex] = useState(0)
  const [entered, setEntered] = useState(false)
  const [progressKey, setProgressKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [bannerRes, settingsRes] = await Promise.all([
          fetch(`/api/banners?_=${Date.now()}`, { cache: "no-store" }),
          fetch(`/api/settings?_=${Date.now()}`, { cache: "no-store" }),
        ])
        const bannerData = await bannerRes.json()
        const settingsData = await settingsRes.json()
        if (cancelled) return

        if (settingsData?.success && settingsData.data) {
          setCopy({
            eyebrow: settingsData.data.heroEyebrow || DEFAULT_SETTINGS.heroEyebrow,
            tagline: settingsData.data.heroTagline || DEFAULT_SETTINGS.heroTagline,
            description: settingsData.data.heroDescription || DEFAULT_SETTINGS.heroDescription,
          })
        }

        if (bannerData.success && Array.isArray(bannerData.data) && bannerData.data.length > 0) {
          const mapped: HeroSlide[] = bannerData.data
            .map((b: { image?: { url?: string }; buyAt?: string; mrp?: string; title?: string }) => {
              const url = b?.image?.url
              if (!url) return null
              return {
                image: getCloudinaryDeliveryUrl(url, { width: 1920, quality: "auto:best" }),
                buyAt: normalizePrice(b.buyAt, FALLBACK_PRICE.buyAt),
                mrp: normalizePrice(b.mrp, FALLBACK_PRICE.mrp),
              }
            })
            .filter(Boolean) as HeroSlide[]
          setRemoteSlides(mapped.length ? mapped : [])
        } else {
          setRemoteSlides([])
        }
      } catch {
        if (!cancelled) setRemoteSlides([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const slides = useMemo<HeroSlide[]>(() => {
    if (remoteSlides && remoteSlides.length > 0) return remoteSlides
    return HERO_SLIDES
  }, [remoteSlides])

  const count = slides.length

  useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), 60)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    setIndex(0)
    setProgressKey((k) => k + 1)
  }, [slides])

  useEffect(() => {
    if (count <= 1) return
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
      setProgressKey((k) => k + 1)
    }, SLIDE_MS)
    return () => window.clearInterval(t)
  }, [count])

  useEffect(() => {
    slides.forEach((slide) => {
      const img = new window.Image()
      img.src = slide.image
    })
  }, [slides])

  const goTo = (i: number) => {
    setIndex(i)
    setProgressKey((k) => k + 1)
  }

  const slide = slides[index] || slides[0]

  return (
    <section className="relative overflow-hidden min-h-[52vh] sm:min-h-[56vh] lg:min-h-[60vh] flex flex-col justify-center">
      <style jsx>{`
        @keyframes heroKenBurns {
          from { transform: scale(1.08); }
          to { transform: scale(1); }
        }
        @keyframes heroShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes heroProgress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .hero-ken {
          animation: heroKenBurns ${SLIDE_MS}ms ease-out forwards;
        }
        .hero-brand-shimmer {
          background-size: 200% 200%;
          animation: heroShimmer 6s ease infinite;
        }
        .hero-progress {
          transform-origin: left center;
          animation: heroProgress ${SLIDE_MS}ms linear forwards;
        }
      `}</style>

      <div className="absolute inset-0">
        {slides.map((item, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`bg-${item.image}-${i}`}
            src={item.image}
            alt=""
            aria-hidden
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-out ${
              i === index ? "opacity-100 hero-ken" : "opacity-0"
            }`}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(10,18,36,0.97) 0%, rgba(20,36,61,0.92) 32%, rgba(20,36,61,0.62) 58%, rgba(20,36,61,0.28) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 85% 35%, rgba(196,154,82,0.28), transparent 60%), radial-gradient(ellipse 40% 35% at 10% 80%, rgba(36,59,90,0.5), transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-20 items-center">
          <div
            className={`relative max-w-xl transition-all duration-800 ease-out ${
              entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="absolute -left-4 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-[#C49A52] to-transparent hidden lg:block" />

            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-8 bg-[#C49A52]" />
              <p className="text-[#E8D5B0] text-[11px] sm:text-xs font-semibold tracking-[0.4em] uppercase">
                {copy.eyebrow}
              </p>
            </div>

            <h1
              className="hero-brand-shimmer text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[0.14em] leading-[0.9] mb-3"
              style={{
                background:
                  "linear-gradient(105deg, #FFF8E7 0%, #E8D5B0 35%, #C49A52 55%, #E8D5B0 75%, #FFF8E7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              COSMORA
            </h1>

            <p className="text-white text-lg sm:text-xl font-light tracking-[0.08em] mb-3">
              {copy.tagline}
            </p>
            <p className="text-white/65 text-sm sm:text-base max-w-md mb-7 leading-relaxed font-light">
              {copy.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold text-[#14243D] shadow-[0_12px_40px_rgba(196,154,82,0.35)] transition-all hover:shadow-[0_16px_48px_rgba(196,154,82,0.45)] hover:-translate-y-0.5"
                style={{ background: "linear-gradient(90deg, #C49A52 0%, #E8D5B0 100%)" }}
              >
                Shop printed tees
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white hover:bg-white/12 hover:border-white/40 transition-all"
              >
                Get a quote
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-t border-white/12">
              {FEATURES.map(({ label, Icon }, i) => (
                <div
                  key={label}
                  className={`flex flex-col gap-2.5 py-5 pr-4 transition-all duration-700 ease-out ${
                    i > 0 ? "lg:border-l lg:border-white/12 lg:pl-4" : ""
                  } ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                  style={{ transitionDelay: `${220 + i * 90}ms` }}
                >
                  <Icon className="w-5 h-5 text-[#C49A52]" strokeWidth={1.5} />
                  <span className="text-[11px] sm:text-xs font-medium text-white/80 leading-snug tracking-wide">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`relative transition-all duration-1000 ease-out delay-100 ${
              entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] max-h-[320px] xl:max-h-[380px] w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.45)]">
              {slides.map((item, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`hero-${item.image}-${i}`}
                  src={item.image}
                  alt={i === index ? "COSMORA custom printed apparel" : ""}
                  aria-hidden={i !== index}
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
                    i === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}

              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1224]/90 via-transparent to-[#0A1224]/20 pointer-events-none rounded-2xl sm:rounded-3xl" />
              <div className="absolute inset-[10px] sm:inset-3 border border-white/20 pointer-events-none rounded-xl sm:rounded-2xl" />
              <div className="absolute inset-[14px] sm:inset-[14px] border border-[#C49A52]/25 pointer-events-none rounded-lg sm:rounded-xl" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[#E8D5B0] text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-1.5">
                      Starting at
                    </p>
                    <p className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight">
                      ₹{slide.buyAt.replace("/-", "")}
                      <span className="text-lg font-medium text-white/50">/-</span>
                    </p>
                  </div>
                  <p className="text-white/40 text-sm line-through mb-1">MRP {slide.mrp}</p>
                </div>
                <div className="mt-4 h-[2px] w-full bg-white/15 overflow-hidden">
                  <div
                    key={progressKey}
                    className="hero-progress h-full bg-[#C49A52]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {count > 1 && (
          <div className="mt-8 lg:mt-10 flex items-center justify-between gap-6">
            <p className="text-[11px] tracking-[0.25em] uppercase text-white/40 tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </p>
            <div className="flex gap-2">
              {slides.map((item, i) => (
                <button
                  key={`${item.image}-dot-${i}`}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === index ? "w-12 bg-[#C49A52]" : "w-3 bg-white/30 hover:bg-white/55"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
