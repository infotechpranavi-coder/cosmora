import { SHOP_NAV } from "@/lib/shop-nav"

/** Stable demo images (picsum seeds) — avoids broken Unsplash IDs. */
const photo = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/900/1125`

export type SeedProduct = {
  name: string
  category: string
  subCategory: string
  price: number
  originalPrice: number
  image: string
  description: string
}

export const SHOP_SEED_PRODUCTS: SeedProduct[] = [
  {
    name: "Classic Cotton T-Shirt",
    category: "Clothing",
    subCategory: "T-Shirts",
    price: 449,
    originalPrice: 799,
    image: photo("cosmora-tee-classic"),
    description: "Soft cotton tee ready for custom print. Dummy catalog style.",
  },
  {
    name: "Ink Black Crew Tee",
    category: "Clothing",
    subCategory: "T-Shirts",
    price: 499,
    originalPrice: 849,
    image: photo("cosmora-tee-black"),
    description: "Deep black crew neck with a smooth print surface.",
  },
  {
    name: "Oxford Formal Shirt",
    category: "Clothing",
    subCategory: "Shirts",
    price: 1099,
    originalPrice: 1599,
    image: photo("cosmora-shirt-oxford"),
    description: "Tailored formal shirt for office and events.",
  },
  {
    name: "Navy Everyday Shirt",
    category: "Clothing",
    subCategory: "Shirts",
    price: 999,
    originalPrice: 1499,
    image: photo("cosmora-shirt-navy"),
    description: "Crisp navy shirt with a clean collar finish.",
  },
  {
    name: "Urban Light Jacket",
    category: "Clothing",
    subCategory: "Jackets",
    price: 1799,
    originalPrice: 2499,
    image: photo("cosmora-jacket-urban"),
    description: "Lightweight jacket for everyday wear and branding.",
  },
  {
    name: "Training Dry-Fit Tee",
    category: "Clothing",
    subCategory: "Sportswear",
    price: 599,
    originalPrice: 949,
    image: photo("cosmora-sports-dryfit"),
    description: "Breathable sportswear for teams and workouts.",
  },
  {
    name: "Court Sports Jersey",
    category: "Clothing",
    subCategory: "Sportswear",
    price: 649,
    originalPrice: 999,
    image: photo("cosmora-sports-jersey"),
    description: "Team jersey with a large back-print area.",
  },
  {
    name: "Campus Pullover Hoodie",
    category: "Clothing",
    subCategory: "Hoodies",
    price: 1199,
    originalPrice: 1699,
    image: photo("cosmora-hoodie-campus"),
    description: "Fleece hoodie for campus and bulk merch.",
  },
  {
    name: "Zip Studio Hoodie",
    category: "Clothing",
    subCategory: "Hoodies",
    price: 1399,
    originalPrice: 1899,
    image: photo("cosmora-hoodie-zip"),
    description: "Zip hoodie with front and sleeve print options.",
  },
  {
    name: "Classic Crew Sweatshirt",
    category: "Clothing",
    subCategory: "Sweatshirts",
    price: 999,
    originalPrice: 1449,
    image: photo("cosmora-sweatshirt-crew"),
    description: "Soft crew sweatshirt for logos and winter merch.",
  },
  {
    name: "Executive Laptop Bag",
    category: "Bags",
    subCategory: "Laptop Bags",
    price: 1299,
    originalPrice: 1899,
    image: photo("cosmora-bag-laptop"),
    description: "Padded laptop bag for work and travel.",
  },
  {
    name: "Slim Laptop Sleeve",
    category: "Bags",
    subCategory: "Laptop Sleeves/Covers",
    price: 699,
    originalPrice: 999,
    image: photo("cosmora-bag-sleeve"),
    description: "Protective sleeve/cover for laptops and tablets.",
  },
  {
    name: "Daily Commute Backpack",
    category: "Bags",
    subCategory: "Backpacks",
    price: 1499,
    originalPrice: 2199,
    image: photo("cosmora-bag-backpack"),
    description: "Everyday backpack with laptop compartment.",
  },
  {
    name: "Weekender Travel Bag",
    category: "Bags",
    subCategory: "Travel Bags",
    price: 1899,
    originalPrice: 2699,
    image: photo("cosmora-bag-travel"),
    description: "Spacious travel bag for short trips.",
  },
  {
    name: "Canvas Tote Bag",
    category: "Bags",
    subCategory: "Tote Bags",
    price: 499,
    originalPrice: 799,
    image: photo("cosmora-bag-tote"),
    description: "Canvas tote ready for custom print.",
  },
  {
    name: "Classic Embroidered Cap",
    category: "Accessories",
    subCategory: "Caps",
    price: 349,
    originalPrice: 599,
    image: photo("cosmora-cap-classic"),
    description: "Structured cap for logos and events.",
  },
  {
    name: "Street Snapback Cap",
    category: "Accessories",
    subCategory: "Caps",
    price: 399,
    originalPrice: 649,
    image: photo("cosmora-cap-snapback"),
    description: "Snapback cap with a clean front panel for branding.",
  },
]

export function shopCategoryPayload() {
  return SHOP_NAV.map((group) => ({
    name: group.name,
    subCategories: group.items.map((item) => item.name),
  }))
}
