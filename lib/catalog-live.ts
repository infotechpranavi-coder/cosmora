import type { CatalogItem } from "@/data/print-marketplace"

export type DbCategory = {
  _id: string
  name: string
  subCategories?: string[]
}

export type DbProduct = {
  _id: string
  name: string
  description?: string
  keyFeatures?: string[]
  price: number
  originalPrice?: number
  offerPercentage?: number
  category?: string
  subCategory?: string
  sizeConstraints?: string
  colors?: Array<{ name: string; hex: string }>
  quantity?: number
  images?: Array<{ url: string; publicId?: string }>
  videos?: Array<{ url: string; publicId?: string }>
  rating?: number
  reviews?: number
  isNew?: boolean
  isOnSale?: boolean
  isActive?: boolean
  isOutOfStock?: boolean
  /** Homepage section assignment from dashboard Apparel modal */
  homeSection?: string
}

export function categoryHref(name: string) {
  return `/products?category=${encodeURIComponent(name)}`
}

/** Map dashboard categories → navbar tree. Empty when nothing is added in admin. */
export function toCategoryTree(categories: DbCategory[]) {
  if (!categories.length) return []

  return categories.map((cat) => {
    const subs = (cat.subCategories || []).filter(Boolean)
    // No subs: single clickable item (avoid showing name twice as header + link)
    if (!subs.length) {
      return {
        name: "",
        items: [{ name: cat.name, href: categoryHref(cat.name) }],
      }
    }
    return {
      name: cat.name,
      items: subs.map((name) => ({ name, href: categoryHref(name) })),
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
  const secondImage = product.images && product.images.length > 1 ? product.images[1].url : undefined
  const price = Number(product.price) || 0
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : undefined
  const offerPercentage =
    product.offerPercentage ||
    (originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined)

  return {
    id: product._id,
    name: product.name,
    href: `/products/${product._id}`,
    image,
    secondImage,
    price,
    originalPrice,
    priceLabel: `₹${price.toLocaleString("en-IN")}`,
    subtitle: product.category || (product.isOnSale ? "Special Edition" : undefined),
    category: product.category,
    rating: typeof product.rating === "number" && product.rating > 0 ? product.rating : 4.8,
    reviews: typeof product.reviews === "number" && product.reviews > 0 ? product.reviews : 18,
    isNew: product.isNew ?? false,
    isOnSale: Boolean(product.isOnSale || (originalPrice && originalPrice > price)),
    isOutOfStock: Boolean(product.isOutOfStock || (product.quantity !== undefined && product.quantity <= 0)),
    quantity: product.quantity ?? 50,
    offerPercentage,
    description: product.description,
    keyFeatures: product.keyFeatures,
    sizeConstraints: product.sizeConstraints,
    colors: product.colors || [],
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
