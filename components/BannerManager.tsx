"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Upload, Trash2, GripVertical, Save, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getCloudinaryDeliveryUrl } from "@/lib/cloudinary-url"

type Banner = {
  _id: string
  image?: { url?: string; publicId?: string }
  title?: string
  link?: string
  order: number
  isActive: boolean
}

function getBannerImageUrl(banner: Banner): string | null {
  return banner?.image?.url ?? null
}

function normalizeBanner(raw: Record<string, unknown>): Banner | null {
  if (!raw || typeof raw._id !== 'string') return null

  const nested = raw.image as { url?: string; publicId?: string } | undefined
  const url =
    nested?.url ??
    (typeof raw.imageUrl === 'string' ? raw.imageUrl : null)

  if (!url) return null

  return {
    _id: raw._id,
    image: {
      url,
      publicId: nested?.publicId ?? (typeof raw.imagePublicId === 'string' ? raw.imagePublicId : ''),
    },
    title: typeof raw.title === 'string' ? raw.title : '',
    link: typeof raw.link === 'string' ? raw.link : '',
    order: typeof raw.order === 'number' ? raw.order : 0,
    isActive: raw.isActive !== false,
  }
}

export default function BannerManager() {
  const { toast } = useToast()
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState("")
  const [link, setLink] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const loadBanners = async () => {
    try {
      const res = await fetch("/api/banners", {
        headers: { "x-dashboard-admin": "true" },
      })
      const data = await res.json()
      const normalized = (data.data || [])
        .map((item: Record<string, unknown>) => normalizeBanner(item))
        .filter(Boolean) as Banner[]
      setBanners(normalized)
    } catch {
      toast({ title: "Could not load banners", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBanners()
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
      fd.append("order", String(banners.length))

      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "x-dashboard-admin": "true" },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")

      toast({ title: "Banner added", description: "It will appear in the homepage slider." })
      setTitle("")
      setLink("")
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

  const moveBanner = (idx: number, dir: -1 | 1) => {
    const next = [...banners]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setBanners(next.map((b, i) => ({ ...b, order: i })))
  }

  const saveOrder = async () => {
    try {
      const res = await fetch("/api/banners", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-dashboard-admin": "true",
        },
        body: JSON.stringify({
          banners: banners.map((b, i) => ({ _id: b._id, order: i, isActive: b.isActive })),
        }),
      })
      if (!res.ok) throw new Error("Save failed")
      toast({ title: "Banner order saved" })
      await loadBanners()
    } catch {
      toast({ title: "Could not save order", variant: "destructive" })
    }
  }

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return
    try {
      const res = await fetch(`/api/banners?id=${id}`, {
        method: "DELETE",
        headers: { "x-dashboard-admin": "true" },
      })
      if (!res.ok) throw new Error("Delete failed")
      toast({ title: "Banner removed" })
      await loadBanners()
    } catch {
      toast({ title: "Delete failed", variant: "destructive" })
    }
  }

  if (loading) return <p className="text-gray-500">Loading banners…</p>

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ImageIcon className="w-8 h-8 text-[#14243D]" />
          Homepage Promo Banners
        </h1>
        <p className="text-gray-600 mt-2">
          Upload banners in order. They rotate automatically on the homepage hero slider.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 space-y-4">
        <h2 className="font-semibold text-gray-900">Add banner</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="banner-title">Title (optional)</Label>
            <Input id="banner-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="banner-link">Link URL (optional)</Label>
            <Input id="banner-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="/products" className="mt-1" />
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
          {uploading ? "Uploading…" : "Upload banner image"}
        </Button>
        <p className="text-xs text-gray-500">
          Recommended: wide landscape image (1920×800 or larger). Re-upload existing banners for best sharpness.
        </p>
      </div>

      {banners.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Banner sequence ({banners.length})</h2>
            <Button variant="outline" onClick={saveOrder} className="border-[#14243D] text-[#14243D]">
              <Save className="w-4 h-4 mr-2" />
              Save order
            </Button>
          </div>
          <div className="space-y-3">
            {banners.map((banner, idx) => {
              const imageUrl = getBannerImageUrl(banner)
              return (
              <div
                key={banner._id}
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-3 shadow-sm"
              >
                <GripVertical className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-sm font-bold text-[#14243D] w-6">{idx + 1}</span>
                <div className="relative w-32 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  {imageUrl ? (
                    <Image
                      src={getCloudinaryDeliveryUrl(imageUrl, { width: 640, quality: 'auto:good' })}
                      alt={banner.title || "Banner"}
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{banner.title || "Untitled banner"}</p>
                  {banner.link && <p className="text-xs text-gray-500 truncate">{banner.link}</p>}
                </div>
                <div className="flex gap-1">
                  <Button type="button" variant="outline" size="sm" disabled={idx === 0} onClick={() => moveBanner(idx, -1)}>
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
            )})}
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center py-12 bg-gray-50 rounded-xl">
          No banners yet. Upload images to replace the default homepage hero.
        </p>
      )}
    </div>
  )
}
