'use client'

import { useState, useEffect, useCallback } from 'react'

// Konami code sequence: ↑↑↓↓←→←→BA (defined outside component to be stable)
const konamiSequence = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
] as const

export default function useKonamiCode(callback: () => void) {
  const [konamiProgress, setKonamiProgress] = useState(0)
  const [isActivated, setIsActivated] = useState(false)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isActivated) return

      const expectedKey = konamiSequence[konamiProgress]
      const pressedKey = e.key.toLowerCase()

      if (pressedKey === expectedKey.toLowerCase()) {
        const newProgress = konamiProgress + 1
        setKonamiProgress(newProgress)

        // Show progress in console for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log(`Konami progress: ${newProgress}/${konamiSequence.length}`)
        }

        if (newProgress === konamiSequence.length) {
          setIsActivated(true)
          callback()
          // Reset after 3 seconds
          setTimeout(() => {
            setKonamiProgress(0)
            setIsActivated(false)
          }, 3000)
        }
      } else {
        // Reset if wrong key pressed
        if (konamiProgress > 0) {
          setKonamiProgress(0)
          if (process.env.NODE_ENV === 'development') {
            console.log('Konami code reset - wrong key pressed')
          }
        }
      }
    },
    [konamiProgress, callback, isActivated]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return { konamiProgress, isActivated }
}
