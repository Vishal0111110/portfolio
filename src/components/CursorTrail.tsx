'use client'

import { useEffect, useRef, useState } from 'react'

import { useCursorTrailAllowed } from '@/hooks/useCursorTrailAllowed'

interface TrailDot {
  x: number
  y: number
  id: number
  opacity: number
}

const TRAIL_DOT_INTERVAL_MS = 48
const TRAIL_MAX_DOTS = 10
const TRAIL_DOT_OPACITY = 0.38

export default function CursorTrail() {
  const trailAllowed = useCursorTrailAllowed()

  const [dots, setDots] = useState<TrailDot[]>([])
  const dotIdRef = useRef(0)
  const lastDotTime = useRef(0)
  const rafId = useRef<number | undefined>(undefined)
  const isActive = useRef(true)

  useEffect(() => {
    if (!trailAllowed) {
      setDots([])
      return
    }

    isActive.current = true

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastDotTime.current > TRAIL_DOT_INTERVAL_MS) {
        lastDotTime.current = now
        
        const newDot: TrailDot = {
          x: e.clientX,
          y: e.clientY,
          id: dotIdRef.current++,
          opacity: 1
        }
        
        setDots(prev => [...prev, newDot].slice(-TRAIL_MAX_DOTS))
      }
    }

    const handleMouseLeave = () => {
      setDots([])
    }

    // Animation loop for fading dots
    const animate = () => {
      if (!isActive.current) return
      
      setDots(prev => {
        if (prev.length === 0) return prev
        
        const updated = prev
          .map(dot => ({ ...dot, opacity: dot.opacity - 0.06 }))
          .filter(dot => dot.opacity > 0)
        
        // Only update if there are changes
        if (updated.length !== prev.length || 
            updated.some((dot, i) => dot.opacity !== prev[i].opacity)) {
          return updated
        }
        return prev
      })
      
      rafId.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.body.addEventListener('mouseleave', handleMouseLeave)
    rafId.current = requestAnimationFrame(animate)

    return () => {
      isActive.current = false
      window.removeEventListener('mousemove', handleMouseMove)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [trailAllowed])

  if (!trailAllowed || dots.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {dots.map((dot, index) => {
        // Calculate size based on position in trail (newer = larger)
        const size = 4 + (index / dots.length) * 4
        
        return (
          <div
            key={dot.id}
            className="absolute rounded-full bg-[var(--color-accent-gray)]"
            style={{
              left: dot.x - size / 2,
              top: dot.y - size / 2,
              width: size,
              height: size,
              opacity: dot.opacity * TRAIL_DOT_OPACITY,
              transform: `scale(${dot.opacity})`,
              transition: 'none'
            }}
          />
        )
      })}
    </div>
  )
}
