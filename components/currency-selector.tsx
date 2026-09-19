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
      ? "flex items-center gap-1 px-2 py-1.5 rounded-full bg-white text-[#7C3AED] text-xs font-semibold shadow-md border border-violet-200 hover:bg-violet-50"
      : "flex items-center gap-2 px-3.5 py-2 rounded-full bg-white text-[#7C3AED] text-sm font-semibold shadow-md border-2 border-violet-200 hover:bg-violet-50 hover:border-[#7C3AED] hover:shadow-lg transition-all duration-200 ring-2 ring-white/30"
    : compact
      ? "flex items-center gap-1 px-2 py-1.5 rounded-full bg-violet-50 text-[#6D28D9] text-xs font-semibold border border-violet-200 hover:bg-violet-100"
      : "flex items-center gap-2 px-3.5 py-2 rounded-full bg-violet-50 text-[#6D28D9] text-sm font-semibold shadow-sm border border-violet-200 hover:bg-white hover:shadow-md transition-all duration-200 w-full justify-center"

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={btnClass}
        aria-label="Change currency"
        aria-expanded={open}
      >
        <Globe className={`w-4 h-4 shrink-0 ${isDark ? "text-[#EC4899]" : "text-[#7C3AED]"}`} />
        {!compact && <span className="hidden sm:inline text-xs font-normal text-gray-500">Currency</span>}
        <span className="font-bold">{info.symbol} {currency}</span>
        {!compact && <ChevronDown className={`w-4 h-4 text-[#7C3AED] transition-transform ${open ? "rotate-180" : ""}`} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border-2 border-violet-200 z-50 py-1 overflow-hidden">
            <p className="px-3 py-2 text-xs font-semibold text-[#7C3AED] bg-violet-50 border-b border-violet-100">
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
                className={`w-full text-left px-3 py-2.5 text-sm hover:bg-violet-50 flex items-center justify-between transition-colors ${
                  currency === c.code ? "bg-violet-50 font-semibold text-[#7C3AED]" : "text-gray-800"
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
