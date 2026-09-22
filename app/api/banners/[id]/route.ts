import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectDB from '@/lib/mongodb'
import Banner from '@/lib/models/Banner'
import { uploadToCloudinary, deleteFromCloudinary, getCloudinaryFolder } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function isMongoObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id
}

function normalizePrice(value: unknown, fallback: string) {
  const raw = typeof value === 'string' ? value.trim() : ''
  if (!raw) return fallback
  return raw.includes('/-') ? raw : `${raw}/-`
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = request.headers.get('x-dashboard-admin') === 'true'
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    if (!isMongoObjectId(id)) {
      return NextResponse.json({ success: false, error: 'Slide not found' }, { status: 404 })
    }

    await connectDB()
    const banner = await Banner.findById(id).lean()
    if (!banner) {
      return NextResponse.json({ success: false, error: 'Slide not found' }, { status: 404 })
    }

    const contentType = request.headers.get('content-type') || ''
    const update: Record<string, unknown> = { updatedAt: new Date() }

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const title = formData.get('title')
      const link = formData.get('link')
      const buyAt = formData.get('buyAt')
      const mrp = formData.get('mrp')
      const imageFile = formData.get('image') as File | null

      if (typeof title === 'string') update.title = title
      if (typeof link === 'string') update.link = link
      if (typeof buyAt === 'string') {
        update.buyAt = normalizePrice(buyAt, (banner as { buyAt?: string }).buyAt || '299/-')
      }
      if (typeof mrp === 'string') {
        update.mrp = normalizePrice(mrp, (banner as { mrp?: string }).mrp || '699/-')
      }

      if (imageFile && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const folder = getCloudinaryFolder('banners')
        const uploaded = await uploadToCloudinary(buffer, folder, 'image', 'banner')
        const oldPublicId = (banner as { image?: { publicId?: string } }).image?.publicId
        update.image = uploaded
        if (oldPublicId) {
          await deleteFromCloudinary(oldPublicId, 'image').catch(() => null)
        }
      }
    } else {
      const body = await request.json()
      if (typeof body.title === 'string') update.title = body.title
      if (typeof body.link === 'string') update.link = body.link
      if (typeof body.buyAt === 'string') {
        update.buyAt = normalizePrice(body.buyAt, (banner as { buyAt?: string }).buyAt || '299/-')
      }
      if (typeof body.mrp === 'string') {
        update.mrp = normalizePrice(body.mrp, (banner as { mrp?: string }).mrp || '699/-')
      }
      if (typeof body.isActive === 'boolean') update.isActive = body.isActive
      if (typeof body.order === 'number') update.order = body.order
    }

    const keys = Object.keys(update).filter((k) => k !== 'updatedAt')
    if (!keys.length) {
      return NextResponse.json({ success: false, error: 'Nothing to update' }, { status: 400 })
    }

    await Banner.collection.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: update }
    )

    const updated = await Banner.findById(id).lean()
    return NextResponse.json({
      success: true,
      message: 'Hero slide updated',
      data: {
        ...updated,
        _id: String(updated?._id),
        buyAt: (updated as { buyAt?: string } | null)?.buyAt || '299/-',
        mrp: (updated as { mrp?: string } | null)?.mrp || '699/-',
      },
    })
  } catch (error) {
    console.error('Banner update error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update slide',
      },
      { status: 500 }
    )
  }
}
