'use client'

import { useState, useEffect } from 'react'
import useKonamiCode from '@/hooks/useKonamiCode'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cpFacts, printConsoleEasterEgg } from '@/data/cpFacts'

export default function KonamiEasterEgg() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [showEffect, setShowEffect] = useState(false)
  const [randomFact, setRandomFact] = useState(cpFacts[0])

  useEffect(() => {
    // Print console easter egg on mount
    printConsoleEasterEgg()
  }, [])

  useKonamiCode(() => {
    setShowEffect(true)
    setRandomFact(cpFacts[Math.floor(Math.random() * cpFacts.length)])
    
    // Hide after 5 seconds
    setTimeout(() => {
      setShowEffect(false)
    }, 5000)
  })

  if (!showEffect) return null

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-[var(--color-white)] opacity-20 ${prefersReducedMotion ? '' : 'motion-safe:animate-pulse'}`}
        aria-hidden
      />

      {!prefersReducedMotion ? (
        <div className="absolute inset-0 overflow-hidden opacity-10" aria-hidden>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-[var(--color-accent-gray)] text-xs tracking-[0.04em] motion-safe:animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              {['01', 'DP', 'O(n)', 'Tree', 'Graph', 'AC', 'WA', 'TLE'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>
      ) : null}

      <div
        className={`relative bg-[var(--color-off-black)] border border-[var(--color-light-gray)] rounded-lg p-8 max-w-md mx-4 shadow-2xl ${
          prefersReducedMotion ? '' : 'motion-safe:animate-in motion-safe:zoom-in motion-safe:duration-500'
        }`}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">🎮</div>
          <h2 className="text-xl font-bold text-[var(--color-white)] mb-2">
            Konami Code Activated!
          </h2>
          <p className="text-sm text-[var(--color-accent-gray)] mb-4">
            You found the secret! Here&apos;s a CP fact for you:
          </p>
          
          <div className="bg-[var(--color-dark-gray)] rounded p-4 text-left">
            <h3 className="text-[var(--color-white)] font-semibold mb-1">
              {randomFact.topic}
            </h3>
            <p className="text-[var(--color-off-white)] text-sm mb-2">
              {randomFact.fact}
            </p>
            <p className="text-[var(--color-accent-gray)] text-xs italic">
              {randomFact.detail}
            </p>
          </div>

          <p className="text-xs text-[var(--color-accent-gray)] mt-4">
            Try the terminal (Ctrl+`) and type &quot;secret&quot; or &quot;matrix&quot;
          </p>
        </div>
      </div>
    </div>
  )
}
