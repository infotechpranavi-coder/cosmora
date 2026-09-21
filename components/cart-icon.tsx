"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useCurrency } from "@/contexts/currency-context"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus } from "lucide-react"

export default function CartIcon({
  variant = "dark",
}: {
  variant?: "dark" | "light"
}) {
  const { state, removeItem, updateQuantity } = useCart()
  const { formatPrice } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)
  const iconClass =
    variant === "light"
      ? "relative p-1 md:p-2 text-gray-700 hover:text-[#C49A52] transition-colors"
      : "relative p-1 md:p-2 text-white hover:text-neutral-300 transition-colors"

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={iconClass}
      >
        <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
        {state.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
            <span className="text-xs">{state.itemCount}</span>
          </span>
        )}
      </button>

      {/* Cart Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-3 md:p-4">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Shopping Cart</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors text-lg md:text-xl"
              >
                ×
              </button>
            </div>

            {state.items.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-lg text-gray-900">{formatPrice(state.total)}</span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link href="/cart" className="flex-1">
                      <Button className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-2 px-4 rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-200">
                        View Cart
                      </Button>
                    </Link>
                    <Link href="/checkout" className="flex-1">
                      <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg border border-gray-900 hover:border-gray-800 transition-all duration-200">
                        Checkout
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
