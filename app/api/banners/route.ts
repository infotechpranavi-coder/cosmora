import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectDB from '@/lib/mongodb'
import Banner from '@/lib/models/Banner'
import { uploadToCloudinary, deleteFromCloudinary, getCloudinaryFolder } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function normalizePrice(value: unknown, fallback: string) {
  const raw = typeof value === 'string' ? value.trim() : ''
  if (!raw) return fallback
  return raw.includes('/-') ? raw : `${raw}/-`
}

async function saveBannerFields(id: string, update: Record<string, unknown>) {
  // Native $set so new fields (buyAt/mrp) always persist even if HMR cached an old schema
  await Banner.collection.updateOne(
    { _id: new mongoose.Types.ObjectId(id) },
    { $set: { ...update, updatedAt: new Date() } }
  )
  return Banner.findById(id).lean()
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const isAdmin = request.headers.get('x-dashboard-admin') === 'true'
    const query = isAdmin ? {} : { isActive: true }
    const banners = await Banner.find(query).sort({ order: 1, createdAt: 1 }).lean()
    const data = banners
      .filter((b) => b.image?.url)
      .map((b) => ({
        ...b,
        _id: String(b._id),
        buyAt: (b as { buyAt?: string }).buyAt || '299/-',
        mrp: (b as { mrp?: string }).mrp || '699/-',
      }))
    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          Pragma: 'no-cache',
        },
      }
    )
  } catch (error) {
    console.error('Banners GET error:', error)
    return NextResponse.json({ success: false, data: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = request.headers.get('x-dashboard-admin') === 'true'
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const title = (formData.get('title') as string) || ''
    const link = (formData.get('link') as string) || ''
    const buyAt = normalizePrice(formData.get('buyAt'), '299/-')
    const mrp = normalizePrice(formData.get('mrp'), '699/-')
    const order = parseInt((formData.get('order') as string) || '0', 10)

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ success: false, error: 'Banner image is required' }, { status: 400 })
    }

    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const folder = getCloudinaryFolder('banners')
    const uploaded = await uploadToCloudinary(buffer, folder, 'image', 'banner')

    // Insert via collection so buyAt/mrp are never stripped
    const now = new Date()
    const doc = {
      image: uploaded,
      title,
      link,
      buyAt,
      mrp,
      order,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }
    const result = await Banner.collection.insertOne(doc)
    const banner = { ...doc, _id: String(result.insertedId) }

    return NextResponse.json({ success: true, data: banner }, { status: 201 })
  } catch (error) {
    console.error('Banners POST error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload banner',
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAdmin = request.headers.get('x-dashboard-admin') === 'true'
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()
    const { banners } = body as {
      banners: Array<{
        _id: string
        order?: number
        isActive?: boolean
        title?: string
        link?: string
        buyAt?: string
        mrp?: string
      }>
    }

    if (!Array.isArray(banners)) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    await Promise.all(
      banners.map(async (b) => {
        const update: Record<string, unknown> = {}
        if (typeof b.order === 'number') update.order = b.order
        if (typeof b.isActive === 'boolean') update.isActive = b.isActive
        if (typeof b.title === 'string') update.title = b.title
        if (typeof b.link === 'string') update.link = b.link
        if (typeof b.buyAt === 'string') update.buyAt = normalizePrice(b.buyAt, '299/-')
        if (typeof b.mrp === 'string') update.mrp = normalizePrice(b.mrp, '699/-')
        if (!Object.keys(update).length) return
        await saveBannerFields(b._id, update)
      })
    )

    const updated = await Banner.find().sort({ order: 1 }).lean()
    const data = updated
      .filter((b) => b.image?.url)
      .map((b) => ({
        ...b,
        _id: String(b._id),
        buyAt: (b as { buyAt?: string }).buyAt || '299/-',
        mrp: (b as { mrp?: string }).mrp || '699/-',
      }))
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Banners PUT error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update banners' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = request.headers.get('x-dashboard-admin') === 'true'
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const id = new URL(request.url).searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'Banner id required' }, { status: 400 })
    }

    await connectDB()
    const banner = await Banner.findById(id)
    if (!banner) {
      return NextResponse.json({ success: false, error: 'Banner not found' }, { status: 404 })
    }

    if (banner.image?.publicId) {
      await deleteFromCloudinary(banner.image.publicId, 'image').catch(() => null)
    }
    await Banner.collection.deleteOne({ _id: new mongoose.Types.ObjectId(id) })

    return NextResponse.json({ success: true, message: 'Banner deleted' })
  } catch (error) {
    console.error('Banners DELETE error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete banner' }, { status: 500 })
  }
}
