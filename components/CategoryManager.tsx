"use client"

import { useState } from 'react'
import { Plus, Trash2, Edit, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCategories, Category } from '@/hooks/useCategories'

export default function CategoryManager() {
    const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategories()
    const [newCategoryName, setNewCategoryName] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')
    const [editSubCategories, setEditSubCategories] = useState<string[]>([])
    const [newSubCategory, setNewSubCategory] = useState('')

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCategoryName.trim()) return
        try {
            await createCategory(newCategoryName.trim(), [])
            setNewCategoryName('')
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
        setNewSubCategory('')
    }

    const removeSubCategory = (sub: string) => {
        setEditSubCategories(editSubCategories.filter(s => s !== sub))
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Apparel Categories</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleAddCategory} className="flex gap-4">
                    <Input
                        placeholder="e.g. Round Neck Tees, Hoodies, Polos"
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
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
                                            <span key={sub} className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-sm">
                                                {sub}
                                                <button onClick={() => removeSubCategory(sub)} className="ml-1 text-gray-400 hover:text-red-500">
                                                    <X className="w-3 h-3" />
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
                                        <Button size="sm" onClick={addSubCategory} type="button">Add</Button>
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                                    <Button size="sm" onClick={handleUpdate}>Save</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => startEditing(category)} className="text-gray-400 hover:text-blue-500">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => deleteCategory(category._id)} className="text-gray-400 hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 uppercase">Sub-categories</p>
                                    <div className="flex flex-wrap gap-1">
                                        {category.subCategories.length > 0 ? (
                                            category.subCategories.map(sub => (
                                                <span key={sub} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs">
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
