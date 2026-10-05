import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Settings from '@/lib/models/Settings'
import { getAuthFromRequest } from '@/lib/auth'
import { uploadToCloudinary, deleteFromCloudinary, getCloudinaryFolder } from '@/lib/cloudinary'
import { parseYoutubeVideoId } from '@/lib/youtube'
import {
  DEFAULT_SETTINGS,
  heroVideoPublicIdKey,
  heroVideoUrlKey,
  heroVideoYoutubeUrlKey,
  type HeroVideoSlot,
} from '@/lib/store-settings'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const SLOTS: HeroVideoSlot[] = ['all', 'bags', 'tees', 'shirts']

function isSlot(value: unknown): value is HeroVideoSlot {
  return typeof value === 'string' && SLOTS.includes(value as HeroVideoSlot)
}

function requireAdmin(request: NextRequest) {
  const auth = getAuthFromRequest(request)
  const isDashboard = request.headers.get('x-dashboard-admin') === 'true'
  return Boolean(auth || isDashboard)
}

async function ensureSettings() {
  await connectDB()
  const existing = await Settings.collection.findOne({ key: 'store' })
  if (!existing) {
    await Settings.collection.insertOne({
      key: 'store',
      ...DEFAULT_SETTINGS,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

function toPayload(doc: Record<string, any> | null) {
  const d = doc || {}
  return {
    shippingFee: d.shippingFee ?? DEFAULT_SETTINGS.shippingFee,
    freeShippingThreshold: d.freeShippingThreshold ?? DEFAULT_SETTINGS.freeShippingThreshold,
    giftEnabled: d.giftEnabled !== false,
    giftFee: d.giftFee ?? DEFAULT_SETTINGS.giftFee,
    taxRate: d.taxRate ?? DEFAULT_SETTINGS.taxRate,
    heroEyebrow: d.heroEyebrow || DEFAULT_SETTINGS.heroEyebrow,
    heroTagline: d.heroTagline || DEFAULT_SETTINGS.heroTagline,
    heroDescription: d.heroDescription || DEFAULT_SETTINGS.heroDescription,
    heroVideoAllUrl: d.heroVideoAllUrl || '',
    heroVideoAllPublicId: d.heroVideoAllPublicId || '',
    heroVideoBagsUrl: d.heroVideoBagsUrl || '',
    heroVideoBagsPublicId: d.heroVideoBagsPublicId || '',
    heroVideoTeesUrl: d.heroVideoTeesUrl || '',
    heroVideoTeesPublicId: d.heroVideoTeesPublicId || '',
    heroVideoShirtsUrl: d.heroVideoShirtsUrl || '',
    heroVideoShirtsPublicId: d.heroVideoShirtsPublicId || '',
    heroVideoAllYoutubeUrl: d.heroVideoAllYoutubeUrl || '',
    heroVideoBagsYoutubeUrl: d.heroVideoBagsYoutubeUrl || '',
    heroVideoTeesYoutubeUrl: d.heroVideoTeesYoutubeUrl || '',
    heroVideoShirtsYoutubeUrl: d.heroVideoShirtsYoutubeUrl || '',
  }
}

/** Save or clear a YouTube link for a hero slot. */
export async function PATCH(request: NextRequest) {
  try {
    if (!requireAdmin(request)) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    await ensureSettings()
    const body = await request.json()
    const slotRaw = body?.slot
    if (!isSlot(slotRaw)) {
      return NextResponse.json({ success: false, error: 'Invalid slot' }, { status: 400 })
    }

    const slot = slotRaw
    const trimmed = typeof body.youtubeUrl === 'string' ? body.youtubeUrl.trim() : ''

    if (trimmed && !parseYoutubeVideoId(trimmed)) {
      return NextResponse.json(
        { success: false, error: 'Invalid YouTube link. Paste a youtube.com or youtu.be URL.' },
        { status: 400 }
      )
    }

    const youtubeKey = heroVideoYoutubeUrlKey(slot)
    await Settings.collection.updateOne(
      { key: 'store' },
      {
        $set: {
          [youtubeKey]: trimmed,
          updatedAt: new Date(),
        },
      }
    )

    const doc = await Settings.collection.findOne({ key: 'store' })
    return NextResponse.json({
      success: true,
      message: trimmed ? 'YouTube link saved' : 'YouTube link removed',
      data: toPayload(doc),
      slot,
    })
  } catch (error: any) {
    console.error('Hero YouTube save error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save YouTube link' },
      { status: 500 }
    )
  }
}

/** Upload / replace homepage hero video for a category slot. */
export async function POST(request: NextRequest) {
  try {
    if (!requireAdmin(request)) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    await ensureSettings()
    const formData = await request.formData()
    const slotRaw = formData.get('slot')
    const file = formData.get('video') as File | null

    if (!isSlot(slotRaw)) {
      return NextResponse.json(
        { success: false, error: 'Invalid slot. Use all, bags, tees, or shirts.' },
        { status: 400 }
      )
    }
    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, error: 'Video file is required' }, { status: 400 })
    }
    if (file.size > 80 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Video must be under 80MB' }, { status: 400 })
    }

    const slot = slotRaw
    const urlKey = heroVideoUrlKey(slot)
    const publicIdKey = heroVideoPublicIdKey(slot)

    const current = await Settings.collection.findOne({ key: 'store' })
    const oldPublicId = (current?.[publicIdKey] as string) || ''

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const folder = getCloudinaryFolder('hero-videos')
    const uploaded = await uploadToCloudinary(buffer, folder, 'video')

    await Settings.collection.updateOne(
      { key: 'store' },
      {
        $set: {
          [urlKey]: uploaded.url,
          [publicIdKey]: uploaded.publicId,
          updatedAt: new Date(),
        },
      }
    )

    if (oldPublicId && oldPublicId !== uploaded.publicId) {
      await deleteFromCloudinary(oldPublicId, 'video').catch(() => null)
    }

    const doc = await Settings.collection.findOne({ key: 'store' })
    return NextResponse.json({
      success: true,
      message: 'Hero video updated',
      data: toPayload(doc),
      slot,
      url: uploaded.url,
    })
  } catch (error: any) {
    console.error('Hero video upload error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to upload hero video' },
      { status: 500 }
    )
  }
}

