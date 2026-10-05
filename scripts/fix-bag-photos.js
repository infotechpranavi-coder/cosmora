const mongoose = require("mongoose")
require("dotenv").config({ path: ".env.local" })

const photo = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`

const UPDATES = {
  "City Tote Bag": photo("photo-1590874103328-eac38a683ce7"),
  "Weekend Duffle": photo("photo-1553062407-98eeb64c6a62"),
  "Slim Laptop Sleeve Bag": photo("photo-1547949003-9792a18a2601"),
  "Campus Backpack": photo("photo-1622560480605-d83c853bc5c3"),
}

;(async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  const products = mongoose.connection.db.collection("products")
  for (const [name, url] of Object.entries(UPDATES)) {
    const res = await products.updateOne(
      { name },
      { $set: { "images.0.url": url, updatedAt: new Date() } }
    )
    console.log(name, res.modifiedCount)
  }
  await mongoose.disconnect()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
