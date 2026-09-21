import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary, getCloudinaryFolder } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || file.size <= 0) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const maxBytes = 8 * 1024 * 1024
    if (file.size > maxBytes) {
      return NextResponse.json({ success: false, error: 'File too large (max 8MB)' }, { status: 400 })
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf']
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Use PNG, JPG, WEBP, SVG, or PDF' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const folder = getCloudinaryFolder('designs')
    const resourceType = file.type === 'application/pdf' ? 'image' : 'image'
    const result = (await uploadToCloudinary(buffer, folder, resourceType)) as {
      url: string
      publicId: string
    }

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        name: file.name,
        type: file.type,
      },
    })
  } catch (error: any) {
    console.error('Design upload failed:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
