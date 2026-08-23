"use client"

import { useState, useEffect } from "react"
import { useProducts } from "@/hooks/useProducts"
import { useSearchParams } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import Navbar from "@/components/navbar"
import ProductGrid from "@/components/product-grid"
import ProductFilters from "@/components/product-filters"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"
import Link from "next/link"
import { calculateDiscount } from "@/lib/price-utils"
import BuyNowButton from "@/components/buy-now-button"
import PriceDisplay from "@/components/price-display"

interface FilterState {
  categories: string[]
  priceRange: [number, number]
  materials: string[]
  colors: string[]
  sizes: string[]
  isNew: boolean
  isOnSale: boolean
}

export default function ProductsPage() {
  const { products, loading } = useProducts()
  const { addItem } = useCart()
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category')

  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('featured')
  const [filters, setFilters] = useState<FilterState>({
    categories: initialCategory ? [initialCategory] : [],
    priceRange: [0, 50000],
    materials: [],
    colors: [],
    sizes: [],
    isNew: false,
    isOnSale: false,
  })

  // Read category from URL and apply it to filters when URL changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl) {
      setFilters(prev => ({
        ...prev,
        categories: [categoryFromUrl]
      }))
    }
  }, [searchParams])

  // Apply filters to products
  const filteredProducts = products.filter(product => {
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false
    }

    // Price filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false
    }

    // New filter
    if (filters.isNew && !product.isNew) {
      return false
    }

    // Sale filter
    if (filters.isOnSale && !product.isOnSale) {
      return false
    }

    // Material filter (using category for now)
    if (filters.materials.length > 0 && !filters.materials.includes(product.category)) {
      return false
    }

    // Size filter (check if product has size constraints)
    if (filters.sizes.length > 0 && product.sizeConstraints) {
      const productSizes = product.sizeConstraints.split(',').map(s => s.trim())
      const hasMatchingSize = filters.sizes.some(size => productSizes.includes(size))
      if (!hasMatchingSize) {
        return false
      }
    }

    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'newest':
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      case 'rating':
        return b.rating - a.rating
      case 'reviews':
        return b.reviews - a.reviews
      default:
        return 0
    }
  })

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.categories.length > 0) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) count++
    if (filters.materials.length > 0) count++
    if (filters.colors.length > 0) count++
    if (filters.sizes.length > 0) count++
    if (filters.isNew) count++
    if (filters.isOnSale) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 50000],
      materials: [],
      colors: [],
      sizes: [],
      isNew: false,
      isOnSale: false,
    })
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Top spacing to prevent navbar overlap */}
      <div className="h-20"></div>
      <div className="bg-gray-50 py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Breadcrumb Navigation */}
          {filters.categories.length > 0 && (
            <div className="mb-4 md:mb-6">
              <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                <a href="/products" className="hover:text-[#C4A484] transition-colors">
                  All Products
                </a>
                <span>/</span>
                <span className="text-gray-900 font-medium">{filters.categories[0]}</span>
              </nav>
            </div>
          )}

          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 mb-3 md:mb-4">
              {filters.categories.length > 0
                ? `${filters.categories[0]} Collection`
                : 'All Products'
              }
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base px-4">
              {filters.categories.length > 0
                ? `Discover our exclusive collection of ${filters.categories[0].toLowerCase()} pieces, each designed to make you shine bright.`
                : 'Discover our complete collection of handcrafted jewelry pieces, each designed to make you shine bright.'
              }
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block lg:w-1/4">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
              />
            </aside>

            {/* Mobile Filters Modal */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
                <div className="absolute right-0 top-0 h-full w-full max-w-sm sm:w-80 bg-white shadow-xl overflow-y-auto">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Filters</h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <ProductFilters
                      filters={filters}
                      onFiltersChange={setFilters}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <main className="lg:w-3/4">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4 md:mb-6">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 text-sm md:text-base py-2 md:py-3"
                >
                  <Filter className="w-4 h-4" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                  {activeFiltersCount > 0 && (
                    <span className="bg-[#C4A484] text-white text-xs px-2 py-1 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </div>
              {/* Results Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 mb-4 md:mb-6">
                <div className="flex flex-col gap-3 md:gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm md:text-base flex-1 sm:flex-none"
                    >
                      <option value="featured">Sort by: Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="rating">Highest Rated</option>
                      <option value="reviews">Most Reviewed</option>
                    </select>

                    {activeFiltersCount > 0 && (
                      <Button
                        onClick={clearAllFilters}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-xs md:text-sm"
                      >
                        <X className="w-3 h-3 md:w-4 md:h-4" />
                        Clear Filters
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center">
                    <p className="text-xs md:text-sm text-gray-600">
                      {loading ? "Loading products..." : `Showing ${sortedProducts.length} of ${products.length} products`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="text-center py-12 md:py-16">
                  <div className="animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-b-2 border-[#C4A484] mx-auto"></div>
                  <p className="mt-4 text-gray-600 text-sm md:text-base">Loading products...</p>
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="text-center py-12 md:py-16 px-4">
                  <Filter className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6 text-sm md:text-base">
                    Try adjusting your filters or clearing all filters to see more products.
                  </p>
                  <Button onClick={clearAllFilters} className="bg-[#C4A484] hover:bg-[#B39474] text-sm md:text-base">
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                  {sortedProducts.map((product) => (
                    <div key={product._id} className="group">
                      <Link href={`/products/${product._id}`}>
                        <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                          <img
                            src={product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                          {product.isNew && (
                            <div className="absolute top-4 right-4">
                              <div className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                                New
                              </div>
                            </div>
                          )}
                          {product.isOnSale && product.originalPrice && (
                            <div className="absolute top-4 left-4">
                              <div className="bg-red-500 px-3 py-1 rounded-full text-sm font-semibold text-white">
                                {calculateDiscount(product.price, product.originalPrice)}% OFF
                              </div>
                            </div>
                          )}
                          {(product.isOutOfStock || product.quantity <= 0) && (
                            <div className="absolute top-4 left-4 z-10">
                              <span className="bg-gray-800 text-white px-3 py-1 text-xs font-bold rounded-full">OUT OF STOCK</span>
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="mt-4 p-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#8B7355] transition-colors">
                          {product.name}
                        </h3>
                        <div className="mb-4">
                          <span className="text-2xl font-bold text-[#8B7355]"><PriceDisplay amount={product.price} /></span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through ml-2"><PriceDisplay amount={product.originalPrice} /></span>
                          )}
                        </div>
                        {/* Action Buttons - Horizontal Layout Below Price */}
                        <div className="flex space-x-3">
                          <Button
                            className={`flex-1 ${product.isOutOfStock || product.quantity <= 0
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-[#8B7355] hover:bg-[#D4AF37]"} text-white`}
                            disabled={product.isOutOfStock || product.quantity <= 0}
                            onClick={() => {
                              if (product.isOutOfStock || product.quantity <= 0) return
                              addItem({
                                id: product._id,
                                name: product.name,
                                price: product.price,
                                originalPrice: product.originalPrice,
                                image: product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg",
                                category: product.category,
                                brand: ""
                              })
                            }}
                          >
                            {product.isOutOfStock || product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
                          </Button>
                          <BuyNowButton
                            product={product}
                            disabled={product.isOutOfStock || product.quantity <= 0}
                            className={`flex-1 ${product.isOutOfStock || product.quantity <= 0
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-[#D4AF37] hover:bg-[#8B7355] text-white"}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
