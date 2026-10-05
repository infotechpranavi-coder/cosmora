import type { CatalogItem } from "@/data/print-marketplace"
import type { DbProduct } from "@/lib/catalog-live"

/** Match a free-text query against product / catalog fields. */
export function matchesProductSearch(
  query: string,
  fields: {
    name?: string
    category?: string
    subCategory?: string
    description?: string
    subtitle?: string
    keyFeatures?: string[]
    colors?: Array<{ name?: string }>
  }
): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  const haystack = [
    fields.name,
    fields.category,
    fields.subCategory,
    fields.description,
    fields.subtitle,
    ...(fields.keyFeatures || []),
    ...(fields.colors || []).map((c) => c.name || ""),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  const tokens = q.split(/\s+/).filter(Boolean)
  return tokens.every((token) => haystack.includes(token))
}

export function filterCatalogByQuery(items: CatalogItem[], query: string): CatalogItem[] {
  const q = query.trim()
  if (!q) return items
  return items.filter((item) =>
    matchesProductSearch(q, {
      name: item.name,
      category: item.category,
      description: item.description,
      subtitle: item.subtitle,
      keyFeatures: item.keyFeatures,
      colors: item.colors,
    })
  )
}

export function filterDbProductsByQuery(products: DbProduct[], query: string): DbProduct[] {
  const q = query.trim()
  if (!q) return products
  return products.filter((p) =>
    matchesProductSearch(q, {
      name: p.name,
      category: p.category,
      subCategory: p.subCategory,
      description: p.description,
      keyFeatures: p.keyFeatures,
      colors: p.colors,
    })
  )
}
