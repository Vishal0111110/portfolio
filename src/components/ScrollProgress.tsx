'use client'

import { useState, useEffect } from 'react'
import { sections } from '@/data/navigation'

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('home')
  const [sectionOffsets, setSectionOffsets] = useState<{ id: string; offset: number }[]>([])

  useEffect(() => {
    const calculateSectionOffsets = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const offsets = sections.map(section => {
        const element = document.getElementById(section.id)
        const offsetTop = element?.offsetTop || 0
        return {
          id: section.id,
          offset: (offsetTop / documentHeight) * 100
        }
      })
      setSectionOffsets(offsets)
    }

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / documentHeight) * 100
      setScrollProgress(progress)

      // Calculate active section
      const scrollPosition = window.scrollY + 100
      const current = sections
        .map(section => ({
          id: section.id,
          offset: document.getElementById(section.id)?.offsetTop || 0
        }))
        .reverse()
        .find(section => scrollPosition >= section.offset)

      if (current) {
        setActiveSection(current.id)
      }
    }

    calculateSectionOffsets()
    window.addEventListener('scroll', updateScrollProgress)
    window.addEventListener('resize', calculateSectionOffsets)
    updateScrollProgress()

    return () => {
      window.removeEventListener('scroll', updateScrollProgress)
      window.removeEventListener('resize', calculateSectionOffsets)
    }
  }, [])

  // Find the current and previous section for the active segment
  const activeIndex = sectionOffsets.findIndex(s => s.id === activeSection)
  const previousOffset = activeIndex > 0 ? sectionOffsets[activeIndex - 1].offset : 0
  const currentOffset = sectionOffsets[activeIndex]?.offset || 0
  const nextOffset = activeIndex < sectionOffsets.length - 1 ? sectionOffsets[activeIndex + 1].offset : 100

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-600 z-50">
      {/* Base white progress bar */}
      <div
        className="h-full bg-[var(--color-white)] transition-all duration-150 ease-out motion-reduce:transition-none"
        style={{ width: `${Math.min(scrollProgress, 100)}%` }}
      ></div>

      {/* Section markers */}
      {sectionOffsets.map((section) => (
        <div
          key={section.id}
          className="absolute top-0 w-0.5 h-1 bg-[var(--color-medium-gray)]/60"
          style={{ left: `${section.offset}%` }}
          aria-hidden="true"
        >
          {/* 2px dot on top of marker */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-[var(--color-medium-gray)] rounded-full" />
        </div>
      ))}
    </div>
  )
}