/** Remove uploaded hero video for a slot (homepage falls back to bundled mp4). */
export async function DELETE(request: NextRequest) {
  try {
    if (!requireAdmin(request)) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    await ensureSettings()
    const { searchParams } = new URL(request.url)
    const slotRaw = searchParams.get('slot')
    const removeType = searchParams.get('type') || 'mp4'
    if (!isSlot(slotRaw)) {
      return NextResponse.json({ success: false, error: 'Invalid slot' }, { status: 400 })
    }

    const slot = slotRaw

    if (removeType === 'youtube') {
      const youtubeKey = heroVideoYoutubeUrlKey(slot)
      await Settings.collection.updateOne(
        { key: 'store' },
        { $set: { [youtubeKey]: '', updatedAt: new Date() } }
      )
    } else {
      const urlKey = heroVideoUrlKey(slot)
      const publicIdKey = heroVideoPublicIdKey(slot)
      const current = await Settings.collection.findOne({ key: 'store' })
      const oldPublicId = (current?.[publicIdKey] as string) || ''

      await Settings.collection.updateOne(
        { key: 'store' },
        {
          $set: {
            [urlKey]: '',
            [publicIdKey]: '',
            updatedAt: new Date(),
          },
        }
      )

      if (oldPublicId) {
        await deleteFromCloudinary(oldPublicId, 'video').catch(() => null)
      }
    }

    const doc = await Settings.collection.findOne({ key: 'store' })
    return NextResponse.json({
      success: true,
      message: removeType === 'youtube' ? 'YouTube link removed' : 'Hero video removed',
      data: toPayload(doc),
    })
  } catch (error: any) {
    console.error('Hero video delete error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to remove hero video' },
      { status: 500 }
    )
  }
}
