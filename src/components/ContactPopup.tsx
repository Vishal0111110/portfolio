'use client'

import { useState, useRef, useEffect } from 'react'
import { CARD_HOVER } from '@/lib/cardHover'

interface ContactProps {
  email: string
  linkedin: string
  codeforces: string
  phone: string
  location: string
}

interface ContactPopupProps {
  isOpen: boolean
  onClose: () => void
  contact: ContactProps
}

export default function ContactPopup({ isOpen, onClose, contact }: ContactPopupProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    website: '',
    subject: '',
    message: '',
    contactMethod: 'Email',
    phone: '',
    availability: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // Focus trap for accessibility
  const modalRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  
  useEffect(() => {
    if (isOpen) {
      // Focus first focusable element when modal opens
      firstFocusableRef.current?.focus()
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
      
      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      document.addEventListener('keydown', handleEscape)
      
      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, onClose])


  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Using Formspree - assumes endpoint is set up
    // Note: Replace with actual Formspree endpoint
    const response = await fetch('https://formspree.io/f/movkllbk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    if (response.ok) {
      setIsSubmitted(true)
    }
  }

  return (
    <>
      {/* Overlay */}
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-title"
      className="fixed inset-0 bg-black/72 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 safe-area-bottom safe-area-left safe-area-right" 
      onClick={onClose}
    >
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-[var(--color-off-black)]/90 backdrop-blur-xl border border-[var(--color-medium-gray)]/80 rounded-2xl shadow-2xl shadow-[var(--color-black)]/55 max-w-[95vw] sm:max-w-5xl w-full max-h-[98vh] sm:max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
          {isSubmitted ? (
            // Confirmation Message
              <div className="p-4 md:p-6 text-center py-8 md:py-12" role="alert" aria-live="polite">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[var(--color-dark-gray)]/60 border border-[var(--color-medium-gray)]/80 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="font-display text-xl md:text-2xl font-normal tracking-tight text-white mb-2">Message sent</h3>
<p className="text-[var(--color-accent-gray)] text-sm px-2 md:px-0 leading-[1.55]">Your message has been sent successfully. I&#39;ll get back to you within 24-48 hours.</p>
                <button
                  ref={firstFocusableRef}
                  onClick={onClose}
                  className={`w-full sm:w-auto px-6 py-3 mt-4 glass-mono text-[var(--color-off-white)] rounded-lg font-medium text-xs uppercase tracking-[0.08em] transition-all duration-200 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-white)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-dark-gray)] ${CARD_HOVER}`}
                >
                  Close
                </button>
              </div>
          ) : (
            <div className="flex flex-col-reverse lg:flex-row w-full overflow-hidden">
              {/* Form */}
              <div className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 overflow-y-auto overflow-x-hidden max-h-[calc(98vh-8rem)] sm:max-h-[calc(95vh-6rem)] lg:max-h-[calc(90vh-4rem)] scrollbar-thin scrollbar-thumb-[var(--color-light-gray)] scrollbar-track-transparent scrollbar-thumb-rounded-full">
                <div className="mb-4 sm:mb-5 lg:mb-6">
                  <h2 id="contact-title" className="font-display text-xl sm:text-2xl font-normal tracking-tight text-white mb-1.5">Get in touch</h2>
<p className="text-[var(--color-accent-gray)] text-xs sm:text-sm leading-[1.55]">Share a little context and I will get back with the best next step.</p>
                </div>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-5 pb-4" aria-label="Contact form">
                  {/* Personal Details */}
                  <fieldset className="space-y-2 sm:space-y-3 lg:space-y-4">
                    <legend className="text-xs uppercase tracking-[0.12em] text-[var(--color-accent-gray)] mb-2">Personal details *</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      <div>
                        <label htmlFor="fullName" className="sr-only">Full Name</label>
                        <input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Full Name *"
                          required
                          autoComplete="name"
                          className="w-full bg-[var(--color-dark-gray)]/45 border border-[var(--color-medium-gray)]/80 text-[var(--color-white)] placeholder-[var(--color-accent-gray)] px-3 sm:px-3.5 py-2.5 rounded-lg focus:ring-2 focus:ring-[var(--color-white)]/70 focus:border-transparent transition-all text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="sr-only">Email Address</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email Address *"
                          required
                          autoComplete="email"
                          className="w-full bg-[var(--color-dark-gray)]/45 border border-[var(--color-medium-gray)]/80 text-[var(--color-white)] placeholder-[var(--color-accent-gray)] px-3 sm:px-3.5 py-2.5 rounded-lg focus:ring-2 focus:ring-[var(--color-white)]/70 focus:border-transparent transition-all text-sm focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label htmlFor="company" className="sr-only">Company or Organization</label>
                        <input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Company/Organization"
                          autoComplete="organization"
                          className="w-full bg-[var(--color-dark-gray)]/45 border border-[var(--color-medium-gray)]/80 text-[var(--color-white)] placeholder-[var(--color-accent-gray)] px-3 sm:px-3.5 py-2.5 rounded-lg focus:ring-2 focus:ring-[var(--color-white)]/70 focus:border-transparent transition-all text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="website" className="sr-only">LinkedIn or Website</label>
                        <input
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="LinkedIn/Website"
                          autoComplete="url"
                          className="w-full bg-[var(--color-dark-gray)]/45 border border-[var(--color-medium-gray)]/80 text-[var(--color-white)] placeholder-[var(--color-accent-gray)] px-3 sm:px-3.5 py-2.5 rounded-lg focus:ring-2 focus:ring-[var(--color-white)]/70 focus:border-transparent transition-all text-sm focus:outline-none"
                        />
                      </div>
                    </div>
                  </fieldset>

                  {/* Contact Intent */}
                  <fieldset className="space-y-1 sm:space-y-2 lg:space-y-3">
                    <legend className="text-xs uppercase tracking-[0.12em] text-[var(--color-accent-gray)] mb-2">Contact intent *</legend>
                    <label htmlFor="subject" className="sr-only">Select Query Type</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-[var(--color-dark-gray)]/45 border border-[var(--color-medium-gray)]/80 text-[var(--color-white)] px-3 sm:px-3.5 py-2.5 rounded-lg focus:ring-2 focus:ring-[var(--color-white)]/70 focus:border-transparent transition-all text-sm focus:outline-none"
                    >
                      <option value="">Select Query Type</option>
                      <option value="Job/Internship Opportunity">Job/Internship Opportunity</option>
                      <option value="Freelance/Collaboration">Freelance/Collaboration</option>
                      <option value="Technical Discussion">Technical Discussion</option>
                      <option value="Project Inquiry">Project Inquiry</option>
                      <option value="Other">Other</option>
                    </select>
                  </fieldset>

                  {/* Message */}
                  <fieldset className="space-y-1 sm:space-y-2 lg:space-y-3">
                    <legend className="text-xs uppercase tracking-[0.12em] text-[var(--color-accent-gray)] mb-2">Message *</legend>
                    <label htmlFor="message" className="sr-only">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project, ideas, or how we can work together..."
                      required
                      rows={3}
                      className="w-full bg-[var(--color-dark-gray)]/45 border border-[var(--color-medium-gray)]/80 text-[var(--color-white)] placeholder-[var(--color-accent-gray)] px-3 sm:px-3.5 py-2.5 rounded-lg focus:ring-2 focus:ring-[var(--color-white)]/70 focus:border-transparent transition-all resize-vertical min-h-[96px] text-sm focus:outline-none leading-[1.55]"
                    ></textarea>
                  </fieldset>

                  {/* Response Preferences */}
                  <fieldset className="space-y-2 sm:space-y-3 lg:space-y-4">
                    <legend className="text-xs uppercase tracking-[0.12em] text-[var(--color-accent-gray)] mb-2">Response preferences *</legend>
                    <div className="space-y-2 lg:space-y-3">
                      <div>
                        <span className="block text-[var(--color-off-white)]/85 mb-1 lg:mb-2 text-xs">Preferred contact method</span>
                        <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4" role="radiogroup" aria-label="Preferred Contact Method">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="contactMethod"
                              value="Email"
                              checked={formData.contactMethod === 'Email'}
                              onChange={handleChange}
                              className="text-[var(--color-white)] focus:ring-[var(--color-accent-gray)] w-3.5 h-3.5 sm:w-4 sm:h-4"
                            />
                            <span className="ml-1.5 text-[var(--color-off-white)]/85 text-xs">Email</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="contactMethod"
                              value="Phone"
                              checked={formData.contactMethod === 'Phone'}
                              onChange={handleChange}
                              className="text-[var(--color-white)] focus:ring-[var(--color-accent-gray)] w-3.5 h-3.5 sm:w-4 sm:h-4"
                            />
                            <span className="ml-1.5 text-[var(--color-off-white)]/85 text-xs">Phone</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="contactMethod"
                              value="LinkedIn Message"
                              checked={formData.contactMethod === 'LinkedIn Message'}
                              onChange={handleChange}
                              className="text-[var(--color-white)] focus:ring-[var(--color-accent-gray)] w-3.5 h-3.5 sm:w-4 sm:h-4"
                            />
                            <span className="ml-1.5 text-[var(--color-off-white)]/85 text-xs">LinkedIn</span>
                          </label>
                        </div>
                      </div>
                      {formData.contactMethod === 'Phone' && (
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Your Phone Number *"
                          className="w-full bg-[var(--color-dark-gray)]/45 border border-[var(--color-medium-gray)]/80 text-[var(--color-white)] placeholder-[var(--color-accent-gray)] px-3 sm:px-3.5 py-2.5 rounded-lg focus:ring-2 focus:ring-[var(--color-white)]/70 focus:border-transparent transition-all text-sm"
                        />
                      )}
                      <div>
                        <label className="block text-[var(--color-off-white)]/85 mb-1 lg:mb-2 text-xs">Best time to contact</label>
                        <select
                          name="availability"
                          value={formData.availability}
                          onChange={handleChange}
                          className="w-full bg-[var(--color-dark-gray)]/45 border border-[var(--color-medium-gray)]/80 text-[var(--color-white)] px-3 sm:px-3.5 py-2.5 rounded-lg focus:ring-2 focus:ring-[var(--color-white)]/70 focus:border-transparent transition-all text-sm"
                        >
                          <option value="">Any time is fine</option>
                          <option value="Morning">Morning (9AM - 12PM)</option>
                          <option value="Afternoon">Afternoon (12PM - 5PM)</option>
                          <option value="Evening">Evening (5PM - 9PM)</option>
                        </select>
                      </div>
                    </div>
                  </fieldset>

                  {/* File Upload */}
                  <div className="space-y-1 sm:space-y-2 lg:space-y-3">
                    <label htmlFor="attachments" className="block text-[var(--color-off-white)]/85 text-xs">
                      Attachments (PDF, DOC, DOCX, JPG, PNG - Max 10MB)
                    </label>
                    <input
                      id="attachments"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      className="w-full bg-[var(--color-dark-gray)]/45 border border-[var(--color-medium-gray)]/80 text-[var(--color-white)] text-xs file:mr-2 sm:file:mr-3 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-3 file:rounded-lg file:border-0 file:bg-[var(--color-light-gray)]/70 file:text-[var(--color-white)] hover:file:bg-[var(--color-accent-gray)] file:font-medium file:text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-white)]/70"
                    />
                  </div>

                  {/* Consent */}
                  <div className="flex items-start space-x-2 lg:space-x-3 py-1 sm:py-2">
                    <input
                      id="consent"
                      type="checkbox"
                      required
                      className="mt-0.5 lg:mt-1 text-[var(--color-white)] bg-[var(--color-dark-gray)] border-[var(--color-medium-gray)] rounded focus:ring-[var(--color-accent-gray)] focus:outline-none w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                    />
                    <label htmlFor="consent" className="text-[var(--color-off-white)]/85 text-[10px] sm:text-[11px] lg:text-xs cursor-pointer leading-tight">
                      I consent to processing my personal data for contact purposes. *
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    ref={firstFocusableRef}
                    className={`w-full glass-mono text-[var(--color-off-white)] py-3 px-4 rounded-lg font-medium tracking-[0.08em] uppercase text-xs transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-white)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-dark-gray)] min-h-[44px] ${CARD_HOVER}`}
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Direct Contact Info */}
              <div className="lg:w-72 xl:w-80 p-2.5 sm:p-3 md:p-4 lg:p-5 bg-[var(--color-off-black)]/40 rounded-lg lg:rounded-2xl mx-2.5 sm:mx-3 md:mx-4 lg:mx-5 mb-2.5 sm:mb-3 lg:mb-5 border border-[var(--color-medium-gray)]/70 lg:border-l lg:border-r-0 lg:border-t-0 lg:border-b-0">
                <h3 className="text-xs uppercase tracking-[0.12em] text-[var(--color-accent-gray)] mb-2 sm:mb-3 lg:mb-4 text-center">Direct contact</h3>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5 sm:gap-2 lg:gap-3">
                  <a
                    href={`mailto:${contact.email}?subject=Contact from Portfolio&body=Hi Vishal,`}
                    className={`group flex items-center gap-1.5 sm:gap-2 lg:gap-3 p-1.5 sm:p-2 lg:p-3 glass-mono rounded-lg text-xs sm:text-sm ${CARD_HOVER}`}
                  >
                    <div className="w-6 h-6 sm:w-8 lg:w-10 sm:h-8 lg:h-10 bg-[var(--color-light-gray)]/20 rounded-full flex items-center justify-center group-hover:bg-[var(--color-light-gray)]/30 transition-colors flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-4 lg:w-5 sm:h-4 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[var(--color-off-white)] font-medium group-hover:text-[var(--color-white)] transition-colors text-[11px] sm:text-xs lg:text-sm">Email</div>
                      <div className="text-[var(--color-accent-gray)] truncate text-[10px] hidden lg:block">{contact.email}</div>
                    </div>
                  </a>

                  <a
                    href={`tel:${contact.phone}`}
                    className={`group flex items-center gap-1.5 sm:gap-2 lg:gap-3 p-1.5 sm:p-2 lg:p-3 glass-mono rounded-lg text-xs sm:text-sm ${CARD_HOVER}`}
                  >
                    <div className="w-6 h-6 sm:w-8 lg:w-10 sm:h-8 lg:h-10 bg-[var(--color-medium-gray)]/20 rounded-full flex items-center justify-center group-hover:bg-[var(--color-medium-gray)]/30 transition-colors flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-4 lg:w-5 sm:h-4 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[var(--color-off-white)] font-medium group-hover:text-[var(--color-white)] transition-colors text-[11px] sm:text-xs lg:text-sm">Phone</div>
                      <div className="text-[var(--color-accent-gray)] truncate text-[10px] hidden lg:block">{contact.phone}</div>
                    </div>
                  </a>

                  <div className="group flex items-center gap-1.5 sm:gap-2 lg:gap-3 p-1.5 sm:p-2 lg:p-3 glass-mono rounded-lg text-xs sm:text-sm border border-[var(--color-medium-gray)]/75">
                    <div className="w-6 h-6 sm:w-8 lg:w-10 sm:h-8 lg:h-10 bg-[var(--color-light-gray)]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-4 lg:w-5 sm:h-4 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[var(--color-off-white)]/90 font-medium text-[11px] sm:text-xs lg:text-sm">Location</div>
                      <div className="text-[var(--color-accent-gray)] truncate text-[10px] hidden lg:block">{contact.location}</div>
                    </div>
                  </div>

                  <a
                    href={`https://www.linkedin.com/in/${contact.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-1.5 sm:gap-2 lg:gap-3 p-1.5 sm:p-2 lg:p-3 glass-mono rounded-lg text-xs sm:text-sm ${CARD_HOVER}`}
                  >
                    <div className="w-6 h-6 sm:w-8 lg:w-10 sm:h-8 lg:h-10 bg-[var(--color-light-gray)]/20 rounded-full flex items-center justify-center group-hover:bg-[var(--color-light-gray)]/30 transition-colors flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-4 lg:w-5 sm:h-4 lg:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[var(--color-off-white)] font-medium group-hover:text-[var(--color-white)] transition-colors text-[11px] sm:text-xs lg:text-sm">LinkedIn</div>
                      <div className="text-[var(--color-accent-gray)] truncate text-[10px] hidden lg:block">/{contact.linkedin}</div>
                    </div>
                  </a>

                  <a
                    href={`https://codeforces.com/profile/${contact.codeforces}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-1.5 sm:gap-2 lg:gap-3 p-1.5 sm:p-2 lg:p-3 glass-mono rounded-lg text-xs sm:text-sm ${CARD_HOVER}`}
                  >
                    <div className="w-6 h-6 sm:w-8 lg:w-10 sm:h-8 lg:h-10 bg-[var(--color-light-gray)]/20 rounded-full flex items-center justify-center group-hover:bg-[var(--color-light-gray)]/30 transition-colors overflow-hidden flex-shrink-0">
                      <img src="/cf-image.png" alt="Codeforces" width="20" height="20" className="w-4 h-4 sm:w-5 lg:w-6 sm:h-5 lg:h-6" loading="lazy" decoding="async" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[var(--color-off-white)] font-medium group-hover:text-[var(--color-white)] transition-colors text-[11px] sm:text-xs lg:text-sm">Codeforces</div>
                      <div className="text-[var(--color-accent-gray)] truncate text-[10px] hidden lg:block">{contact.codeforces}</div>
                    </div>
                  </a>
                </div>
                <div className="mt-3 sm:mt-4 lg:mt-6 p-2 sm:p-3 lg:p-4 bg-gradient-to-r from-[var(--color-medium-gray)]/16 to-[var(--color-light-gray)]/8 border border-[var(--color-accent-gray)]/25 rounded-lg col-span-2 lg:col-span-1">
                  <p className="text-[11px] sm:text-xs text-[var(--color-off-white)]/85 text-center font-medium leading-[1.5]">
                    <strong>24-48 hour response time</strong>
                    <br />
<span className="text-[var(--color-accent-gray)]">Let&#39;s build something amazing!</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[var(--color-accent-gray)] hover:text-[var(--color-white)] transition-colors z-10 p-2 hover:bg-[var(--color-dark-gray)]/70 border border-transparent hover:border-[var(--color-medium-gray)]/70 rounded-full touch-manipulation"
            aria-label="Close contact popup"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
