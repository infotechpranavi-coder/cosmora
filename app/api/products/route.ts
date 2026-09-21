import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { uploadToCloudinary, getCloudinaryFolder } from '@/lib/cloudinary'
import { parseKeyFeatures } from '@/lib/key-features'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Connect to database with timeout
    try {
      await Promise.race([
        connectDB(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Database connection timeout')), 10000)
        )
      ])
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection failed. Please check your MongoDB connection string.',
          data: [],
          count: 0
        },
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // Optimize query: only fetch active products, limit fields, use lean for faster queries
    const products = await Product.find({ isActive: { $ne: false } })
      .select('name description keyFeatures price originalPrice offerPercentage isOnSale isNew category subCategory sizeConstraints images videos quantity rating reviews isOutOfStock isActive')
      .sort({ createdAt: -1 })
      .limit(50) // Limit to 50 products for better performance
      .lean() // Use lean() for faster queries (returns plain JS objects)

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
      }
    })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to fetch products',
        data: [],
        count: 0
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Connect to database with timeout
    try {
      await Promise.race([
        connectDB(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Database connection timeout')), 10000)
        )
      ])
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection failed. Please check your MongoDB connection string.',
          details: process.env.NODE_ENV === 'development' ? String(dbError) : undefined
        },
        { status: 503 }
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
    const rating = formData.get('rating') ? parseFloat(formData.get('rating') as string) : 0
    const reviews = formData.get('reviews') ? parseInt(formData.get('reviews') as string, 10) : 0

    // Debug logging
    console.log('Received form data:', {
      name,
      description,
      keyFeaturesRaw,
      keyFeatures,
      price,
      originalPrice,
      sizeConstraints,
      quantity,
      category,
      subCategory,
      isOutOfStock: formData.get('isOutOfStock') === 'true'
    })

    // Validate required fields
    if (!name || !description || !keyFeatures.length || !price || !quantity || !category) {
      const missingFields: string[] = []
      if (!name) missingFields.push('name')
      if (!description) missingFields.push('description')
      if (!keyFeatures.length) missingFields.push('keyFeatures')
      if (!price) missingFields.push('price')
      if (!quantity) missingFields.push('quantity')
      if (!category) missingFields.push('category')

      console.log('Validation failed - missing fields:', missingFields)

      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
          details: {
            name: !!name,
            description: !!description,
            keyFeatures: keyFeatures.length,
            price: !!price,
            quantity: !!quantity,
            category: !!category
          }
        },
        { status: 400 }
      )
    }

    // Handle image uploads with organized folder structure
    const imageFiles = formData.getAll('images') as File[]
    const uploadedImages: any[] = []

    for (const imageFile of imageFiles) {
      if (imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Use organized folder structure
        const folder = getCloudinaryFolder('products')
        const result = await uploadToCloudinary(buffer, folder, 'image')
        uploadedImages.push(result)
      }
    }

    // Handle video uploads with organized folder structure
    const videoFiles = formData.getAll('videos') as File[]
    const uploadedVideos: any[] = []

    for (const videoFile of videoFiles) {
      if (videoFile.size > 0) {
        const bytes = await videoFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Use organized folder structure
        const folder = getCloudinaryFolder('products')
        const result = await uploadToCloudinary(buffer, folder, 'video')
        uploadedVideos.push(result)
      }
    }

    // Create product
    const product = new Product({
      name,
      description,
      keyFeatures,
      price,
      originalPrice,
      sizeConstraints: sizeConstraints || undefined,
      quantity,
      category,
      subCategory,
      rating,
      reviews,
      isOutOfStock: formData.get('isOutOfStock') === 'true',
      images: uploadedImages,
      videos: uploadedVideos
    })

    await product.save()

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating product:', error)

    // Always return JSON, never HTML
    const errorMessage = error?.message || 'Failed to create product'
    const isDevelopment = process.env.NODE_ENV === 'development'

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: isDevelopment ? String(error) : undefined,
        stack: isDevelopment ? error?.stack : undefined
      },
      {
        status: error?.status || 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
}
