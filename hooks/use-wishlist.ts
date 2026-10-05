"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

const STORAGE_KEY = "cosmora_wishlist"

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setWishlist(JSON.parse(stored))
      }
    } catch (e) {
      console.error("Failed to load wishlist", e)
    }
  }, [])

  const isWishlisted = useCallback(
    (id?: string) => {
      if (!id) return false
      return wishlist.includes(id)
    },
    [wishlist]
  )

  const toggleWishlist = useCallback(
    (item: { id?: string; name: string }) => {
      if (!item.id) return
      setWishlist((prev) => {
        const exists = prev.includes(item.id!)
        const updated = exists ? prev.filter((i) => i !== item.id) : [...prev, item.id!]
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        } catch (e) {
          console.error("Failed to save wishlist", e)
        }

        if (!exists) {
          toast({
            title: "Saved to Wishlist ❤️",
            description: `${item.name} added to your wishlist.`,
            duration: 2500,
          })
        } else {
          toast({
            title: "Removed from Wishlist",
            description: `${item.name} removed from your wishlist.`,
            duration: 2000,
          })
        }

        return updated
      })
    },
    [toast]
  )

  return { wishlist, isWishlisted, toggleWishlist }
}
