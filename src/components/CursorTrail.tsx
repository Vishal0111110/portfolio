'use client'

import { useEffect, useRef, useState } from 'react'

interface TrailDot {
  x: number
  y: number
  id: number
  opacity: number
}

export default function CursorTrail() {
  const [dots, setDots] = useState<TrailDot[]>([])
  const dotIdRef = useRef(0)
  const mousePos = useRef({ x: 0, y: 0 })
  const lastDotTime = useRef(0)
  const rafId = useRef<number | undefined>(undefined)
  const isActive = useRef(true)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Check if touch device
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkTouch()

    // Don't show trail on touch devices
    if (isTouchDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      
      const now = Date.now()
      // Throttle to one dot every 30ms for performance
      if (now - lastDotTime.current > 30) {
        lastDotTime.current = now
        
        const newDot: TrailDot = {
          x: e.clientX,
          y: e.clientY,
          id: dotIdRef.current++,
          opacity: 1
        }
        
        setDots(prev => {
          // Keep only last 15 dots for performance
          const newDots = [...prev, newDot].slice(-15)
          return newDots
        })
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
          .map(dot => ({ ...dot, opacity: dot.opacity - 0.05 }))
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
  }, [isTouchDevice])

  // Don't render on touch devices or if no dots
  if (isTouchDevice || dots.length === 0) return null

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
              opacity: dot.opacity * 0.6,
              transform: `scale(${dot.opacity})`,
              transition: 'none'
            }}
          />
        )
      })}
    </div>
  )
}
