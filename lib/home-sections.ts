/** Homepage section keys products can be assigned to from the Apparel modal. */
export const HOME_SECTION_OPTIONS = [
  { value: "", label: "None — catalog only (not featured on a home section)" },
  { value: "marquee", label: "Image strip (top film strip)" },
  { value: "spotlight", label: "Spotlight Collection" },
  { value: "rail", label: "Trending Now / Product rail" },
  { value: "lookbook", label: "The Cosmora Lookbook" },
  { value: "bags", label: "Bags section" },
  { value: "tees", label: "T-Shirts section" },
  { value: "shirts", label: "Formal shirts section" },
] as const

export type HomeSectionValue = (typeof HOME_SECTION_OPTIONS)[number]["value"]

export const HOME_SECTION_VALUES = HOME_SECTION_OPTIONS.map((o) => o.value).filter(Boolean) as string[]

export function isHomeSection(value: unknown): value is string {
  return typeof value === "string" && HOME_SECTION_VALUES.includes(value)
}

export function normalizeHomeSection(value: unknown): string {
  if (typeof value !== "string") return ""
  const trimmed = value.trim()
  return isHomeSection(trimmed) ? trimmed : ""
}
