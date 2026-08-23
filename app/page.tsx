"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import NecklaceSection from "@/components/necklace-section"
import PendantSection from "@/components/pendant-section"
import InstagramCarousel from "@/components/instagram-carousel"
import HeroBannerSlider from "@/components/hero-banner-slider"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Heart, Eye, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useProducts } from "@/hooks/useProducts"
import { calculateDiscount } from "@/lib/price-utils"
import BuyNowButton from "@/components/buy-now-button"
import PriceDisplay from "@/components/price-display"
import FloatingContactButtons from "@/components/floating-contact-buttons"
import ResponsiveProductCarousel, { CarouselItem, FeaturedCarouselItem } from "@/components/responsive-product-carousel"

export default function Home() {
  const { addItem } = useCart()
  const { products, loading, error } = useProducts()

  const featuredProducts = products.slice(0, 4)
  const newArrivals = products.slice(0, 12)
  const latestGems = products.slice(0, 8)

  // Don't block the entire page - show skeleton loaders instead

  // Show error state if there's an error
  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 text-lg">Error loading products: {error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#C4A484] hover:bg-[#B39474]"
            >
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const categories = [
    {
      id: 1,
      name: "Rings",
      count: products.filter(p => p.category === "Rings").length,
      image: "https://res.cloudinary.com/djjj41z17/image/upload/v1754041278/7K0A0299_jboywk.jpg",
      href: "/categories/rings",
    },
    {
      id: 2,
      name: "Necklaces",
      count: products.filter(p => p.category === "Necklaces").length,
      image: "https://res.cloudinary.com/djjj41z17/image/upload/v1754041775/RNK-387_mhmryo.jpg",
      href: "/categories/necklaces",
    },
    {
      id: 3,
      name: "Pendants",
      count: products.filter(p => p.category === "Pendants").length,
      image: "https://res.cloudinary.com/djjj41z17/image/upload/v1754042374/RP_2237_thzcn1.jpg",
      href: "/categories/earrings",
    },
    {
      id: 4,
      name: "Mangalsutra",
      count: products.filter(p => p.category === "Mangalsutra").length,
      image: "https://res.cloudinary.com/djjj41z17/image/upload/v1754040744/1J8A0224_kecmbm.jpg",
      href: "/categories/bracelets",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Navbar - Always visible */}
      <Navbar />

      {/* Show subtle loading indicator at top if loading */}
      {loading && products.length === 0 && (
        <div className="fixed top-20 left-0 right-0 z-50 bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
            <p className="text-sm text-blue-600">Loading products...</p>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-[72px] sm:h-[68px] lg:h-[80px]" aria-hidden />

      {/* Hero Section — admin banners slider */}
      <HeroBannerSlider />

      {/* About Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 md:space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div>
                <h2 className="font-light-300 text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-4 md:mb-6 animate-fade-in-up text-center lg:text-left" style={{ animationDelay: '0.4s' }}>About Alankarika</h2>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4 md:mb-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  At Alankarika, we believe that jewelry is more than just an accessory—it's a reflection of your unique story,
                  your precious moments, and your personal style. Since 2025, we've been dedicated to creating
                  exquisite pieces that celebrate life's most beautiful moments.
                </p>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6 md:mb-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                  Our master craftsmen combine traditional techniques with modern innovation to create jewelry that stands
                  the test of time. Every piece is carefully designed and meticulously crafted using only the finest
                  materials, ensuring that your jewelry remains as beautiful as the day you first wore it.
                </p>
                <div className="text-center lg:text-left">
                  <Link href="/about">
                    <Button size="lg" className="bg-[#8B7355] hover:bg-[#D4AF37] text-white px-6 md:px-8 py-3 text-base md:text-lg animate-fade-in-up transition-all duration-300 hover:scale-105 shadow-lg" style={{ animationDelay: '1s' }}>
                      Learn More About Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in-up text-center lg:text-left w-full" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 lg:p-16 flex items-center justify-center min-h-[360px] md:min-h-[460px] lg:min-h-[560px] w-full">
                <Image
                  src="/logo/alankarika_logo-tm.jpeg"
                  alt="Alankarika Logo"
                  width={1000}
                  height={900}
                  className="rounded-2xl object-contain animate-fade-in-up transition-all duration-300 hover:scale-105 w-full h-auto"
                  style={{ animationDelay: '0.5s' }}
                />
              </div>
              <div className="absolute bottom-2 left-2 sm:-bottom-3 sm:-left-3 lg:-bottom-6 lg:-left-6 bg-white p-3 lg:p-6 rounded-xl lg:rounded-2xl shadow-lg animate-fade-in-up max-w-[85%] sm:max-w-none" style={{ animationDelay: '0.7s' }}>
                <div className="flex items-center space-x-2 lg:space-x-4">
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-xs lg:text-sm">Premium Quality</p>
                    <p className="text-xs lg:text-sm text-gray-600">Certified & Authentic</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-12 md:py-20" style={{ backgroundColor: '#f9f7c4' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8 md:mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-center flex-1">
              <h2 className="font-light-300 text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-3 md:mb-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>New Arrivals</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base lg:text-lg animate-fade-in-up px-4" style={{ animationDelay: '0.6s' }}>
                Discover our latest collection of exquisite jewelry pieces, crafted with precision and designed to make you shine.
              </p>
            </div>

          </div>

          <ResponsiveProductCarousel>
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <CarouselItem key={`loading-${index}`}>
                    <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-200 animate-pulse">
                      <div className="w-full h-64 md:h-80 bg-gray-300"></div>
                    </div>
                  </CarouselItem>
                ))
              ) : newArrivals.length === 0 ? (
                <div className="w-full text-center py-16">
                  <p className="text-gray-500">No products available</p>
                </div>
              ) : (
                newArrivals.map((product) => (
                  <CarouselItem key={product._id}>
                  <div className="group">
                    <Link href={`/view-details?id=${product._id}`}>
                      <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <Image
                          src={product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={400}
                          className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                        {product.isNew && (
                          <div className="absolute top-3 md:top-4 right-3 md:right-4">
                            <div className="bg-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold text-gray-900">
                              New
                            </div>
                          </div>
                        )}
                        {product.isOnSale && (
                          <div className="absolute top-3 md:top-4 left-3 md:left-4">
                            <div className="bg-red-500 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold text-white">
                              {calculateDiscount(product.price, product.originalPrice)}% OFF
                            </div>
                          </div>
                        )}
                        {(product.isOutOfStock || product.quantity <= 0) && (
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10 transition-all duration-300">
                            <span className="bg-gray-800 text-white px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-bold shadow-xl border border-gray-600">
                              OUT OF STOCK
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="mt-3 md:mt-4 p-3 md:p-4">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#8B7355] transition-colors">
                        {product.name}
                      </h3>
                      <div className="mb-3 md:mb-4">
                        <span className="text-lg md:text-2xl font-bold text-[#8B7355]"><PriceDisplay amount={product.price} /></span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs md:text-sm text-gray-500 line-through ml-2"><PriceDisplay amount={product.originalPrice} /></span>
                        )}
                      </div>
                      {/* Action Buttons - Horizontal Layout Below Price */}
                      <div className="flex space-x-2 md:space-x-3">
                        <Button
                          className={`flex-1 ${product.isOutOfStock || product.quantity <= 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#8B7355] hover:bg-[#D4AF37]"} text-white text-xs md:text-sm py-2`}
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
                          <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                          <span className="hidden sm:inline">{product.isOutOfStock || product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}</span>
                          <span className="sm:hidden">{product.isOutOfStock || product.quantity <= 0 ? "OOS" : "Add"}</span>
                        </Button>
                        <BuyNowButton
                          product={product}
                          disabled={product.isOutOfStock || product.quantity <= 0}
                          className={`flex-1 ${product.isOutOfStock || product.quantity <= 0
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-[#D4AF37] hover:bg-[#8B7355]"} text-white text-xs md:text-sm py-2`}
                        />
                      </div>
                    </div>
                  </div>
                  </CarouselItem>
                ))
              )}
          </ResponsiveProductCarousel>

          {/* View All Button */}
          <div className="text-center mt-8 md:mt-12 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <Link href="/products">
              <Button size="lg" className="bg-gradient-to-r from-white to-[#D4AF37] hover:bg-[#D4AF37] text-black hover:text-black px-6 md:px-8 py-3 text-base md:text-lg transition-all duration-300 hover:scale-105 rounded-full border border-[#D4AF37]/30">
                View All New Arrivals
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Gems Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8 md:mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-center flex-1">
              <h2 className="font-light-300 text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-3 md:mb-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>Latest Gems</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base lg:text-lg animate-fade-in-up px-4" style={{ animationDelay: '0.6s' }}>
                Discover our most precious and exclusive gemstone jewelry collection, featuring rare stones and premium craftsmanship.
              </p>
            </div>
          </div>

          <ResponsiveProductCarousel>
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <CarouselItem key={`loading-gems-${index}`}>
                    <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-200 animate-pulse h-64 md:h-80" />
                  </CarouselItem>
                ))
              ) : latestGems.length === 0 ? (
                <div className="w-full text-center py-16">
                  <p className="text-gray-500">No products available</p>
                </div>
              ) : (
                latestGems.map((product) => (
                  <CarouselItem key={product._id}>
                  <div className="group">
                    <Link href={`/view-details?id=${product._id}`}>
                      <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <Image
                          src={product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={400}
                          className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                        <div className="absolute top-4 right-4">
                          <div className="px-3 py-1 rounded-full text-sm font-bold text-gray-900 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 shadow-lg border border-gray-400">
                            Premium
                          </div>
                        </div>
                        {product.isOnSale && (
                          <div className="absolute top-4 left-4">
                            <div className="bg-red-500 px-3 py-1 rounded-full text-sm font-semibold text-white">
                              {calculateDiscount(product.price, product.originalPrice)}% OFF
                            </div>
                          </div>
                        )}
                        {(product.isOutOfStock || product.quantity <= 0) && (
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10 transition-all duration-300">
                            <span className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl border border-gray-600">
                              OUT OF STOCK
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="mt-3 md:mt-4 p-3 md:p-4">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#8B7355] transition-colors">
                        {product.name}
                      </h3>
                      <div className="mb-3 md:mb-4">
                        <span className="text-lg md:text-2xl font-bold text-[#8B7355]"><PriceDisplay amount={product.price} /></span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through ml-2"><PriceDisplay amount={product.originalPrice} /></span>
                        )}
                      </div>
                      {/* Action Buttons - Horizontal Layout Below Price */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button
                          className={`flex-1 ${product.isOutOfStock || product.quantity <= 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#8B7355] hover:bg-[#D4AF37]"} text-white text-xs md:text-sm`}
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
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {product.isOutOfStock || product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
                        </Button>
                        <BuyNowButton
                          product={product}
                          disabled={product.isOutOfStock || product.quantity <= 0}
                          className={`flex-1 ${product.isOutOfStock || product.quantity <= 0
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-[#D4AF37] hover:bg-[#8B7355]"} text-white`}
                        />
                      </div>
                    </div>
                  </div>
                  </CarouselItem>
                ))
              )}
          </ResponsiveProductCarousel>

          {/* View All Button */}
          <div className="text-center mt-8 md:mt-12">
            <Link href="/products">
              <Button size="lg" className="bg-gradient-to-r from-white to-[#D4AF37] hover:bg-[#D4AF37] text-black hover:text-black px-6 md:px-8 py-3 text-base md:text-lg rounded-full border border-[#D4AF37]/30">
                View All Latest Gems
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="font-light-300 text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-3 md:mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base lg:text-lg px-4">
              Explore our diverse collection of jewelry categories, each carefully curated to suit every style and occasion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link key={category.id} href={`/products?category=${encodeURIComponent(category.name)}`} className="group">
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${0.8 + index * 0.1}s` }}>
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={300}
                    height={400}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-semibold text-white mb-2">{category.name}</h3>
                    <p className="text-white opacity-90">{category.count} Products</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="font-light-300 text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-3 md:mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base lg:text-lg px-4">
              Discover our handpicked selection of the finest jewelry pieces, crafted with precision and designed to make you shine.
            </p>
          </div>

          <ResponsiveProductCarousel>
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <FeaturedCarouselItem key={`loading-featured-${index}`}>
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                      <div className="w-full h-64 bg-gray-200 animate-pulse" />
                    </div>
                  </FeaturedCarouselItem>
                ))
              ) : featuredProducts.length === 0 ? (
                <div className="w-full text-center py-16">
                  <p className="text-gray-500">No products available</p>
                </div>
              ) : (
                featuredProducts.map((product) => (
                  <FeaturedCarouselItem key={product._id}>
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300">
                      <Link href={`/view-details?id=${product._id}`}>
                        <div className="relative overflow-hidden cursor-pointer">
                          <Image
                            src={product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg"}
                            alt={product.name}
                            width={300}
                            height={300}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                          />

                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-col space-y-2">
                            {product.isNew && (
                              <span className="bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-full">NEW</span>
                            )}
                            {product.isOnSale && (
                              <span className="bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-full">SALE</span>
                            )}
                          </div>

                          {/* Featured Badge */}
                          <div className="absolute top-4 right-4">
                            <span className="bg-[#D4AF37] text-black px-3 py-1 text-xs font-bold rounded-full">FEATURED</span>
                          </div>
                        </div>
                      </Link>

                      <div className="p-6">
                        <p className="text-sm text-gray-500 mb-2">{product.category}</p>

                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-[#C4A484] transition-colors">
                          {product.name}
                        </h3>


                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-[#8B7355]"><PriceDisplay amount={product.price} /></span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through"><PriceDisplay amount={product.originalPrice} /></span>
                            )}
                            {product.isOnSale && product.offerPercentage && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                {product.offerPercentage}% OFF
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                          <Button
                            className="flex-1 bg-[#8B7355] hover:bg-[#D4AF37] text-white py-2 px-4 text-sm font-medium"
                            onClick={() => addItem({
                              id: product._id,
                              name: product.name,
                              price: product.price,
                              originalPrice: product.originalPrice,
                              image: product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg",
                              category: product.category,
                              brand: ""
                            })}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                          <BuyNowButton
                            product={product}
                            className="flex-1 bg-[#D4AF37] hover:bg-[#8B7355] text-white py-2 px-4 text-sm font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </FeaturedCarouselItem>
                ))
              )}
          </ResponsiveProductCarousel>

          <div className="text-center mt-8 md:mt-12">
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="bg-gradient-to-r from-white to-[#D4AF37] hover:bg-[#D4AF37] text-black hover:text-black px-8 py-3 text-lg transition-all duration-300 hover:scale-105 rounded-full border border-[#D4AF37]/30"
              >
                Explore All Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>





      <Footer />
      <FloatingContactButtons />
    </div>
  )
}
