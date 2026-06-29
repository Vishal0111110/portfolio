'use client'

import type { ReactNode } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

type ChapterSectionProps = {
  sectionId: string
  titleId: string
  eyebrow: string
  title: string
  blurb?: string
  /** Narrow rail on lg; full-width stack on small screens */
  children: ReactNode
}

export default function ChapterSection({
  sectionId,
  titleId,
  eyebrow,
  title,
  blurb,
  children,
}: ChapterSectionProps) {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.12, triggerOnce: true })

  return (
    <section
      ref={ref}
      id={sectionId}
      aria-labelledby={titleId}
      className="relative z-10 px-4 py-16 sm:py-20 max-w-5xl mx-auto safe-area-left safe-area-right"
    >
      <div className="lg:grid lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] lg:gap-x-12 xl:gap-x-16 lg:items-start">
        <header className={`mb-9 lg:mb-0 lg:sticky lg:top-24 lg:self-start animate-slide-up ${isInView ? 'is-visible' : ''}`}>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-nothing-red)] mb-2">{eyebrow}</p>
          <h2 id={titleId} className="font-display text-2xl sm:text-3xl font-normal tracking-tight leading-[1.15] text-white text-left">
            {title}
          </h2>
          {blurb ? (
            <p className="mt-3 text-xs text-[var(--color-accent-gray)] leading-[1.6] max-w-[14rem] hidden lg:block">{blurb}</p>
          ) : null}
        </header>
        <div className={`min-w-0 animate-slide-up ${isInView ? 'is-visible' : ''}`}>{children}</div>
      </div>
    </section>
  )
}
