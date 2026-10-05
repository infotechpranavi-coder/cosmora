export type ProductColor = {
  name: string
  hex: string
}

/** Common apparel colors for quick-add in the dashboard form. */
export const PRESET_PRODUCT_COLORS: ProductColor[] = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#F5F5F5" },
  { name: "Navy", hex: "#1B2A4A" },
  { name: "Grey", hex: "#8A8F98" },
  { name: "Beige", hex: "#D4C4A8" },
  { name: "Olive", hex: "#556B2F" },
  { name: "Maroon", hex: "#7B2D3B" },
  { name: "Red", hex: "#C62828" },
  { name: "Blue", hex: "#1565C0" },
  { name: "Green", hex: "#2E7D32" },
]

function normalizeHex(value: string): string {
  const raw = value.trim()
  if (!raw) return "#000000"
  const withHash = raw.startsWith("#") ? raw : `#${raw}`
  if (/^#[0-9A-Fa-f]{3}$/.test(withHash)) {
    const [, a, b, c] = withHash
    return `#${a}${a}${b}${b}${c}${c}`.toUpperCase()
  }
  if (/^#[0-9A-Fa-f]{6}$/.test(withHash)) return withHash.toUpperCase()
  return "#000000"
}

export function normalizeProductColors(input: unknown): ProductColor[] {
  if (!Array.isArray(input)) return []

  const seen = new Set<string>()
  const colors: ProductColor[] = []

  for (const item of input) {
    if (!item || typeof item !== "object") continue
    const name = String((item as ProductColor).name || "").trim()
    if (!name) continue
    const hex = normalizeHex(String((item as ProductColor).hex || "#000000"))
    const key = `${name.toLowerCase()}|${hex}`
    if (seen.has(key)) continue
    seen.add(key)
    colors.push({ name, hex })
  }

  return colors
}

export function parseProductColors(raw: unknown): ProductColor[] {
  if (Array.isArray(raw)) return normalizeProductColors(raw)
  if (typeof raw !== "string" || !raw.trim()) return []

  try {
    return normalizeProductColors(JSON.parse(raw))
  } catch {
    // Fallback: "Black, White" or "Black:#111, White:#fff"
    return normalizeProductColors(
      raw.split(",").map((part) => {
        const [namePart, hexPart] = part.split(":").map((s) => s.trim())
        return { name: namePart || "", hex: hexPart || "#000000" }
      })
    )
  }
}

export function serializeProductColors(colors: ProductColor[]): string {
  return JSON.stringify(normalizeProductColors(colors))
}

/** Light colors need a border so the swatch stays visible on white backgrounds. */
export function isLightColor(hex: string): boolean {
  const normalized = normalizeHex(hex).slice(1)
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.78
}
