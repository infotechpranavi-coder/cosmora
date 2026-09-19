"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    setIsSubscribed(true)
    setEmail("")
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  return (
    <section className="py-16 bg-[#C4A484]">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
        <div className="mb-8">
          <Mail className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-light text-white mb-4">Stay in the Loop</h2>
          <p className="text-white opacity-90 text-lg max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and jewelry
            care tips from our experts.
          </p>
        </div>

        {isSubscribed ? (
          <div className="bg-white bg-opacity-20 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-white text-lg font-medium">âœ¨ Thank you for subscribing! âœ¨</div>
            <p className="text-white opacity-90 mt-2">Welcome to the COSMORA family!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white border-0 text-gray-900 placeholder-gray-500"
              />
              <Button type="submit" className="bg-white text-[#C4A484] hover:bg-gray-100 font-medium px-8">
                Subscribe
              </Button>
            </div>
            <p className="text-white opacity-75 text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </form>
        )}
      </div>
    </section>
  )
}
