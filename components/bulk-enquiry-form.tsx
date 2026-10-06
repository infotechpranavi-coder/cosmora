"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  STORE_EMAIL,
  STORE_PHONE_DISPLAY,
  STORE_PHONE_TEL,
  STORE_WHATSAPP,
  SHOP_NAV,
} from "@/lib/shop-nav"
import { Check, ChevronDown, Mail, Phone, X } from "lucide-react"

export default function BulkEnquiryForm() {
  const [formData, setFormData] = useState({
    products: [] as string[],
    quantity: "",
    companyName: "",
    whatsapp: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [productError, setProductError] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  const toggleProduct = (name: string) => {
    setFormData((prev) => {
      const exists = prev.products.includes(name)
      const products = exists
        ? prev.products.filter((p) => p !== name)
        : [...prev.products, name]
      return { ...prev, products }
    })
    setProductError(false)
  }

  const removeProduct = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p !== name),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.products.length === 0) {
      setProductError(true)
      setDropdownOpen(true)
      return
    }

    setIsSubmitting(true)

    const message = [
      "Bulk & Corporate Enquiry",
      `Product: ${formData.products.join(", ")}`,
      `Quantity: ${formData.quantity}`,
      `Company: ${formData.companyName}`,
      `WhatsApp: ${formData.whatsapp}`,
    ].join("\n")

    const waUrl = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`
    window.open(waUrl, "_blank", "noopener,noreferrer")

    await new Promise((resolve) => setTimeout(resolve, 400))
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ products: [], quantity: "", companyName: "", whatsapp: "" })
    setTimeout(() => setIsSubmitted(false), 4000)
  }

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <h3 className="text-xl font-semibold text-[#172033] mb-2">Enquiry ready</h3>
        <p className="text-sm text-[#667085]">
          WhatsApp opened with your bulk request. If it did not open, message us on{" "}
          <a href={`tel:${STORE_PHONE_TEL}`} className="font-semibold text-[#14243D]">
            {STORE_PHONE_DISPLAY}
          </a>{" "}
          or email{" "}
          <a href={`mailto:${STORE_EMAIL}`} className="font-semibold text-[#14243D]">
            {STORE_EMAIL}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[#172033] mb-2">
          Product * <span className="font-normal text-slate-500">(select one or more)</span>
        </label>

        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className={`w-full min-h-[48px] rounded-xl border bg-white px-3.5 py-2.5 text-left text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#14243D]/20 ${
              productError
                ? "border-rose-400"
                : dropdownOpen
                  ? "border-[#14243D] shadow-sm"
                  : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-1 flex-wrap gap-1.5 min-w-0">
                {formData.products.length === 0 ? (
                  <span className="text-slate-400 py-0.5">Select products</span>
                ) : (
                  formData.products.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1 rounded-full bg-[#EEF2F7] px-2.5 py-1 text-xs font-medium text-[#14243D]"
                    >
                      {name}
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation()
                          removeProduct(name)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            e.stopPropagation()
                            removeProduct(name)
                          }
                        }}
                        className="rounded-full p-0.5 hover:bg-[#14243D]/10"
                        aria-label={`Remove ${name}`}
                      >
                        <X className="w-3 h-3" />
                      </span>
                    </span>
                  ))
                )}
              </div>
              <ChevronDown
                className={`mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="max-h-72 overflow-y-auto py-2">
                {SHOP_NAV.map((group) => (
                  <div key={group.name} className="px-2">
                    <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      {group.name}
                    </p>
                    {group.items.map((item) => {
                      const selected = formData.products.includes(item.name)
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => toggleProduct(item.name)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                            selected
                              ? "bg-[#14243D] text-white"
                              : "text-[#172033] hover:bg-slate-50"
                          }`}
                        >
                          <span className="font-medium">{item.name}</span>
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                              selected
                                ? "border-white/40 bg-white/15"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {selected ? <Check className="w-3.5 h-3.5" /> : null}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                ))}

                <div className="mt-1 border-t border-slate-100 px-2 pt-1">
                  {(["Other / Mixed"] as const).map((name) => {
                    const selected = formData.products.includes(name)
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleProduct(name)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                          selected
                            ? "bg-[#14243D] text-white"
                            : "text-[#172033] hover:bg-slate-50"
                        }`}
                      >
                        <span className="font-medium">{name}</span>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                            selected
                              ? "border-white/40 bg-white/15"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {selected ? <Check className="w-3.5 h-3.5" /> : null}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-3 py-2.5">
                <span className="text-xs text-slate-500">
                  {formData.products.length} selected
                </span>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(false)}
                  className="rounded-lg bg-[#14243D] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1E3A60]"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {productError && (
          <p className="mt-1.5 text-xs text-rose-600">Please select at least one product.</p>
        )}
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-[#172033] mb-2">
          Quantity *
        </label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          required
          value={formData.quantity}
          onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
          placeholder="e.g. 100"
          className="h-12 rounded-xl"
        />
      </div>

      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-[#172033] mb-2">
          Company Name *
        </label>
        <Input
          id="companyName"
          name="companyName"
          type="text"
          required
          value={formData.companyName}
          onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
          placeholder="Your company or brand"
          className="h-12 rounded-xl"
        />
      </div>

      <div>
        <label htmlFor="whatsapp" className="block text-sm font-medium text-[#172033] mb-2">
          WhatsApp Number *
        </label>
        <Input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          required
          value={formData.whatsapp}
          onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))}
          placeholder="+91 XXXXX XXXXX"
          className="h-12 rounded-xl"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 rounded-xl bg-[#14243D] hover:bg-[#1E3A60] text-white font-semibold"
      >
        {isSubmitting ? "Sending…" : "Submit bulk enquiry"}
      </Button>

      <div className="pt-2 flex flex-col sm:flex-row gap-3 text-sm text-[#667085]">
        <a
          href={`mailto:${STORE_EMAIL}`}
          className="inline-flex items-center gap-2 hover:text-[#14243D]"
        >
          <Mail className="w-4 h-4" />
          {STORE_EMAIL}
        </a>
        <a
          href={`tel:${STORE_PHONE_TEL}`}
          className="inline-flex items-center gap-2 hover:text-[#14243D]"
        >
          <Phone className="w-4 h-4" />
          {STORE_PHONE_DISPLAY}
        </a>
      </div>
    </form>
  )
}
