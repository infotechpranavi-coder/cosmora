"use client"

import Link from "next/link"
import type { CatalogItem } from "@/data/print-marketplace"

export function MarketplaceProductCard({
  href,
  image,
  name,
  priceLabel,
  subtitle,
}: CatalogItem) {
  return (
    <Link href={href} className="group block min-w-0">
      <div className="relative bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden aspect-[4/3] sm:aspect-[5/4] ring-1 ring-neutral-200/80 group-hover:ring-neutral-400/80 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_24px_50px_rgba(0,0,0,0.14)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {priceLabel && (
          <div className="absolute bottom-3 right-3 bg-[#2F3F8F] text-white px-3 py-1.5 rounded-xl shadow-md text-right leading-tight">
            <p className="text-sm sm:text-base font-extrabold">{priceLabel}</p>
            {subtitle && <p className="text-[10px] font-medium text-indigo-100">{subtitle}</p>}
          </div>
        )}
      </div>
      <h3 className="mt-3 text-center text-sm sm:text-base font-extrabold text-gray-900 uppercase tracking-wide line-clamp-2 group-hover:text-[#2F3F8F] transition-colors">
        {name}
      </h3>
    </Link>
  )
}

export function MarketplaceCategoryRow({
  title,
  items,
  columns = 4,
}: {
  title: string
  items: CatalogItem[]
  columns?: 2 | 4 | 5
}) {
  const grid =
    columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : columns === 5
        ? "grid-cols-2 lg:grid-cols-5"
        : "grid-cols-2 lg:grid-cols-4"

  return (
    <section className="py-8 sm:py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-block w-3.5 h-7 sm:w-4 sm:h-8 bg-[#C9A227] rounded-[3px]" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">{title}</h2>
        </div>
        <div className={`grid ${grid} gap-4 sm:gap-6`}>
          {items.map((item) => (
            <MarketplaceProductCard key={item.name} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}

/** Kept so stale Fast Refresh of page.tsx does not crash on the old import. */
export function MarketplaceSection({
  title,
  products,
  items,
  emptyLabel = "No products available",
}: {
  title: string
  href?: string
  products?: Array<{
    _id: string
    name: string
    price: number
    images?: Array<{ url: string }>
    isOnSale?: boolean
  }>
  items?: CatalogItem[]
  emptyLabel?: string
}) {
  const cards: CatalogItem[] =
    items ??
    (products || []).map((product) => ({
      name: product.name,
      href: `/view-details?id=${product._id}`,
      image: product.images?.[0]?.url || "/placeholder.svg",
      priceLabel: `${product.price}/-`,
      subtitle: product.isOnSale ? "On offer" : undefined,
    }))

  if (cards.length === 0) {
    return (
      <section className="py-8 sm:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block w-3.5 h-7 sm:w-4 sm:h-8 bg-[#C9A227] rounded-[3px]" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">{title}</h2>
          </div>
          <p className="text-gray-500 py-10 text-center">{emptyLabel}</p>
        </div>
      </section>
    )
  }

  return <MarketplaceCategoryRow title={title} items={cards} />
}
