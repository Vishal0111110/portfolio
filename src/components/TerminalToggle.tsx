'use client'

import { useState, useEffect } from 'react'

interface TerminalToggleProps {
  onToggle: () => void
  isOpen: boolean
}

export default function TerminalToggle({ onToggle, isOpen }: TerminalToggleProps) {
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    // Show keyboard shortcut hint after 2 seconds
    const timer = setTimeout(() => {
      setShowHint(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <button
      onClick={onToggle}
      className="fixed bottom-6 right-6 z-[var(--z-tooltip)] group"
      aria-label="Toggle terminal"
    >
      {/* Main Button */}
      <div className="relative">
        {/* Button Background with dot matrix pattern */}
        <div className="absolute inset-0 bg-[var(--color-dark-gray)] border border-[var(--color-medium-gray)] rounded-lg dot-matrix-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Button Content */}
        <div className="relative bg-[var(--color-off-black)] border border-[var(--color-medium-gray)] rounded-lg p-3 shadow-lg transition-all duration-300 hover:scale-110 hover:border-[var(--color-accent-gray)] group-hover:shadow-xl">
          {/* Terminal Icon */}
          <svg
            className="w-6 h-6 text-[var(--color-accent-gray)] transition-colors duration-300 group-hover:text-[var(--color-white)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>

          {/* Status Indicator */}
          {isOpen && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Keyboard Shortcut Hint */}
        {showHint && !isOpen && (
          <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-[var(--color-dark-gray)] border border-[var(--color-medium-gray)] rounded text-xs text-[var(--color-accent-gray)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Ctrl + `
          </div>
        )}
      </div>

      {/* Ripple Effect on Click */}
      <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[var(--color-accent-gray)] opacity-0 group-active:opacity-10 transition-opacity duration-200"></div>
      </div>
    </button>
  )
}
