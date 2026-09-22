import mongoose from 'mongoose'

const BannerSchema = new mongoose.Schema(
  {
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    title: { type: String, trim: true, default: '' },
    link: { type: String, trim: true, default: '' },
    buyAt: { type: String, trim: true, default: '299/-' },
    mrp: { type: String, trim: true, default: '699/-' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, strict: true }
)

// Next.js HMR can keep a stale model without buyAt/mrp — force refresh
if (mongoose.models.Banner) {
  const existing = mongoose.models.Banner
  if (!existing.schema.path('buyAt') || !existing.schema.path('mrp')) {
    delete mongoose.models.Banner
    // @ts-expect-error mongoose internal cache
    delete mongoose.modelSchemas?.Banner
  }
}

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema)
