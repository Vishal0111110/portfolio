'use client'

import { useState, useEffect } from 'react'

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'achievements', label: 'Achievements & Certifications' }
  ]

  useEffect(() => {
    const handleScroll = () => {
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
    <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-md border-b border-gray-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-white font-bold text-lg">Portfolio</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`transition-colors duration-300 ${
                  activeSection === section.id
                    ? 'text-purple-400 border-b-2 border-purple-400 pb-1'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 0 1 1.414 1.414l-4.828 4.829 4.828 4.829z"/>
                ) : (
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 1 0 0-2H4a1 1 0 0 0 0 2zm0 6h16a1 1 0 0 0 0-2H4a1 1 0 0 0 0 2z"/>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur-md rounded-md mt-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-300 ${
                    activeSection === section.id
                      ? 'text-purple-400 bg-purple-600/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
