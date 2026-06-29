"use client"
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import { resumeData } from '@/data/resume'

import Footer from '@/components/Footer'

import ScrollProgress from '@/components/ScrollProgress'

import TerminalToggle from '@/components/TerminalToggle'

import CursorTrail from '@/components/CursorTrail'

import KonamiEasterEgg from '@/components/KonamiEasterEgg'

import { getGreeting } from '@/utils/greetings'

import { printConsoleEasterEgg } from '@/data/cpFacts'

import PWAInstallPrompt from '@/components/PWAInstallPrompt'

import { performanceMonitor } from '@/utils/performance'

import ExperienceSection from '@/components/ExperienceSection'

import MethodSection from '@/components/MethodSection'

import ProjectSection from '@/components/ProjectSection'
import TiltCard from '@/components/TiltCard'

import { CARD_HOVER } from '@/lib/cardHover'

import { useParallax } from '@/hooks/useScrollAnimation'

import { useBackgroundMotionAllowed } from '@/hooks/useBackgroundMotionAllowed'



// Dynamic imports for heavy components - Step 5.1 & 5.2

const Terminal = dynamic(() => import('@/components/Terminal'), {
  ssr: false,
  loading: () => null,
})


const Background = dynamic(() => import('@/components/Background'), {
  ssr: false,
  loading: () => null,
})


const GrainOverlay = dynamic(() => import('@/components/GrainOverlay'), {
  ssr: false,
  loading: () => null,
})


const ContactPopup = dynamic(() => import('@/components/ContactPopup'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
    </div>
  ),
})


const SKILL_TIER_KEYS = ['dailyDrivers', 'comfortable', 'exploring'] as const

const UNIFIED_CARD_CLASS = 'glass-mono rounded-xl border border-[var(--color-medium-gray)]/60 p-4 sm:p-5'
const UNIFIED_CARD_INTERACTIVE_CLASS = `${UNIFIED_CARD_CLASS} ${CARD_HOVER} touch-manipulation mobile-card relative overflow-hidden`
const SECTION_LABEL_CLASS = 'text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.12em] text-[var(--color-accent-gray)] mb-2'
const SECTION_HEADING_CLASS = 'font-display text-2xl sm:text-3xl font-normal tracking-tight text-white mb-4'
const CARD_TITLE_CLASS = 'text-sm sm:text-base font-medium tracking-[0.005em] sm:tracking-[0.01em] text-[var(--color-off-white)]'
const CARD_SUBTEXT_CLASS = 'text-xs sm:text-sm text-[var(--color-accent-gray)] leading-[1.55]'

