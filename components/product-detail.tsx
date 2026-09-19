"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Heart, ShoppingCart, Star, Plus, Minus, Share2, Truck, RotateCcw, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { calculateDiscount } from "@/lib/price-utils"
import { saveBuyNowItem } from "@/lib/buy-now"
import PriceDisplay from "@/components/price-display"

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  description: string
  keyFeatures: string[]
  images: Array<{ url: string; publicId: string }>
  videos: Array<{ url: string; publicId: string }>
  category: string
  quantity: number
  isNew: boolean
  isOutOfStock: boolean
  isOnSale: boolean
  offerPercentage?: number
  sizeConstraints?: string
}

export default function ProductDetail({ productId: propProductId }: { productId?: string }) {
  const { addItem } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)

        // Get product ID from prop, URL params or use a default
        const productId = propProductId || searchParams.get('id') || searchParams.get('productId')

        if (productId) {
          // Fetch specific product by ID
          const response = await fetch(`/api/products/${productId}`)
          const data = await response.json()

          if (data.success) {
            setProduct(data.data)
          } else {
            setError(data.error || 'Failed to fetch product')
          }
        } else {
          // If no product ID, fetch the first available product or show a message
          const response = await fetch('/api/products')
          const data = await response.json()

          if (data.success && data.data.length > 0) {
            setProduct(data.data[0]) // Show first product as default
          } else {
            setError('No products available')
          }
        }
      } catch (err) {
        setError('Failed to fetch product')
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [searchParams])

  if (loading) {
    return (
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <Button onClick={() => window.history.back()} className="bg-[#2F3F8F] hover:bg-[#1B2A4A] text-white">Go Back</Button>
          </div>
        </div>
      </div>
    )
  }

  const incrementQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg",
      category: product.category,
      brand: "",
      quantity,
    })
  }

  const handleBuyNow = () => {
    if (product.isOutOfStock || product.quantity <= 0) return
    saveBuyNowItem({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg",
      category: product.category,
      brand: "",
      quantity,
    })
    router.push('/checkout?mode=buynow')
  }

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <Image
                src={product.images && product.images.length > 0 ? product.images[selectedImage].url : "/placeholder.svg"}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 ${selectedImage === index ? "border-[#0A0A0A]" : "border-gray-200"
                      }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} view ${index + 1}`}
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-4">{product.name}</h1>
              {(product.isOutOfStock || product.quantity <= 0) && (
                <div className="mb-4">
                  <span className="bg-gray-800 text-white px-4 py-1.5 rounded-full text-sm font-bold">OUT OF STOCK</span>
                </div>
              )}

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-[#2F3F8F]"><PriceDisplay amount={product.price} /></span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through"><PriceDisplay amount={product.originalPrice} /></span>
                )}
                {product.isOnSale && product.originalPrice && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    {calculateDiscount(product.price, product.originalPrice)}% OFF
                  </span>
                )}
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">{product.description}</p>

              {/* Key Features */}
              {product.keyFeatures && product.keyFeatures.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {product.keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-[#2F3F8F] rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Size Selection */}
              {product.sizeConstraints && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizeConstraints.split(',').map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size.trim())}
                        className={`px-4 py-2 border rounded-lg transition-colors ${selectedSize === size.trim()
                          ? "border-[#2F3F8F] bg-[#2F3F8F] text-white"
                          : "border-gray-300 hover:border-[#0A0A0A]"
                          }`}
                      >
                        {size.trim()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      disabled={product.isOutOfStock || product.quantity <= 0 || quantity <= 1}
                      className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      disabled={product.isOutOfStock || product.quantity <= 0 || quantity >= product.quantity}
                      className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {(product.isOutOfStock || product.quantity <= 0) ? (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  ) : (
                    <span className="text-gray-600">({product.quantity} available)</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.isOutOfStock || product.quantity <= 0}
                  className={`flex-1 h-12 text-base sm:text-lg ${product.isOutOfStock || product.quantity <= 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#2F3F8F] hover:bg-[#1B2A4A]"} text-white`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.isOutOfStock || product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={product.isOutOfStock || product.quantity <= 0}
                  className={`flex-1 h-12 text-base sm:text-lg ${product.isOutOfStock || product.quantity <= 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#2F3F8F] hover:bg-[#1B2A4A] text-white"}`}
                >
                  Buy Now
                </Button>
                <Button variant="outline" className="px-6 py-3 self-start sm:self-auto">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Additional Info */}
              <div className="pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Truck className="w-5 h-5 mr-2" />
                    <span>Free Shipping</span>
                  </div>
                  <Link href="/return-policy" className="flex items-center text-gray-600 hover:text-[#2F3F8F] transition-colors">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    <span>7 Days Return Policy</span>
                  </Link>
                  <div className="flex items-center text-gray-600">
                    <Shield className="w-5 h-5 mr-2" />
                    <span>Secure Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
