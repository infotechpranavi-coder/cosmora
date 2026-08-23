"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { getCloudinaryDeliveryUrl } from "@/lib/cloudinary-url"

type Banner = {
  _id: string
  image: { url: string; publicId: string }
  title?: string
  link?: string
}

const FALLBACK = "/2.jpg"
const INTERVAL_MS = 5000

export default function HeroBannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    fetch("/api/banners")
      .then((r) => r.json())
      .then((data) => {
        if (data?.data?.length) setBanners(data.data)
      })
      .catch(() => {})
  }, [])

  const count = banners.length

  const next = useCallback(() => {
    if (count <= 1) return
    setFade(false)
    setTimeout(() => {
      setIndex((i) => (i + 1) % count)
      setFade(true)
    }, 400)
  }, [count])

  useEffect(() => {
    if (count <= 1) return
    const t = setInterval(next, INTERVAL_MS)
    return () => clearInterval(t)
  }, [count, next])

  const current = banners[index]
  const rawSrc = current?.image?.url || FALLBACK
  const src =
    rawSrc === FALLBACK
      ? FALLBACK
      : getCloudinaryDeliveryUrl(rawSrc, { width: 2560, quality: 'auto:best' })

  const content = (
    <div className="absolute inset-0">
      <Image
        src={src}
        alt={current?.title || "Alankarika Jewelry Collection"}
        fill
        className={`object-cover object-[center_30%] sm:object-center transition-opacity duration-700 ease-in-out ${
          fade ? "opacity-100" : "opacity-0"
        }`}
        priority
        quality={100}
        sizes="100vw"
        unoptimized={src.startsWith('http')}
      />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  )

  return (
    <section className="relative h-[24vh] min-h-[200px] max-h-[260px] sm:min-h-[45vh] sm:max-h-none md:min-h-[55vh] lg:min-h-[85vh] xl:min-h-screen overflow-hidden">
      {current?.link ? (
        <Link href={current.link} className="block absolute inset-0 z-0">
          {content}
        </Link>
      ) : (
        content
      )}

      {count > 1 && (
        <>
          <div className="absolute bottom-3 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {banners.map((b, i) => (
              <button
                key={b._id}
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
          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-colors hidden md:flex items-center justify-center"
            aria-label="Next banner"
          >
            ›
          </button>
        </>
      )}
    </section>
  )
}
