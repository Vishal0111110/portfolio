import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { CaseStudyContent } from '@/data/projects'
import { getProjectCaseStudy, projectSlugs } from '@/data/projects'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return projectSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const data = getProjectCaseStudy(params.slug)
  if (!data) {
    return { title: 'Case study' }
  }
  return {
    title: `${data.project.name} — Case study`,
    description: data.caseStudy.headline,
    openGraph: {
      title: `${data.project.name} — Case study`,
      description: data.caseStudy.headline,
    },
  }
}

const fields: { key: keyof CaseStudyContent; label: string }[] = [
  { key: 'problem', label: 'Problem' },
  { key: 'constraints', label: 'Constraints' },
  { key: 'approach', label: 'Approach' },
  { key: 'outcome', label: 'Outcome' },
  { key: 'redo', label: 'What I’d redo' },
]

export default function CaseStudyPage({ params }: Props) {
  const data = getProjectCaseStudy(params.slug)
  if (!data) {
    notFound()
  }
  const { project, caseStudy } = data

  return (
    <div className="min-h-screen bg-[var(--color-off-black)] text-[var(--color-off-white)]">
      <header className="border-b border-[var(--color-medium-gray)]/70">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 safe-area-left safe-area-right">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-nothing-red)] mb-3">Case study</p>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-white tracking-tight mb-3">{project.name}</h1>
          <p className="text-sm sm:text-base text-[var(--color-accent-gray)] leading-[1.6]">{caseStudy.headline}</p>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.12em] text-[var(--color-accent-gray)] hover:text-[var(--color-nothing-red)] transition-colors"
            >
              Repository →
            </a>
            <Link href="/#projects" className="text-xs uppercase tracking-[0.12em] text-[var(--color-nothing-red)] hover:text-white transition-colors">
              ← Back to projects
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 sm:py-14 space-y-5 sm:space-y-6 safe-area-left safe-area-right">
        {fields.map(({ key, label }) => (
          <section key={key} aria-labelledby={`cs-${key}`} className="glass-mono rounded-xl border border-[var(--color-medium-gray)]/60 p-4 sm:p-5">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.12em] text-[var(--color-accent-gray)] mb-2">
              {label}
            </p>
            <h2 id={`cs-${key}`} className="font-display text-lg sm:text-xl text-white mb-2 font-normal tracking-tight">
              {label}
            </h2>
            <p className="text-[var(--color-off-white)] leading-[1.65] text-sm sm:text-base tracking-[0.005em]">{caseStudy[key]}</p>
          </section>
        ))}
      </main>

      <footer className="border-t border-[var(--color-medium-gray)]/60 py-8 sm:py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Link href="/" className="text-xs uppercase tracking-[0.12em] text-[var(--color-accent-gray)] hover:text-white transition-colors">
            Home
          </Link>
        </div>
      </footer>
    </div>
  )
}
