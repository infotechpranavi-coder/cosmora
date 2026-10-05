const mongoose = require("mongoose")
require("dotenv").config({ path: ".env.local" })

;(async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  const products = await mongoose.connection.db
    .collection("products")
    .find({}, { projection: { name: 1, category: 1, price: 1, description: 1, "images.url": 1 } })
    .toArray()
  for (const p of products) {
    const dummy = (p.description || "").includes("Dummy catalog")
    console.log(`${dummy ? "DUMMY" : "REAL "} | ${p.category} | ${p.price} | ${p.name}`)
  }
  console.log("count", products.length)
  await mongoose.disconnect()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
