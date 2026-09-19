"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Send, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Diamond Ring",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop",
    price: "$1,299",
    description: "Elegant diamond ring with 18k gold setting"
  },
  {
    id: 2,
    name: "Pearl Necklace",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=500&fit=crop",
    price: "$899",
    description: "Classic pearl necklace with silver clasp"
  },
  {
    id: 3,
    name: "Sapphire Earrings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
    price: "$599",
    description: "Stunning sapphire earrings in white gold"
  },
  {
    id: 4,
    name: "Emerald Bracelet",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&h=500&fit=crop",
    price: "$799",
    description: "Beautiful emerald bracelet with diamond accents"
  },
  {
    id: 5,
    name: "Ruby Pendant",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&h=500&fit=crop",
    price: "$499",
    description: "Exquisite ruby pendant on gold chain"
  },
  {
    id: 6,
    name: "Opal Ring",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&h=500&fit=crop",
    price: "$699",
    description: "Unique opal ring with intricate design"
  },
  {
    id: 7,
    name: "Amethyst Necklace",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
    price: "$399",
    description: "Stunning amethyst necklace with silver chain"
  }
];

const InstagramCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prev) => (prev + 1) % products.length);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isDragging]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX;
      setCurrentX(newX);
      const diff = startX - newX;
      setTranslateX(-diff * 0.5); // Reduce movement for smoother effect
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      const diff = startX - currentX;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          setCurrentIndex((prev) => (prev + 1) % products.length);
        } else {
          setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
        }
      }
      setIsDragging(false);
      setTranslateX(0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const newX = e.touches[0].clientX;
      setCurrentX(newX);
      const diff = startX - newX;
      setTranslateX(-diff * 0.5);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      const diff = startX - currentX;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          setCurrentIndex((prev) => (prev + 1) % products.length);
        } else {
          setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
        }
      }
      setIsDragging(false);
      setTranslateX(0);
    }
  };

  const currentProduct = products[currentIndex];
  const prevProduct = products[(currentIndex - 1 + products.length) % products.length];
  const nextProduct = products[(currentIndex + 1) % products.length];

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden">
      {/* Navigation Arrows */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Triptych Layout */}
      <div 
        ref={carouselRef}
        className="flex items-center justify-center gap-4 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {/* Left Panel */}
        <div className="relative w-64 h-80 rounded-lg overflow-hidden border-2 border-yellow-400 transition-all duration-300 hover:scale-105">
          <Image
            src={prevProduct.image}
            alt={prevProduct.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 left-2 right-2">
            <h4 className="text-white text-xs font-semibold">{prevProduct.name}</h4>
            <p className="text-white/90 text-xs">{prevProduct.price}</p>
          </div>
        </div>

        {/* Central Instagram Post */}
        <div className="relative w-80 bg-white rounded-2xl border-2 border-yellow-400 shadow-xl transition-all duration-300 hover:scale-105">
          {/* Header */}
          <div className="flex items-center p-3 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full border-2 border-yellow-400 mr-3 overflow-hidden">
                <Image
                  src="/logoalan-removebg-preview.png"
                  alt="COSMORA"
                  width={60}
                  height={60}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-black">COSMORA</h4>
                <p className="text-xs text-gray-500">Premium Jewelry</p>
              </div>
            </div>
          </div>

          {/* Main Image */}
          <div className="relative w-full h-80">
            <Image
              src={currentProduct.image}
              alt={currentProduct.name}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
              <h3 className="text-white font-semibold text-lg">{currentProduct.name}</h3>
              <p className="text-white/90 text-sm">{currentProduct.price}</p>
              <p className="text-white/80 text-xs mt-1">{currentProduct.description}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLike}
                  className={`transition-colors ${
                    isLiked ? "text-red-500" : "text-gray-700"
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
                </button>
                <button className="text-gray-700 hover:text-gray-900 transition-colors">
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button className="text-gray-700 hover:text-gray-900 transition-colors">
                  <Send className="w-6 h-6" />
                </button>
              </div>
              <button className="text-gray-700 hover:text-gray-900 transition-colors">
                <Bookmark className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="relative w-64 h-80 rounded-lg overflow-hidden border-2 border-yellow-400 transition-all duration-300 hover:scale-105">
          <Image
            src={nextProduct.image}
            alt={nextProduct.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 left-2 right-2">
            <h4 className="text-white text-xs font-semibold">{nextProduct.name}</h4>
            <p className="text-white/90 text-xs">{nextProduct.price}</p>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-yellow-400 w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default InstagramCarousel; 
