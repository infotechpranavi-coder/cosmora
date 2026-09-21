import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { parseKeyFeatures } from '@/lib/key-features'

function isMongoObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!isMongoObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    await connectDB()

    const product = await Product.findById(id)

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product
    })

  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params

    if (!isMongoObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    const formData = await request.formData()

    // Extract text fields
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const keyFeaturesRaw = formData.get('keyFeatures') as string
    const keyFeatures = parseKeyFeatures(keyFeaturesRaw)
    const price = parseFloat(formData.get('price') as string)
    const originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : undefined
    const sizeConstraints = formData.get('sizeConstraints') as string
    const quantity = parseInt(formData.get('quantity') as string)
    const category = formData.get('category') as string
    const subCategory = formData.get('subCategory') as string || undefined
    const rating = formData.get('rating') ? parseFloat(formData.get('rating') as string) : undefined
    const reviews = formData.get('reviews') ? parseInt(formData.get('reviews') as string, 10) : undefined

    // Validate required fields
    if (!name || !description || !keyFeatures.length || !price || !quantity || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Handle new image uploads
    const newImageFiles = formData.getAll('newImages') as File[]
    const uploadedImages: any[] = []

    for (const imageFile of newImageFiles) {
      if (imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const { uploadToCloudinary, getCloudinaryFolder } = await import('@/lib/cloudinary')
        const folder = getCloudinaryFolder('products')
        const result = await uploadToCloudinary(buffer, folder, 'image')
        uploadedImages.push(result)
      }
    }

    // Handle new video uploads
    const newVideoFiles = formData.getAll('newVideos') as File[]
    const uploadedVideos: any[] = []

    for (const videoFile of newVideoFiles) {
      if (videoFile.size > 0) {
        const bytes = await videoFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const { uploadToCloudinary, getCloudinaryFolder } = await import('@/lib/cloudinary')
        const folder = getCloudinaryFolder('products')
        const result = await uploadToCloudinary(buffer, folder, 'video')
        uploadedVideos.push(result)
      }
    }

    // Handle deletions
    const imagesToDelete = formData.get('imagesToDelete') ? JSON.parse(formData.get('imagesToDelete') as string) : []
    const videosToDelete = formData.get('videosToDelete') ? JSON.parse(formData.get('videosToDelete') as string) : []

    // Delete files from Cloudinary
    if (imagesToDelete.length > 0 || videosToDelete.length > 0) {
      const { deleteFromCloudinary } = await import('@/lib/cloudinary')

      for (const publicId of imagesToDelete) {
        await deleteFromCloudinary(publicId, 'image')
      }

      for (const publicId of videosToDelete) {
        await deleteFromCloudinary(publicId, 'video')
      }
    }

    // Get existing product to merge with new data
    const existingProduct = await Product.findById(id)
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Merge existing images/videos with new ones, excluding deleted ones
    const existingImages = existingProduct.images.filter((img: any) => !imagesToDelete.includes(img.publicId))
    const existingVideos = existingProduct.videos.filter((vid: any) => !videosToDelete.includes(vid.publicId))

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        keyFeatures,
        price,
        originalPrice,
        sizeConstraints: sizeConstraints || undefined,
        quantity,
        category,
        subCategory,
        ...(rating !== undefined && { rating }),
        ...(reviews !== undefined && { reviews }),
        isOutOfStock: formData.get('isOutOfStock') === 'true',
        images: [...existingImages, ...uploadedImages],
        videos: [...existingVideos, ...uploadedVideos]
      },
      { new: true, runValidators: true }
    )

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    })

  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params

    if (!isMongoObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    const product = await Product.findById(id)
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete all images and videos from Cloudinary
    const { deleteFromCloudinary } = await import('@/lib/cloudinary')

    for (const image of product.images) {
      await deleteFromCloudinary(image.publicId, 'image')
    }

    for (const video of product.videos) {
      await deleteFromCloudinary(video.publicId, 'video')
    }

    // Delete the product from MongoDB
    await Product.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
