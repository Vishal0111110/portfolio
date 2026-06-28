'use client'

import { useEffect, useRef, type MutableRefObject } from 'react'

export type ScrollDirection = 1 | -1

export interface ScrollVelocityState {
  /** Smoothed 0–1 throttle — drives warp speed through the star tunnel */
  warpSpeed: number
  direction: ScrollDirection
}

const SCROLL_GAIN = 0.0032
const MOMENTUM_DECAY = 0.962
const WARP_LERP = 0.05
const MAX_MOMENTUM = 1.3
const IDLE_CUTOFF_MS = 72
const MOMENTUM_THRESHOLD = 0.008

/**
 * Spacecraft-throttle scroll coupling: scroll adds momentum, momentum decays smoothly.
 * Returns a stable ref for R3F useFrame (delta-time particle motion, not per-frame offsets).
 */
export function useScrollVelocity(enabled = true): MutableRefObject<ScrollVelocityState> {
  const stateRef = useRef<ScrollVelocityState>({ warpSpeed: 0, direction: 1 })

  useEffect(() => {
    if (!enabled) {
      stateRef.current = { warpSpeed: 0, direction: 1 }
      return
    }

    let lastScrollY = window.scrollY
    let lastScrollTime = performance.now()
    let momentum = 0
    let warpSpeed = 0
    let direction: ScrollDirection = 1
    let rafId = 0

    const onScroll = () => {
      const now = performance.now()
      const deltaY = window.scrollY - lastScrollY

      if (Math.abs(deltaY) > 0.8) {
        direction = deltaY > 0 ? 1 : -1
        momentum += deltaY * SCROLL_GAIN
        momentum = Math.max(-MAX_MOMENTUM, Math.min(MAX_MOMENTUM, momentum))
      }

      lastScrollY = window.scrollY
      lastScrollTime = now
    }

    const tick = () => {
      const idleMs = performance.now() - lastScrollTime

      if (idleMs > IDLE_CUTOFF_MS) {
        momentum *= MOMENTUM_DECAY
        if (Math.abs(momentum) < MOMENTUM_THRESHOLD) momentum = 0
      }

      const targetWarp = Math.min(Math.abs(momentum), 1)
      warpSpeed += (targetWarp - warpSpeed) * WARP_LERP
      if (warpSpeed < 0.002) warpSpeed = 0

      if (momentum !== 0) {
        direction = momentum > 0 ? 1 : -1
      }

      stateRef.current = { warpSpeed, direction }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
      stateRef.current = { warpSpeed: 0, direction: 1 }
    }
  }, [enabled])

  return stateRef
}
