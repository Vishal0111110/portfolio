'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInWebAppiOS = (window.navigator as Navigator & { standalone?: boolean })?.standalone === true

    if (isStandalone || isInWebAppiOS) {
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default install prompt
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show custom install prompt after a delay
      setTimeout(() => {
        setShowInstallPrompt(true)
      }, 3000) // Show after 3 seconds
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
    } catch (error) {
      console.error('Error during install prompt:', error)
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Remember that user dismissed the prompt
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  if (!showInstallPrompt) return null

  return (
    <div id="install-prompt" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-[100] animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-[var(--color-dark-gray)]/95 backdrop-blur-xl border border-[var(--color-medium-gray)] rounded-xl p-4 shadow-2xl shadow-[var(--color-black)]/50 max-w-md">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-nothing-red)] to-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">Install App</span>
          </div>
          <p className="text-[var(--color-accent-gray)] text-xs leading-relaxed">
            Install Vishal&#39;s Portfolio as an app for the best experience!
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleInstallClick}
            className="flex-1 sm:flex-none bg-[var(--color-white)] hover:bg-[var(--color-off-white)] text-[var(--color-black)] px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-nothing-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-dark-gray)]"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 sm:flex-none bg-transparent hover:bg-[var(--color-medium-gray)]/30 text-[var(--color-accent-gray)] hover:text-[var(--color-off-white)] px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-nothing-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-dark-gray)]"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  )
}
