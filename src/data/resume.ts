// Aggregated resume data - imports from all modular data files
// This file provides backward compatibility while the new modular files
// are organized by domain (personalInfo, experience, projects, etc.)

import { personalInfo } from './personalInfo'
import { experience } from './experience'
import { projects } from './projects'
import { skills } from './skills'
import { achievements } from './achievements'
import { certifications } from './certifications'
import { education } from './education'
import { cpStats } from './cpStats'

// Re-export all individual data modules for direct imports
export { personalInfo, experience, projects, skills, achievements, certifications, education, cpStats }

// Export aggregated resumeData for backward compatibility
export const resumeData = {
  // Personal Info
  name: personalInfo.name,
  location: personalInfo.location,
  contact: personalInfo.contact,
  summary: personalInfo.summary,

  // Professional
  experience: experience,
  projects: projects,

  // Education
  education: education,

  // Skills (backward compatible format)
  skills: {
    languages: skills.languages,
    frameworks: skills.frameworks,
    tools: skills.toolsLegacy
  },

  // Extended skills structure
  skillsExtended: {
    languagesCore: skills.languagesCore,
    frameworksTools: skills.frameworksTools,
    tools: skills.tools
  },

  // Coding Profiles (from cpStats)
  codingProfiles: cpStats.bestRankings.map(r => ({
    platform: r.platform,
    rating: r.rating.toString(),
    rank: r.rank,
    url: r.url
  })),

  // CP Stats
  cpStats: cpStats,

  // Achievements and Certifications
  achievements: achievements.map(a => ({
    text: a.text,
    url: a.url
  })),
  certifications: certifications.map(c => ({
    text: c.text,
    url: c.url
  }))
}

// Type export for backward compatibility
export type ResumeData = typeof resumeData
