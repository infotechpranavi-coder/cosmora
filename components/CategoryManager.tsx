"use client"

import { useState } from "react"
import { Plus, Trash2, Edit, RefreshCw, PackagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCategories, Category } from "@/hooks/useCategories"
import { SHOP_NAV } from "@/lib/shop-nav"

export default function CategoryManager() {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory, fetchCategories } =
    useCategories()
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editSubCategories, setEditSubCategories] = useState<string[]>([])
  const [newSubCategory, setNewSubCategory] = useState("")
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    try {
      await createCategory(newCategoryName.trim(), [])
      setNewCategoryName("")
    } catch (err) {
      console.error(err)
    }
  }

  const startEditing = (category: Category) => {
    setEditingId(category._id)
    setEditName(category.name)
    setEditSubCategories(category.subCategories)
  }

  const handleUpdate = async () => {
    if (!editingId || !editName.trim()) return
    try {
      await updateCategory(editingId, editName.trim(), editSubCategories)
      setEditingId(null)
    } catch (err) {
      console.error(err)
    }
  }

  const addSubCategory = () => {
    if (!newSubCategory.trim()) return
    if (!editSubCategories.includes(newSubCategory.trim())) {
      setEditSubCategories([...editSubCategories, newSubCategory.trim()])
    }
    setNewSubCategory("")
  }

  const removeSubCategory = (sub: string) => {
    setEditSubCategories(editSubCategories.filter((s) => s !== sub))
  }

  const runSetup = async (action: "sync-categories" | "seed-products" | "setup") => {
    setBusy(true)
    setMessage("")
    try {
      const res = await fetch("/api/shop-catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || "Failed")
      await fetchCategories()
      if (action === "sync-categories") {
        setMessage("Shop categories synced: Clothing, Bags, Accessories with subcategories.")
      } else if (action === "seed-products") {
        setMessage(
          `Seeded ${data.data.seeded.length} new products. Updated ${data.data.updatedExisting.length} existing names to the new category tree.`
        )
      } else {
        setMessage(
          `Synced categories and seeded ${data.data.seeded.length} products. Existing matching names were remapped.`
        )
      }
    } catch (err: any) {
      setMessage(err.message || "Setup failed")
    } finally {
      setBusy(false)
    }
  }

  const ordered = [...categories].sort((a, b) => {
    const order = SHOP_NAV.map((g) => g.name)
    const ai = order.indexOf(a.name)
    const bi = order.indexOf(b.name)
    if (ai === -1 && bi === -1) return a.name.localeCompare(b.name)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Apparel Categories</h1>
          <p className="text-sm text-gray-500 mt-1">
            Main categories match the navbar: Clothing, Bags, Accessories. Assign products to a main category, then a subcategory.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => runSetup("sync-categories")}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync navbar categories
          </Button>
          <Button
            type="button"
            className="bg-[#14243D] hover:bg-[#1E3A60] text-white"
            disabled={busy}
            onClick={() => runSetup("setup")}
          >
            <PackagePlus className="w-4 h-4 mr-2" />
            {busy ? "Working…" : "Sync + seed sample products"}
          </Button>
        </div>
      </div>

      {message && (
        <div className="rounded-lg border border-[#E8D5B0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#14243D]">
          {message}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <Input
            placeholder="Add extra type (optional)"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit" className="bg-[#C49A52] hover:bg-[#243B5A]">
            <Plus className="w-4 h-4 mr-2" />
            Add Type
          </Button>
        </form>
      </div>

      {error && <div className="text-red-500">{error}</div>}
      {loading && <p className="text-sm text-gray-500">Loading categories…</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ordered.map((category) => (
          <div key={category._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {editingId === category._id ? (
              <div className="space-y-4">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Category Name"
                />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Sub-categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {editSubCategories.map((sub) => (
                      <span
                        key={sub}
                        className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-sm"
                      >
                        {sub}
                        <button
                          type="button"
                          onClick={() => removeSubCategory(sub)}
                          className="ml-1 text-gray-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="New sub-category"
                      value={newSubCategory}
                      onChange={(e) => setNewSubCategory(e.target.value)}
                      className="text-sm"
                    />
                    <Button size="sm" onClick={addSubCategory} type="button">
                      Add
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleUpdate}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(category)}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCategory(category._id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase">Sub-categories</p>
                  <div className="flex flex-wrap gap-1">
                    {category.subCategories.length > 0 ? (
                      category.subCategories.map((sub) => (
                        <span
                          key={sub}
                          className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs"
                        >
                          {sub}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">None</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