export default function Home() {

  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const [isTerminalOpen, setIsTerminalOpen] = useState(false)

  const [showAllAchievements, setShowAllAchievements] = useState(false)

  const [showAllProjects, setShowAllProjects] = useState(false)

  const motionAllowed = useBackgroundMotionAllowed()

  const geometricParallax = useParallax(motionAllowed ? 0.08 : 0)
  const dotMatrixParallax = useParallax(motionAllowed ? 0.04 : 0)
  const heroCircleParallax = useParallax(motionAllowed ? 0.12 : 0)



  // Console greeting on mount

  useEffect(() => {

    const greeting = getGreeting()

    console.log(

      `%c${greeting.text}\n%c${greeting.subtext || ''}`,

      'font-size: 20px; font-weight: bold; color: var(--color-white);',

      'font-size: 14px; color: var(--color-accent-gray);'

    )

    

    // Print console easter egg with hints

    setTimeout(() => {

      printConsoleEasterEgg()

    }, 1000)

    

    // Step 5.7: Initialize performance monitoring

    performanceMonitor.startMonitoring()

    

    // Report metrics after page load

    const reportMetrics = () => {

      setTimeout(() => {

        performanceMonitor.reportMetrics()

      }, 3000)

    }

    

    if (document.readyState === 'complete') {

      reportMetrics()

    } else {

      window.addEventListener('load', reportMetrics)

      return () => window.removeEventListener('load', reportMetrics)

    }

  }, [])



  return (

    <div className="min-h-screen text-[var(--color-off-white)] relative bg-[var(--color-off-black)]">

      {/* Skip to Content Link - Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-white)] focus:text-[var(--color-black)] focus:rounded-lg focus:font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-nothing-red)]"
      >
        Skip to main content
      </a>

      {/* Nothing OS Background Layers */}

      <div 
        ref={geometricParallax.ref}
        className="fixed inset-0 nothing-geometric opacity-20"
        style={{ 
          zIndex: -3,
          transform: motionAllowed ? `translateY(${geometricParallax.offset * -1}px)` : 'none',
          willChange: motionAllowed ? 'transform' : 'auto'
        }} 
      />

      <div 
        ref={dotMatrixParallax.ref}
        className="fixed inset-0 dot-matrix opacity-25"
        style={{ 
          zIndex: -2,
          transform: motionAllowed ? `translateY(${dotMatrixParallax.offset * -1}px)` : 'none',
          willChange: motionAllowed ? 'transform' : 'auto'
        }} 
      />

      

      {/* Nothing OS-inspired Grain Overlay */}

      <GrainOverlay />

      

      {/* Cursor Trail Effect */}

      <CursorTrail />

      

      {/* Konami Code Easter Egg */}

      <KonamiEasterEgg />

      <Navigation />

      <ScrollProgress />

      <Background />



      {/* Header/Hero - Nothing OS Inspired */}

      <header id="home" role="banner" className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-16 px-4 text-center overflow-hidden">

        {/* Nothing OS Signature Red Accent Elements - Desktop Only */}
        {/* Red dot - signature Nothing OS branding element (top-left) - Hidden on mobile */}
        <div className="fixed top-8 left-8 w-2 h-2 bg-[var(--color-nothing-red)] rounded-full hidden md:block" style={{ zIndex: 1000 }}></div>

        {/* Red line - signature Nothing OS branding element (top-right) - Hidden on mobile */}
        <div className="fixed top-8 right-8 w-12 h-0.5 bg-[var(--color-nothing-red)] hidden md:block" style={{ zIndex: 1000 }}></div>

        {/* Animated background elements - Monochromatic Dot Matrix */}

        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>

          <div className="absolute inset-0 dot-matrix opacity-20"></div>

          {/* Single subtle floating element */}

          <div 
            ref={heroCircleParallax.ref}
            className="absolute left-1/3 top-1/3 w-24 h-24 border border-[var(--color-medium-gray)]/10 rounded-full"
            style={{ 
              animation: 'float 8s ease-in-out infinite',
              transform: motionAllowed ? `translateY(${heroCircleParallax.offset * -1}px)` : 'none',
              willChange: motionAllowed ? 'transform' : 'auto'
            }}
          ></div>

        </div>



        {/* Main content with ultra-minimalist layout */}

        <div className="relative z-20 max-w-4xl w-full mx-auto">

          {/* Name with Nothing OS minimalism */}

          <div className="animate-in slide-in-from-top-8 duration-1000 delay-500 mb-16">

            <h1 

              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-[0.02em] text-white cursor-default"

              onMouseEnter={(e) => {

                e.currentTarget.style.color = 'var(--color-nothing-red)';

              }}

              onMouseLeave={(e) => {

                e.currentTarget.style.color = 'var(--color-white)';

              }}

            >

              {resumeData.name}

            </h1>

          </div>



          {/* Tagline */}

          <div className="animate-in slide-in-from-left-8 duration-1000 delay-700 mb-10">

            <p className="text-sm text-[var(--color-accent-gray)] tracking-[0.01em] max-w-xl mx-auto leading-[1.55]">

              {resumeData.tagline}

            </p>

          </div>

          {/* Metaphor cue — editorial spine (“broadcast / signal”) */}

          <div className="animate-in slide-in-from-bottom-8 duration-1000 delay-800 max-w-lg mx-auto mb-12 px-2">

            <p className="text-[10px] sm:text-xs uppercase tracking-[0.14em] text-[var(--color-nothing-red)] mb-2">{resumeData.metaphorCue.label}</p>

            <p className="text-xs sm:text-sm text-[var(--color-accent-gray)] leading-[1.6] font-light">{resumeData.metaphorCue.line}</p>

          </div>



          {/* Minimal summary with more negative space */}

          <div className="animate-in slide-in-from-right-8 duration-1000 delay-900 mb-10">

            <p className="text-base text-[var(--color-off-white)] leading-[1.65] max-w-2xl mx-auto text-center font-light">

              {resumeData.summary}

            </p>

          </div>

          {/* Minimal Contact Info */}

          <div className="flex flex-col items-center gap-3 mt-4 animate-in slide-in-from-bottom-8 duration-1000 delay-1100">

            <p className="text-sm sm:text-base font-sans font-medium text-[var(--color-accent-gray)] tracking-[0.1em] uppercase">

              {resumeData.location}

            </p>

          </div>



          {/* Refined Navigation - Nothing OS Style */}

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-8 md:gap-x-12 mt-[2.68rem] sm:mt-[3.57rem] md:mt-[4.46rem] px-4 animate-in slide-in-from-bottom-8 duration-1000 delay-1300">

            <div className="w-1 h-1 bg-[var(--color-nothing-red)] opacity-60"></div>

            <a 

              href={`https://www.linkedin.com/in/${resumeData.contact.linkedin}`}

              target="_blank"

              rel="noopener noreferrer"

              className="group relative text-xs text-[var(--color-accent-gray)] hover:text-[var(--color-nothing-red)] transition-all duration-300 tracking-[0.12em] uppercase font-light">

              <span className="relative z-10">LinkedIn</span>

              <div className="absolute bottom-0 left-0 w-0 h-px bg-[var(--color-nothing-red)] transition-all duration-300 group-hover:w-full"></div>

            </a>

            <div className="w-1 h-1 bg-[var(--color-nothing-red)] opacity-60"></div>

            <a 

              href={`https://codeforces.com/profile/${resumeData.contact.codeforces}`}

              target="_blank"

              rel="noopener noreferrer"

              className="group relative text-xs text-[var(--color-accent-gray)] hover:text-[var(--color-nothing-red)] transition-all duration-300 tracking-[0.12em] uppercase font-light">

              <span className="relative z-10">Codeforces</span>

              <div className="absolute bottom-0 left-0 w-0 h-px bg-[var(--color-nothing-red)] transition-all duration-300 group-hover:w-full"></div>

            </a>

            <div className="w-1 h-1 bg-[var(--color-nothing-red)] opacity-60"></div>

            <button 

              onClick={() => setIsPopupOpen(true)}

              className="group relative text-xs text-[var(--color-accent-gray)] hover:text-[var(--color-nothing-red)] transition-all duration-300 tracking-[0.12em] uppercase font-light">

              <span className="relative z-10">Contact</span>

              <div className="absolute bottom-0 left-0 w-0 h-px bg-[var(--color-nothing-red)] transition-all duration-300 group-hover:w-full"></div>

            </button>

            <div className="w-1 h-1 bg-[var(--color-nothing-red)] opacity-60"></div>

            <a 

              href="https://drive.google.com/file/d/1ZiK0D0uLYT3gWX7uJs23-PLXt8FWjhTa/view?usp=sharing"

              target="_blank"

              rel="noopener noreferrer"

              className="group relative text-xs text-[var(--color-accent-gray)] hover:text-[var(--color-nothing-red)] transition-all duration-300 tracking-[0.12em] uppercase font-light">

              <span className="relative z-10">Resume</span>

              <div className="absolute bottom-0 left-0 w-0 h-px bg-[var(--color-nothing-red)] transition-all duration-300 group-hover:w-full"></div>

            </a>

            <div className="w-1 h-1 bg-[var(--color-nothing-red)] opacity-60"></div>

            <button 

              onClick={() => setIsTerminalOpen(true)}

              className="group relative text-xs text-[var(--color-accent-gray)] hover:text-[var(--color-nothing-red)] transition-all duration-300 tracking-[0.12em] uppercase font-light">

              <span className="relative z-10">Terminal</span>

              <div className="absolute bottom-0 left-0 w-0 h-px bg-[var(--color-nothing-red)] transition-all duration-300 group-hover:w-full"></div>

            </button>

          </div>

          {/* Scrolling indicator */}

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">

            <div className="w-6 h-10 border-2 border-[var(--color-accent-gray)]/50 rounded-full flex justify-center">

              <div className="w-1 h-3 bg-[var(--color-accent-gray)]/50 rounded-full mt-2 animate-pulse"></div>

            </div>

          </div>

        </div>

      </header>



      {/* Main Content */}
      <main id="main-content" role="main">

      <ExperienceSection experience={resumeData.experience} />

      <MethodSection method={resumeData.method} />

      <ProjectSection projects={resumeData.projects} showAll={showAllProjects} onToggle={() => setShowAllProjects(!showAllProjects)} />



      {/* Skills & Info */}

      <section id="skills" aria-labelledby="skills-heading" className="relative z-10 px-4 py-14 sm:py-16 max-w-4xl mx-auto safe-area-left safe-area-right">

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-16">

          {/* Skills */}

          <div>

            <h2 id="skills-heading" className="font-display text-2xl sm:text-3xl font-normal tracking-tight text-white mb-4 sm:mb-8">Technical Skills</h2>

            <div className="space-y-4 sm:space-y-8">

                {SKILL_TIER_KEYS.map((key, tierIndex) => {

                const tier = resumeData.skillsByTier[key]

                const dotColor =

                  tierIndex === 0 ? 'bg-[var(--color-white)]' : tierIndex === 1 ? 'bg-[var(--color-accent-gray)]' : 'bg-[var(--color-light-gray)]'


                return (

                  <TiltCard key={key} className={`${UNIFIED_CARD_CLASS} sm:p-6 animate-slide-up stagger-${Math.min(tierIndex + 1, 6)} is-visible`}>

                    <h3 className={`${CARD_TITLE_CLASS} mb-1 flex items-center gap-2`}>

                      <span className={`w-2 h-2 rounded-full ${dotColor}`} />

                      {tier.label}

                    </h3>

                    <p className={`${CARD_SUBTEXT_CLASS} mb-3`}>{tier.description}</p>

                    <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-[260px] sm:max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-medium-gray)] scrollbar-track-transparent pr-1">

                      {tier.items.map((item) => (

                        <TiltCard key={item} className="text-xs inline-block px-2 py-1.5 sm:px-2.5 rounded-lg bg-[var(--color-dark-gray)]/70 border border-[var(--color-medium-gray)]/60 text-[var(--color-off-white)] tracking-[0.01em] max-w-max mr-2 mb-2">

                          {item}

                        </TiltCard>

                      ))}

                    </div>

                  </TiltCard>

                )

              })}

            </div>

          </div>



          {/* Education & Coding Profiles */}

          <div>

            <div className="mb-6 sm:mb-8">

              <h3 className={SECTION_HEADING_CLASS}>Education</h3>

              <TiltCard className={`group block ${UNIFIED_CARD_INTERACTIVE_CLASS}`}>
                <a
                  href="https://drive.google.com/file/d/1bZxGD0N1rcg401EIsZEfSN-EfixDrp0_/view?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <p className={SECTION_LABEL_CLASS}>Academics</p>
                  <h4 className={`${CARD_TITLE_CLASS} text-white`}>{resumeData.education.institution}</h4>

                  <p className={`${CARD_SUBTEXT_CLASS} mb-1`}>{resumeData.education.degree}</p>

                  <p className="text-xs sm:text-sm leading-relaxed text-[var(--color-accent-gray)]/90">CGPA: {resumeData.education.gpa} • {resumeData.education.period}</p>

                  <p className="text-xs sm:text-sm text-[var(--color-accent-gray)]/80">{resumeData.education.location}</p>
                </a>
              </TiltCard>

            </div>



            {/* CP Stats Section */}
            <div>
              <h3 className={SECTION_HEADING_CLASS}>Competitive Programming</h3>

              {/* Total Solved Card */}
              <TiltCard className={`${UNIFIED_CARD_CLASS} mb-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={SECTION_LABEL_CLASS}>Problems Solved</p>
                    <p className="font-display text-2xl sm:text-3xl tracking-tight text-white">{resumeData.cpStats?.totalSolved || 2500}+</p>
                  </div>
                </div>
              </TiltCard>

              {/* Platform Rankings */}
              <div className="space-y-3 mb-4">
                {resumeData.cpStats?.bestRankings?.map((profile, index) => (
                  <TiltCard key={index} className={`${UNIFIED_CARD_INTERACTIVE_CLASS} p-3 sm:p-4 animate-slide-up stagger-${Math.min(index + 1, 6)} is-visible`}>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div className="flex items-center gap-3">
                          <span className={CARD_TITLE_CLASS}>{profile.platform}</span>
                          <span className="text-xs px-2 py-0.5 bg-[var(--color-dark-gray)] rounded-full text-[var(--color-accent-gray)] tracking-[0.03em]">{profile.rank}</span>
                        </div>
                        <span className="text-[var(--color-nothing-red)] text-sm tracking-[0.02em]">{profile.rating}</span>
                      </div>
                    </a>
                  </TiltCard>
                ))}
              </div>

              {/* Favorite Topics */}
              <TiltCard className={UNIFIED_CARD_CLASS}>
                <p className={SECTION_LABEL_CLASS}>Favorite Topics</p>
                <div className="flex flex-wrap gap-2">
                  {resumeData.cpStats?.favoriteTopics?.slice(0, 6).map((topic, index) => (
                    <TiltCard key={index} className="text-xs inline-block px-2 py-1 bg-[var(--color-dark-gray)] rounded-lg text-[var(--color-off-white)] tracking-[0.01em] max-w-max">
                      {topic}
                    </TiltCard>
                  ))}
                </div>
              </TiltCard>
            </div>

          </div>

        </div>

      </section>



      {/* Achievements */}

      <section id="achievements" aria-labelledby="achievements-heading" className="relative z-10 px-4 py-14 sm:py-16 max-w-4xl mx-auto">

        <h2 id="achievements-heading" className="font-display text-2xl sm:text-3xl font-normal tracking-tight text-white mb-6 sm:mb-8 text-center">Achievements</h2>

        <div className="relative space-y-6 sm:space-y-8">

          {resumeData.achievements.slice(0, showAllAchievements ? undefined : 4).map((achievement, index) => (

            <div key={index} className="relative flex items-start">

              <div className="flex flex-col items-center">

                <span className="w-8 h-8 bg-[var(--color-dark-gray)] border border-[var(--color-medium-gray)] rounded-full flex items-center justify-center text-[var(--color-off-white)] text-xs font-medium z-10">{index + 1}</span>

                {index < (showAllAchievements ? resumeData.achievements.length - 1 : Math.min(3, resumeData.achievements.length - 1)) && (

                  <div className="w-0.5 bg-[var(--color-medium-gray)]/80 h-full mt-4"></div>

                )}

              </div>

                {achievement.url ? (

                <TiltCard className={`ml-2.5 sm:ml-4 flex-1 ${UNIFIED_CARD_INTERACTIVE_CLASS} block sm:p-6 animate-slide-up stagger-${Math.min(index + 1, 6)} is-visible`}>

                  <a href={achievement.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">

                    <span className="text-sm sm:text-base text-[var(--color-off-white)] leading-[1.6] tracking-[0.005em] sm:tracking-[0.01em]">{achievement.text}</span>

                    {achievement.date ? (

                      <p className={`mt-3 ${CARD_SUBTEXT_CLASS}`}>{achievement.date}</p>

                    ) : null}

                  </a>

                </TiltCard>

              ) : (

                <TiltCard className={`ml-2.5 sm:ml-4 flex-1 ${UNIFIED_CARD_CLASS} sm:p-6 animate-slide-up stagger-${Math.min(index + 1, 6)} is-visible`}>

                  <span className="text-sm sm:text-base text-[var(--color-off-white)] leading-[1.6] tracking-[0.005em] sm:tracking-[0.01em]">{achievement.text}</span>

                  {achievement.date ? (

                    <p className={`mt-3 ${CARD_SUBTEXT_CLASS}`}>{achievement.date}</p>

                  ) : null}

                </TiltCard>

              )}

            </div>

          ))}

        </div>

        {resumeData.achievements.length > 4 && (
          <button
            onClick={() => setShowAllAchievements(!showAllAchievements)}
            className="w-full py-3 mt-6 text-xs uppercase tracking-[0.12em] text-[var(--color-accent-gray)] hover:text-[var(--color-nothing-red)] transition-colors border border-[var(--color-medium-gray)]/50 rounded-lg hover:border-[var(--color-nothing-red)]/50"
          >
            {showAllAchievements ? 'Show Less' : `View All ${resumeData.achievements.length} Achievements`}
          </button>
        )}

      </section>



      {/* Certifications */}

      <section id="certifications" aria-labelledby="certifications-heading" className="relative z-10 px-4 py-14 sm:py-16 max-w-4xl mx-auto pb-24 sm:pb-32">

        <h2 id="certifications-heading" className="font-display text-2xl sm:text-3xl font-normal tracking-tight text-white mb-6 sm:mb-8 text-center">Certifications</h2>

        <div className="relative space-y-6 sm:space-y-8">

          {resumeData.certifications.map((cert, index) => (

            <div key={index} className="relative flex items-start">

              <div className="flex flex-col items-center">

                <span className="w-8 h-8 bg-[var(--color-dark-gray)] border border-[var(--color-medium-gray)] rounded-full flex items-center justify-center text-[var(--color-off-white)] text-xs font-medium z-10">{index + 1}</span>

                {index < resumeData.certifications.length - 1 && (

                  <div className="w-0.5 bg-[var(--color-medium-gray)]/80 h-full mt-4"></div>

                )}

              </div>

              {cert.url ? (

                <TiltCard className={`ml-2.5 sm:ml-4 flex-1 ${UNIFIED_CARD_INTERACTIVE_CLASS} block sm:p-6 animate-slide-up stagger-${Math.min(index + 1, 6)} is-visible`}>

                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">

                    <span className="text-sm sm:text-base text-[var(--color-off-white)] leading-[1.6] tracking-[0.005em] sm:tracking-[0.01em]">{cert.text}</span>

                    <p className={`mt-3 ${CARD_SUBTEXT_CLASS}`}>

                      {cert.issuer}

                      {cert.date ? ` · ${cert.date}` : ''}

                    </p>

                  </a>

                </TiltCard>

              ) : (

                <TiltCard className={`ml-2.5 sm:ml-4 flex-1 ${UNIFIED_CARD_CLASS} sm:p-6 animate-slide-up stagger-${Math.min(index + 1, 6)} is-visible`}>

                  <span className="text-sm sm:text-base text-[var(--color-off-white)] leading-[1.6] tracking-[0.005em] sm:tracking-[0.01em]">{cert.text}</span>

                  <p className={`mt-3 ${CARD_SUBTEXT_CLASS}`}>

                    {cert.issuer}

                    {cert.date ? ` · ${cert.date}` : ''}

                  </p>

                </TiltCard>

              )}

            </div>

          ))}

        </div>

      </section>

      </main>{/* End Main Content */}

      <Terminal isOpen={isTerminalOpen} onToggle={() => setIsTerminalOpen(!isTerminalOpen)} />

      <TerminalToggle onToggle={() => setIsTerminalOpen(!isTerminalOpen)} isOpen={isTerminalOpen} />

      <Footer />

      <ContactPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} contact={{ ...resumeData.contact, location: resumeData.location }} />

      <PWAInstallPrompt />

    </div>

  )

}

