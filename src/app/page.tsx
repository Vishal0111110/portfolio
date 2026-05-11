'use client'



import { useState, useEffect } from 'react'

import dynamic from 'next/dynamic'

import { resumeData } from '@/data/resume'

import Navigation from '@/components/Navigation'

import Footer from '@/components/Footer'

import ScrollProgress from '@/components/ScrollProgress'

import TerminalToggle from '@/components/TerminalToggle'

import CursorTrail from '@/components/CursorTrail'

import KonamiEasterEgg from '@/components/KonamiEasterEgg'

import { getGreeting } from '@/utils/greetings'

import { printConsoleEasterEgg } from '@/data/cpFacts'

import PWAInstallPrompt from '@/components/PWAInstallPrompt'

import { performanceMonitor } from '@/utils/performance'



// Dynamic imports for heavy components - Step 5.1 & 5.2

const Terminal = dynamic(() => import('@/components/Terminal'), { 

  ssr: false,

  loading: () => null

})



const Background = dynamic(() => import('@/components/Background'), { 

  ssr: false,

  loading: () => null

})



const GrainOverlay = dynamic(() => import('@/components/GrainOverlay'), {

  ssr: false,

  loading: () => null

})



const ContactPopup = dynamic(() => import('@/components/ContactPopup'), { 

  ssr: false,

  loading: () => (

    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">

      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>

    </div>

  )

})



