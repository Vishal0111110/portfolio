import { personalInfo } from './personalInfo'
import { experience } from './experience'
import { projects } from './projects'
import { skills } from './skills'
import { achievements } from './achievements'
import { certifications } from './certifications'
import { education } from './education'
import { cpStats } from './cpStats'
import { cpFacts, getRandomCPFact } from './cpFacts'

export interface Command {
  name: string
  aliases?: string[]
  description: string
  usage?: string
  handler: (args: string[]) => string | string[]
  hidden?: boolean
}

export const terminalCommands: Command[] = [
  {
    name: 'help',
    aliases: ['h', '?', 'commands'],
    description: 'Show available commands',
    handler: () => {
      const visibleCommands = terminalCommands.filter(cmd => !cmd.hidden)
      return [
        'Available Commands:',
        '',
        ...visibleCommands.map(cmd => 
          `  ${cmd.name.padEnd(12)} - ${cmd.description}${cmd.aliases ? ` (aliases: ${cmd.aliases.join(', ')})` : ''}`
        ),
        '',
        'Tip: Use ↑↓ arrows for command history, Tab for autocomplete'
      ]
    }
  },
  {
    name: 'about',
    aliases: ['info', 'whoami'],
    description: 'Display personal information and summary',
    handler: () => [
      `${personalInfo.name}`,
      `${personalInfo.location}`,
      '',
      'Summary:',
      ...personalInfo.summary.split('. ').map(s => s.trim()).filter(Boolean).map(s => `  • ${s}${s.endsWith('.') ? '' : '.'}`),
      '',
      'Contact:',
      `  Email: ${personalInfo.contact.email}`,
      `  Phone: ${personalInfo.contact.phone}`,
      `  LinkedIn: ${personalInfo.contact.linkedin}`,
      `  Codeforces: ${personalInfo.contact.codeforces}`
    ]
  },
  {
    name: 'experience',
    aliases: ['exp', 'work'],
    description: 'Show work experience',
    handler: () => {
      const lines = ['Work Experience:', '']
      experience.forEach(exp => {
        lines.push(`Company: ${exp.company}`)
        lines.push(`   Position: ${exp.position}`)
        lines.push(`   Location: ${exp.location}`)
        lines.push(`   Period: ${exp.period}`)
        lines.push('   Highlights:')
        exp.description.forEach(desc => lines.push(`     • ${desc}`))
        lines.push('')
      })
      return lines
    }
  },
  {
    name: 'projects',
    aliases: ['proj', 'work'],
    description: 'List all projects',
    handler: (args) => {
      if (args[0] === 'count') {
        return `Total Projects: ${projects.length}`
      }
      const lines = ['Projects:', '']
      projects.forEach((proj, i) => {
        lines.push(`${i + 1}. ${proj.name} (${proj.date})`)
        lines.push(`   Tech: ${proj.tech}`)
        lines.push(`   Link: ${proj.link}`)
        lines.push('')
      })
      return lines
    }
  },
  {
    name: 'skills',
    aliases: ['tech', 'stack'],
    description: 'Display technical skills',
    handler: () => [
      'Technical Skills:',
      '',
      'Languages & Core:',
      ...skills.languagesCore.map(s => `  • ${s}`),
      '',
      'Frameworks & Tools:',
      ...skills.frameworksTools.map(s => `  • ${s}`),
      '',
      'Development Tools:',
      ...skills.tools.map(s => `  • ${s}`)
    ]
  },
  {
    name: 'achievements',
    aliases: ['achieve', 'awards'],
    description: 'Show achievements and awards',
    handler: () => {
      const lines = ['Achievements:', '']
      achievements.slice(0, 5).forEach((ach, i) => {
        lines.push(`${i + 1}. ${ach.text}`)
        if (ach.date) lines.push(`   Date: ${ach.date}`)
        lines.push('')
      })
      lines.push(`Total: ${achievements.length} achievements`)
      return lines
    }
  },
  {
    name: 'education',
    aliases: ['edu', 'study'],
    description: 'Show education details',
    handler: () => [
      'Education:',
      '',
      `Institution: ${education.institution}`,
      `Degree: ${education.degree}`,
      `GPA: ${education.gpa}`,
      `Period: ${education.period}`,
      `Location: ${education.location}`
    ]
  },
  {
    name: 'cp',
    aliases: ['coding', 'stats', 'cpstats'],
    description: 'Show competitive programming stats',
    handler: () => [
      'Competitive Programming Stats:',
      '',
      `Total Problems Solved: ${cpStats.totalSolved}`,
      '',
      'Best Rankings:',
      ...cpStats.bestRankings.map(r => `  • ${r.platform}: ${r.rank} (${r.rating})`),
      '',
      'Favorite Topics:',
      ...cpStats.favoriteTopics.map(t => `  • ${t}`),
      '',
      'Primary Language: C++ (95%)'
    ]
  },
  {
    name: 'cpfact',
    aliases: ['fact', 'trivia'],
    description: 'Show a random CP fact',
    handler: () => {
      const fact = getRandomCPFact()
      return [
        `${fact.topic}:`,
        '',
        fact.fact,
        '',
        `${fact.detail}`
      ]
    }
  },
  {
    name: 'clear',
    aliases: ['cls'],
    description: 'Clear the terminal screen',
    handler: () => 'CLEAR'
  },
  {
    name: 'date',
    aliases: ['time', 'now'],
    description: 'Show current date and time',
    handler: () => {
      const now = new Date()
      return [
        'Current Date & Time:',
        now.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      ]
    }
  },
  {
    name: 'contact',
    aliases: ['email', 'reach'],
    description: 'Show contact information',
    handler: () => [
      'Contact Information:',
      '',
      `Name: ${personalInfo.name}`,
      `Email: ${personalInfo.contact.email}`,
      `Phone: ${personalInfo.contact.phone}`,
      `LinkedIn: linkedin.com/in/${personalInfo.contact.linkedin}`,
      `Codeforces: ${personalInfo.contact.codeforces}`,
      '',
      'Open to opportunities in:',
      '  • Software Engineering',
      '  • Competitive Programming',
      '  • Full-Stack Development'
    ]
  },
  {
    name: 'secret',
    aliases: ['easter', 'egg'],
    description: '???',
    hidden: true,
    handler: () => [
      'Easter Egg Activated!',
      '',
      '╔══════════════════════════════════════╗',
      '║  CONGRATULATIONS!                   ║',
      '║                                      ║',
      '║  You found the secret command!       ║',
      '║                                      ║',
      '║  Try these other secrets:            ║',
      '║  • konami - Konami code info         ║',
      '║  • matrix - Matrix mode              ║',
      '║  • game - Play games                 ║',
      '╚══════════════════════════════════════╝'
    ]
  },
  {
    name: 'konami',
    aliases: ['cheat', 'code'],
    description: 'Show Konami code information',
    hidden: true,
    handler: () => [
      'Konami Code Easter Egg:',
      '',
      'Enter this sequence anywhere on the page:',
      '',
      '   ↑ ↑ ↓ ↓ ← → ← → B A',
      '',
      'Or type the command: "konami"',
      '',
      'History: The Konami Code was created by Kazuhisa Hashimoto in 1986',
      'for the NES version of Gradius. It became the most famous cheat code',
      'in gaming history!'
    ]
  },
  {
    name: 'certifications',
    aliases: ['certs', 'badges'],
    description: 'Show certifications and credentials',
    handler: () => {
      const lines = ['Certifications:', '']
      certifications.forEach((cert, i) => {
        lines.push(`${i + 1}. ${cert.text}`)
        lines.push(`   Issuer: ${cert.issuer}`)
        lines.push(`   Date: ${cert.date}`)
        if (cert.url) lines.push(`   URL: ${cert.url}`)
        lines.push('')
      })
      lines.push(`Total: ${certifications.length} certifications`)
      return lines
    }
  },
  {
    name: 'social',
    aliases: ['links', 'profiles'],
    description: 'Show social media and coding profiles',
    handler: () => [
      'Social & Coding Profiles:',
      '',
      'Professional:',
      `  • LinkedIn: linkedin.com/in/${personalInfo.contact.linkedin}`,
      `  • Email: ${personalInfo.contact.email}`,
      '',
      'Competitive Programming:',
      `  • Codeforces: codeforces.com/profile/${personalInfo.contact.codeforces}`,
      '  • CodeChef: codechef.com/users/vishal_616',
      '  • LeetCode: leetcode.com/u/VishalBuyyarapu/',
      '',
      'Contact:',
      `  • Phone: ${personalInfo.contact.phone}`,
      `  • Location: ${personalInfo.location}`
    ]
  },
  {
    name: 'resume',
    aliases: ['cv', 'download'],
    description: 'Get resume download link',
    handler: () => [
      'Resume:',
      '',
      'Download my resume:',
      'https://drive.google.com/file/d/1ZiK0D0uLYT3gWX7uJs23-PLXt8FWjhTa/view?usp=sharing',
      '',
      'Summary:',
      'Software Engineer with strong competitive programming background',
      'and experience in distributed systems and microservices architecture.'
    ]
  },
  {
    name: 'whoami',
    aliases: ['me', 'user'],
    description: 'Display current user info',
    handler: () => [
      'User Information:',
      '',
      `Name: ${personalInfo.name}`,
      `Role: Software Engineer`,
      `Location: ${personalInfo.location}`,
      `Status: Available for opportunities`,
      '',
      'Specialties:',
      '  • Competitive Programming',
      '  • Distributed Systems',
      '  • Full-Stack Development',
      '  • System Architecture'
    ]
  },
  {
    name: 'matrix',
    aliases: ['rain', 'codefall'],
    description: '???',
    hidden: true,
    handler: () => [
      'Matrix Mode:',
      '',
      'Wake up, Neo...',
      'The Matrix has you...',
      '',
      'Follow the white rabbit.'
    ]
  },
  {
    name: 'hack',
    aliases: ['1337', 'elite'],
    description: '???',
    hidden: true,
    handler: () => [
      'Hacker Mode:',
      '',
      'Accessing mainframe...',
      '[████████████] 100%',
      '',
      'Just kidding!',
      'Try: cpfact for actual CS facts'
    ]
  },
  {
    name: 'joke',
    aliases: ['funny', 'laugh'],
    description: '???',
    hidden: true,
    handler: () => [
      'Programming Joke:',
      '',
      'Why do programmers prefer dark mode?',
      '',
      'Because light attracts bugs!',
      '',
      '(Toggle dark mode in the navbar)'
    ]
  }
]

// Helper function to get command by name or alias
export function getCommand(input: string): Command | undefined {
  const lowerInput = input.toLowerCase()
  return terminalCommands.find(cmd => 
    cmd.name === lowerInput || 
    cmd.aliases?.includes(lowerInput)
  )
}

// Get all command names for autocomplete
export function getAllCommandNames(): string[] {
  const names: string[] = []
  terminalCommands.forEach(cmd => {
    names.push(cmd.name)
    if (cmd.aliases) names.push(...cmd.aliases)
  })
  return names
}
