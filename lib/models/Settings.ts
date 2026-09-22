import mongoose from 'mongoose'
import { DEFAULT_SETTINGS } from '@/lib/store-settings'

const SettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'store',
    },
    shippingFee: {
      type: Number,
      required: true,
      min: 0,
      default: DEFAULT_SETTINGS.shippingFee,
    },
    freeShippingThreshold: {
      type: Number,
      min: 0,
      default: DEFAULT_SETTINGS.freeShippingThreshold,
    },
    giftEnabled: {
      type: Boolean,
      default: DEFAULT_SETTINGS.giftEnabled,
    },
    giftFee: {
      type: Number,
      required: true,
      min: 0,
      default: DEFAULT_SETTINGS.giftFee,
    },
    taxRate: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
      default: DEFAULT_SETTINGS.taxRate,
    },
    heroEyebrow: {
      type: String,
      trim: true,
      default: DEFAULT_SETTINGS.heroEyebrow,
    },
    heroTagline: {
      type: String,
      trim: true,
      default: DEFAULT_SETTINGS.heroTagline,
    },
    heroDescription: {
      type: String,
      trim: true,
      default: DEFAULT_SETTINGS.heroDescription,
    },
  },
  { timestamps: true, strict: true }
)

if (mongoose.models.Settings) {
  const existing = mongoose.models.Settings
  if (
    !existing.schema.path('heroEyebrow') ||
    !existing.schema.path('heroTagline') ||
    !existing.schema.path('heroDescription')
  ) {
    delete mongoose.models.Settings
    // @ts-expect-error mongoose internal cache
    delete mongoose.modelSchemas?.Settings
  }
}

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema)
