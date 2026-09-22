import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Settings from '@/lib/models/Settings'
import { getAuthFromRequest } from '@/lib/auth'
import { DEFAULT_SETTINGS } from '@/lib/store-settings'

function toSettingsPayload(doc: {
  shippingFee?: number
  freeShippingThreshold?: number
  giftEnabled?: boolean
  giftFee?: number
  taxRate?: number
  heroEyebrow?: string
  heroTagline?: string
  heroDescription?: string
}) {
  return {
    shippingFee: doc.shippingFee ?? DEFAULT_SETTINGS.shippingFee,
    freeShippingThreshold: doc.freeShippingThreshold ?? DEFAULT_SETTINGS.freeShippingThreshold,
    giftEnabled: doc.giftEnabled !== false,
    giftFee: doc.giftFee ?? DEFAULT_SETTINGS.giftFee,
    taxRate: doc.taxRate ?? DEFAULT_SETTINGS.taxRate,
    heroEyebrow: doc.heroEyebrow || DEFAULT_SETTINGS.heroEyebrow,
    heroTagline: doc.heroTagline || DEFAULT_SETTINGS.heroTagline,
    heroDescription: doc.heroDescription || DEFAULT_SETTINGS.heroDescription,
  }
}

async function getOrCreateSettings() {
  let doc = await Settings.findOne({ key: 'store' })
  if (!doc) {
    doc = await Settings.create({ key: 'store', ...DEFAULT_SETTINGS })
  }
  return doc
}

export async function GET() {
  try {
    await connectDB()
    const doc = await getOrCreateSettings()
    return NextResponse.json(
      {
        success: true,
        data: toSettingsPayload(doc),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    )
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load settings', data: DEFAULT_SETTINGS },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request)
    const isDashboard = request.headers.get('x-dashboard-admin') === 'true'
    if (!auth && !isDashboard) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    await connectDB()
    await getOrCreateSettings()
    const body = await request.json()

    const update: Record<string, unknown> = {}

    if (body.shippingFee !== undefined) {
      update.shippingFee = Math.max(0, Number(body.shippingFee) || 0)
    }
    if (body.freeShippingThreshold !== undefined) {
      update.freeShippingThreshold = Math.max(0, Number(body.freeShippingThreshold) || 0)
    }
    if (body.giftEnabled !== undefined) {
      update.giftEnabled = body.giftEnabled !== false
    }
    if (body.giftFee !== undefined) {
      update.giftFee = Math.max(0, Number(body.giftFee) || 0)
    }
    if (body.taxRate !== undefined) {
      update.taxRate = Math.min(1, Math.max(0, Number(body.taxRate) || 0.18))
    }
    if (typeof body.heroEyebrow === 'string') {
      update.heroEyebrow = body.heroEyebrow.trim() || DEFAULT_SETTINGS.heroEyebrow
    }
    if (typeof body.heroTagline === 'string') {
      update.heroTagline = body.heroTagline.trim() || DEFAULT_SETTINGS.heroTagline
    }
    if (typeof body.heroDescription === 'string') {
      update.heroDescription = body.heroDescription.trim() || DEFAULT_SETTINGS.heroDescription
    }

    if (!Object.keys(update).length) {
      const doc = await getOrCreateSettings()
      return NextResponse.json({
        success: true,
        message: 'Nothing to update',
        data: toSettingsPayload(doc),
      })
    }

    const doc = await Settings.findOneAndUpdate(
      { key: 'store' },
      { $set: update },
      { new: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Settings saved',
      data: toSettingsPayload(doc),
    })
  } catch (error) {
    console.error('Settings PUT error:', error)
    return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 })
  }
}
