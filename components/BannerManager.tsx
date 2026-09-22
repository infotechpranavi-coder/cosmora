"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Upload, Trash2, GripVertical, Save, ImageIcon, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getCloudinaryDeliveryUrl } from "@/lib/cloudinary-url"
import { DEFAULT_SETTINGS } from "@/lib/store-settings"

type Banner = {
  _id: string
  image?: { url?: string; publicId?: string }
  title?: string
  link?: string
  buyAt?: string
  mrp?: string
  order: number
  isActive: boolean
}

function getBannerImageUrl(banner: Banner): string | null {
  return banner?.image?.url ?? null
}

function normalizeBanner(raw: Record<string, unknown>): Banner | null {
  if (!raw || typeof raw._id !== "string") return null

  const nested = raw.image as { url?: string; publicId?: string } | undefined
  const url =
    nested?.url ??
    (typeof raw.imageUrl === "string" ? raw.imageUrl : null)

  if (!url) return null

  return {
    _id: raw._id,
    image: {
      url,
      publicId: nested?.publicId ?? (typeof raw.imagePublicId === "string" ? raw.imagePublicId : ""),
    },
    title: typeof raw.title === "string" ? raw.title : "",
    link: typeof raw.link === "string" ? raw.link : "",
    buyAt: typeof raw.buyAt === "string" && raw.buyAt ? raw.buyAt : "299/-",
    mrp: typeof raw.mrp === "string" && raw.mrp ? raw.mrp : "699/-",
    order: typeof raw.order === "number" ? raw.order : 0,
    isActive: raw.isActive !== false,
  }
}

