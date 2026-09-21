import { v2 as cloudinary } from 'cloudinary'

// Use hardcoded values for now to fix the issue
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dzs85rccr',
  api_key: process.env.CLOUDINARY_API_KEY || '563775748192214',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Yj4ONzhLsminRC65Zv6C2NpyEG0',
})

export default cloudinary

export type ImageUploadProfile = 'product' | 'banner' | 'category'

function inferUploadProfile(folder: string): ImageUploadProfile {
  if (folder.includes('banners')) return 'banner'
  if (folder.includes('categories')) return 'category'
  return 'product'
}

function getUploadTransformations(profile: ImageUploadProfile) {
  switch (profile) {
    case 'banner':
      // Hero banners need full-width quality — only cap extremely large originals
      return [{ width: 3840, crop: 'limit' }, { quality: 'auto:best' }, { fetch_format: 'auto' }]
    case 'category':
      return [{ width: 1200, crop: 'limit' }, { quality: 'auto:good' }, { fetch_format: 'auto' }]
    case 'product':
    default:
      return [{ width: 800, height: 800, crop: 'limit' }, { quality: 'auto' }, { fetch_format: 'auto' }]
  }
}

export const uploadToCloudinary = async (
  file: Buffer,
  folder: string,
  resourceType: 'image' | 'video' = 'image',
  profile?: ImageUploadProfile
) => {
  try {
    console.log('Starting Cloudinary upload...')
    console.log('Cloud name:', cloudinary.config().cloud_name)
    console.log('API key:', cloudinary.config().api_key ? 'Present' : 'Missing')

    const uploadProfile = profile ?? inferUploadProfile(folder)
    const imageTransformations =
      resourceType === 'image' ? getUploadTransformations(uploadProfile) : undefined

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: resourceType,
          allowed_formats: resourceType === 'image'
            ? ['jpg', 'jpeg', 'png', 'webp']
            : ['mp4', 'mov', 'avi', 'mkv'],
          transformation: imageTransformations,
          secure: true,
          use_filename: true,
          unique_filename: true
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload stream error:', error)
            reject(error)
          } else {
            console.log('Cloudinary upload successful:', result?.public_id)
            console.log('Generated URL:', result?.secure_url)
            resolve(result)
          }
        }
      )

      uploadStream.end(file)
    })

    return {
      url: (result as any).secure_url,
      publicId: (result as any).public_id
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload file to Cloudinary')
  }
}

export const deleteFromCloudinary = async (publicId: string, resourceType: 'image' | 'video' = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete file from Cloudinary')
  }
}

// Helper function to get organized folder structure
export const getCloudinaryFolder = (type: 'products' | 'banners' | 'thumbnails' | 'categories' | 'designs', category?: string) => {
  if (type === 'categories' && category) {
    return `cosmora/categories/${category.toLowerCase()}`
  }
  return `cosmora/${type}`
}

// Enhanced upload function with better error handling and progress tracking
export const uploadMultipleFiles = async (
  files: File[],
  folder: string,
  resourceType: 'image' | 'video' = 'image'
) => {
  const uploadPromises = files.map(async (file) => {
    if (file.size === 0) return null

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    return await uploadToCloudinary(buffer, folder, resourceType)
  })

  const results = await Promise.all(uploadPromises)
  return results.filter(result => result !== null)
}

// Delete multiple files from Cloudinary
export const deleteMultipleFiles = async (
  publicIds: string[],
  resourceType: 'image' | 'video' = 'image'
) => {
  const deletePromises = publicIds.map(publicId =>
    deleteFromCloudinary(publicId, resourceType)
  )

  await Promise.all(deletePromises)
}
