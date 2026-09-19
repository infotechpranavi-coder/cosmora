"use client"

import { useState } from "react"
import Link from "next/link"
import { Phone } from "lucide-react"
import { CUSTOMER_CARE, FIND_IT_FAST } from "@/data/print-marketplace"
import FloatingContactButtons from "@/components/floating-contact-buttons"

export default function Footer() {
  const [sent, setSent] = useState(false)

  return (
    <footer className="bg-[#1a1a2e] text-white">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-10 text-sm">
          <span className="text-gray-300">Got questions? Call us 24/7!</span>
          <a href="tel:+919619108909" className="inline-flex items-center gap-2 font-semibold hover:text-pink-300">
            <Phone className="w-4 h-4" />
            +91 9619108909, +91 7506550101
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cosmora-logo.png" alt="COSMORA" className="h-12 w-auto mb-4 bg-white rounded-md p-1" />
            <h3 className="text-sm font-bold uppercase tracking-wide mb-4">Find it Fast</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {FIND_IT_FAST.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-4">Customer Care</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {CUSTOMER_CARE.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-4">Contact info</h3>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                <span className="font-semibold text-white">Thane :</span> Gala No 20, Pomal Service Industrial Estate
                &amp; Premises Co-Op.Society Ltd, Kolshet Rd, Dhokali, Thane West, Thane, Maharashtra 400607
              </p>
              <p>
                <span className="font-semibold text-white">Mumbai :</span> Gala no.40, Ground floor, Gurudwara Building,
                Dr Baba Saheb Ambedkar Rd, opp. Chitra Cinema, Old bdd chawl, Dadar East, Dadar, Mumbai, Maharashtra
                400014
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Get Bulk Order</h3>
            <p className="text-sm text-gray-300 mb-4">
              Do you Want to Place an Order in minimal time and with best rates? Fill below form.
            </p>
            {sent ? (
              <p className="text-sm bg-white/10 rounded-lg p-4">Thanks! We will contact you shortly.</p>
            ) : (
              <form
                className="space-y-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
              >
                <input
                  required
                  name="name"
                  placeholder="Full name"
                  className="w-full rounded-md px-3 py-2 text-sm text-gray-900"
                />
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email id"
                  className="w-full rounded-md px-3 py-2 text-sm text-gray-900"
                />
                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="What's app number"
                  className="w-full rounded-md px-3 py-2 text-sm text-gray-900"
                />
                <input
                  name="qty"
                  placeholder="Enter your quantity"
                  className="w-full rounded-md px-3 py-2 text-sm text-gray-900"
                />
                <button type="submit" className="w-full rounded-md bg-[#EC4899] hover:bg-pink-600 py-2 text-sm font-semibold">
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-gray-400">
          Copyright © 2026 COSMORA. All Rights Reserved.
        </div>
      </div>
      <FloatingContactButtons />
    </footer>
  )
}
