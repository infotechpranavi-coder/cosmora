const mongoose = require("mongoose")

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://infotechpranavi_db_user:46tvRhmFSIcpwDWb@cluster0.nq9rxoz.mongodb.net/cosmora?retryWrites=true&w=majority&appName=Cluster0"

const APPAREL_SUBS = [
  "Cotton Polos",
  "Hoodies",
  "Pullover Hoodies",
  "Sweatshirt",
  "Zipper Hoodies",
  "Premium Cotton Polos",
  "Round Neck T-Shirt",
  "Sports T-Shirt",
  "Kids T-Shirt",
  "Women's T-Shirt",
]

async function main() {
  await mongoose.connect(uri)
  const Category =
    mongoose.models.Category ||
    mongoose.model(
      "Category",
      new mongoose.Schema(
        {
          name: { type: String, unique: true },
          subCategories: [String],
        },
        { timestamps: true }
      )
    )

  const name = "Customize Apparels"
  const existing = await Category.findOne({ name })
  if (existing) {
    existing.subCategories = APPAREL_SUBS
    await existing.save()
    console.log("UPDATED category:", name)
  } else {
    await Category.create({ name, subCategories: APPAREL_SUBS })
    console.log("CREATED category:", name)
  }

  await mongoose.disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
