// Barrel file for all data exports
// Phase 8: Data Structure Reorganization

export { personalInfo, type PersonalInfo } from './personalInfo'
export { experience, type Experience } from './experience'
export { education, type Education } from './education'
export { projects, type Projects } from './projects'
export { skills, type Skills } from './skills'
export { achievements, type Achievements } from './achievements'
export { certifications, type Certifications } from './certifications'
export { cpStats, type CPStats, getTopRating, getPlatformCount, getPrimaryLanguage } from './cpStats'
export { 
  terminalCommands, 
  type Command, 
  getCommand, 
  getAllCommandNames 
} from './terminalCommands'
export { 
  cpFacts, 
  getRandomCPFact, 
  getCPFactByTopic, 
  getCPFactById,
  printConsoleEasterEgg 
} from './cpFacts'

// Backward compatible aggregated export
export { resumeData, type ResumeData } from './resume'
