"use client"

import Image from "next/image"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Fashion Designer",
      image: "/placeholder.svg?height=80&width=80&text=Sarah",
      rating: 5,
      text: "Absolutely stunning merchandise! The quality is exceptional and the designs are timeless. I've received so many compliments on my COSMORA pieces. The customer service is also outstanding.",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Business Executive",
      image: "/placeholder.svg?height=80&width=80&text=Michael",
      rating: 5,
      text: "I bought an engagement ring from COSMORA and it was perfect. The craftsmanship is incredible and my fiancÃ©e absolutely loves it. The whole experience was seamless from start to finish.",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Artist",
      image: "/placeholder.svg?height=80&width=80&text=Emily",
      rating: 5,
      text: "The attention to detail in every piece is remarkable. I've been a customer for years and every purchase has exceeded my expectations. COSMORA truly understands what makes merchandise special.",
    },
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our valued customers have to say about their COSMORA experience.
          </p>
        </div>

        <div className="relative">
          <div className="bg-gray-50 rounded-lg p-8 lg:p-12">
            <div className="text-center">
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial text */}
              <blockquote className="text-xl text-gray-700 leading-relaxed mb-8 italic">
                "{testimonials[currentTestimonial].text}"
              </blockquote>

              {/* Customer info */}
              <div className="flex items-center justify-center space-x-4">
                <Image
                  src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                  alt={testimonials[currentTestimonial].name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#C4A484] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#C4A484] hover:text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? "bg-[#C4A484]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
