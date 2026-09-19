"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export type CountryDial = {
  name: string
  iso: string
  dial: string
  flag: string
}

/** Common dial codes — India first as default for COSMORA */
export const COUNTRY_DIAL_CODES: CountryDial[] = [
  { name: "India", iso: "IN", dial: "+91", flag: "🇮🇳" },
  { name: "United Arab Emirates", iso: "AE", dial: "+971", flag: "🇦🇪" },
  { name: "United States", iso: "US", dial: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", iso: "GB", dial: "+44", flag: "🇬🇧" },
  { name: "Canada", iso: "CA", dial: "+1", flag: "🇨🇦" },
  { name: "Australia", iso: "AU", dial: "+61", flag: "🇦🇺" },
  { name: "Singapore", iso: "SG", dial: "+65", flag: "🇸🇬" },
  { name: "Saudi Arabia", iso: "SA", dial: "+966", flag: "🇸🇦" },
  { name: "Qatar", iso: "QA", dial: "+974", flag: "🇶🇦" },
  { name: "Kuwait", iso: "KW", dial: "+965", flag: "🇰🇼" },
  { name: "Oman", iso: "OM", dial: "+968", flag: "🇴🇲" },
  { name: "Bahrain", iso: "BH", dial: "+973", flag: "🇧🇭" },
  { name: "Nepal", iso: "NP", dial: "+977", flag: "🇳🇵" },
  { name: "Bangladesh", iso: "BD", dial: "+880", flag: "🇧🇩" },
  { name: "Sri Lanka", iso: "LK", dial: "+94", flag: "🇱🇰" },
  { name: "Pakistan", iso: "PK", dial: "+92", flag: "🇵🇰" },
  { name: "Germany", iso: "DE", dial: "+49", flag: "🇩🇪" },
  { name: "France", iso: "FR", dial: "+33", flag: "🇫🇷" },
  { name: "Italy", iso: "IT", dial: "+39", flag: "🇮🇹" },
  { name: "Spain", iso: "ES", dial: "+34", flag: "🇪🇸" },
  { name: "Netherlands", iso: "NL", dial: "+31", flag: "🇳🇱" },
  { name: "Switzerland", iso: "CH", dial: "+41", flag: "🇨🇭" },
  { name: "Japan", iso: "JP", dial: "+81", flag: "🇯🇵" },
  { name: "South Korea", iso: "KR", dial: "+82", flag: "🇰🇷" },
  { name: "China", iso: "CN", dial: "+86", flag: "🇨🇳" },
  { name: "Hong Kong", iso: "HK", dial: "+852", flag: "🇭🇰" },
  { name: "Malaysia", iso: "MY", dial: "+60", flag: "🇲🇾" },
  { name: "Thailand", iso: "TH", dial: "+66", flag: "🇹🇭" },
  { name: "Indonesia", iso: "ID", dial: "+62", flag: "🇮🇩" },
  { name: "Philippines", iso: "PH", dial: "+63", flag: "🇵🇭" },
  { name: "New Zealand", iso: "NZ", dial: "+64", flag: "🇳🇿" },
  { name: "South Africa", iso: "ZA", dial: "+27", flag: "🇿🇦" },
  { name: "Brazil", iso: "BR", dial: "+55", flag: "🇧🇷" },
  { name: "Mexico", iso: "MX", dial: "+52", flag: "🇲🇽" },
  { name: "Russia", iso: "RU", dial: "+7", flag: "🇷🇺" },
  { name: "Turkey", iso: "TR", dial: "+90", flag: "🇹🇷" },
  { name: "Egypt", iso: "EG", dial: "+20", flag: "🇪🇬" },
  { name: "Nigeria", iso: "NG", dial: "+234", flag: "🇳🇬" },
  { name: "Kenya", iso: "KE", dial: "+254", flag: "🇰🇪" },
  { name: "Ireland", iso: "IE", dial: "+353", flag: "🇮🇪" },
]

function parsePhoneValue(value: string): { dial: string; local: string } {
  const trimmed = (value || "").trim()
  if (!trimmed) return { dial: "+91", local: "" }

  const sorted = [...COUNTRY_DIAL_CODES].sort((a, b) => b.dial.length - a.dial.length)
  for (const c of sorted) {
    if (trimmed.startsWith(c.dial)) {
      return { dial: c.dial, local: trimmed.slice(c.dial.length).replace(/\D/g, "") }
    }
  }
  if (trimmed.startsWith("+")) {
    const match = trimmed.match(/^(\+\d{1,4})(.*)$/)
    if (match) {
      return { dial: match[1], local: match[2].replace(/\D/g, "") }
    }
  }
  return { dial: "+91", local: trimmed.replace(/\D/g, "") }
}

type PhoneInputProps = {
  id?: string
  value: string
  onChange: (fullPhone: string) => void
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
  inputClassName?: string
}

export default function PhoneInput({
  id = "phone",
  value,
  onChange,
  required,
  disabled,
  placeholder = "98765 43210",
  className,
  inputClassName,
}: PhoneInputProps) {
  const parsed = parsePhoneValue(value)
  const [dial, setDial] = useState(parsed.dial)
  const [local, setLocal] = useState(parsed.local)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const rootRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Sync from external value (e.g. prefilled profile)
  useEffect(() => {
    const next = parsePhoneValue(value)
    setDial(next.dial)
    setLocal(next.local)
  }, [value])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50)
    }
  }, [open])

  const selected = useMemo(
    () => COUNTRY_DIAL_CODES.find((c) => c.dial === dial) || COUNTRY_DIAL_CODES[0],
    [dial]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return COUNTRY_DIAL_CODES
    return COUNTRY_DIAL_CODES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.iso.toLowerCase().includes(q)
    )
  }, [search])

  const emit = (nextDial: string, nextLocal: string) => {
    const digits = nextLocal.replace(/\D/g, "")
    onChange(digits ? `${nextDial}${digits}` : "")
  }

  return (
    <div ref={rootRef} className={cn("relative flex gap-2", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className="flex h-10 shrink-0 items-center gap-1 rounded-md border border-input bg-background px-2.5 text-sm hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Select country code"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span className="font-medium text-gray-800">{selected.dial}</span>
        <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
      </button>

      <Input
        id={id}
        type="tel"
        inputMode="numeric"
        value={local}
        onChange={(e) => {
          const next = e.target.value.replace(/[^\d\s]/g, "")
          setLocal(next)
          emit(dial, next)
        }}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={cn("flex-1", inputClassName)}
        autoComplete="tel-national"
      />

      {open && !disabled && (
        <div className="absolute left-0 top-full z-50 mt-1 w-[min(100%,20rem)] rounded-lg border border-[#E8DFD0] bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-[#E8DFD0] px-3 py-2">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">No countries found</li>
            ) : (
              filtered.map((c) => (
                <li key={`${c.iso}-${c.dial}`}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-violet-50",
                      c.dial === dial && c.iso === selected.iso && "bg-violet-50"
                    )}
                    onClick={() => {
                      setDial(c.dial)
                      emit(c.dial, local)
                      setOpen(false)
                      setSearch("")
                    }}
                  >
                    <span>{c.flag}</span>
                    <span className="flex-1 truncate text-gray-800">{c.name}</span>
                    <span className="text-gray-500">{c.dial}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
