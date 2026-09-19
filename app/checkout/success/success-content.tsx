"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, Package, Truck, Home, ShoppingBag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const [verifying, setVerifying] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const order = searchParams.get('order')
    if (order) setOrderNumber(order)

    if (!sessionId) return

    setVerifying(true)
    fetch(`/api/stripe/verify-session?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.paymentStatus === 'paid') {
          setPaymentConfirmed(true)
          if (data.order?.orderNumber) setOrderNumber(data.order.orderNumber)
        }
      })
      .catch(() => {})
      .finally(() => setVerifying(false))
  }, [searchParams])

  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {verifying ? (
                <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
              ) : (
                <CheckCircle className="w-12 h-12 text-green-600" />
              )}
            </div>
            <h1 className="text-4xl font-light text-gray-900 mb-4">
              {verifying ? 'Confirming Payment...' : 'Order Confirmed!'}
            </h1>
            <p className="text-gray-600 text-lg">
              {paymentConfirmed
                ? 'Your Stripe payment was successful. Thank you for shopping with COSMORA.'
                : 'Thank you for your purchase. Your order has been successfully placed.'}
            </p>
            {orderNumber && (
              <p className="text-[#0A0A0A] font-medium mt-3">Order #{orderNumber}</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Order Processing</h3>
                <p className="text-sm text-gray-600">We&apos;re preparing your order</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Shipping</h3>
                <p className="text-sm text-gray-600">Estimated 3-5 business days</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Delivery</h3>
                <p className="text-sm text-gray-600">Track your package</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-4">What&apos;s Next?</h3>
              <div className="text-left space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">1</span>
                  <p>You&apos;ll receive an order confirmation email with your order details and tracking information.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">2</span>
                  <p>Our team will process your order and prepare it for shipping within 24–48 hours.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">3</span>
                  <p>You&apos;ll receive shipping updates and can track your package until it reaches your doorstep.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="bg-[#0A0A0A] hover:bg-[#111111]">
                  <Home className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Browse More Products
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              Need help? <Link href="/contact" className="text-[#0A0A0A] hover:underline">Contact our support team</Link>
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Customer Support</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Email: info@cosmora.in</p>
                <p>Phone: +91 9076055755</p>
                <p>Hours: Mon-Sat 9AM-8PM IST</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Return Policy</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>7-day return window</p>
                <p>Item must be unworn with original packaging</p>
                <p>Refund to original payment method</p>
                <p>
                  <Link href="/return-policy" className="text-[#0A0A0A] underline">
                    Read full refund policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
