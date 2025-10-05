export default function Footer() {
  return (
<footer className="relative z-10 flex flex-col items-center justify-center py-8 px-4 text-center overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        <div className="absolute right-1/4 top-3/4 w-20 h-20 bg-purple-600/10 rotate-45 animate-pulse rounded-full"></div>
        <div className="absolute left-1/4 bottom-1/4 w-16 h-16 border border-purple-400/30 rounded animate-ping"></div>
        <div className="absolute right-2/3 bottom-1/3 w-12 h-12 bg-purple-600/5 animate-bounce"></div>
      </div>
      <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-gray-400 text-sm">
            © 2025 Buyyarapu Vishal. Built with Next.js and TailwindCSS.
          </div>
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/in/buyyarapuvishal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-purple-300 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <a
              href="https://codeforces.com/profile/ArminArlert69"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-purple-300 transition-colors text-sm"
            >
              <img src="/cf-image.png" alt="Codeforces" className="w-4 h-4" />
              Codeforces
            </a>
            <a
              href="mailto:buyyarapuvishalgaurav616@gmail.com?subject=Contact from Portfolio&body=Hi Vishal,"
              className="flex items-center gap-2 text-gray-400 hover:text-purple-300 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
