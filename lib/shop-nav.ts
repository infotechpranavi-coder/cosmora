export type ShopNavItem = {
  name: string
  href: string
}

export type ShopNavGroup = {
  name: string
  href: string
  items: ShopNavItem[]
}

function hrefFor(name: string) {
  return `/products?category=${encodeURIComponent(name)}`
}

export const STORE_EMAIL = "info@cosmoraonline.com"
export const STORE_PHONE_DISPLAY = "+91 9326493809"
export const STORE_PHONE_TEL = "+919326493809"
export const STORE_WHATSAPP = "919326493809"

/** Fixed Cosmora storefront taxonomy (nav + product filters). */
export const SHOP_NAV: ShopNavGroup[] = [
  {
    name: "Clothing",
    href: hrefFor("Clothing"),
    items: [
      { name: "T-Shirts", href: hrefFor("T-Shirts") },
      { name: "Shirts", href: hrefFor("Shirts") },
      { name: "Jackets", href: hrefFor("Jackets") },
      { name: "Sportswear", href: hrefFor("Sportswear") },
      { name: "Hoodies", href: hrefFor("Hoodies") },
      { name: "Sweatshirts", href: hrefFor("Sweatshirts") },
    ],
  },
  {
    name: "Bags",
    href: hrefFor("Bags"),
    items: [
      { name: "Laptop Bags", href: hrefFor("Laptop Bags") },
      { name: "Laptop Sleeves/Covers", href: hrefFor("Laptop Sleeves/Covers") },
      { name: "Backpacks", href: hrefFor("Backpacks") },
      { name: "Travel Bags", href: hrefFor("Travel Bags") },
      { name: "Tote Bags", href: hrefFor("Tote Bags") },
    ],
  },
  {
    name: "Accessories",
    href: hrefFor("Accessories"),
    items: [{ name: "Caps", href: hrefFor("Caps") }],
  },
]

export const SHOP_SUBCATEGORY_NAMES = SHOP_NAV.flatMap((g) => g.items.map((i) => i.name))

export const SHOP_PARENT_NAMES = SHOP_NAV.map((g) => g.name)

/** Subcategory names that belong under a parent (or the parent itself). */
export function resolveCategoryFilterTerms(category: string): string[] {
  const q = category.trim().toLowerCase()
  if (!q) return []

  const group = SHOP_NAV.find((g) => g.name.toLowerCase() === q)
  if (group) {
    return [group.name, ...group.items.map((i) => i.name)].map((n) => n.toLowerCase())
  }

  return [q]
}

export function isKnownShopCategory(category: string): boolean {
  const q = category.trim().toLowerCase()
  if (!q) return false
  return (
    SHOP_PARENT_NAMES.some((n) => n.toLowerCase() === q) ||
    SHOP_SUBCATEGORY_NAMES.some((n) => n.toLowerCase() === q)
  )
}
