"use client"

import { useState, useRef, useEffect } from 'react'
import { X, Plus, Upload, Trash2, Video, Star } from 'lucide-react'
import { CreateProductData, UpdateProductData, Product } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { normalizeKeyFeatures } from '@/lib/key-features'

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateProductData | UpdateProductData) => Promise<void>
  product?: Product | null
  mode: 'create' | 'edit'
}

function productToFormState(product?: Product | null) {
  const features = normalizeKeyFeatures(product?.keyFeatures)
  return {
    name: String(product?.name || ''),
    description: String(product?.description || ''),
    keyFeatures: features?.length ? [...features] : [''],
    price: product?.price != null ? String(product.price) : '',
    originalPrice: product?.originalPrice != null ? String(product.originalPrice) : '',
    sizeConstraints: String(product?.sizeConstraints || ''),
    quantity: product?.quantity != null ? String(product.quantity) : '',
    category: String(product?.category || ''),
    subCategory: String(product?.subCategory || ''),
    rating: product?.rating != null ? String(product.rating) : '0',
    reviews: product?.reviews != null ? String(product.reviews) : '0',
    isOutOfStock: product?.isOutOfStock || false,
  }
}

export default function ProductForm({ isOpen, onClose, onSubmit, product, mode }: ProductFormProps) {
  const [formData, setFormData] = useState(() => productToFormState(product))

  const { categories: dynamicCategories } = useCategories()

  const [images, setImages] = useState<File[]>([])
  const [videos, setVideos] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState(product?.images || [])
  const [existingVideos, setExistingVideos] = useState(product?.videos || [])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [videosToDelete, setVideosToDelete] = useState<string[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [videoPreviews, setVideoPreviews] = useState<string[]>([])

  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  // Reload form when editing a different product
  useEffect(() => {
    if (!isOpen) return
    if (mode === 'edit' && product) {
      setFormData(productToFormState(product))
      setExistingImages(product.images || [])
      setExistingVideos(product.videos || [])
      setImages([])
      setVideos([])
      setImagesToDelete([])
      setVideosToDelete([])
    } else if (mode === 'create') {
      setFormData(productToFormState(null))
      setExistingImages([])
      setExistingVideos([])
      setImages([])
      setVideos([])
      setImagesToDelete([])
      setVideosToDelete([])
    }
  }, [isOpen, mode, product?._id])

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file))
    setImagePreviews(urls)
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [images])

  useEffect(() => {
    const urls = videos.map((file) => URL.createObjectURL(file))
    setVideoPreviews(urls)
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [videos])

  const selectedCategory = dynamicCategories.find(c => c.name === formData.category)
  const subCategories = selectedCategory?.subCategories || []
  const categoryMissingFromList =
    formData.category && !dynamicCategories.some(c => c.name === formData.category)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleKeyFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.keyFeatures]
    newFeatures[index] = value
    setFormData(prev => ({ ...prev, keyFeatures: newFeatures }))
  }

  const addKeyFeature = () => {
    setFormData(prev => ({ ...prev, keyFeatures: [...prev.keyFeatures, ''] }))
  }

  const removeKeyFeature = (index: number) => {
    if (formData.keyFeatures.length > 1) {
      setFormData(prev => ({
        ...prev,
        keyFeatures: prev.keyFeatures.filter((_, i) => i !== index),
      }))
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'))
    if (files.length) {
      setImages((prev) => [...prev, ...files])
    }
    event.target.value = ''
  }

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('video/'))
    if (files.length) {
      setVideos((prev) => [...prev, ...files])
    }
    event.target.value = ''
  }

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeNewVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (publicId: string) => {
    setImagesToDelete(prev => [...prev, publicId])
    setExistingImages(prev => prev.filter(img => img.publicId !== publicId))
  }

  const removeExistingVideo = (publicId: string) => {
    setVideosToDelete(prev => [...prev, publicId])
    setExistingVideos(prev => prev.filter(vid => vid.publicId !== publicId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validKeyFeatures = formData.keyFeatures.filter(f => f.trim())
    if (validKeyFeatures.length === 0) {
      alert('Please add at least one key feature.')
      return
    }
    if (!formData.category) {
      alert('Please select a category.')
      return
    }

    const rating = Math.min(5, Math.max(0, parseFloat(formData.rating) || 0))
    const reviews = Math.max(0, parseInt(formData.reviews, 10) || 0)

    if (mode === 'create') {
      const createData: CreateProductData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        keyFeatures: validKeyFeatures,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        sizeConstraints: formData.sizeConstraints.trim() || undefined,
        quantity: parseInt(formData.quantity, 10),
        category: formData.category,
        subCategory: formData.subCategory.trim() || undefined,
        rating,
        reviews,
        isOutOfStock: formData.isOutOfStock,
        images,
        videos,
      }
      await onSubmit(createData)
    } else {
      const updateData: UpdateProductData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        keyFeatures: validKeyFeatures,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        sizeConstraints: formData.sizeConstraints.trim() || undefined,
        quantity: parseInt(formData.quantity, 10),
        category: formData.category,
        subCategory: formData.subCategory.trim() || undefined,
        rating,
        reviews,
        isOutOfStock: formData.isOutOfStock,
        images: images.length > 0 ? images : undefined,
        videos: videos.length > 0 ? videos : undefined,
        imagesToDelete: imagesToDelete.length > 0 ? imagesToDelete : undefined,
        videosToDelete: videosToDelete.length > 0 ? videosToDelete : undefined,
      }
      await onSubmit(updateData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white mb-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Add Apparel / Tee' : 'Edit Apparel'}
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {mode === 'edit' && (
          <p className="text-sm text-[#14243D] bg-[#EEF2F7] rounded-md px-3 py-2 mb-4">
            Existing details are loaded — change only what you need.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Apparel Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#14243D]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => {
                  handleInputChange('category', e.target.value)
                  if (e.target.value !== formData.category) {
                    handleInputChange('subCategory', '')
                  }
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#14243D]"
                required
              >
                <option value="">Select Category</option>
                {categoryMissingFromList && (
                  <option value={formData.category}>{formData.category} (current)</option>
                )}
                {dynamicCategories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {formData.category && subCategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sub-category</label>
              <select
                value={formData.subCategory}
                onChange={(e) => handleInputChange('subCategory', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select Sub-category (Optional)</option>
                {formData.subCategory &&
                  !subCategories.includes(formData.subCategory) && (
                    <option value={formData.subCategory}>{formData.subCategory} (current)</option>
                  )}
                {subCategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Review stats — admin controlled */}
          <div className="bg-[#EEF2F7]/50 border border-[#E8D5B0] rounded-lg p-4">
            <label className="block text-sm font-semibold text-[#14243D] mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Review stats (shown on product page)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Star rating (0–5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Number of reviews</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.reviews}
                  onChange={(e) => handleInputChange('reviews', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Example: 4.8 stars with 124 reviews — displays as ★★★★☆ (124 reviews)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Features *</label>
            <div className="space-y-2">
              {formData.keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleKeyFeatureChange(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                    placeholder={`Key feature ${index + 1}`}
                  />
                  {formData.keyFeatures.length > 1 && (
                    <button type="button" onClick={() => removeKeyFeature(index)} className="text-red-600 p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addKeyFeature} className="flex items-center gap-2 text-[#14243D] text-sm">
                <Plus className="w-4 h-4" /> Add Key Feature
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
              <input type="number" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} className="w-full border rounded-md px-3 py-2" min="0" step="0.01" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
              <input type="number" value={formData.originalPrice} onChange={(e) => handleInputChange('originalPrice', e.target.value)} className="w-full border rounded-md px-3 py-2" min="0" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
              <input type="number" value={formData.quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} className="w-full border rounded-md px-3 py-2" min="0" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Apparel Sizes (S, M, L, XL…)</label>
            <input
              type="text"
              value={formData.sizeConstraints}
              onChange={(e) => handleInputChange('sizeConstraints', e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              placeholder="S, M, L, XL, XXL"
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg border">
            <input
              type="checkbox"
              id="isOutOfStock"
              checked={formData.isOutOfStock}
              onChange={(e) => handleInputChange('isOutOfStock', e.target.checked)}
              className="w-5 h-5"
            />
            <label htmlFor="isOutOfStock" className="text-sm font-medium">Mark as Out of Stock</label>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Apparel / Print Images</label>
            {(existingImages.length > 0 || images.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {existingImages.map((image, index) => (
                  <div key={image.publicId || `existing-img-${index}`} className="relative group">
                    <img src={image.url} alt="" className="w-full h-24 object-cover rounded-lg border" />
                    <button type="button" onClick={() => removeExistingImage(image.publicId)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100">
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-[11px] text-gray-500 mt-1 truncate">Saved image</p>
                  </div>
                ))}
                {images.map((file, index) => (
                  <div key={`${file.name}-${file.size}-${index}`} className="relative group">
                    <img
                      src={imagePreviews[index]}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded-lg border border-[#14243D]"
                    />
                    <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1">
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-[11px] text-gray-700 mt-1 truncate" title={file.name}>{file.name}</p>
                  </div>
                ))}
              </div>
            )}
            <input ref={imageInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            <button type="button" onClick={() => imageInputRef.current?.click()} className="border-2 border-dashed rounded-lg p-4 w-full flex flex-col items-center text-gray-600 hover:border-[#14243D]">
              <Upload className="w-6 h-6 mb-1" />
              Add images
              {images.length > 0 && (
                <span className="text-xs text-[#14243D] mt-1">{images.length} new image{images.length === 1 ? '' : 's'} selected</span>
              )}
            </button>
          </div>

          {/* Videos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Videos</label>
            {(existingVideos.length > 0 || videos.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {existingVideos.map((video, index) => (
                  <div key={video.publicId || `existing-vid-${index}`} className="relative">
                    <video src={video.url} className="w-full h-24 object-cover rounded-lg" controls />
                    <button type="button" onClick={() => removeExistingVideo(video.publicId)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1">
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-[11px] text-gray-500 mt-1 truncate">Saved video</p>
                  </div>
                ))}
                {videos.map((file, index) => (
                  <div key={`${file.name}-${file.size}-${index}`} className="relative">
                    <video src={videoPreviews[index]} className="w-full h-24 object-cover rounded-lg border border-[#14243D]" controls />
                    <button type="button" onClick={() => removeNewVideo(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1">
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-[11px] text-gray-700 mt-1 truncate" title={file.name}>{file.name}</p>
                  </div>
                ))}
              </div>
            )}
            <input ref={videoInputRef} type="file" multiple accept="video/*" onChange={handleVideoUpload} className="hidden" />
            <button type="button" onClick={() => videoInputRef.current?.click()} className="border-2 border-dashed rounded-lg p-4 w-full flex flex-col items-center text-gray-600 hover:border-[#14243D]">
              <Video className="w-6 h-6 mb-1" />
              Add videos
              {videos.length > 0 && (
                <span className="text-xs text-[#14243D] mt-1">{videos.length} new video{videos.length === 1 ? '' : 's'} selected</span>
              )}
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 rounded-md">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-[#14243D] text-white rounded-md hover:bg-[#243B5A]">
              {mode === 'create' ? 'Add to Catalog' : 'Update Catalog Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
