import Link from 'next/link'
import ChapterSection from '@/components/ChapterSection'
import { CARD_HOVER } from '@/lib/cardHover'
import TiltCard from '@/components/TiltCard'
import type { ProjectEntry } from '@/data/projects'

export default function ProjectSection({ projects, showAll = false, onToggle }: { projects: ProjectEntry[]; showAll?: boolean; onToggle?: () => void }) {
  return (
    <ChapterSection
      sectionId="projects"
      titleId="projects-heading"
      eyebrow="Selected work"
      title="Projects"
      blurb="Built with real constraints, refined with real feedback. Start with the outcome, then open the repo for details."
    >
      <div className="relative space-y-4 sm:space-y-6">
        {projects.slice(0, showAll ? undefined : 3).map((project, index) => {
          const metaParts = [project.role, project.tech, project.date].filter(Boolean)
          const meta = metaParts.join(' · ')
          return (
            <TiltCard
              key={`${project.name}-${index}`}
              className={`glass-mono p-4 sm:p-5 rounded-xl ${CARD_HOVER} touch-manipulation mobile-card relative overflow-hidden animate-slide-up stagger-${Math.min(index + 1, 6)} is-visible`}
            >
              <article className="block w-full h-full">
              <span className="absolute top-4 right-4 text-[10px] tracking-[0.08em] text-[var(--color-accent-gray)] tabular-nums opacity-70">
                {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-2 mb-3 pr-14">
                <h3 className="text-lg sm:text-xl font-semibold tracking-tight leading-tight text-white">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--color-off-white)] transition-colors underline-offset-4 hover:underline"
                  >
                    {project.name}
                  </a>
                </h3>
                <p className="text-xs text-[var(--color-accent-gray)] leading-[1.45] break-words">{meta}</p>
              </div>
              {project.outcome ? (
                <p className="text-sm text-[var(--color-off-white)] font-medium leading-[1.5] mb-3.5 border-l border-[var(--color-nothing-red)]/40 pl-3">
                  {project.outcome}
                </p>
              ) : null}
              <ul className="space-y-2 text-gray-300 mb-4">
                {project.description.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm leading-[1.5]">
                    <span className="text-[var(--color-accent-gray)] mr-2.5 mt-1.5 flex-shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2.5 border-t border-[var(--color-medium-gray)]/50">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.12em] text-[var(--color-accent-gray)] hover:text-[var(--color-nothing-red)] transition-colors"
                >
                  Repository →
                </a>
                {project.slug && project.caseStudy ? (
                  <Link
                    href={`/work/${project.slug}`}
                    className="text-xs uppercase tracking-[0.12em] text-[var(--color-nothing-red)] hover:text-[var(--color-white)] transition-colors"
                  >
                    Case study →
                  </Link>
                ) : null}
              </div>
              </article>
            </TiltCard>
          )
        })}
      </div>

      {projects.length > 3 && onToggle && (
        <button
          onClick={onToggle}
          className="w-full py-3 text-xs uppercase tracking-[0.12em] text-[var(--color-accent-gray)] hover:text-[var(--color-nothing-red)] transition-colors border border-[var(--color-medium-gray)]/50 rounded-lg hover:border-[var(--color-nothing-red)]/50"
        >
          {showAll ? 'Show Less' : `View All ${projects.length} Projects`}
        </button>
      )}
    </ChapterSection>
  )
}
