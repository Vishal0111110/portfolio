'use client'

import { useState, useEffect } from 'react'

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / documentHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', updateScrollProgress)
    updateScrollProgress() // Initial call

    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-600 z-50">
      <div
        className="h-full bg-[var(--color-white)] transition-all duration-150 ease-out motion-reduce:transition-none"
        style={{ width: `${Math.min(scrollProgress, 100)}%` }}
      ></div>
    </div>
  )
}
