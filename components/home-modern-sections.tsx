"use client"

import Link from "next/link"
import {
  Shirt,
  Palette,
  Printer,
  PackageCheck,
  Sparkles,
  Clock3,
  BadgeCheck,
  ArrowUpRight,
} from "lucide-react"
import { MarketplaceProductCard } from "@/components/marketplace-section"
import { APPARELS, CLIENT_LOGOS, FEATURED_APPARELS, IMG } from "@/data/print-marketplace"

const STEPS = [
  {
    step: "01",
    title: "Pick your tee",
    text: "Choose round neck, polo, sports, kids or oversized styles.",
    Icon: Shirt,
  },
  {
    step: "02",
    title: "Upload artwork",
    text: "Share your logo or design — our team helps refine the print.",
    Icon: Palette,
  },
  {
    step: "03",
    title: "We print & ship",
    text: "Factory print quality with door delivery across India.",
    Icon: Printer,
  },
]

const HIGHLIGHTS = [
  { title: "Factory rates", text: "No middlemen — direct manufacturer pricing.", Icon: BadgeCheck },
  { title: "Fast turnaround", text: "Quick production for bulk and single pieces.", Icon: Clock3 },
  { title: "Editable designs", text: "Adjust artwork before we go to print.", Icon: Sparkles },
  { title: "Door delivery", text: "Packed and shipped from Navi Mumbai.", Icon: PackageCheck },
]

export default function HomeModernSections() {
  const tees = [...FEATURED_APPARELS, ...APPARELS]

  return (
    <>
      {/* How it works */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 relative">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#7C3AED] mb-3">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
              Print your universe in three simple steps
            </h2>
            <p className="mt-3 text-gray-600 text-base sm:text-lg">
              From blank tee to branded merch — COSMORA makes custom printing effortless.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {STEPS.map(({ step, title, text, Icon }, i) => (
              <div
                key={step}
                className="group relative rounded-3xl bg-white/90 backdrop-blur border border-violet-100 p-6 sm:p-8 shadow-[0_20px_50px_rgba(91,33,182,0.06)] hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(91,33,182,0.12)] transition-all duration-500"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex items-start justify-between mb-8">
                  <span className="text-5xl font-black text-violet-100 group-hover:text-violet-200 transition-colors">
                    {step}
                  </span>
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured tees */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#7C3AED] mb-2">
                Bestsellers
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Signature printed tees
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C3AED] hover:text-[#6D28D9]"
            >
              View all styles
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 mb-7">
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

      {/* Full-bleed visual story */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(120deg, #4C1D95 0%, #7C3AED 45%, #DB2777 100%)",
          }}
        />
        <div className="absolute inset-0 opacity-30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMG("/img/homepage-new/grid/6.jpg?var=1789713787")}
            alt=""
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase text-pink-200 mb-3">
                Wear your universe
              </p>
              <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4">
                Premium prints that feel brand-ready
              </h2>
              <p className="text-white/85 text-base sm:text-lg max-w-xl mb-8">
                Soft fabrics, sharp artwork, and factory finishing — built for startups, events, teams, and creators
                in Navi Mumbai and beyond.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white text-[#6D28D9] px-6 py-3 font-semibold hover:bg-violet-50 transition-colors"
              >
                Get a print quote
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-white/10 blur-2xl" />
              <div className="relative rounded-[2rem] overflow-hidden ring-1 ring-white/30 shadow-2xl aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={IMG("/img/homepage-new/grid/2.png?var=1789713787")}
                  alt="Round neck printed t-shirt"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why COSMORA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#7C3AED] mb-3">
              Why COSMORA
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Built for modern merch teams
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HIGHLIGHTS.map(({ title, text, Icon }) => (
              <div
                key={title}
                className="rounded-3xl border border-violet-100 bg-white p-6 hover:border-violet-300 transition-colors duration-300"
              >
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-[#7C3AED]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style gallery strip */}
      <section className="py-12 sm:py-16 bg-white/70 border-y border-violet-100/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#7C3AED] mb-2">
                Style gallery
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Explore every cut
              </h2>
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="flex gap-4 sm:gap-5 animate-marquee w-max px-4">
            {[...tees, ...tees].map((item, i) => (
              <Link
                key={`${item.name}-${i}`}
                href={item.href}
                className="relative shrink-0 w-[220px] sm:w-[280px] aspect-[4/5] rounded-3xl overflow-hidden group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="font-extrabold text-sm sm:text-base">{item.name}</p>
                  {item.priceLabel && <p className="text-xs text-white/80 mt-0.5">{item.priceLabel}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk CTA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0f0a1f] text-white px-6 sm:px-12 py-12 sm:py-16">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#7C3AED]/40 blur-3xl" />
            <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[#EC4899]/30 blur-3xl" />
            <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] uppercase text-pink-300 mb-3">Bulk orders</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
                  Need 50 or 5,000 tees?
                </h2>
                <p className="text-white/75 text-base sm:text-lg max-w-xl">
                  Tell us your quantity, fabric, and print placement — we&apos;ll share factory rates on WhatsApp
                  within hours.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-stretch">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#EC4899] hover:bg-pink-500 px-6 py-3.5 font-semibold transition-colors"
                >
                  Request bulk quote
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 hover:bg-white/10 px-6 py-3.5 font-semibold transition-colors"
                >
                  Browse tee catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#7C3AED] mb-3">
              Trusted by teams
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Meet our clients
            </h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {CLIENT_LOGOS.map((src) => (
              <div
                key={src}
                className="bg-white rounded-2xl p-4 shadow-sm border border-violet-50 flex items-center justify-center h-24 hover:shadow-md transition-shadow"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Client logo" className="max-h-14 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
