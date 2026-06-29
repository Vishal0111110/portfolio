import ChapterSection from '@/components/ChapterSection'
import { CARD_HOVER } from '@/lib/cardHover'
import TiltCard from '@/components/TiltCard'
import type { Experience } from '@/data/experience'

export default function ExperienceSection({ experience }: { experience: Experience }) {
  return (
    <ChapterSection
      sectionId="experience"
      titleId="experience-heading"
      eyebrow="Timeline"
      title="Experience"
      blurb="Work I shipped with real users, real deadlines, and real constraints."
    >
      <div className="space-y-4 sm:space-y-6">
        {experience.map((exp, index) => (
          <TiltCard
            key={`${exp.company}-${index}`}
            className={`group block glass-mono p-4 sm:p-5 rounded-xl ${CARD_HOVER} touch-manipulation mobile-card relative overflow-hidden`}
          >
            <a
              href={exp.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold tracking-tight leading-tight text-white mb-1">{exp.position}</h3>
                <p className="text-[var(--color-off-white)] font-medium text-sm leading-[1.5]">
                  {exp.company} • {exp.location}
                </p>
              </div>
              <span className="text-gray-400 mt-2 sm:mt-0 text-xs sm:text-sm tracking-[0.02em] whitespace-nowrap">{exp.period}</span>
            </div>
            <ul className="space-y-2 text-gray-300">
              {exp.description.map((item, idx) => (
                <li key={idx} className="flex items-start text-sm leading-[1.5]">
                  <span className="text-[var(--color-accent-gray)] mr-2.5 mt-1.5 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            </a>
          </TiltCard>
        ))}
      </div>
    </ChapterSection>
  )
}
