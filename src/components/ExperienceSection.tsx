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
    type: string
    description: string[]
    link: string
  }>
}

// Calculate total duration for a company
function calculateTotalDuration(roles: GroupedExperience['roles']): string {
  if (roles.length === 1) return roles[0].period
  // For multiple roles, show the earliest start to latest end
  const earliestStart = roles[roles.length - 1].period.split(' – ')[0]
  const latestEnd = roles[0].period.split(' – ')[1]
  return `${earliestStart} – ${latestEnd}`
}

export default function ExperienceSection({ experience }: { experience: Experience }) {
  // Group experiences by company and reverse roles to show most recent first
  const groupedExperience = experience.reduce((acc: GroupedExperience[], exp) => {
    const existingGroup = acc.find(group => group.company === exp.company)
    if (existingGroup) {
      existingGroup.roles.unshift({
        position: exp.position,
        period: exp.period,
        type: exp.type,
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
          type: exp.type,
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
              <h3 className="text-lg font-semibold text-white">{group.company}</h3>
              <p className="text-sm text-gray-400 mt-0.5">{group.location}</p>
            </div>

            {/* Roles with Timeline */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-3 top-2 bottom-0 w-0.5 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-600" />
              
              {group.roles.map((role, roleIndex) => (
                <div key={role.position} className="relative pl-8 pb-5 last:pb-0">
                  {/* Circular Dot Centered on Line */}
                  <div className={`absolute left-[5.65px] top-4 w-3.5 h-3.5 rounded-full border-2 ${
                    roleIndex === 0 ? 'border-gray-500 bg-white' : 'border-gray-600 bg-gray-800'
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
                          <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] bg-gray-800/50 text-gray-300 rounded border border-gray-700">
                            {role.type}
                          </span>
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
