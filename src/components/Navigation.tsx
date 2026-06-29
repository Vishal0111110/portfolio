'use client'

import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import { sections } from '@/data/navigation'

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      const sectionElements = sections.map(section => ({
        id: section.id,
        offset: document.getElementById(section.id)?.offsetTop || 0
      }))

      const scrollPosition = window.scrollY + 100

      const current = sectionElements.reverse().find(section =>
        scrollPosition >= section.offset
      )

      if (current) {
        setActiveSection(current.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Main Navigation */}
      <nav 
        role="navigation" 
        aria-label="Main navigation"
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-[var(--color-off-black)]/82 backdrop-blur-xl border-b border-[var(--color-medium-gray)]/70' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 safe-area-top">
            {/* Logo with dot pattern */}
            <a 
              href="#home" 
              onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
              className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-white)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-off-black)] rounded-lg"
              aria-label="Go to home section"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--color-dark-gray)] border border-[var(--color-medium-gray)]/80 flex items-center justify-center dot-matrix-subtle">
                <span className="text-[var(--color-white)] font-medium text-sm tracking-[0.01em]">VB</span>
              </div>
              <span className="font-display text-[var(--color-white)] font-normal text-lg tracking-tight hidden sm:block">
                Vishal
              </span>
            </a>

            {/* Desktop Navigation - Minimalist */}
            <div className="hidden md:flex items-center gap-1" role="menubar">
              <div className="mr-2">
                <ThemeToggle />
              </div>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  role="menuitem"
                  aria-current={activeSection === section.id ? 'page' : undefined}
                  className={`relative px-3.5 py-2 text-xs uppercase tracking-[0.1em] transition-all duration-300 rounded-lg group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-white)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-off-black)] ${
                    activeSection === section.id
                      ? 'text-[var(--color-white)] bg-[var(--color-dark-gray)]/80'
                      : 'text-[var(--color-accent-gray)] hover:text-[var(--color-white)] hover:bg-[var(--color-dark-gray)]/45'
                  }`}
                >
                  {section.label}
                  {/* Active indicator dot */}
                  {activeSection === section.id && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--color-nothing-red)] rounded-full" aria-hidden="true"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Mobile menu button - Minimalist */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="p-2 rounded-lg text-[var(--color-accent-gray)] hover:text-[var(--color-white)] hover:bg-[var(--color-dark-gray)]/70 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-white)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-off-black)] min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation - Monochromatic */}
          {isMenuOpen && (
            <div 
              id="mobile-menu"
              role="menu"
              aria-label="Mobile navigation"
              className="md:hidden absolute top-full left-0 right-0 bg-[var(--color-off-black)]/88 backdrop-blur-xl border-b border-[var(--color-medium-gray)]/70 safe-area-left safe-area-right"
            >
              <div className="px-4 py-3 space-y-1">
                {/* Theme Toggle in Mobile Menu */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-medium-gray)]/70 mb-2">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.12em] text-[var(--color-accent-gray)]">Theme</span>
                  <ThemeToggle />
                </div>
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    role="menuitem"
                    aria-current={activeSection === section.id ? 'page' : undefined}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-xs uppercase tracking-[0.1em] transition-all duration-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-white)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-off-black)] min-h-[44px] ${
                      activeSection === section.id
                        ? 'text-[var(--color-white)] bg-[var(--color-dark-gray)]/80'
                        : 'text-[var(--color-accent-gray)] hover:text-[var(--color-white)] hover:bg-[var(--color-dark-gray)]/45'
                    }`}
                  >
                    {/* Section number indicator */}
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      activeSection === section.id
                        ? 'bg-[var(--color-nothing-red)] text-[var(--color-white)]'
                        : 'bg-[var(--color-medium-gray)] text-[var(--color-accent-gray)]'
                    }`} aria-hidden="true">
                      {index + 1}
                    </span>
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Section Indicator Dots - Right Side */}
      <nav 
        className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3" 
        aria-label="Section navigation"
      >
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            aria-label={`Go to ${section.label} section`}
            aria-current={activeSection === section.id ? 'true' : undefined}
            className="group relative flex items-center justify-end min-h-[44px] min-w-[44px] p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-white)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-off-black)] rounded-full"
          >
            {/* Tooltip */}
            <span className="absolute right-8 px-2 py-1 bg-[var(--color-dark-gray)] border border-[var(--color-medium-gray)] rounded text-xs text-[var(--color-off-white)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {section.label}
            </span>
            
            {/* Dot */}
            <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === section.id
                ? 'bg-[var(--color-white)] scale-125'
                : 'bg-[var(--color-medium-gray)] hover:bg-[var(--color-accent-gray)]'
            }`} aria-hidden="true"></span>
          </button>
        ))}
      </nav>
    </>
  )
}
