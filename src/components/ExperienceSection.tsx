import ChapterSection from '@/components/ChapterSection'
import { CARD_HOVER } from '@/lib/cardHover'
import TiltCard from '@/components/TiltCard'
import type { Experience } from '@/data/experience'

interface GroupedExperience {
  company: string
  location: string
  roles: Array<{
    position: string
    period: string
    description: string[]
    link: string
  }>
}

// Calculate total duration for a company
function calculateTotalDuration(roles: GroupedExperience['roles']): string {
  // Simple calculation - in a real app you'd parse dates properly
  const roleCount = roles.length
  if (roleCount === 1) return roles[0].period
  return `${roleCount} roles`
}

export default function ExperienceSection({ experience }: { experience: Experience }) {
  // Group experiences by company
  const groupedExperience = experience.reduce((acc: GroupedExperience[], exp) => {
    const existingGroup = acc.find(group => group.company === exp.company)
    if (existingGroup) {
      existingGroup.roles.push({
        position: exp.position,
        period: exp.period,
        description: exp.description,
        link: exp.link
      })
    } else {
      acc.push({
        company: exp.company,
        location: exp.location,
        roles: [{
          position: exp.position,
          period: exp.period,
          description: exp.description,
          link: exp.link
        }]
      })
    }
    return acc
  }, [])

  return (
    <ChapterSection
      sectionId="experience"
      titleId="experience-heading"
      eyebrow="Timeline"
      title="Experience"
      blurb="Work I shipped with real users, real deadlines, and real constraints."
    >
      <div className="space-y-6 sm:space-y-8">
        {groupedExperience.map((group, groupIndex) => (
          <div 
            key={group.company} 
            className="relative animate-slide-up stagger-${Math.min(groupIndex + 1, 6)} is-visible"
          >
            {/* Company Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold text-white">{group.company}</h3>
                <span className="text-xs text-gray-400">· {calculateTotalDuration(group.roles)}</span>
              </div>
              <p className="text-sm text-gray-400 mt-0.5">{group.location}</p>
            </div>

            {/* Roles with Timeline */}
            <div className="relative pl-4 sm:pl-6 ml-6 sm:ml-8">
              {/* Vertical Line */}
              <div className="absolute left-[7px] sm:left-[11px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-500 via-gray-600 to-gray-700" />
              
              {group.roles.map((role, roleIndex) => (
                <div key={role.position} className="relative pb-5 last:pb-0">
                  {/* Timeline Dot */}
                  <div className={`absolute left-[-15px] sm:left-[-19px] top-2 w-2.5 h-2.5 rounded-full border-2 ${
                    roleIndex === 0 
                      ? 'bg-white border-gray-400 shadow-md' 
                      : 'bg-gray-800 border-gray-500'
                  }`} />
                  
                  {/* Role Card */}
                  <TiltCard
                    className={`group block glass-mono p-4 sm:p-5 rounded-xl ${CARD_HOVER} touch-manipulation mobile-card relative overflow-hidden`}
                  >
                    <a
                      href={role.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base sm:text-lg font-semibold tracking-tight leading-tight text-white mb-1.5">
                            {role.position}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] bg-gray-800/50 text-gray-300 rounded border border-gray-700">
                              {roleIndex === 0 ? 'Full-time' : 'Internship'}
                            </span>
                          </div>
                        </div>
                        <span className="text-gray-400 mt-2 sm:mt-0 text-xs sm:text-sm tracking-[0.02em] whitespace-nowrap">
                          {role.period}
                        </span>
                      </div>
                      <ul className="space-y-2 text-gray-300">
                        {role.description.map((item, idx) => (
                          <li key={idx} className="flex items-start text-sm leading-[1.5]">
                            <span className="text-[var(--color-accent-gray)] mr-2.5 mt-1.5 flex-shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </a>
                  </TiltCard>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ChapterSection>
  )
}
