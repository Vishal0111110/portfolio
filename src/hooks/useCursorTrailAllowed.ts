'use client'

import { useEffect, useState } from 'react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Cursor trail only when motion is OK, viewport is desktop-ish,
 * and primary pointer looks like a mouse (not touch-first).
 */
export function useCursorTrailAllowed(): boolean {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const compute = () => {
      if (prefersReducedMotion) {
        setAllowed(false)
        return
      }
      const fine = window.matchMedia('(pointer: fine)').matches
      const wide = window.matchMedia('(min-width: 768px)').matches
      setAllowed(fine && wide)
    }

    compute()

    const mqFine = window.matchMedia('(pointer: fine)')
    const mqWide = window.matchMedia('(min-width: 768px)')

    mqFine.addEventListener('change', compute)
    mqWide.addEventListener('change', compute)
    window.addEventListener('resize', compute)

    return () => {
      mqFine.removeEventListener('change', compute)
      mqWide.removeEventListener('change', compute)
      window.removeEventListener('resize', compute)
    }
  }, [prefersReducedMotion])

  return allowed
}
