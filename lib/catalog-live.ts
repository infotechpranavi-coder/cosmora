import type { CatalogItem } from "@/data/print-marketplace"
import { CATEGORY_TREE } from "@/data/print-marketplace"

export type DbCategory = {
  _id: string
  name: string
  subCategories?: string[]
}

export type DbProduct = {
  _id: string
  name: string
  price: number
  originalPrice?: number
  category?: string
  subCategory?: string
  images?: Array<{ url: string }>
  isOnSale?: boolean
  isActive?: boolean
}

export function categoryHref(name: string) {
  return `/products?category=${encodeURIComponent(name)}`
}

/** Map dashboard categories → navbar tree. Falls back to static print tree. */
export function toCategoryTree(categories: DbCategory[]) {
  if (!categories.length) return CATEGORY_TREE

  return categories.map((cat) => {
    const subs = (cat.subCategories || []).filter(Boolean)
    if (subs.length) {
      return {
        name: cat.name,
        items: subs.map((name) => ({ name, href: categoryHref(name) })),
      }
    }
    return {
      name: cat.name,
      items: [{ name: cat.name, href: categoryHref(cat.name) }],
    }
  })
}

export function flatCategoryNames(categories: DbCategory[]) {
  const names: string[] = []
  for (const cat of categories) {
    const subs = (cat.subCategories || []).filter(Boolean)
    if (subs.length) names.push(...subs)
    else names.push(cat.name)
  }
  return Array.from(new Set(names))
}

export function productToCatalogItem(product: DbProduct): CatalogItem {
  const image = product.images?.[0]?.url || "/placeholder.svg"
  return {
    name: product.name,
    href: `/products/${product._id}`,
    image,
    priceLabel: `₹ ${Number(product.price).toFixed(0)}/-`,
    subtitle: product.isOnSale ? "On offer" : product.category || undefined,
  }
}

export function filterProductsByCategory(products: DbProduct[], category: string) {
  if (!category) return products
  const q = category.toLowerCase()
  return products.filter((p) => {
    const cat = (p.category || "").toLowerCase()
    const sub = (p.subCategory || "").toLowerCase()
    const name = (p.name || "").toLowerCase()
    return cat === q || sub === q || cat.includes(q) || sub.includes(q) || name.includes(q)
  })
}
