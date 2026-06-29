"use client"

import React, { useEffect, useRef } from 'react'
import { TILT_MAX_DEG, TILT_PERSPECTIVE } from '@/lib/cardHover'

type Props = {
  className?: string
  children: React.ReactNode
}

export default function TiltCard({ className = '', children }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const supportsCoarse = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (supportsCoarse) return // disable tilt on coarse pointers

    let raf = 0

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      const dx = (px - 0.5) * 2 // -1 .. 1
      const dy = (py - 0.5) * 2
      const rotateY = +(dx * TILT_MAX_DEG).toFixed(2)
      const rotateX = +(-dy * TILT_MAX_DEG).toFixed(2)
      const tx = Math.round(px * 100)
      const ty = Math.round(py * 100)

      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (!el) return
        el.style.transform = `perspective(${TILT_PERSPECTIVE}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
        el.style.setProperty('--tilt-highlight-x', `${tx}%`)
        el.style.setProperty('--tilt-highlight-y', `${ty}%`)
      })
    }

    const onPointerLeave = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (!el) return
        el.style.transform = `perspective(${TILT_PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`
        el.style.setProperty('--tilt-highlight-x', `50%`)
        el.style.setProperty('--tilt-highlight-y', `50%`)
      })
    }

    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerleave', onPointerLeave)

    // Ensure pointer events are captured (in case children are interactive)
    el.style.willChange = 'transform'
    el.style.transition = 'transform 240ms cubic-bezier(.2,.9,.2,1)'

    return () => {
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerleave', onPointerLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [supportsCoarse])

  return (
    <div
      ref={ref}
      className={className}
      // ensure hover highlight is clipped to the card root
      style={{
        position: 'relative',
        overflow: 'hidden',
        ['--tilt-highlight-x' as any]: '50%',
        ['--tilt-highlight-y' as any]: '50%',
      }}
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(circle at var(--tilt-highlight-x) var(--tilt-highlight-y), rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 10%, transparent 40%)',
          transition: 'background-position 240ms cubic-bezier(.2,.9,.2,1), opacity 240ms',
        }}
      />
    </div>
  )
}
