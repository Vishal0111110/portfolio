'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-[var(--color-dark-gray)] border border-[var(--color-medium-gray)] animate-pulse" />
    )
  }

  return (
    <div
      aria-label="Dark mode"
      title="Dark mode"
      className="w-9 h-9 rounded-lg bg-[var(--color-dark-gray)] border border-[var(--color-medium-gray)] text-[var(--color-off-white)] flex items-center justify-center min-h-[36px] min-w-[36px]"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </div>
  )
}
