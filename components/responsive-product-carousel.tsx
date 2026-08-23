"use client"

import { ReactNode } from "react"

type ResponsiveProductCarouselProps = {
  children: ReactNode
  className?: string
}

/** Horizontal scroll carousel — works on mobile, tablet, and desktop without fixed pixel transforms */
export default function ResponsiveProductCarousel({ children, className = "" }: ResponsiveProductCarouselProps) {
  return (
    <div className={`-mx-4 px-4 sm:mx-0 sm:px-0 ${className}`}>
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth">
        {children}
      </div>
    </div>
  )
}

export function CarouselItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`snap-start shrink-0 w-[85vw] sm:w-72 md:w-80 ${className}`}>
      {children}
    </div>
  )
}

export function FeaturedCarouselItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`snap-start shrink-0 w-[90vw] sm:w-80 md:w-96 ${className}`}>
      {children}
    </div>
  )
}
