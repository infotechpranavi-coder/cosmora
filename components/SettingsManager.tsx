"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Settings, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { StoreSettings } from "@/lib/store-settings"
import { DEFAULT_SETTINGS } from "@/lib/store-settings"

export default function SettingsManager() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<StoreSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) setForm({ ...DEFAULT_SETTINGS, ...data.data })
      })
      .catch(() => {
        toast({
          title: "Could not load settings",
          description: "Using defaults.",
          variant: "destructive",
        })
      })
      .finally(() => setLoading(false))
  }, [toast])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-dashboard-admin': 'true',
        },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Save failed')
      } else if (data.data) {
        setForm({ ...DEFAULT_SETTINGS, ...data.data })
      }
      toast({
        title: "Settings saved",
        description: "Shipping and gift fees will apply on cart & checkout.",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Try again",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading settings...</div>
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-8 h-8 text-[#14243D]" />
          Print Shop Settings
        </h1>
        <p className="text-gray-600 mt-2">
          Shipping and gift charges set here appear on the cart and checkout.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div>
          <Label htmlFor="shippingFee">Shipping fee (₹)</Label>
          <Input
            id="shippingFee"
            type="number"
            min={0}
            step="1"
            value={form.shippingFee}
            onChange={(e) => setForm((f) => ({ ...f, shippingFee: Number(e.target.value) || 0 }))}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Set 0 for free shipping always.</p>
        </div>

        <div>
          <Label htmlFor="freeShippingThreshold">Free shipping threshold (₹)</Label>
          <Input
            id="freeShippingThreshold"
            type="number"
            min={0}
            step="1"
            value={form.freeShippingThreshold}
            onChange={(e) =>
              setForm((f) => ({ ...f, freeShippingThreshold: Number(e.target.value) || 0 }))
            }
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Orders at or above this amount get free shipping. Set 0 to disable.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Checkbox
            id="giftEnabled"
            checked={form.giftEnabled}
            onCheckedChange={(checked) => setForm((f) => ({ ...f, giftEnabled: checked === true }))}
          />
          <Label htmlFor="giftEnabled">Enable gift packaging for merch orders</Label>
        </div>

        <div>
          <Label htmlFor="giftFee">Gift packaging fee (₹)</Label>
          <Input
            id="giftFee"
            type="number"
            min={0}
            step="1"
            value={form.giftFee}
            onChange={(e) => setForm((f) => ({ ...f, giftFee: Number(e.target.value) || 0 }))}
            className="mt-1"
            disabled={!form.giftEnabled}
          />
        </div>

        <div>
          <Label htmlFor="taxRate">Tax rate (%)</Label>
          <Input
            id="taxRate"
            type="number"
            min={0}
            max={100}
            step="1"
            value={Math.round((form.taxRate || 0.18) * 100)}
            onChange={(e) =>
              setForm((f) => ({ ...f, taxRate: (Number(e.target.value) || 0) / 100 }))
            }
            className="mt-1"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#14243D] hover:bg-[#243B5A] text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
