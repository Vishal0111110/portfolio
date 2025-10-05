'use client'

import { useState } from 'react'
import { resumeData } from '@/data/resume'
import Background from '@/components/Background'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import ContactPopup from '@/components/ContactPopup'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  return (
    <div className="min-h-screen text-gray-100 relative">
      <div
        className="fixed inset-0"
        style={{
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 70%, #0f1729 100%)',
          zIndex: -2
        }}
      />
      <Navigation />
      <ScrollProgress />
      <Background />

      {/* Header/Hero */}
      <header id="home" className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
          {/* Floating geometric shapes */}
          <div className="absolute left-1/4 top-1/4 w-32 h-32 border-2 border-purple-400/20 rounded-full animate-bounce"></div>
          <div className="absolute right-1/3 top-1/6 w-24 h-24 bg-purple-600/10 rotate-45 animate-pulse"></div>
          <div className="absolute left-2/3 bottom-1/4 w-16 h-16 border border-purple-300/30 rounded animate-ping"></div>
          <div className="absolute right-1/4 bottom-1/3 w-20 h-20 bg-purple-600/5 animate-pulse rounded-full"></div>
        </div>

        {/* Main content with staggered animations */}
        <div className="relative z-20 max-w-6xl w-full">
          <div className="animate-in slide-in-from-top-8 duration-1000 delay-500">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 animate-in zoom-in-50 duration-1000 delay-300">
              {resumeData.name}
            </h1>
          </div>

          <div className="animate-in slide-in-from-left-8 duration-1000 delay-700">
            <p className="text-lg md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light tracking-wide animate-in fade-in duration-1000 delay-500">
              <span className="animate-typing">
                Software Engineer • Problem Solver • Competitive Programmer
              </span>
            </p>
          </div>

          <div className="animate-in slide-in-from-right-8 duration-1000 delay-900">
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-16 leading-relaxed animate-in fade-in duration-1000 delay-700">
              {resumeData.summary}
            </p>
          </div>

          {/* Contact Info with Premium Icons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 mt-12 animate-in slide-in-from-bottom-8 duration-1000 delay-1100">
            <div className="group flex items-center gap-3 text-gray-400 hover:text-purple-300 transition-all duration-500 hover:scale-110">
              <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-400/30 flex items-center justify-center group-hover:border-purple-400/60 transition-all duration-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-medium">{resumeData.location}</span>
            </div>

            <a href={`mailto:${resumeData.contact.email}?subject=Contact from Portfolio&body=Hi Vishal,`} className="group flex items-center gap-3 text-gray-400 hover:text-purple-300 transition-all duration-500 hover:scale-110">
              <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-400/30 flex items-center justify-center group-hover:border-purple-400/60 transition-all duration-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium">{resumeData.contact.email}</span>
            </a>

            <a href={`tel:${resumeData.contact.phone}`} className="group flex items-center gap-3 text-gray-400 hover:text-purple-300 transition-all duration-500 hover:scale-110">
              <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-400/30 flex items-center justify-center group-hover:border-purple-400/60 transition-all duration-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="font-medium">{resumeData.contact.phone}</span>
            </a>
          </div>

          {/* Action Buttons with Enhanced Mobile-First Styling */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-12 animate-in slide-in-from-bottom-8 duration-1000 delay-1300 px-4">
            {/* Contact Links Grid for Mobile */}
            <div className="grid grid-cols-2 gap-3 sm:hidden w-full max-w-md">
              <a
                href={`https://www.linkedin.com/in/${resumeData.contact.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 p-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 border border-purple-400/30 hover:border-purple-400/60 flex flex-col items-center gap-2 min-h-[64px] touch-manipulation"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-xs text-center">LinkedIn</span>
                <div className="absolute inset-0 bg-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </a>

              <a
                href={`https://codeforces.com/profile/${resumeData.contact.codeforces}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 p-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 border border-purple-400/30 hover:border-purple-400/60 flex flex-col items-center gap-2 min-h-[64px] touch-manipulation"
              >
                <img src="/cf-image.png" alt="Codeforces" className="w-6 h-6 rounded" />
                <span className="text-xs text-center">Codeforces</span>
                <div className="absolute inset-0 bg-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </a>

              <button
                onClick={() => setIsPopupOpen(true)}
                className="group relative bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 p-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 border border-purple-400/30 hover:border-purple-400/60 flex flex-col items-center gap-2 min-h-[64px] touch-manipulation col-span-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Contact Me</span>
                <div className="absolute inset-0 bg-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </button>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden sm:flex flex-row items-center justify-center gap-6">
              <a
                href={`https://www.linkedin.com/in/${resumeData.contact.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 px-8 py-4 rounded-full font-semibold transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 border border-purple-400/30 hover:border-purple-400/60 overflow-hidden touch-manipulation"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </span>
                <div className="absolute inset-0 bg-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
              </a>

              <a
                href={`https://codeforces.com/profile/${resumeData.contact.codeforces}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 px-8 py-4 rounded-full font-semibold transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 border border-purple-400/30 hover:border-purple-400/60 overflow-hidden touch-manipulation"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <img src="/cf-image.png" alt="Codeforces" className="w-5 h-5" />
                  Codeforces
                </span>
                <div className="absolute inset-0 bg-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
              </a>

              <button
                onClick={() => setIsPopupOpen(true)}
                className="group relative bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 px-8 py-4 rounded-full font-semibold transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 border border-purple-400/30 hover:border-purple-400/60 overflow-hidden touch-manipulation"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Me
                </span>
                <div className="absolute inset-0 bg-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
              </button>
            </div>

            <a
              href="https://drive.google.com/file/d/1-Oe-uNAdiD027h0J5HAuaZAAMExq0MI3/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-purple-500 hover:bg-purple-600 text-white px-8 sm:px-10 py-5 sm:py-4 rounded-full font-bold transition-all duration-300 sm:duration-500 hover:scale-105 sm:hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 overflow-hidden animate-pulse-slow touch-manipulation w-full sm:w-auto text-center min-h-[56px] flex items-center justify-center"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Resume
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
            </a>
          </div>

          {/* Scrolling indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-purple-400/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-purple-400/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Experience */}
      <section id="experience" className="relative z-10 px-4 py-16 max-w-4xl mx-auto safe-area-left safe-area-right">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 sm:mb-12 text-center">Experience</h2>
        <div className="space-y-6 sm:space-y-8">
          {resumeData.experience.map((exp, index) => (
            <a
              key={index}
              href="https://drive.google.com/file/d/1MnaMruhrJcEF9ueund5JM52LlOn_ztAo/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-800/50 backdrop-blur-sm p-5 sm:p-6 rounded-xl sm:rounded-lg border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl touch-manipulation mobile-card"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">{exp.position}</h3>
                  <p className="text-purple-300 font-medium text-sm sm:text-base leading-relaxed">{exp.company} • {exp.location}</p>
                </div>
                <span className="text-gray-400 mt-2 sm:mt-0 text-sm sm:text-base whitespace-nowrap">{exp.period}</span>
              </div>
              <ul className="space-y-3 text-gray-300">
                {exp.description.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm sm:text-base">
                    <span className="text-purple-300 mr-3 mt-1.5 flex-shrink-0">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </a>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="relative z-10 px-4 py-16 max-w-4xl mx-auto safe-area-left safe-area-right">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 sm:mb-12 text-center">Projects</h2>
        <div className="relative space-y-6 sm:space-y-8">
          {resumeData.projects.map((project, index) => (
            <div key={index} className="relative flex items-start">
              <div className="flex flex-col items-center">
                <span className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm z-10">{index + 1}</span>
                {index < resumeData.projects.length - 1 && (
                  <div className="w-0.5 bg-purple-600 h-full mt-4"></div>
                )}
              </div>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 sm:ml-4 flex-1 bg-gray-800/50 backdrop-blur-sm p-5 sm:p-6 rounded-xl sm:rounded-lg border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl touch-manipulation mobile-card"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-white hover:text-purple-300 transition-colors mb-2 sm:mb-0">{project.name}</h3>
                  <span className="text-gray-400 text-sm sm:text-base">{project.date}</span>
                </div>
                <p className="text-purple-300 text-sm mb-4 font-medium leading-relaxed">{project.tech}</p>
                <ul className="space-y-3 text-gray-300">
                  {project.description.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm sm:text-base">
                      <span className="text-purple-300 mr-3 mt-1.5 flex-shrink-0">•</span>
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
      <section id="skills" className="relative z-10 px-4 py-16 max-w-4xl mx-auto safe-area-left safe-area-right">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Skills */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Technical Skills</h2>
            <div className="space-y-5 sm:space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.languages.map((lang, index) => (
                    <span key={index} className="bg-purple-600/20 text-purple-300 px-3 py-1.5 rounded-full text-sm touch-manipulation">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-3">Frameworks & Libraries</h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.frameworks.map((fw, index) => (
                    <span key={index} className="bg-purple-600/20 text-purple-300 px-3 py-1.5 rounded-full text-sm touch-manipulation">
                      {fw}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-3">Tools & IDEs</h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.tools.map((tool, index) => (
                    <span key={index} className="bg-purple-600/20 text-purple-300 px-3 py-1.5 rounded-full text-sm touch-manipulation">
                      {tool}
                    </span>
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
                className="block bg-gray-800/50 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl touch-manipulation mobile-card"
              >
                <h4 className="text-base sm:text-lg font-semibold text-white">{resumeData.education.institution}</h4>
                <p className="text-purple-300 mb-1 text-sm sm:text-base">{resumeData.education.degree}</p>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">CGPA: {resumeData.education.gpa} • {resumeData.education.period}</p>
                <p className="text-gray-500 text-xs sm:text-sm">{resumeData.education.location}</p>
              </a>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Coding Profiles</h3>
              <div className="space-y-3">
                {resumeData.codingProfiles.map((profile, index) => (
                  profile.url ? (
                    <a
                      key={index}
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gray-800/50 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl touch-manipulation mobile-card"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-white text-sm sm:text-base">{profile.platform}</span>
                        <span className="text-purple-300 text-xs sm:text-sm">{profile.rating} • {profile.rank}</span>
                      </div>
                    </a>
                  ) : (
                    <div key={index} className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl mobile-card">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-white text-sm sm:text-base">{profile.platform}</span>
                        <span className="text-purple-300 text-xs sm:text-sm">{profile.rating} • {profile.rank}</span>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements & Certifications */}
      <section id="achievements" className="relative z-10 px-4 py-16 max-w-4xl mx-auto pb-32">
        <div className="space-y-16">
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Achievements</h2>
            <div className="relative space-y-8">
              {resumeData.achievements.map((achievement, index) => (
                <div key={index} className="relative flex items-start">
                  <div className="flex flex-col items-center">
                    <span className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">{index + 1}</span>
                    {index < resumeData.achievements.length - 1 && (
                      <div className="w-0.5 bg-purple-600 h-full mt-4"></div>
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
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Certifications</h2>
            <div className="relative space-y-8">
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="relative flex items-start">
                  <div className="flex flex-col items-center">
                    <span className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">{index + 1}</span>
                    {index < resumeData.certifications.length - 1 && (
                      <div className="w-0.5 bg-purple-600 h-full mt-4"></div>
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
      <Footer />
      <ContactPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} contact={{ ...resumeData.contact, location: resumeData.location }} />
      <PWAInstallPrompt />
    </div>
  )
}
