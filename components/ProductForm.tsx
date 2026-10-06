"use client"

import { useState, useRef, useEffect } from 'react'
import { X, Plus, Upload, Trash2, Video, Star } from 'lucide-react'
import { CreateProductData, UpdateProductData, Product } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { normalizeKeyFeatures } from '@/lib/key-features'
import { HOME_SECTION_OPTIONS, normalizeHomeSection } from '@/lib/home-sections'
import {
  PRESET_PRODUCT_COLORS,
  normalizeProductColors,
  isLightColor,
  type ProductColor,
} from '@/lib/product-colors'
import { SHOP_NAV } from '@/lib/shop-nav'

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
    colors: normalizeProductColors(product?.colors),
    quantity: product?.quantity != null ? String(product.quantity) : '',
    category: String(product?.category || ''),
    subCategory: String(product?.subCategory || ''),
    homeSection: normalizeHomeSection(product?.homeSection),
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
  const [customColorName, setCustomColorName] = useState('')
  const [customColorHex, setCustomColorHex] = useState('#14243D')

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
      setCustomColorName('')
      setCustomColorHex('#14243D')
    } else if (mode === 'create') {
      setFormData(productToFormState(null))
      setExistingImages([])
      setExistingVideos([])
      setImages([])
      setVideos([])
      setImagesToDelete([])
      setVideosToDelete([])
      setCustomColorName('')
      setCustomColorHex('#14243D')
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
  const shopGroup = SHOP_NAV.find((g) => g.name === formData.category)
  const categoryOptions = Array.from(
    new Set([...SHOP_NAV.map((g) => g.name), ...dynamicCategories.map((c) => c.name)])
  )
  const subCategories = shopGroup
    ? shopGroup.items.map((i) => i.name)
    : selectedCategory?.subCategories || []
  const categoryMissingFromList =
    Boolean(formData.category) && !categoryOptions.includes(formData.category)

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

  const addColor = (color: ProductColor) => {
    setFormData((prev) => {
      const next = normalizeProductColors([...prev.colors, color])
      return { ...prev, colors: next }
    })
  }

  const removeColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }))
  }

  const togglePresetColor = (color: ProductColor) => {
    const exists = formData.colors.some(
      (c) => c.name.toLowerCase() === color.name.toLowerCase() || c.hex.toLowerCase() === color.hex.toLowerCase()
    )
    if (exists) {
      setFormData((prev) => ({
        ...prev,
        colors: prev.colors.filter(
          (c) =>
            c.name.toLowerCase() !== color.name.toLowerCase() &&
            c.hex.toLowerCase() !== color.hex.toLowerCase()
        ),
      }))
      return
    }
    addColor(color)
  }

  const handleAddCustomColor = () => {
    const name = customColorName.trim()
    if (!name) {
      alert('Enter a color name (e.g. Navy).')
      return
    }
    addColor({ name, hex: customColorHex })
    setCustomColorName('')
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
      alert('Please select a main category (Clothing, Bags, or Accessories).')
      return
    }
    if (subCategories.length > 0 && !formData.subCategory.trim()) {
      alert('Please select a subcategory after choosing the main category.')
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
        colors: formData.colors,
        quantity: parseInt(formData.quantity, 10),
        category: formData.category,
        subCategory: formData.subCategory.trim() || undefined,
        homeSection: formData.homeSection || '',
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
        colors: formData.colors,
        quantity: parseInt(formData.quantity, 10),
        category: formData.category,
        subCategory: formData.subCategory.trim() || undefined,
        homeSection: formData.homeSection || '',
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Main category *</label>
              <select
                value={formData.category}
                onChange={(e) => {
                  handleInputChange('category', e.target.value)
                  handleInputChange('subCategory', '')
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#14243D]"
                required
              >
                <option value="">Select Clothing, Bags, or Accessories</option>
                {categoryMissingFromList && (
                  <option value={formData.category}>{formData.category} (current)</option>
                )}
                {categoryOptions.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {formData.category && subCategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sub-category *</label>
              <select
                value={formData.subCategory}
                onChange={(e) => handleInputChange('subCategory', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select a subcategory</option>
                {formData.subCategory &&
                  !subCategories.includes(formData.subCategory) && (
                    <option value={formData.subCategory}>{formData.subCategory} (current)</option>
                  )}
                {subCategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                This is where the product appears in the Clothing / Bags / Accessories dropdowns.
              </p>
            </div>
          )}

          <div className="bg-[#EEF2F7]/60 border border-[#E8D5B0] rounded-lg p-4">
            <label className="block text-sm font-semibold text-[#14243D] mb-2">
              Show on homepage section
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Pick where this apparel appears on the home page. Leave as none to keep it in the catalog only.
            </p>
            <select
              value={formData.homeSection}
              onChange={(e) => handleInputChange('homeSection', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#14243D]"
            >
              {HOME_SECTION_OPTIONS.map((opt) => (
                <option key={opt.value || 'none'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

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

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Colors</label>
              <p className="text-xs text-slate-500">
                Pick presets or add a custom color. These swatches show on the product page.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {PRESET_PRODUCT_COLORS.map((color) => {
                const selected = formData.colors.some(
                  (c) =>
                    c.name.toLowerCase() === color.name.toLowerCase() ||
                    c.hex.toLowerCase() === color.hex.toLowerCase()
                )
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => togglePresetColor(color)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                      selected
                        ? "border-[#14243D] bg-[#14243D] text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    <span
                      className={`h-3.5 w-3.5 rounded-full ${isLightColor(color.hex) ? "border border-slate-300" : ""}`}
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.name}
                  </button>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Custom color name</label>
                <input
                  type="text"
                  value={customColorName}
                  onChange={(e) => setCustomColorName(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                  placeholder="e.g. Forest Green"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Hex</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColorHex}
                    onChange={(e) => setCustomColorHex(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded border border-slate-200 bg-white p-1"
                  />
                  <input
                    type="text"
                    value={customColorHex}
                    onChange={(e) => setCustomColorHex(e.target.value)}
                    className="w-28 border rounded-md px-3 py-2 text-sm bg-white font-mono"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddCustomColor}
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#14243D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1E3A60]"
              >
                <Plus className="w-4 h-4" /> Add color
              </button>
            </div>

            {formData.colors.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {formData.colors.map((color, index) => (
                  <span
                    key={`${color.name}-${color.hex}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white pl-2 pr-1 py-1 text-xs font-medium text-slate-700"
                  >
                    <span
                      className={`h-4 w-4 rounded-full ${isLightColor(color.hex) ? "border border-slate-300" : ""}`}
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.name}
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="rounded-full p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      aria-label={`Remove ${color.name}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No colors selected yet.</p>
            )}
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
