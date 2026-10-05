const mongoose = require("mongoose")
require("dotenv").config({ path: ".env.local" })

const SEED_CATEGORIES = [
  "Round Neck T-Shirt",
  "Polo",
  "Sports T-Shirt",
  "Oversized Tee",
  "Hoodie",
  "Kids T-Shirt",
  "HELLO",
]

const SHOP_CATEGORIES = ["Bags", "T-Shirts", "Formal Shirts"]

;(async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  const db = mongoose.connection.db
  const removed = await db.collection("products").deleteMany({
    description: /Dummy catalog/,
  })
  console.log("removed dummy products", removed.deletedCount)

  await db.collection("products").updateMany(
    { name: /^TSHIRT$/i },
    { $set: { category: "T-Shirts", updatedAt: new Date() } }
  )

  await db.collection("categories").deleteMany({ name: { $in: SEED_CATEGORIES } })

  const now = new Date()
  for (const name of SHOP_CATEGORIES) {
    const exists = await db.collection("categories").findOne({ name })
    if (!exists) {
      await db.collection("categories").insertOne({
        name,
        subCategories: [],
        createdAt: now,
        updatedAt: now,
      })
      console.log("category +", name)
    }
  }

  const left = await db.collection("products").find({}, { projection: { name: 1, category: 1, price: 1 } }).toArray()
  console.log("remaining", left)
  await mongoose.disconnect()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
