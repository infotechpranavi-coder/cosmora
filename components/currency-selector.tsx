"use client"

import { useState } from "react"
import { ChevronDown, Globe } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"
import { CURRENCIES, CURRENCY_LIST, type CurrencyCode } from "@/lib/currencies"

export default function CurrencySelector({
  variant = "dark",
  compact = false,
}: {
  variant?: "dark" | "light"
  compact?: boolean
}) {
  const { currency, setCurrency, ratesLoading } = useCurrency()
  const [open, setOpen] = useState(false)
  const info = CURRENCIES[currency]

  const isDark = variant === "dark"
  const btnClass = isDark
    ? compact
      ? "flex items-center gap-1 px-2 py-1.5 rounded-full bg-white text-[#041428] text-xs font-semibold shadow-md border border-neutral-300 hover:bg-neutral-100"
      : "flex items-center gap-2 px-3.5 py-2 rounded-full bg-white text-[#041428] text-sm font-semibold shadow-md border-2 border-neutral-300 hover:bg-neutral-100 hover:border-[#041428] hover:shadow-lg transition-all duration-200 ring-2 ring-white/30"
    : compact
      ? "flex items-center gap-1 px-2 py-1.5 rounded-full bg-neutral-100 text-[#111111] text-xs font-semibold border border-neutral-300 hover:bg-neutral-100"
      : "flex items-center gap-2 px-3.5 py-2 rounded-full bg-neutral-100 text-[#111111] text-sm font-semibold shadow-sm border border-neutral-300 hover:bg-white hover:shadow-md transition-all duration-200 w-full justify-center"

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={btnClass}
        aria-label="Change currency"
        aria-expanded={open}
      >
        <Globe className={`w-4 h-4 shrink-0 ${isDark ? "text-[#041428]" : "text-[#041428]"}`} />
        {!compact && <span className="hidden sm:inline text-xs font-normal text-gray-500">Currency</span>}
        <span className="font-bold">{info.symbol} {currency}</span>
        {!compact && <ChevronDown className={`w-4 h-4 text-[#041428] transition-transform ${open ? "rotate-180" : ""}`} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border-2 border-neutral-300 z-50 py-1 overflow-hidden">
            <p className="px-3 py-2 text-xs font-semibold text-[#041428] bg-neutral-100 border-b border-neutral-200">
              Select currency
            </p>
            {ratesLoading && (
              <p className="px-3 py-1.5 text-xs text-gray-400">Updating rates…</p>
            )}
            {CURRENCY_LIST.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setCurrency(c.code as CurrencyCode)
                  setOpen(false)
                }}
                className={`w-full text-left px-3 py-2.5 text-sm hover:bg-neutral-100 flex items-center justify-between transition-colors ${
                  currency === c.code ? "bg-neutral-100 font-semibold text-[#041428]" : "text-gray-800"
                }`}
              >
                <span className="font-medium">
                  {c.symbol} {c.code}
                </span>
                <span className="text-xs text-gray-500 truncate ml-2">{c.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