export default function Home() {

  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const [isTerminalOpen, setIsTerminalOpen] = useState(false)



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

      <div className="fixed inset-0 nothing-geometric opacity-20" style={{ zIndex: -3 }} />

      <div className="fixed inset-0 dot-matrix opacity-25" style={{ zIndex: -2 }} />

      

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

          <div className="absolute left-1/3 top-1/3 w-24 h-24 border border-[var(--color-medium-gray)]/10 rounded-full" style={{ animation: 'float 8s ease-in-out infinite' }}></div>

        </div>



        {/* Main content with ultra-minimalist layout */}

        <div className="relative z-20 max-w-4xl w-full mx-auto">

          {/* Name with Nothing OS minimalism */}

          <div className="animate-in slide-in-from-top-8 duration-1000 delay-500 mb-16">

            <h1 

              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.05em] text-white cursor-default"

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



          {/* Minimal subtitle */}

          <div className="animate-in slide-in-from-left-8 duration-1000 delay-700 mb-16">

            <p className="font-mono text-sm text-[var(--color-accent-gray)] tracking-widest uppercase">

              Algorithmic Thinker

            </p>

          </div>



          {/* Minimal summary with more negative space */}

          <div className="animate-in slide-in-from-right-8 duration-1000 delay-900 mb-20">

            <p className="text-base text-[var(--color-off-white)] leading-relaxed max-w-2xl mx-auto text-center font-light">

              {resumeData.summary}

            </p>

          </div>



          {/* Minimal Contact Info */}

          <div className="flex flex-col items-center gap-4 mt-16 animate-in slide-in-from-bottom-8 duration-1000 delay-1100">

            <p className="text-sm text-[var(--color-accent-gray)] tracking-widest uppercase">

              {resumeData.location}

            </p>

          </div>



          {/* Refined Navigation - Nothing OS Style */}

          <div className="flex items-center justify-center gap-12 mt-24 animate-in slide-in-from-bottom-8 duration-1000 delay-1300">

            <div className="w-1 h-1 bg-[var(--color-nothing-red)] opacity-60"></div>

            <a 

              href={`https://www.linkedin.com/in/${resumeData.contact.linkedin}`}

              target="_blank"

              rel="noopener noreferrer"

              className="group relative text-xs text-[var(--color-accent-gray)] hover:text-[var(--color-nothing-red)] transition-all duration-300 tracking-widest uppercase font-light">

              <span className="relative z-10">LinkedIn</span>

              <div className="absolute bottom-0 left-0 w-0 h-px bg-[var(--color-nothing-red)] transition-all duration-300 group-hover:w-full"></div>

            </a>

            <div className="w-1 h-1 bg-[var(--color-nothing-red)] opacity-60"></div>

            <a 

              href={`https://codeforces.com/profile/${resumeData.contact.codeforces}`}

              target="_blank"

              rel="noopener noreferrer"

              className="group relative text-xs text-[var(--color-accent-gray)] hover:text-[var(--color-nothing-red)] transition-all duration-300 tracking-widest uppercase font-light">

              <span className="relative z-10">Codeforces</span>

              <div className="absolute bottom-0 left-0 w-0 h-px bg-[var(--color-nothing-red)] transition-all duration-300 group-hover:w-full"></div>

            </a>

            <div className="w-1 h-1 bg-[var(--color-nothing-red)] opacity-60"></div>

            <button 

              onClick={() => setIsPopupOpen(true)}

              className="group relative text-xs text-[var(--color-accent-gray)] hover:text-[var(--color-nothing-red)] transition-all duration-300 tracking-widest uppercase font-light">

              <span className="relative z-10">Contact</span>

              <div className="absolute bottom-0 left-0 w-0 h-px bg-[var(--color-nothing-red)] transition-all duration-300 group-hover:w-full"></div>

            </button>

            <div className="w-1 h-1 bg-[var(--color-nothing-red)] opacity-60"></div>

            <a 

              href="https://drive.google.com/file/d/1ZiK0D0uLYT3gWX7uJs23-PLXt8FWjhTa/view?usp=sharing"

              target="_blank"

              rel="noopener noreferrer"

              className="group relative text-xs text-[var(--color-accent-gray)] hover:text-[var(--color-nothing-red)] transition-all duration-300 tracking-widest uppercase font-light">

              <span className="relative z-10">Resume</span>

              <div className="absolute bottom-0 left-0 w-0 h-px bg-[var(--color-nothing-red)] transition-all duration-300 group-hover:w-full"></div>

            </a>

            <div className="w-1 h-1 bg-[var(--color-nothing-red)] opacity-60"></div>

            <button 

              onClick={() => setIsTerminalOpen(true)}

              className="group relative text-xs text-[var(--color-accent-gray)] hover:text-[var(--color-nothing-red)] transition-all duration-300 tracking-widest uppercase font-light">

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

      {/* Experience */}

      <section id="experience" aria-labelledby="experience-heading" className="relative z-10 px-4 py-16 max-w-4xl mx-auto safe-area-left safe-area-right">

        <h2 id="experience-heading" className="text-2xl sm:text-3xl font-bold text-white mb-8 sm:mb-12 text-center">Experience</h2>

        <div className="space-y-6 sm:space-y-8">

          {resumeData.experience.map((exp, index) => (

            <a

              key={index}

              href={exp.link || '#'}

              target="_blank"

              rel="noopener noreferrer"

              className="group block glass-mono p-5 sm:p-6 rounded-xl sm:rounded-lg border border-[var(--color-medium-gray)] hover:border-[var(--color-accent-gray)] transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-[var(--color-black)]/50 touch-manipulation mobile-card relative overflow-hidden"

            >

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">

                <div className="flex-1 min-w-0">

                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">{exp.position}</h3>

                  <p className="text-[var(--color-off-white)] font-medium text-sm sm:text-base leading-relaxed">{exp.company} • {exp.location}</p>

                </div>

                <span className="text-gray-400 mt-2 sm:mt-0 text-sm sm:text-base whitespace-nowrap">{exp.period}</span>

              </div>

              <ul className="space-y-3 text-gray-300">

                {exp.description.map((item, idx) => (

                  <li key={idx} className="flex items-start text-sm sm:text-base">

                    <span className="text-[var(--color-accent-gray)] mr-3 mt-1.5 flex-shrink-0">•</span>

                    <span className="leading-relaxed">{item}</span>

                  </li>

                ))}

              </ul>

            </a>

          ))}

        </div>

      </section>



      {/* Projects */}

      <section id="projects" aria-labelledby="projects-heading" className="relative z-10 px-4 py-16 max-w-4xl mx-auto safe-area-left safe-area-right">

        <h2 id="projects-heading" className="text-2xl sm:text-3xl font-bold text-white mb-8 sm:mb-12 text-center">Projects</h2>

        <div className="relative space-y-6 sm:space-y-8">

          {resumeData.projects.map((project, index) => (

            <div key={index} className="relative flex items-start">

              <div className="flex flex-col items-center">

                <span className="w-7 h-7 sm:w-8 sm:h-8 bg-[var(--color-light-gray)] rounded-full flex items-center justify-center text-[var(--color-white)] font-bold text-xs sm:text-sm z-10">{index + 1}</span>

                {index < resumeData.projects.length - 1 && (

                  <div className="w-0.5 bg-[var(--color-light-gray)] h-full mt-4"></div>

                )}

              </div>

              <a

                href={project.link}

                target="_blank"

                rel="noopener noreferrer"

                className="group ml-3 sm:ml-4 flex-1 glass-mono p-5 sm:p-6 rounded-xl sm:rounded-lg border border-[var(--color-medium-gray)] hover:border-[var(--color-accent-gray)] transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-[var(--color-black)]/50 touch-manipulation mobile-card relative overflow-hidden"

              >

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">

                  <h3 className="text-lg sm:text-xl font-semibold text-white hover:text-[var(--color-accent-gray)] transition-colors mb-2 sm:mb-0">{project.name}</h3>

                  <span className="text-gray-400 text-sm sm:text-base">{project.date}</span>

                </div>

                <p className="text-[var(--color-accent-gray)] text-sm mb-4 font-medium leading-relaxed">{project.tech}</p>

                <ul className="space-y-3 text-gray-300">

                  {project.description.map((item, idx) => (

                    <li key={idx} className="flex items-start text-sm sm:text-base">

                      <span className="text-[var(--color-accent-gray)] mr-3 mt-1.5 flex-shrink-0">•</span>

                      <span className="leading-relaxed">{item}</span>

                    </li>

                  ))}

                </ul>

              </a>

            </div>

          ))}

        </div>

      </section>



      {/* Skills & Info */}

      <section id="skills" aria-labelledby="skills-heading" className="relative z-10 px-4 py-16 max-w-4xl mx-auto safe-area-left safe-area-right">

        <div className="grid md:grid-cols-2 gap-8 md:gap-16">

          {/* Skills */}

          <div>

            <h2 id="skills-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Technical Skills</h2>

            <div className="space-y-6 sm:space-y-8">

              {/* Languages with Progress Bars */}

              <div className="glass-mono rounded-xl p-4 sm:p-6">

                <h3 className="text-base sm:text-lg font-semibold text-[var(--color-off-white)] mb-4 flex items-center gap-2">

                  <span className="w-2 h-2 bg-[var(--color-white)] rounded-full"></span>

                  Languages

                </h3>

                <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-medium-gray)] scrollbar-track-transparent pr-2">

                  {resumeData.skillsExtended?.languagesCore?.map((lang, index) => {

                    const progress = [95, 92, 90, 88, 85, 82, 80, 78, 75, 72, 70, 68, 65, 62, 60, 58, 55][index] || 50;

                    return (

                      <div key={index} className="group">

                        <div className="flex justify-between items-center mb-1">

                          <span className="text-sm text-[var(--color-off-white)] font-medium">{lang}</span>

                          <span className="text-xs text-[var(--color-accent-gray)] font-mono opacity-0 group-hover:opacity-100 transition-opacity">{progress}%</span>

                        </div>

                        <div className="h-2 bg-[var(--color-dark-gray)] rounded-full overflow-hidden">

                          <div 

                            className="h-full bg-gradient-to-r from-[var(--color-light-gray)] to-[var(--color-white)] rounded-full transition-all duration-1000 ease-out"

                            style={{ width: `${progress}%`, animationDelay: `${index * 100}ms` }}

                          ></div>

                        </div>

                      </div>

                    );

                  })}

                </div>

              </div>



              {/* Frameworks & Tools with Progress Bars */}

              <div className="glass-mono rounded-xl p-4 sm:p-6">

                <h3 className="text-base sm:text-lg font-semibold text-[var(--color-off-white)] mb-4 flex items-center gap-2">

                  <span className="w-2 h-2 bg-[var(--color-accent-gray)] rounded-full"></span>

                  Frameworks & Tools

                </h3>

                <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-medium-gray)] scrollbar-track-transparent pr-2">

                  {resumeData.skillsExtended?.frameworksTools?.map((fw, index) => {

                    const progress = [95, 92, 90, 88, 85, 82, 80, 78, 75, 72, 70, 68, 65, 62, 60, 58, 55, 52, 50, 48, 45, 42, 40][index] || 35;

                    return (

                      <div key={index} className="group">

                        <div className="flex justify-between items-center mb-1">

                          <span className="text-sm text-[var(--color-off-white)] font-medium">{fw}</span>

                          <span className="text-xs text-[var(--color-accent-gray)] font-mono opacity-0 group-hover:opacity-100 transition-opacity">{progress}%</span>

                        </div>

                        <div className="h-2 bg-[var(--color-dark-gray)] rounded-full overflow-hidden">

                          <div 

                            className="h-full bg-gradient-to-r from-[var(--color-medium-gray)] to-[var(--color-accent-gray)] rounded-full transition-all duration-1000 ease-out"

                            style={{ width: `${progress}%`, animationDelay: `${index * 100}ms` }}

                          ></div>

                        </div>

                      </div>

                    );

                  })}

                </div>

              </div>



              {/* Tools with Dot Matrix Grid */}

              <div className="glass-mono rounded-xl p-4 sm:p-6">

                <h3 className="text-base sm:text-lg font-semibold text-[var(--color-off-white)] mb-4 flex items-center gap-2">

                  <span className="w-2 h-2 bg-[var(--color-light-gray)] rounded-full"></span>

                  Tools & IDEs

                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-medium-gray)] scrollbar-track-transparent pr-2">

                  {resumeData.skillsExtended?.tools?.map((tool, index) => (

                    <div key={index} className="group relative bg-[var(--color-dark-gray)]/50 rounded-lg p-2 text-center hover:bg-[var(--color-medium-gray)]/50 transition-all duration-300 cursor-default overflow-hidden">

                      <span className="relative z-10 text-xs sm:text-sm text-[var(--color-off-white)]">{tool}</span>

                      <div className="absolute inset-0 dot-matrix-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>



          {/* Education & Coding Profiles */}

          <div>

            <div className="mb-6 sm:mb-8">

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Education</h3>

              <a

                href="https://drive.google.com/file/d/1bZxGD0N1rcg401EIsZEfSN-EfixDrp0_/view?usp=drive_link"

                target="_blank"

                rel="noopener noreferrer"

                className="group block glass-mono p-4 sm:p-5 rounded-xl border border-[var(--color-medium-gray)] hover:border-[var(--color-accent-gray)] transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-[var(--color-black)]/50 touch-manipulation mobile-card relative overflow-hidden"

              >

                <h4 className="text-base sm:text-lg font-semibold text-white">{resumeData.education.institution}</h4>

                <p className="text-[var(--color-accent-gray)] mb-1 text-sm sm:text-base">{resumeData.education.degree}</p>

                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">CGPA: {resumeData.education.gpa} • {resumeData.education.period}</p>

                <p className="text-gray-500 text-xs sm:text-sm">{resumeData.education.location}</p>

              </a>

            </div>



            {/* CP Stats Section */}
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">Competitive Programming</h3>

              {/* Total Solved Card */}
              <div className="glass-mono p-4 sm:p-5 rounded-xl border border-[var(--color-medium-gray)] mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[var(--color-accent-gray)] text-sm">Problems Solved</p>
                    <p className="text-2xl sm:text-3xl font-semibold text-white">{resumeData.cpStats?.totalSolved || 2500}+</p>
                  </div>
                </div>
              </div>

              {/* Platform Rankings */}
              <div className="space-y-3 mb-4">
                {resumeData.cpStats?.bestRankings?.map((profile, index) => (
                  <a
                    key={index}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block glass-mono p-3 sm:p-4 rounded-xl border border-[var(--color-medium-gray)] hover:border-[var(--color-accent-gray)] transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-[var(--color-black)]/50 touch-manipulation mobile-card relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-white text-sm sm:text-base">{profile.platform}</span>
                        <span className="text-xs px-2 py-0.5 bg-[var(--color-dark-gray)] rounded-full text-[var(--color-accent-gray)]">{profile.rank}</span>
                      </div>
                      <span className="text-[var(--color-nothing-red)] font-mono text-sm">{profile.rating}</span>
                    </div>
                  </a>
                ))}
              </div>

              {/* Favorite Topics */}
              <div className="glass-mono p-4 rounded-xl border border-[var(--color-medium-gray)]">
                <p className="text-[var(--color-accent-gray)] text-sm mb-2">Favorite Topics</p>
                <div className="flex flex-wrap gap-2">
                  {resumeData.cpStats?.favoriteTopics?.slice(0, 6).map((topic, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-[var(--color-dark-gray)] rounded-lg text-[var(--color-off-white)]">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

      </section>



      {/* Achievements & Certifications */}

      <section id="achievements" aria-labelledby="achievements-heading" className="relative z-10 px-4 py-16 max-w-4xl mx-auto pb-32">

        <div className="space-y-16">

          <div>

            <h2 id="achievements-heading" className="text-3xl font-bold text-white mb-8 text-center">Achievements</h2>

            <div className="relative space-y-8">

              {resumeData.achievements.map((achievement, index) => (

                <div key={index} className="relative flex items-start">

                  <div className="flex flex-col items-center">

                    <span className="w-8 h-8 bg-[var(--color-light-gray)] rounded-full flex items-center justify-center text-[var(--color-white)] font-bold text-sm z-10">{index + 1}</span>

                    {index < resumeData.achievements.length - 1 && (

                      <div className="w-0.5 bg-[var(--color-light-gray)] h-full mt-4"></div>

                    )}

                  </div>

                  {achievement.url ? (

                    <a

                      href={achievement.url}

                      target="_blank"

                      rel="noopener noreferrer"

                      className="ml-4 flex-1 bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"

                    >

                      <span className="text-gray-300">{achievement.text}</span>

                    </a>

                  ) : (

                    <div className="ml-4 flex-1 bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">

                      <span className="text-gray-300">{achievement.text}</span>

                    </div>

                  )}

                </div>

              ))}

            </div>

          </div>



          <div>

            <h2 id="certifications-heading" className="text-3xl font-bold text-white mb-8 text-center">Certifications</h2>

            <div className="relative space-y-8">

              {resumeData.certifications.map((cert, index) => (

                <div key={index} className="relative flex items-start">

                  <div className="flex flex-col items-center">

                    <span className="w-8 h-8 bg-[var(--color-light-gray)] rounded-full flex items-center justify-center text-[var(--color-white)] font-bold text-sm z-10">{index + 1}</span>

                    {index < resumeData.certifications.length - 1 && (

                      <div className="w-0.5 bg-[var(--color-light-gray)] h-full mt-4"></div>

                    )}

                  </div>

                  {cert.url ? (

                    <a

                      href={cert.url}

                      target="_blank"

                      rel="noopener noreferrer"

                      className="ml-4 flex-1 bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"

                    >

                      <span className="text-gray-300">{cert.text}</span>

                    </a>

                  ) : (

                    <div className="ml-4 flex-1 bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">

                      <span className="text-gray-300">{cert.text}</span>

                    </div>

                  )}

                </div>

              ))}

            </div>

          </div>

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

