"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Gift, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { computeShippingFee } from "@/lib/buy-now"
import type { StoreSettings } from "@/lib/store-settings"
import { DEFAULT_SETTINGS } from "@/lib/store-settings"
import { useCurrency } from "@/contexts/currency-context"

export default function CartPage() {
  const { state, removeItem, updateQuantity, clearCart } = useCart()
  const { formatPrice } = useCurrency()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS)
  const [isGift, setIsGift] = useState(false)
  const [giftMessage, setGiftMessage] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) setSettings(data.data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = sessionStorage.getItem('cartGift')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setIsGift(Boolean(parsed.isGift))
        setGiftMessage(parsed.giftMessage || '')
      } catch {
        // ignore
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    sessionStorage.setItem('cartGift', JSON.stringify({ isGift, giftMessage }))
  }, [isGift, giftMessage])

  const shipping = useMemo(
    () => computeShippingFee(state.total, settings.shippingFee, settings.freeShippingThreshold),
    [state.total, settings.shippingFee, settings.freeShippingThreshold]
  )
  const giftFee = isGift && settings.giftEnabled ? settings.giftFee : 0
  const tax = state.total * (settings.taxRate || 0.18)
  const grandTotal = state.total + shipping + giftFee + tax

  const handleQuantityUpdate = (id: string, newQuantity: number) => {
    setIsUpdating(id)
    updateQuantity(id, newQuantity)
    setTimeout(() => setIsUpdating(null), 500)
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center" style={{ backgroundColor: '#f6f7fb' }}>
          <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-16 h-16 text-[#14243D]" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#172033] mb-4">Your Cart is Empty</h1>
            <p className="text-[#667085] text-lg mb-8 max-w-md mx-auto">
              Add custom merchandise, then come back to complete your order.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-[#14243D] hover:bg-[#243B5A] text-white px-8 py-3">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg" className="border-[#14243D] text-[#14243D] hover:bg-[#14243D] hover:text-white px-8 py-3">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="min-h-[calc(100vh-120px)] py-12" style={{ backgroundColor: '#f6f7fb' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="mb-12">
            <Link href="/products" className="inline-flex items-center text-[#14243D] hover:text-[#243B5A] mb-6 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Continue Shopping</span>
            </Link>
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#172033] mb-4">Shopping Cart</h1>
              <p className="text-[#667085] text-lg">
                {state.itemCount} item{state.itemCount !== 1 ? 's' : ''} in your cart
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[#172033] flex items-center">
                    <Star className="w-5 h-5 text-[#14243D] mr-2" />
                    Your Items
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-600 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="divide-y divide-neutral-100">
                  {state.items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="w-24 h-24 object-cover rounded-xl"
                        />

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-[#172033]">{item.name}</h3>
                          <p className="text-sm text-[#14243D]">{item.brand}</p>
                          <p className="text-sm text-[#667085] capitalize">{item.category}</p>
                        </div>

                        <div className="flex items-center border border-[#E9D5FF] rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                            disabled={isUpdating === item.id}
                            className="px-3 py-2 hover:bg-[#EEF2F7] disabled:opacity-50 text-[#14243D]"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-2 min-w-[2.5rem] text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                            disabled={isUpdating === item.id}
                            className="px-3 py-2 hover:bg-[#EEF2F7] disabled:opacity-50 text-[#14243D]"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right min-w-[6rem]">
                          <p className="text-xl font-bold text-[#14243D]">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 self-start sm:self-center"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {settings.giftEnabled && (
                <div className="bg-white rounded-2xl shadow-sm border border-[#E9D5FF] p-6">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="send-as-gift"
                      checked={isGift}
                      onCheckedChange={(checked) => setIsGift(checked === true)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-3">
                      <Label htmlFor="send-as-gift" className="flex items-center gap-2 text-base font-semibold text-[#172033] cursor-pointer">
                        <Gift className="w-4 h-4 text-[#14243D]" />
                        Send as Gift
                        {settings.giftFee > 0 && (
                          <span className="text-sm font-normal text-[#667085]">(+{formatPrice(settings.giftFee)})</span>
                        )}
                      </Label>
                      {isGift && (
                        <Textarea
                          placeholder="Write a gift message..."
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                          maxLength={500}
                          className="min-h-[90px] border-[#E5E7EB] focus-visible:ring-[#14243D]"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-[#E9D5FF] p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-[#172033] mb-6 flex items-center">
                  <Star className="w-5 h-5 text-[#14243D] mr-2" />
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between py-2 border-b border-[#E9D5FF]">
                    <span className="text-[#667085]">Subtotal ({state.itemCount} items)</span>
                    <span className="font-medium">{formatPrice(state.total)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E9D5FF]">
                    <span className="text-[#667085]">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-700">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  {isGift && settings.giftEnabled && (
                    <div className="flex justify-between py-2 border-b border-[#E9D5FF]">
                      <span className="text-[#667085]">Gift wrapping</span>
                      <span className="font-medium">{formatPrice(giftFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-[#E9D5FF]">
                    <span className="text-[#667085]">Tax ({Math.round((settings.taxRate || 0.18) * 100)}%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                  <div className="bg-[#EEF2F7] p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-[#172033]">Total</span>
                      <span className="text-2xl font-bold text-[#14243D]">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link href="/checkout" className="w-full">
                    <Button
                      className="w-full h-12 bg-[#14243D] hover:bg-[#243B5A] text-white text-base rounded-lg"
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/products" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-11 border border-[#14243D] text-[#14243D] bg-white hover:bg-[#EEF2F7] rounded-lg"
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {settings.freeShippingThreshold > 0 && shipping > 0 && (
                  <p className="mt-4 text-xs text-[#667085] text-center">
                    Free shipping on orders {formatPrice(settings.freeShippingThreshold)}+
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