export default function BannerManager() {
  const { toast } = useToast()
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [savingText, setSavingText] = useState(false)
  const [savingSlideId, setSavingSlideId] = useState<string | null>(null)
  const [replacingId, setReplacingId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [link, setLink] = useState("")
  const [buyAt, setBuyAt] = useState("299")
  const [mrp, setMrp] = useState("699")
  const [heroEyebrow, setHeroEyebrow] = useState(DEFAULT_SETTINGS.heroEyebrow)
  const [heroTagline, setHeroTagline] = useState(DEFAULT_SETTINGS.heroTagline)
  const [heroDescription, setHeroDescription] = useState(DEFAULT_SETTINGS.heroDescription)
  const fileRef = useRef<HTMLInputElement>(null)
  const replaceFileRef = useRef<HTMLInputElement>(null)
  const bannersRef = useRef<Banner[]>([])
  bannersRef.current = banners

  const loadBanners = async () => {
    try {
      const res = await fetch("/api/banners", {
        headers: { "x-dashboard-admin": "true" },
        cache: "no-store",
      })
      const data = await res.json()
      const normalized = (data.data || [])
        .map((item: Record<string, unknown>) => normalizeBanner(item))
        .filter(Boolean) as Banner[]
      setBanners(normalized)
    } catch {
      toast({ title: "Could not load hero images", variant: "destructive" })
    }
  }

  const loadHeroText = async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" })
      const data = await res.json()
      if (data.success && data.data) {
        setHeroEyebrow(data.data.heroEyebrow || DEFAULT_SETTINGS.heroEyebrow)
        setHeroTagline(data.data.heroTagline || DEFAULT_SETTINGS.heroTagline)
        setHeroDescription(data.data.heroDescription || DEFAULT_SETTINGS.heroDescription)
      }
    } catch {
      /* keep defaults */
    }
  }

  useEffect(() => {
    ;(async () => {
      await Promise.all([loadBanners(), loadHeroText()])
      setLoading(false)
    })()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("image", file)
      fd.append("title", title)
      fd.append("link", link)
      fd.append("buyAt", buyAt)
      fd.append("mrp", mrp)
      fd.append("order", String(banners.length))

      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "x-dashboard-admin": "true" },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")

      toast({ title: "Hero image added", description: "It now shows on the homepage hero section." })
      setTitle("")
      setLink("")
      setBuyAt("299")
      setMrp("699")
      if (fileRef.current) fileRef.current.value = ""
      await loadBanners()
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Try again",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const id = replacingId
    if (!file || !id) return
    setSavingSlideId(id)
    try {
      const banner = banners.find((b) => b._id === id)
      const fd = new FormData()
      fd.append("image", file)
      fd.append("title", banner?.title || "")
      fd.append("link", banner?.link || "")
      fd.append("buyAt", banner?.buyAt || "299/-")
      fd.append("mrp", banner?.mrp || "699/-")

      const res = await fetch(`/api/banners/${id}`, {
        method: "PUT",
        headers: { "x-dashboard-admin": "true" },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Replace failed")

      toast({ title: "Image updated", description: "Homepage hero image refreshed." })
      await loadBanners()
    } catch (err) {
      toast({
        title: "Could not change image",
        description: err instanceof Error ? err.message : "Try again",
        variant: "destructive",
      })
    } finally {
      setSavingSlideId(null)
      setReplacingId(null)
      if (replaceFileRef.current) replaceFileRef.current.value = ""
    }
  }

  const moveBanner = (idx: number, dir: -1 | 1) => {
    const next = [...banners]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setBanners(next.map((b, i) => ({ ...b, order: i })))
  }

  const updateBannerField = (id: string, field: keyof Banner, value: string) => {
    setBanners((prev) => prev.map((b) => (b._id === id ? { ...b, [field]: value } : b)))
  }

  const saveHeroText = async () => {
    setSavingText(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-dashboard-admin": "true",
        },
        body: JSON.stringify({
          heroEyebrow,
          heroTagline,
          heroDescription,
        }),
      })
      if (!res.ok) throw new Error("Save failed")
      toast({ title: "Hero text saved", description: "Homepage hero copy updated." })
    } catch {
      toast({ title: "Could not save hero text", variant: "destructive" })
    } finally {
      setSavingText(false)
    }
  }

  const saveOneSlide = async (id: string) => {
    const banner = bannersRef.current.find((b) => b._id === id)
    if (!banner) return
    setSavingSlideId(id)
    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-dashboard-admin": "true",
        },
        body: JSON.stringify({
          title: banner.title || "",
          link: banner.link || "",
          buyAt: banner.buyAt || "299/-",
          mrp: banner.mrp || "699/-",
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Save failed")
      if (data.data) {
        setBanners((prev) =>
          prev.map((b) =>
            b._id === id
              ? {
                  ...b,
                  title: data.data.title ?? b.title,
                  link: data.data.link ?? b.link,
                  buyAt: data.data.buyAt || b.buyAt,
                  mrp: data.data.mrp || b.mrp,
                  image: data.data.image || b.image,
                }
              : b
          )
        )
      }
      toast({ title: "Slide saved", description: "Price and text updated on the homepage hero." })
      await loadBanners()
    } catch (err) {
      toast({
        title: "Could not save slide",
        description: err instanceof Error ? err.message : "Try again",
        variant: "destructive",
      })
    } finally {
      setSavingSlideId(null)
    }
  }

  const saveSlides = async () => {
    try {
      const res = await fetch("/api/banners", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-dashboard-admin": "true",
        },
        body: JSON.stringify({
          banners: banners.map((b, i) => ({
            _id: b._id,
            order: i,
            isActive: b.isActive,
            title: b.title || "",
            link: b.link || "",
            buyAt: b.buyAt || "299/-",
            mrp: b.mrp || "699/-",
          })),
        }),
      })
      if (!res.ok) throw new Error("Save failed")
      toast({ title: "All slides saved", description: "Order, prices, and labels updated." })
      await loadBanners()
    } catch {
      toast({ title: "Could not save slides", variant: "destructive" })
    }
  }

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this hero image?")) return
    try {
      const res = await fetch(`/api/banners?id=${id}`, {
        method: "DELETE",
        headers: { "x-dashboard-admin": "true" },
      })
      if (!res.ok) throw new Error("Delete failed")
      toast({ title: "Hero image removed" })
      await loadBanners()
    } catch {
      toast({ title: "Delete failed", variant: "destructive" })
    }
  }

  if (loading) return <p className="text-gray-500">Loading hero settings…</p>

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ImageIcon className="w-8 h-8 text-[#14243D]" />
          Homepage Hero
        </h1>
        <p className="text-gray-600 mt-2">
          Edit hero text, pricing, and images. Use Edit on a saved slide to change its image, price, or label.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold text-gray-900">Hero text</h2>
          <Button
            type="button"
            onClick={saveHeroText}
            disabled={savingText}
            className="bg-[#14243D] hover:bg-[#243B5A] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {savingText ? "Saving…" : "Save text"}
          </Button>
        </div>
        <div>
          <Label htmlFor="hero-eyebrow">Eyebrow line</Label>
          <Input
            id="hero-eyebrow"
            value={heroEyebrow}
            onChange={(e) => setHeroEyebrow(e.target.value)}
            placeholder="India's first print marketplace"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="hero-tagline">Tagline</Label>
          <Input
            id="hero-tagline"
            value={heroTagline}
            onChange={(e) => setHeroTagline(e.target.value)}
            placeholder="Wear Your Universe"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="hero-description">Description</Label>
          <Textarea
            id="hero-description"
            value={heroDescription}
            onChange={(e) => setHeroDescription(e.target.value)}
            rows={3}
            placeholder="Custom printed apparel from the manufacturer…"
            className="mt-1"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Add new hero image</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="banner-title">Slide label (optional)</Label>
            <Input
              id="banner-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer tee"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="banner-link">Link URL (optional)</Label>
            <Input
              id="banner-link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="/products"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="banner-buyAt">Starting price (₹)</Label>
            <Input
              id="banner-buyAt"
              value={buyAt}
              onChange={(e) => setBuyAt(e.target.value)}
              placeholder="299"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="banner-mrp">MRP (₹)</Label>
            <Input
              id="banner-mrp"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              placeholder="699"
              className="mt-1"
            />
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        <Button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="bg-[#14243D] hover:bg-[#243B5A] text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Uploading…" : "Upload hero image"}
        </Button>
      </div>

      <input
        ref={replaceFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleReplaceImage}
      />

      {banners.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-3">
            <div>
              <h2 className="font-semibold text-gray-900">Saved hero slides ({banners.length})</h2>
              <p className="text-xs text-gray-500 mt-0.5">Click Edit to change image, price, or text on a saved slide.</p>
            </div>
            <Button variant="outline" onClick={saveSlides} className="border-[#14243D] text-[#14243D] shrink-0">
              <Save className="w-4 h-4 mr-2" />
              Save all
            </Button>
          </div>
          <div className="space-y-4">
            {banners.map((banner, idx) => {
              const imageUrl = getBannerImageUrl(banner)
              const isSaving = savingSlideId === banner._id
              return (
                <div
                  key={banner._id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <GripVertical className="w-5 h-5 text-gray-400 shrink-0" />
                    <span className="text-sm font-bold text-[#14243D] w-6">{idx + 1}</span>
                    <div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      {imageUrl ? (
                        <Image
                          src={getCloudinaryDeliveryUrl(imageUrl, { width: 640, quality: "auto:good" })}
                          alt={banner.title || "Hero image"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 ml-auto">
                      <Button
                        type="button"
                        size="sm"
                        disabled={isSaving}
                        onClick={() => saveOneSlide(banner._id)}
                        className="bg-[#C49A52] hover:bg-[#A8843F] text-[#14243D] font-semibold"
                      >
                        <Save className="w-3.5 h-3.5 mr-1.5" />
                        {isSaving ? "Saving…" : "Save this slide"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isSaving}
                        onClick={() => {
                          setReplacingId(banner._id)
                          replaceFileRef.current?.click()
                        }}
                        className="border-[#14243D] text-[#14243D]"
                      >
                        <ImagePlus className="w-3.5 h-3.5 mr-1.5" />
                        Change image
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={idx === 0}
                        onClick={() => moveBanner(idx, -1)}
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={idx === banners.length - 1}
                        onClick={() => moveBanner(idx, 1)}
                      >
                        ↓
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => deleteBanner(banner._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pl-0 sm:pl-11">
                    <div>
                      <Label className="text-xs">Label</Label>
                      <Input
                        value={banner.title || ""}
                        onChange={(e) => updateBannerField(banner._id, "title", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Starting price (₹)</Label>
                      <Input
                        value={(banner.buyAt || "299/-").replace("/-", "")}
                        onChange={(e) => updateBannerField(banner._id, "buyAt", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">MRP (₹)</Label>
                      <Input
                        value={(banner.mrp || "699/-").replace("/-", "")}
                        onChange={(e) => updateBannerField(banner._id, "mrp", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Link (optional)</Label>
                      <Input
                        value={banner.link || ""}
                        onChange={(e) => updateBannerField(banner._id, "link", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-12 bg-gray-50 rounded-xl">
          No hero images yet. Upload one with pricing to replace the default homepage hero visuals.
        </p>
      )}
    </div>
  )
}
