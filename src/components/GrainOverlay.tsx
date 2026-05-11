'use client'

import { useEffect, useState } from 'react'

export default function GrainOverlay() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{
        opacity: 0.03,
        mixBlendMode: 'overlay',
      }}
    >
      <svg className="w-full h-full">
        <filter id="portfolio-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="saturate"
            values="0"
          />
        </filter>
        <rect width="100%" height="100%" fill="white" filter="url(#portfolio-noise)" />
      </svg>
    </div>
  )
}
