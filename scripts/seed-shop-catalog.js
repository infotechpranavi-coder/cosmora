const mongoose = require("mongoose")
require("dotenv").config({ path: ".env.local" })

const photo = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`

const PRODUCTS = [
  {
    name: "City Tote Bag",
    category: "Bags",
    price: 1299,
    originalPrice: 1799,
    sizes: "One size",
    image: photo("photo-1590874103328-eac38a683ce7"),
    description: "Structured everyday tote with an inner pocket. Canvas body, ready for a small logo print.",
    features: ["Canvas body", "Inner slip pocket", "Custom print area"],
  },
  {
    name: "Weekend Duffle",
    category: "Bags",
    price: 1899,
    originalPrice: 2499,
    sizes: "One size",
    image: photo("photo-1553062407-98eeb64c6a62"),
    description: "Compact duffle for short trips. Reinforced handles and a zip main compartment.",
    features: ["Zip compartment", "Shoulder strap", "Water-resistant base"],
  },
  {
    name: "Slim Laptop Sleeve Bag",
    category: "Bags",
    price: 999,
    originalPrice: 1499,
    sizes: "13 inch, 15 inch",
    image: photo("photo-1547949003-9792a18a2601"),
    description: "Padded sleeve bag for a laptop and charger. Clean front panel for branding.",
    features: ["Padded laptop slot", "Front pocket", "Fits 13–15 inch"],
  },
  {
    name: "Campus Backpack",
    category: "Bags",
    price: 1599,
    originalPrice: 2199,
    sizes: "One size",
    image: photo("photo-1622560480605-d83c853bc5c3"),
    description: "Day backpack with a padded back and bottle pocket. Built for college and office commutes.",
    features: ["Padded straps", "Bottle pocket", "Laptop sleeve"],
  },
  {
    name: "Classic White Tee",
    category: "T-Shirts",
    price: 499,
    originalPrice: 799,
    sizes: "S, M, L, XL, XXL",
    image: photo("photo-1521572163474-6864f9cf17ab"),
    description: "Soft cotton crew neck. Smooth chest panel for custom prints.",
    features: ["180 GSM cotton", "Crew neck", "Print-ready"],
  },
  {
    name: "Ink Black Tee",
    category: "T-Shirts",
    price: 549,
    originalPrice: 849,
    sizes: "S, M, L, XL, XXL",
    image: photo("photo-1583743814966-8936f5b7be1a"),
    description: "Black everyday tee with a regular fit and reinforced collar.",
    features: ["Regular fit", "Reinforced collar", "Pre-shrunk"],
  },
  {
    name: "Navy Crew Tee",
    category: "T-Shirts",
    price: 529,
    originalPrice: 829,
    sizes: "S, M, L, XL, XXL",
    image: photo("photo-1523381210434-271e8be1f52b"),
    description: "Navy crew for teams, events, and staff uniforms.",
    features: ["Team-ready", "Cotton blend", "Sizes S–XXL"],
  },
  {
    name: "Heather Grey Tee",
    category: "T-Shirts",
    price: 479,
    originalPrice: 749,
    sizes: "S, M, L, XL, XXL",
    image: photo("photo-1576566588028-4147f3842f27"),
    description: "Heather grey tee that takes single-colour prints cleanly.",
    features: ["Heather cotton", "Everyday fit", "Easy to print"],
  },
  {
    name: "Oxford Formal Shirt",
    category: "Formal Shirts",
    price: 1499,
    originalPrice: 1999,
    sizes: "38, 40, 42, 44",
    image: photo("photo-1596755094514-f87e34085b2c"),
    description: "White oxford formal shirt with a spread collar. Suitable for office wear and events.",
    features: ["Oxford cotton", "Spread collar", "Button cuffs"],
  },
  {
    name: "Sky Blue Formal Shirt",
    category: "Formal Shirts",
    price: 1599,
    originalPrice: 2199,
    sizes: "38, 40, 42, 44",
    image: photo("photo-1602810318383-e386cc2a3ccf"),
    description: "Light blue formal shirt with a slim regular fit and a left chest pocket.",
    features: ["Slim regular fit", "Chest pocket", "Easy-iron fabric"],
  },
  {
    name: "Charcoal Office Shirt",
    category: "Formal Shirts",
    price: 1699,
    originalPrice: 2299,
    sizes: "38, 40, 42, 44",
    image: photo("photo-1594938291221-94f18cbb5660"),
    description: "Charcoal formal shirt for meetings and client visits.",
    features: ["Matte finish", "Full button placket", "Office fit"],
  },
  {
    name: "Pin Stripe Formal Shirt",
    category: "Formal Shirts",
    price: 1799,
    originalPrice: 2399,
    sizes: "38, 40, 42, 44",
    image: photo("photo-1620012253295-c15cc3e65df4"),
    description: "Fine stripe formal shirt with a pointed collar.",
    features: ["Fine stripe", "Pointed collar", "Breathable weave"],
  },
]

function offerOf(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

;(async () => {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing")
  await mongoose.connect(process.env.MONGODB_URI)
  const products = mongoose.connection.db.collection("products")
  const now = new Date()
  let added = 0

  for (const item of PRODUCTS) {
    const exists = await products.findOne({ name: item.name })
    if (exists) {
      console.log("exists", item.name)
      continue
    }
    const offer = offerOf(item.price, item.originalPrice)
    await products.insertOne({
      name: item.name,
      description: item.description,
      keyFeatures: item.features,
      price: item.price,
      originalPrice: item.originalPrice,
      offerPercentage: offer,
      isOnSale: offer > 0,
      sizeConstraints: item.sizes,
      quantity: 80,
      category: item.category,
      subCategory: "",
      images: [
        {
          url: item.image,
          publicId: `catalog/${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        },
      ],
      videos: [],
      rating: 4.5,
      reviews: 18,
      isNew: true,
      isActive: true,
      isOutOfStock: false,
      createdAt: now,
      updatedAt: now,
    })
    added += 1
    console.log("added", item.category, item.name)
  }

  const count = await products.countDocuments({ isActive: { $ne: false } })
  console.log("added", added, "active products", count)
  await mongoose.disconnect()
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
