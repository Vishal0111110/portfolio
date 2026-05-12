import Link from 'next/link'

export default function CaseStudyNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-[var(--color-off-black)] text-[var(--color-off-white)]">
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-nothing-red)] mb-3">Case study</p>
      <h1 className="font-display text-2xl text-white mb-6">Not found</h1>
      <p className="text-[var(--color-accent-gray)] text-sm mb-8 text-center max-w-md">
        This write-up does not exist or was moved.
      </p>
      <Link href="/#projects" className="text-sm tracking-[0.01em] text-[var(--color-nothing-red)] hover:text-white transition-colors">
        ← Back to projects
      </Link>
    </div>
  )
}
