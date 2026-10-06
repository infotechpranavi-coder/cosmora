import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Category from "@/lib/models/Category"
import Product from "@/lib/models/Product"
import { shopCategoryPayload, SHOP_SEED_PRODUCTS } from "@/lib/shop-catalog-seed"
import { SHOP_NAV } from "@/lib/shop-nav"

export const dynamic = "force-dynamic"

function parentForSub(subName: string) {
  const group = SHOP_NAV.find((g) =>
    g.items.some((item) => item.name.toLowerCase() === subName.toLowerCase())
  )
  return group?.name || ""
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json().catch(() => ({}))
    const action = body.action || "setup"

    const synced: string[] = []
    if (action === "sync-categories" || action === "setup") {
      for (const cat of shopCategoryPayload()) {
        await Category.findOneAndUpdate(
          { name: cat.name },
          { $set: { name: cat.name, subCategories: cat.subCategories } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
        synced.push(cat.name)
      }
    }

    const seeded: string[] = []
    const skipped: string[] = []
    if (action === "seed-products" || action === "setup") {
      for (const item of SHOP_SEED_PRODUCTS) {
        const exists = await Product.findOne({ name: item.name })
        if (exists) {
          exists.category = item.category
          exists.subCategory = item.subCategory
          exists.images = [
            {
              url: item.image,
              publicId: `seed/cosmora/${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            },
          ]
          await exists.save()
          skipped.push(item.name)
          continue
        }

        const offer =
          item.originalPrice > item.price
            ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
            : 0

        await Product.create({
          name: item.name,
          description: item.description,
          keyFeatures: ["Custom print ready", "Factory pricing", "Sizes S–XXL"],
          price: item.price,
          originalPrice: item.originalPrice,
          offerPercentage: offer,
          isOnSale: offer > 0,
          sizeConstraints: "S, M, L, XL, XXL",
          quantity: 80,
          category: item.category,
          subCategory: item.subCategory,
          images: [
            {
              url: item.image,
              publicId: `seed/cosmora/${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            },
          ],
          videos: [],
          rating: 4.6,
          reviews: 12,
          isNew: true,
          isActive: true,
          isOutOfStock: false,
          homeSection: "",
          colors: [],
        })
        seeded.push(item.name)
      }

      const allProducts = await Product.find({})
      for (const product of allProducts) {
        const parent = parentForSub(product.subCategory || product.category || "")
        if (parent && product.category !== parent) {
          if (!product.subCategory && SHOP_NAV.some((g) => g.items.some((i) => i.name === product.category))) {
            product.subCategory = product.category
          }
          product.category = parent
          await product.save()
        }
      }
    }

    const categories = await Category.find({}).sort({ name: 1 })
    return NextResponse.json({
      success: true,
      data: { synced, seeded, updatedExisting: skipped, categories },
    })
  } catch (error: any) {
    console.error("shop-catalog setup failed", error)
    return NextResponse.json({ success: false, error: error.message || "Setup failed" }, { status: 500 })
  }
}
