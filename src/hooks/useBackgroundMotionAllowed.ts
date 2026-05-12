'use client'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/** True when 3D background may animate (IntersectionObserver still gates off-screen pause). */
export function useBackgroundMotionAllowed(): boolean {
  return !usePrefersReducedMotion()
}
