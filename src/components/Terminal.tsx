'use client'

import { useState, useEffect, useRef } from 'react'
import { resumeData } from '@/data/resume'

interface Command {
  name: string
  description: string
  handler: (args: string[]) => string
}

interface TerminalProps {
  isOpen?: boolean
  onToggle?: () => void
}

export default function Terminal({ isOpen: externalIsOpen, onToggle }: TerminalProps) {
  const [isOpen, setIsOpen] = useState(externalIsOpen ?? false)
  
  // Sync with external state
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen)
    }
  }, [externalIsOpen])
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<string[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  
  // Game states
  const [gameState, setGameState] = useState<'idle' | 'rps' | 'guess' | 'hangman' | 'matrix'>('idle')
  
  // Rock Paper Scissors state
  const [rpsScore, setRpsScore] = useState({ player: 0, computer: 0, ties: 0 })
  const [rpsStreak, setRpsStreak] = useState(0)
  const [rpsBestStreak, setRpsBestStreak] = useState(0)
  const [rpsHistory, setRpsHistory] = useState<Array<{player: string, computer: string, result: string}>>([])
  const [rpsMode, setRpsMode] = useState<'classic' | 'bestOf3' | 'bestOf5'>('classic')
  const [rpsRound, setRpsRound] = useState(0)
  
  // Number Guessing Game state
  const [guessTarget, setGuessTarget] = useState(0)
  const [guessAttempts, setGuessAttempts] = useState(0)
  const [guessHistory, setGuessHistory] = useState<Array<{guess: number, hint: string, temp: string}>>([])
  const [guessDifficulty, setGuessDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [guessHintsUsed, setGuessHintsUsed] = useState(0)
  const [guessMaxHints, setGuessMaxHints] = useState(3)
  const [guessStartTime, setGuessStartTime] = useState<number>(0)
  const [guessStats, setGuessStats] = useState({ games: 0, totalAttempts: 0, bestGame: Infinity })
  
  // Hangman state
  const [hangmanWord, setHangmanWord] = useState('')
  const [hangmanGuessed, setHangmanGuessed] = useState<string[]>([])
  const [hangmanWrong, setHangmanWrong] = useState(0)
  const [hangmanCategory, setHangmanCategory] = useState<'programming' | 'algorithms' | 'technology' | 'mixed'>('mixed')
  const [hangmanDifficulty, setHangmanDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [hangmanStreak, setHangmanStreak] = useState(0)
  const [hangmanHintsUsed, setHangmanHintsUsed] = useState(0)
  const [hangmanMaxHints, setHangmanMaxHints] = useState(2)
  const [hangmanWins, setHangmanWins] = useState(0)
  const [hangmanGames, setHangmanGames] = useState(0)
  
  // Matrix state
  const [matrixTheme, setMatrixTheme] = useState<'green' | 'amber' | 'cyan' | 'red'>('green')
  const [matrixSpeed, setMatrixSpeed] = useState<'slow' | 'normal' | 'fast'>('normal')

  // Helper functions for games
  const getSymbol = (choice: string) => {
    const symbols: Record<string, string> = {
      rock: '[R]',
      paper: '[P]',
      scissors: '[S]'
    };
    return symbols[choice] || '[?]';
  };

  const getHangmanDisplay = (word: string, guessed: string[]) => {
    return word.split('').map(letter => 
      guessed.includes(letter.toUpperCase()) ? letter : '_'
    ).join(' ');
  };

  const drawHangman = (wrong: number) => {
    const stages = [
      `
     +---+
     |   |
         |
         |
         |
         |
    =========
      `,
      `
     +---+
     |   |
     O   |
         |
         |
         |
    =========
      `,
      `
     +---+
     |   |
     O   |
     |   |
         |
         |
    =========
      `,
      `
     +---+
     |   |
     O   |
    /|   |
         |
         |
    =========
      `,
      `
     +---+
     |   |
     O   |
    /|\\  |
         |
         |
    =========
      `,
      `
     +---+
     |   |
     O   |
    /|\\  |
    /    |
         |
    =========
      `,
      `
     +---+
     |   |
     O   |
    /|\\  |
    / \\  |
         |
    =========
      `
    ];
    return stages[Math.min(wrong, stages.length - 1)];
  };

  // Enhanced helper functions
  const getTemperatureBar = (distance: number, maxDistance: number = 50) => {
    const percentage = Math.max(0, Math.min(100, 100 - (distance / maxDistance) * 100));
    const filled = Math.round(percentage / 10);
    const empty = 10 - filled;
    const bar = '#'.repeat(filled) + '.'.repeat(empty);
    let temp = 'FREEZING';
    if (percentage > 80) temp = 'BOILING';
    else if (percentage > 60) temp = 'HOT';
    else if (percentage > 40) temp = 'WARM';
    else if (percentage > 20) temp = 'COOL';
    return `[${bar}] ${percentage.toFixed(0)}% - ${temp}`;
  };

  const getRpsAchievement = (streak: number, wins: number, total: number) => {
    if (streak >= 10) return 'LEGENDARY - Unstoppable Force!';
    if (streak >= 5) return 'MASTER - On Fire!';
    if (streak >= 3) return 'SHARPSHOOTER - Heating Up!';
    if (wins >= 10) return 'VETERAN - Experienced Player';
    if (total >= 5) return 'GAMER - Getting Started';
    return 'NOVICE - New Challenger';
  };

  const generateMatrixRain = (rows: number, cols: number, theme: string) => {
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const colors: Record<string, string> = {
      green: '\x1b[32m',
      amber: '\x1b[33m',
      cyan: '\x1b[36m',
      red: '\x1b[31m'
    };
    
    let result = '';
    for (let i = 0; i < rows; i++) {
      let line = '';
      for (let j = 0; j < cols; j++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const brightness = Math.random();
        if (brightness > 0.9) line += char;
        else if (brightness > 0.7) line += '･';
        else if (brightness > 0.5) line += '､';
        else line += ' ';
      }
      result += line + '\n';
    }
    return result;
  };

  const getWordHint = (word: string, revealed: string[]) => {
    const unrevealed = word.split('').filter((l, i) => !revealed.includes(l) && !revealed.includes(l.toUpperCase()));
    if (unrevealed.length === 0) return null;
    return unrevealed[Math.floor(Math.random() * unrevealed.length)];
  };

  const getHangmanWordPool = (category: string, difficulty: string) => {
    const words: Record<string, Record<string, string[]>> = {
      programming: {
        easy: ['CODE', 'JAVA', 'RUBY', 'RUST', 'GO', 'PHP'],
        medium: ['PYTHON', 'JAVASCRIPT', 'TYPESCRIPT', 'SWIFT', 'KOTLIN', 'SCALA'],
        hard: ['ASSEMBLY', 'COBOL', 'FORTRAN', 'HASKELL', 'LISPDIALECT', 'OBJECTIVEC']
      },
      algorithms: {
        easy: ['SORT', 'TREE', 'GRAPH', 'HEAP', 'STACK', 'QUEUE'],
        medium: ['QUICKSORT', 'MERGESORT', 'BINARYSEARCH', 'DYNAMIC', 'RECURSION'],
        hard: ['DIJKSTRA', 'FLOYDWARSHALL', 'BELLMANFORD', 'TOPOLOGICAL', 'KRUSKAL']
      },
      technology: {
        easy: ['WEB', 'APP', 'API', 'CSS', 'HTML', 'SQL'],
        medium: ['REACT', 'DOCKER', 'KUBERNETES', 'WEBPACK', 'MONGODB', 'POSTGRES'],
        hard: ['MICROSERVICES', 'BLOCKCHAIN', 'QUANTUMCOMPUTING', 'SERVERLESS', 'WEBASSEMBLY']
      },
      mixed: {
        easy: ['DATA', 'CODE', 'BYTE', 'NODE', 'REACT', 'CLOUD'],
        medium: ['ALGORITHM', 'FRAMEWORK', 'DATABASE', 'INTERFACE', 'FUNCTION'],
        hard: ['OPTIMIZATION', 'CRYPTOGRAPHY', 'PARALLELIZATION', 'VIRTUALIZATION']
      }
    };
    return words[category]?.[difficulty] || words.mixed.medium;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      programming: '[PROG]',
      algorithms: '[ALGO]',
      technology: '[TECH]',
      mixed: '[MIX]'
    };
    return labels[category] || '[CAT]';
  };

  // ASCII Art
  const asciiArt = `
   _____ _                 _     __   __          
  / ____| |               | |   \\ \\ / /          
 | (___ | |__   ___ _ __  | |_   \\ V /___  _   _ 
  \\___ \\| '_ \\ / _ \\ '_ \\ | __|  / // _ \\| | | |
  ____) | | | |  __/ | | || |_ / / \\ (_) | |_| |
 |_____/|_| |_|\\___|_| |_| \\__/_/   \\___/ \\__, |
                                            __/ |
                                           |___/ 
  `

  // Initial welcome message
  const hasInitialized = useRef(false)
  useEffect(() => {
    if (!hasInitialized.current && output.length === 0) {
      hasInitialized.current = true
      setOutput([
        asciiArt,
        '',
        'Welcome to Vishal\'s Terminal',
        'Type "help" to see available commands',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      ])
    }
  }, [asciiArt, output.length])

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  // Keyboard shortcut to toggle terminal (Ctrl+` or Cmd+`)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault()
        setIsOpen(prev => {
          const newState = !prev
          onToggle?.()
          return newState
        })
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onToggle])

  // Terminal commands - Professional and meaningful
  const commands: Record<string, Command> = {
    help: {
      name: 'help',
      description: 'List all available commands',
      handler: () => {
        return `
Available Commands:
  help          - Show this help message
  about         - Display information about Vishal
  skills        - Show technical skills
  experience    - Show work experience
  projects      - List all projects
  achievements  - Show achievements and awards
  education     - Show education details
  cp            - Show competitive programming stats
  cpfact        - Show a random CP fact
  certifications- Show certifications and credentials
  social        - Show social media and coding profiles
  resume        - Get resume download link
  contact       - Display contact information
  whoami        - Display current user
  date          - Show current date and time
  clear         - Clear the terminal
  history       - Show command history
  ls            - List available sections
  cd [section]  - Navigate to a section
  system        - Display system information
  performance   - Show performance metrics
  neofetch      - Display system information
  
  Fun & Games:
  game          - Game center with stats & leaderboards
  rps [mode]    - Rock Paper Scissors Ultimate
                  Modes: classic, bestof3, bestof5
                  Features: Streaks, Achievements, History
  guess [diff]  - Number Guessing Pro
                  Difficulties: easy(1-50), medium(1-100), hard(1-500)
                  Features: Temperature Bar, Hints, Timer, Statistics
  hangman [cat] - Hangman Master
                  Categories: programming, algorithms, technology, mixed
                  Features: Difficulty levels, Hints, Win Rate, Streaks
  matrix [theme]- Matrix Rain Simulator
                  Themes: green, amber, cyan, red
                  Features: Speed control, Animated rain, Movie quotes
  
  CP Topics:
  cptopics      - Competitive programming topics overview
  math          - Mathematical algorithms
  greedy        - Greedy algorithms
  binarysearch  - Binary search variations
  graphs        - Graph algorithms
  segmenttree   - Segment trees
  fenwick       - Fenwick trees (BIT)
  binarylift    - Binary lifting & LCA
  dp            - Dynamic Programming
  stringalgo    - String algorithms (KMP, Z, Suffix Array)
  datastructures- Advanced data structures
  flowalgo      - Flow algorithms (Max Flow, Min Cut)
  geometryalgo  - Geometry algorithms
        `
      }
    },
    about: {
      name: 'about',
      description: 'Display information about Vishal',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│                        ABOUT ME                                  │
└─────────────────────────────────────────────────────────────────┘

Name: ${resumeData.name}
Location: ${resumeData.location}

${resumeData.summary}

Core Expertise:
  • Algorithmic problem-solving and optimization
  • System architecture and distributed systems
  • High-performance computing and scalability
  • Competitive programming and algorithm design

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    skills: {
      name: 'skills',
      description: 'Show technical skills',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│                      TECHNICAL SKILLS                            │
└─────────────────────────────────────────────────────────────────┘

Programming Languages:
${resumeData.skills.languages.map(lang => `  • ${lang}`).join('\n')}

Frameworks & Libraries:
${resumeData.skills.frameworks.map(fw => `  • ${fw}`).join('\n')}

Development Tools & IDEs:
${resumeData.skills.tools.map(tool => `  • ${tool}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    experience: {
      name: 'experience',
      description: 'Show work experience',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│                      WORK EXPERIENCE                             │
└─────────────────────────────────────────────────────────────────┘

${resumeData.experience.map((exp, index) => `
${index + 1}. ${exp.company}
   Position: ${exp.position}
   Location: ${exp.location}
   Period: ${exp.period}
   Highlights:
${exp.description.map(desc => `     • ${desc}`).join('\n')}
`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    achievements: {
      name: 'achievements',
      description: 'Show achievements and awards',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│                       ACHIEVEMENTS                               │
└─────────────────────────────────────────────────────────────────┘

${resumeData.achievements.map((ach, index) => `
${index + 1}. ${ach.text}${ach.date ? ` (${ach.date})` : ''}
`).join('')}

Total: ${resumeData.achievements.length} achievements

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    education: {
      name: 'education',
      description: 'Show education details',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│                        EDUCATION                                 │
└─────────────────────────────────────────────────────────────────┘

Institution: ${resumeData.education.institution}
Degree: ${resumeData.education.degree}
GPA: ${resumeData.education.gpa}
Period: ${resumeData.education.period}
Location: ${resumeData.education.location}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    cp: {
      name: 'cp',
      description: 'Show competitive programming stats',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│              COMPETITIVE PROGRAMMING STATS                       │
└─────────────────────────────────────────────────────────────────┘

Total Problems Solved: ${resumeData.cpStats.totalSolved}

Best Rankings:
${resumeData.cpStats.bestRankings.map(r => `  • ${r.platform}: ${r.rank} (${r.rating})`).join('\n')}

Favorite Topics:
${resumeData.cpStats.favoriteTopics.map(t => `  • ${t}`).join('\n')}

Primary Language: C++ (95%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    cpfact: {
      name: 'cpfact',
      description: 'Show a random CP fact',
      handler: () => {
        const facts = [
          { topic: 'Time Complexity', fact: 'O(1) < O(log n) < O(sqrt n) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!)', detail: 'Always aim for the most efficient solution possible.' },
          { topic: 'Binary Search', fact: 'Binary search can find an element in O(log n) time.', detail: 'Requires sorted array. Classic divide and conquer.' },
          { topic: 'Dynamic Programming', fact: 'DP = Recursion + Memoization', detail: 'Store results of subproblems to avoid recomputation.' },
          { topic: 'Graph Theory', fact: 'Dijkstra\'s algorithm finds shortest path in O((V+E) log V).', detail: 'Works only for non-negative edge weights.' },
          { topic: 'Greedy Algorithm', fact: 'Make locally optimal choices at each step.', detail: 'Doesn\'t always yield globally optimal solution.' }
        ]
        const fact = facts[Math.floor(Math.random() * facts.length)]
        return `
┌─────────────────────────────────────────────────────────────────┐
│                      CP FACT OF THE DAY                          │
└─────────────────────────────────────────────────────────────────┘

${fact.topic}:
${fact.fact}

${fact.detail}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    certifications: {
      name: 'certifications',
      description: 'Show certifications and credentials',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│                     CERTIFICATIONS                               │
└─────────────────────────────────────────────────────────────────┘

${resumeData.certifications.map((cert, index) => `
${index + 1}. ${cert.text}
   Issuer: ${cert.issuer}
   Date: ${cert.date}
   ${cert.url ? `URL: ${cert.url}` : ''}
`).join('\n')}

Total: ${resumeData.certifications.length} certifications

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    social: {
      name: 'social',
      description: 'Show social media and coding profiles',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│                    SOCIAL & CODING PROFILES                      │
└─────────────────────────────────────────────────────────────────┘

Professional:
  • LinkedIn: linkedin.com/in/${resumeData.contact.linkedin}
  • Email: ${resumeData.contact.email}

Competitive Programming:
  • Codeforces: codeforces.com/profile/${resumeData.contact.codeforces}
  • CodeChef: codechef.com/users/vishal_616
  • LeetCode: leetcode.com/u/VishalBuyyarapu/

Contact:
  • Location: ${resumeData.location}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    resume: {
      name: 'resume',
      description: 'Get resume download link',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│                        RESUME                                    │
└─────────────────────────────────────────────────────────────────┘

Download my resume:
https://drive.google.com/file/d/1ZiK0D0uLYT3gWX7uJs23-PLXt8FWjhTa/view?usp=sharing

Summary:
Software Engineer with strong competitive programming background
and experience in distributed systems and microservices architecture.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    projects: {
      name: 'projects',
      description: 'List all projects',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│                         PROJECTS                                 │
└─────────────────────────────────────────────────────────────────┘

${resumeData.projects.map((project, index) => `
${index + 1}. ${project.name}
   Date: ${project.date}
   Tech: ${project.tech}
   Description: ${project.description.slice(0, 100)}...
   Link: ${project.link}
`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    contact: {
      name: 'contact',
      description: 'Display contact information',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│                      CONTACT INFO                                │
└─────────────────────────────────────────────────────────────────┘

Email: ${resumeData.contact.email}
Location: ${resumeData.location}

Professional Profiles:
  • LinkedIn: https://linkedin.com/in/${resumeData.contact.linkedin}
  • Codeforces: https://codeforces.com/profile/${resumeData.contact.codeforces}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    whoami: {
      name: 'whoami',
      description: 'Display current user',
      handler: () => {
        return `vishal@portfolio:~$ ${resumeData.name}`
      }
    },
    date: {
      name: 'date',
      description: 'Show current date and time',
      handler: () => {
        return new Date().toString()
      }
    },
    clear: {
      name: 'clear',
      description: 'Clear the terminal',
      handler: () => ''
    },
    history: {
      name: 'history',
      description: 'Show command history',
      handler: () => {
        return commandHistory.map((cmd, index) => `${index + 1}  ${cmd}`).join('\n')
      }
    },
    ls: {
      name: 'ls',
      description: 'List available sections',
      handler: () => {
        return `
drwxr-xr-x  home/
drwxr-xr-x  experience/
drwxr-xr-x  projects/
drwxr-xr-x  skills/
drwxr-xr-x  achievements/
drwxr-xr-x  certifications/
        `
      }
    },
    cd: {
      name: 'cd',
      description: 'Navigate to a section',
      handler: (args) => {
        const section = args[0]
        const sections = ['home', 'experience', 'projects', 'skills', 'achievements']
        
        if (section && sections.includes(section)) {
          document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
          return `Navigating to ${section}...`
        } else if (!section) {
          return 'Usage: cd [section]'
        } else {
          return `Section "${section}" not found. Available: ${sections.join(', ')}`
        }
      }
    },
    system: {
      name: 'system',
      description: 'Display system information',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│                      SYSTEM INFORMATION                           │
└─────────────────────────────────────────────────────────────────┘

Operating System: ${navigator.platform}
Browser: ${navigator.userAgent.split(' ').slice(-2).join(' ')}
Screen Resolution: ${window.screen.width}x${window.screen.height}
Color Depth: ${window.screen.colorDepth}-bit
Language: ${navigator.language}
Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}

Runtime Environment:
  JavaScript Engine: V8 (Chrome) / JavaScriptCore (Safari)
  Framework: Next.js 14.2.5
  Rendering: Client-side React 18
  CSS Engine: Tailwind CSS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    performance: {
      name: 'performance',
      description: 'Show performance metrics',
      handler: () => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const memory = (performance as any).memory
        
        return `
┌─────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE METRICS                            │
└─────────────────────────────────────────────────────────────────┘

Page Load Performance:
  DNS Lookup: ${(perfData.domainLookupEnd - perfData.domainLookupStart).toFixed(2)}ms
  TCP Connect: ${(perfData.connectEnd - perfData.connectStart).toFixed(2)}ms
  Request Time: ${(perfData.responseEnd - perfData.requestStart).toFixed(2)}ms
  DOM Processing: ${(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart).toFixed(2)}ms
  Total Load Time: ${(perfData.loadEventEnd - perfData.startTime).toFixed(2)}ms

Memory Usage:
${memory ? `
  Used: ${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB
  Total: ${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB
  Limit: ${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB
` : 'Memory API not available'}

Connection: ${(() => {
          const conn = (navigator as Navigator & { connection?: { effectiveType: string; downlink: number } }).connection;
          return conn ? `${conn.effectiveType} (${conn.downlink} Mbps)` : 'Unknown';
        })()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    neofetch: {
      name: 'neofetch',
      description: 'Display system information',
      handler: () => {
        return `
       _____       vishal@portfolio
      /     \\      ----------
     /  O O  \\     OS: ${navigator.platform} Browser
    |    ^    |    Host: Web Environment
     \\  \\_/  /     Kernel: JavaScript V8
      \\  _  /      Uptime: ${Math.floor(performance.now() / 1000 / 60)} minutes
       \\___/       Shell: Terminal.js
                    Resolution: ${window.screen.width}x${window.screen.height}
                    Theme: Nothing OS Dark
                    CPU: WebAssembly
                    Memory: ${(performance as any).memory ? `${Math.round((performance as any).memory.usedJSHeapSize / 1048576)}MB` : 'N/A'}

        `
      }
    },
    game: {
      name: 'game',
      description: 'Play interactive games',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│                     GAME CENTER                                  │
└─────────────────────────────────────────────────────────────────┘

Available Games:

  rps [choice]     - Rock Paper Scissors Ultimate
     Modes: classic, bestof3, bestof5
     Features: Streaks, Achievements, Round History

  guess [number]   - Number Guessing Pro
     Difficulty: easy (1-50), medium (1-100), hard (1-500)
     Features: Temperature Bar, Hint System, Statistics

  hangman [letter] - Hangman Master
     Categories: programming, algorithms, technology, mixed
     Difficulty: easy/medium/hard word lengths
     Features: Categories, Hints, Streak Tracking, Win Rate

  matrix [theme]  - Matrix Rain Simulator
     Themes: green, amber, cyan, red
     Features: Animated rain, Speed control, Color themes

Player Statistics:
  • RPS Best Streak: ${rpsBestStreak}
  • Hangman Win Rate: ${hangmanGames > 0 ? ((hangmanWins / hangmanGames) * 100).toFixed(1) : 0}%
  • Hangman Current Streak: ${hangmanStreak}
  • Guessing Games Played: ${guessStats.games}

Quick Start:
  rps classic          - Start RPS in classic mode
  rps bestof5          - Play best of 5 rounds
  guess easy           - Easy guessing game
  guess hard           - Hard mode (1-500)
  hangman programming  - Programming words only
  hangman hard         - Hard difficulty
  matrix amber         - Matrix in amber theme

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    rps: {
      name: 'rps',
      description: 'Rock Paper Scissors',
      handler: (args) => {
        const choices = ['rock', 'paper', 'scissors'];
        const input = args[0]?.toLowerCase();
        
        // Handle mode selection
        if (input === 'classic' || input === 'bestof3' || input === 'bestof5') {
          const mode = input === 'bestof3' ? 'bestOf3' : input === 'bestof5' ? 'bestOf5' : 'classic';
          setRpsMode(mode);
          setRpsRound(0);
          setRpsScore({ player: 0, computer: 0, ties: 0 });
          setRpsHistory([]);
          const rounds = input === 'classic' ? 'INF' : (input === 'bestof3' ? '3' : '5');
          return `
┌─────────────────────────────────────────────────────────────────┐
│           ROCK PAPER SCISSORS ULTIMATE                            │
└─────────────────────────────────────────────────────────────────┘

MODE SELECTED: ${input.toUpperCase()}
   Rounds to play: ${rounds}
   
How to Play:
   Type 'rps rock' OR 'rps paper' OR 'rps scissors'
   
Rules: Rock > Scissors > Paper > Rock

Make your choice: rps [rock|paper|scissors]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          `;
        }
        
        // Show instructions if invalid input
        if (!input || !choices.includes(input)) {
          setGameState('rps');
          const totalGames = rpsScore.player + rpsScore.computer + rpsScore.ties;
          return `
┌─────────────────────────────────────────────────────────────────┐
│           ROCK PAPER SCISSORS ULTIMATE                            │
└─────────────────────────────────────────────────────────────────┘

${rpsHistory.length > 0 ? `
CURRENT MATCH (${rpsMode.toUpperCase()}):
   You: ${rpsScore.player} | Computer: ${rpsScore.computer} | Ties: ${rpsScore.ties}
   Current Streak: ${rpsStreak}
   Best Streak: ${rpsBestStreak}
   
Achievement: ${getRpsAchievement(rpsStreak, rpsScore.player, totalGames)}

ROUND HISTORY (Last 5):
${rpsHistory.slice(-5).map((round, i) => 
  `   ${i + 1}. ${round.player} ${getSymbol(round.player)} vs ${round.computer} ${getSymbol(round.computer)} -> ${round.result}`
).join('\n')}
` : `
Game Ready! Mode: ${rpsMode.toUpperCase()}
   
How to Play:
   Type 'rps rock' OR 'rps paper' OR 'rps scissors'
   
   Change Mode:
   rps classic  - Free play (default)
   rps bestof3  - First to win 2 rounds
   rps bestof5  - First to win 3 rounds

Rules: Rock > Scissors > Paper > Rock
`}

Quick Choices: rps rock | rps paper | rps scissors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          `;
        }
        
        // Play the round
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        let result = '';
        let roundResult = '';
        
        if (input === computerChoice) {
          result = "IT'S A TIE!";
          roundResult = 'Tie';
          setRpsScore(prev => ({ ...prev, ties: prev.ties + 1 }));
          setRpsStreak(0);
        } else if (
          (input === 'rock' && computerChoice === 'scissors') ||
          (input === 'paper' && computerChoice === 'rock') ||
          (input === 'scissors' && computerChoice === 'paper')
        ) {
          result = "YOU WIN THIS ROUND!";
          roundResult = 'Win';
          setRpsScore(prev => ({ ...prev, player: prev.player + 1 }));
          setRpsStreak(prev => {
            const newStreak = prev + 1;
            if (newStreak > rpsBestStreak) setRpsBestStreak(newStreak);
            return newStreak;
          });
        } else {
          result = "COMPUTER WINS THIS ROUND!";
          roundResult = 'Loss';
          setRpsScore(prev => ({ ...prev, computer: prev.computer + 1 }));
          setRpsStreak(0);
        }
        
        // Update history
        const newHistory = [...rpsHistory, { player: input, computer: computerChoice, result: roundResult }];
        setRpsHistory(newHistory);
        setRpsRound(prev => prev + 1);
        
        // Check for match end in bestof modes
        const totalGames = rpsScore.player + rpsScore.computer + rpsScore.ties + 1;
        const winsNeeded = rpsMode === 'bestOf3' ? 2 : (rpsMode === 'bestOf5' ? 3 : Infinity);
        const playerWins = rpsScore.player + (roundResult === 'Win' ? 1 : 0);
        const computerWins = rpsScore.computer + (roundResult === 'Loss' ? 1 : 0);
        
        let matchResult = '';
        if (rpsMode !== 'classic' && (playerWins >= winsNeeded || computerWins >= winsNeeded)) {
          const matchWinner = playerWins >= winsNeeded ? 'YOU' : 'COMPUTER';
          matchResult = `
╔═════════════════════════════════════════════════════════════════╗
║  MATCH COMPLETE! ${matchWinner} WINS THE SERIES!                    ║
╚═════════════════════════════════════════════════════════════════╝
   Final Score: You ${playerWins} - ${computerWins} Computer
   Total Rounds: ${totalGames}
   
   Starting new match... (mode: ${rpsMode})
          `;
          setRpsScore({ player: 0, computer: 0, ties: 0 });
          setRpsRound(0);
          setRpsHistory([]);
          setRpsStreak(0);
        }
        
        return `
┌─────────────────────────────────────────────────────────────────┐
│           ROCK PAPER SCISSORS ULTIMATE                            │
└─────────────────────────────────────────────────────────────────┘

ROUND ${rpsRound + 1} RESULT:
    
    YOU:       ${input.toUpperCase()} ${getSymbol(input)}
    COMPUTER:  ${computerChoice.toUpperCase()} ${getSymbol(computerChoice)}
    
    ${result}

CURRENT SCORE:
    You: ${playerWins} | Computer: ${computerWins} | Ties: ${rpsScore.ties + (roundResult === 'Tie' ? 1 : 0)}
    
    Current Streak: ${roundResult === 'Win' ? rpsStreak + 1 : 0}
    Best Streak: ${Math.max(rpsBestStreak, roundResult === 'Win' ? rpsStreak + 1 : rpsBestStreak)}
    
${rpsMode !== 'classic' ? `    Progress: ${playerWins}/${winsNeeded} wins needed` : ''}

${matchResult}

Play again: rps [rock|paper|scissors]
Change mode: rps classic | rps bestof3 | rps bestof5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `;
      }
    },
    guess: {
      name: 'guess',
      description: 'Number guessing game',
      handler: (args) => {
        const input = args[0]?.toLowerCase();
        
        // Handle difficulty selection or hint request
        if (input === 'easy' || input === 'medium' || input === 'hard') {
          const ranges: Record<string, { max: number; hints: number }> = {
            easy: { max: 50, hints: 5 },
            medium: { max: 100, hints: 3 },
            hard: { max: 500, hints: 2 }
          };
          const config = ranges[input];
          const newTarget = Math.floor(Math.random() * config.max) + 1;
          
          setGuessDifficulty(input as any);
          setGuessTarget(newTarget);
          setGuessAttempts(0);
          setGuessHistory([]);
          setGuessHintsUsed(0);
          setGuessMaxHints(config.hints);
          setGuessStartTime(Date.now());
          setGameState('guess');
          
          return `
┌─────────────────────────────────────────────────────────────────┐
│              NUMBER GUESSING PRO                                 │
└─────────────────────────────────────────────────────────────────┘

NEW GAME STARTED!
   Difficulty: ${input.toUpperCase()}
   Range: 1 to ${config.max}
   Hints available: ${config.hints}

How to Play:
   guess [number]    - Make a guess
   guess hint        - Use a hint (reveals a digit)
   guess stats       - View your statistics
   guess easy        - New easy game (1-50)
   guess hard        - New hard game (1-500)

Pro Tips:
   • Use binary search strategy (halve the range each time)
   • Watch the temperature bar - get closer!
   • Save hints for when you're stuck

Timer started! Good luck!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          `;
        }
        
        // Hint request
        if (input === 'hint') {
          if (guessHintsUsed >= guessMaxHints) {
            return `
┌─────────────────────────────────────────────────────────────────┐
│              NUMBER GUESSING PRO                                 │
└─────────────────────────────────────────────────────────────────┘

No hints remaining!
   Used: ${guessHintsUsed}/${guessMaxHints}
   
Keep guessing or start a new game:
   guess ${guessDifficulty}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            `;
          }
          
          setGuessHintsUsed(prev => prev + 1);
          const targetStr = guessTarget.toString();
          const hintPos = Math.floor(Math.random() * targetStr.length);
          const hintDigit = targetStr[hintPos];
          const position = hintPos === 0 ? 'first' : hintPos === targetStr.length - 1 ? 'last' : `${hintPos + 1}th`;
          
          return `
┌─────────────────────────────────────────────────────────────────┐
│              NUMBER GUESSING PRO                                 │
└─────────────────────────────────────────────────────────────────┘

HINT REVEALED!
   The ${position} digit is: ${hintDigit}
   Hints used: ${guessHintsUsed + 1}/${guessMaxHints}
   
Keep guessing!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          `;
        }
        
        // Stats request
        if (input === 'stats') {
          const avgAttempts = guessStats.games > 0 ? (guessStats.totalAttempts / guessStats.games).toFixed(1) : '0';
          return `
┌─────────────────────────────────────────────────────────────────┐
│              YOUR GUESSING STATISTICS                            │
└─────────────────────────────────────────────────────────────────┘

Career Stats:
   Games Played: ${guessStats.games}
   Total Guesses: ${guessStats.totalAttempts}
   Average Guesses/Game: ${avgAttempts}
   Best Game: ${guessStats.bestGame === Infinity ? 'N/A' : guessStats.bestGame + ' attempts'}

Performance Tiers:
   1-3 attempts: LEGENDARY
   4-5 attempts: EXPERT  
   6-7 attempts: SKILLED
   8+ attempts: COMPLETED

Current Session:
   Difficulty: ${guessDifficulty.toUpperCase()}
   Hints Remaining: ${guessMaxHints - guessHintsUsed}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          `;
        }
        
        // Parse guess
        const userGuess = parseInt(args[0]);
        const ranges: Record<string, number> = { easy: 50, medium: 100, hard: 500 };
        const maxRange = ranges[guessDifficulty] || 100;
        
        // Start new game if invalid or out of range
        if (isNaN(userGuess) || userGuess < 1 || userGuess > maxRange) {
          return `
┌─────────────────────────────────────────────────────────────────┐
│              NUMBER GUESSING PRO                                 │
└─────────────────────────────────────────────────────────────────┘

${guessHistory.length > 0 ? `
CURRENT GAME IN PROGRESS:
   Difficulty: ${guessDifficulty.toUpperCase()} (1-${maxRange})
   Attempts: ${guessAttempts}
   Hints: ${guessMaxHints - guessHintsUsed} remaining

GUESS HISTORY:
${guessHistory.map((h, i) => `   ${(i + 1).toString().padStart(2)}. ${h.guess.toString().padStart(3)} -> ${h.hint} ${h.temp}`).join('\n')}

Make your next guess!
` : `
SELECT DIFFICULTY TO START:
   guess easy   - Range 1-50 (5 hints)
   guess medium - Range 1-100 (3 hints)
   guess hard   - Range 1-500 (2 hints)

Commands:
   guess hint   - Use a hint
   guess stats  - View statistics
`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          `;
        }
        
        // Process the guess
        const newAttempts = guessAttempts + 1;
        setGuessAttempts(newAttempts);
        
        let hint = '';
        let emoji = '';
        let gameStatus = '';
        
        if (userGuess === guessTarget) {
          const endTime = Date.now();
          const timeTaken = Math.floor((endTime - guessStartTime) / 1000);
          
          // Update stats
          setGuessStats(prev => ({
            games: prev.games + 1,
            totalAttempts: prev.totalAttempts + newAttempts,
            bestGame: Math.min(prev.bestGame, newAttempts)
          }));
          setGameState('idle');
          
          // Performance rating
          let rating = '';
          let tier = '';
          if (newAttempts <= 3) { rating = 'LEGENDARY! You have perfect instincts!'; tier = 'LEGENDARY'; }
          else if (newAttempts <= 5) { rating = 'EXPERT! Outstanding binary search skills!'; tier = 'EXPERT'; }
          else if (newAttempts <= 7) { rating = 'SKILLED! Great strategic thinking!'; tier = 'SKILLED'; }
          else { rating = 'COMPLETED! Persistence pays off!'; tier = 'COMPLETED'; }
          
          // Points calculation
          const basePoints = Math.max(100 - (newAttempts * 10), 10);
          const hintPenalty = guessHintsUsed * 15;
          const difficultyBonus = guessDifficulty === 'hard' ? 50 : guessDifficulty === 'medium' ? 25 : 0;
          const totalPoints = Math.max(basePoints - hintPenalty + difficultyBonus, 0);
          
          return `
┌─────────────────────────────────────────────────────────────────┐
│              NUMBER GUESSED! YOU WON!                            │
└─────────────────────────────────────────────────────────────────┘

VICTORY! ${rating}

Target Number: ${guessTarget}
Attempts: ${newAttempts}
Time: ${timeTaken}s
Hints Used: ${guessHintsUsed}/${guessMaxHints}

SCORE BREAKDOWN:
   Base Points: ${basePoints}
   Difficulty Bonus: +${difficultyBonus} (${guessDifficulty})
   Hint Penalty: -${hintPenalty}
   ======================
   TOTAL: ${totalPoints} POINTS

TIER ACHIEVED: ${tier}

Play again:
   guess easy   - New easy game
   guess medium - New medium game  
   guess hard   - New hard game

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          `;
        } else if (userGuess < guessTarget) {
          hint = 'TOO LOW! Go higher';
          emoji = '[UP]';
        } else {
          hint = 'TOO HIGH! Go lower';
          emoji = '[DOWN]';
        }
        
        // Temperature bar
        const distance = Math.abs(userGuess - guessTarget);
        const maxDist = maxRange;
        const tempBar = getTemperatureBar(distance, maxDist);
        
        // Update history
        const tempLabel = distance <= 5 ? 'BOILING' : distance <= 15 ? 'HOT' : distance <= 30 ? 'WARM' : distance <= 50 ? 'COOL' : 'FREEZING';
        const newHistory = [...guessHistory, { guess: userGuess, hint: emoji, temp: tempLabel }];
        setGuessHistory(newHistory);
        
        // Smart hint - show range after multiple wrong guesses
        let smartHint = '';
        if (newAttempts === 3) {
          const range = Math.ceil(maxRange / 4);
          const low = Math.floor((guessTarget - 1) / range) * range + 1;
          const high = Math.min(low + range - 1, maxRange);
          smartHint = `\nSmart Hint: The number is between ${low} and ${high}`;
        }
        
        return `
┌─────────────────────────────────────────────────────────────────┐
│              NUMBER GUESSING PRO                                 │
└─────────────────────────────────────────────────────────────────┘

ATTEMPT #${newAttempts}

Your Guess: ${userGuess}
${emoji} ${hint}

${tempBar}

GUESS HISTORY:
${newHistory.slice(-5).map((h, i) => `   ${(newHistory.length - 5 + i + 1).toString().padStart(2)}. ${h.guess.toString().padStart(3)} ${h.hint} ${h.temp}`).join('\n')}
${smartHint}

Commands:
   guess [1-${maxRange}]  - Make another guess
   guess hint             - Use hint (${guessMaxHints - guessHintsUsed} left)
   guess stats            - View statistics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `;
      }
    },
    matrix: {
      name: 'matrix',
      description: 'Enter the matrix',
      handler: (args) => {
        const input = args[0]?.toLowerCase();
        
        // Handle theme selection
        if (input === 'green' || input === 'amber' || input === 'cyan' || input === 'red') {
          setMatrixTheme(input as any);
          const themeColors: Record<string, string> = {
            green: '#00ff00',
            amber: '#ffb000',
            cyan: '#00ffff',
            red: '#ff0000'
          };
          return `
┌─────────────────────────────────────────────────────────────────┐
│                  THE MATRIX SIMULATOR                              │
└─────────────────────────────────────────────────────────────────┘

THEME CHANGED: ${input.toUpperCase()}
   Color code: ${themeColors[input]}
   
Available Commands:
   matrix         - Generate new rain pattern
   matrix slow    - Slow speed mode
   matrix normal  - Normal speed (default)
   matrix fast    - Fast speed mode
   
   Themes:
   matrix green   - Classic Matrix green
   matrix amber   - Retro amber terminal
   matrix cyan    - Cyan futuristic
   matrix red     - Red alert mode

"Unfortunately, no one can be told what the Matrix is.
    You have to see it for yourself."
    
    - Morpheus

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          `;
        }
        
        // Handle speed selection
        if (input === 'slow' || input === 'normal' || input === 'fast') {
          setMatrixSpeed(input as any);
          return `
┌─────────────────────────────────────────────────────────────────┐
│                  THE MATRIX SIMULATOR                              │
└─────────────────────────────────────────────────────────────────┘

SPEED SET TO: ${input.toUpperCase()}

Generate rain with: matrix

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          `;
        }
        
        // Generate matrix rain
        setGameState('matrix');
        const rows = matrixSpeed === 'slow' ? 15 : matrixSpeed === 'fast' ? 25 : 20;
        const cols = 50;
        const rain = generateMatrixRain(rows, cols, matrixTheme);
        
        const themeNames: Record<string, string> = {
          green: 'THE MATRIX',
          amber: 'AMBER TERMINAL',
          cyan: 'CYAN PROTOCOL',
          red: 'RED ALERT'
        };
        
        const quotes = [
          "Wake up, Neo...",
          "The Matrix has you...",
          "Follow the white rabbit.",
          "Knock, knock, Neo.",
          "I know kung fu.",
          "There is no spoon.",
          "Free your mind.",
          "Welcome to the desert of the real."
        ];
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        
        return `
┌─────────────────────────────────────────────────────────────────┐
│            ${themeNames[matrixTheme].padEnd(60)}            │
└─────────────────────────────────────────────────────────────────┘

${rain}

"${quote}"

Commands:
   matrix         - Reload with new pattern
   matrix slow    - Slow rain
   matrix fast    - Fast rain
   matrix green   - Green theme
   matrix amber   - Amber theme
   matrix cyan    - Cyan theme
   matrix red     - Red theme

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `;
      }
    },
    hangman: {
      name: 'hangman',
      description: 'Hangman word game',
      handler: (args) => {
        const input = args[0]?.toLowerCase();
        
        // Handle category and difficulty selection
        const categories = ['programming', 'algorithms', 'technology', 'mixed'];
        const difficulties = ['easy', 'medium', 'hard'];
        
        if (categories.includes(input) || difficulties.includes(input)) {
          if (categories.includes(input)) {
            setHangmanCategory(input as any);
          }
          if (difficulties.includes(input)) {
            setHangmanDifficulty(input as any);
            setHangmanMaxHints(input === 'easy' ? 3 : input === 'medium' ? 2 : 1);
          }
          
          const wordPool = getHangmanWordPool(hangmanCategory, hangmanDifficulty);
          const newWord = wordPool[Math.floor(Math.random() * wordPool.length)];
          
          setHangmanWord(newWord);
          setHangmanGuessed([]);
          setHangmanWrong(0);
          setHangmanHintsUsed(0);
          setGameState('hangman');
          
          return `
┌─────────────────────────────────────────────────────────────────┐
│              HANGMAN MASTER                                      │
└─────────────────────────────────────────────────────────────────┘

NEW GAME STARTED!
   Category: ${getCategoryLabel(hangmanCategory)} ${hangmanCategory.toUpperCase()}
   Difficulty: ${hangmanDifficulty.toUpperCase()} (${newWord.length} letters)
   Hints Available: ${hangmanMaxHints}

Stats: ${hangmanWins}/${hangmanGames} wins (${hangmanGames > 0 ? ((hangmanWins/hangmanGames)*100).toFixed(0) : 0}%)
   Current Streak: ${hangmanStreak}

${drawHangman(0)}

Word: ${getHangmanDisplay(newWord, [])}

How to Play:
   hangman [letter]  - Guess a letter (a-z)
   hangman hint    - Reveal a letter (-50 points)
   
   Categories:
   hangman programming  - Programming languages
   hangman algorithms   - Algorithm names
   hangman technology   - Tech terms
   hangman mixed        - All categories
   
   Difficulty:
   hangman easy    - Short words (3-5 letters)
   hangman medium  - Medium words (6-8 letters)
   hangman hard    - Long words (9+ letters)

Make your guess: hangman [a-z]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          `;
        }
        
        // Handle hint request
        if (input === 'hint') {
          if (hangmanHintsUsed >= hangmanMaxHints) {
            return `
┌─────────────────────────────────────────────────────────────────┐
│              HANGMAN MASTER                                      │
└─────────────────────────────────────────────────────────────────┘

No hints remaining!
   Used: ${hangmanHintsUsed}/${hangmanMaxHints}

${drawHangman(hangmanWrong)}

Word: ${getHangmanDisplay(hangmanWord, hangmanGuessed)}
Wrong: ${hangmanWrong}/6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            `;
          }
          
          const hintLetter = getWordHint(hangmanWord, hangmanGuessed);
          if (!hintLetter) {
            return `
┌─────────────────────────────────────────────────────────────────┐
│              HANGMAN MASTER                                      │
└─────────────────────────────────────────────────────────────────┘

No letters left to reveal!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            `;
          }
          
          const newGuessed = [...hangmanGuessed, hintLetter];
          setHangmanGuessed(newGuessed);
          setHangmanHintsUsed(prev => prev + 1);
          
          const display = getHangmanDisplay(hangmanWord, newGuessed);
          const isWon = !display.includes('_');
          
          if (isWon) {
            setHangmanWins(prev => prev + 1);
            setHangmanGames(prev => prev + 1);
            setHangmanStreak(prev => prev + 1);
            setGameState('idle');
            return `
┌─────────────────────────────────────────────────────────────────┐
│              HANGMAN SAVED! YOU WON!                             │
└─────────────────────────────────────────────────────────────────┘

Hint revealed: ${hintLetter}

Word: ${hangmanWord}

You won with a hint! (Penalty: -50 points)
Win Streak: ${hangmanStreak + 1}

Play again:
   hangman programming | hangman easy | hangman hard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            `;
          }
          
          return `
┌─────────────────────────────────────────────────────────────────┐
│              HANGMAN MASTER                                      │
└─────────────────────────────────────────────────────────────────┘

HINT REVEALED: Letter "${hintLetter}" uncovered!
   Hints used: ${hangmanHintsUsed + 1}/${hangmanMaxHints}
   Score penalty: -50 points

${drawHangman(hangmanWrong)}

Word: ${display}
Wrong letters: ${hangmanWrong}/6 ${hangmanGuessed.filter(l => !hangmanWord.includes(l)).join(', ') || '(none)'}

Keep guessing: hangman [a-z]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          `;
        }
        
        // Handle letter guess
        const letter = input;
        if (!letter || letter.length !== 1 || !/[a-z]/.test(letter)) {
          // Show current game status or start new game
          if (hangmanWord && hangmanWrong < 6 && getHangmanDisplay(hangmanWord, hangmanGuessed).includes('_')) {
            return `
┌─────────────────────────────────────────────────────────────────┐
│              HANGMAN MASTER                                      │
└─────────────────────────────────────────────────────────────────┘

GAME IN PROGRESS
   Category: ${getCategoryLabel(hangmanCategory)} ${hangmanCategory.toUpperCase()}
   Word Length: ${hangmanWord.length} letters
   Hints: ${hangmanMaxHints - hangmanHintsUsed} remaining

${drawHangman(hangmanWrong)}

Word: ${getHangmanDisplay(hangmanWord, hangmanGuessed)}
Wrong letters: ${hangmanWrong}/6 ${hangmanGuessed.filter(l => !hangmanWord.includes(l)).join(', ') || '(none)'}

Win Rate: ${hangmanGames > 0 ? ((hangmanWins/hangmanGames)*100).toFixed(0) : 0}% | Streak: ${hangmanStreak}

Make your guess: hangman [a-z]
Need help? Type: hangman hint

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            `;
          }
          
          // Start new game with default settings
          const wordPool = getHangmanWordPool(hangmanCategory, hangmanDifficulty);
          const newWord = wordPool[Math.floor(Math.random() * wordPool.length)];
          
          setHangmanWord(newWord);
          setHangmanGuessed([]);
          setHangmanWrong(0);
          setHangmanHintsUsed(0);
          setGameState('hangman');
          
          return `
┌─────────────────────────────────────────────────────────────────┐
│              HANGMAN MASTER                                      │
└─────────────────────────────────────────────────────────────────┘

NEW GAME STARTED!
   Category: ${getCategoryLabel(hangmanCategory)} ${hangmanCategory.toUpperCase()}
   Difficulty: ${hangmanDifficulty.toUpperCase()}
   Word: ${newWord.length} letters

Career Stats:
   Wins: ${hangmanWins} | Games: ${hangmanGames}
   Win Rate: ${hangmanGames > 0 ? ((hangmanWins/hangmanGames)*100).toFixed(1) : 0}%
   Current Streak: ${hangmanStreak}

${drawHangman(0)}

Word: ${getHangmanDisplay(newWord, [])}

How to Play:
   hangman [letter]  - Guess a letter (a-z)
   hangman hint    - Reveal a letter (penalty)

   Quick Setup:
   hangman programming | hangman easy | hangman hard

Make your guess: hangman [a-z]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          `;
        }
        
        // Process letter guess
        const upperLetter = letter.toUpperCase();
        let newGuessed = [...hangmanGuessed];
        let newWrong = hangmanWrong;
        let alreadyGuessed = false;
        
        if (!hangmanGuessed.includes(upperLetter)) {
          newGuessed.push(upperLetter);
          setHangmanGuessed(newGuessed);
          
          if (!hangmanWord.includes(upperLetter)) {
            newWrong++;
            setHangmanWrong(newWrong);
          }
        } else {
          alreadyGuessed = true;
        }
        
        const display = getHangmanDisplay(hangmanWord, newGuessed);
        const isWon = !display.includes('_');
        const isLost = newWrong >= 6;
        
        if (isWon) {
          setHangmanWins(prev => prev + 1);
          setHangmanGames(prev => prev + 1);
          setHangmanStreak(prev => prev + 1);
          setGameState('idle');
          
          // Calculate score
          const baseScore = hangmanWord.length * 20;
          const wrongPenalty = newWrong * 10;
          const hintPenalty = hangmanHintsUsed * 50;
          const streakBonus = hangmanStreak * 25;
          const finalScore = Math.max(baseScore - wrongPenalty - hintPenalty + streakBonus, 0);
          
          return `
┌─────────────────────────────────────────────────────────────────┐
│              HANGMAN SAVED! YOU WON!                             │
└─────────────────────────────────────────────────────────────────┘

CONGRATULATIONS! YOU SAVED THE HANGMAN!

Word: ${hangmanWord}

SCORE BREAKDOWN:
   Base Score: ${baseScore} (${hangmanWord.length} letters x 20)
   Wrong Guesses: -${wrongPenalty} (${newWrong} x 10)
   Hints Used: -${hintPenalty} (${hangmanHintsUsed} x 50)
   Streak Bonus: +${streakBonus} (${hangmanStreak} streak)
   ======================
   TOTAL: ${finalScore} POINTS

Win Streak: ${hangmanStreak + 1}
Total Wins: ${hangmanWins + 1}/${hangmanGames + 1}

Play again:
   hangman           - New word, same settings
   hangman hard      - Harder difficulty
   hangman mixed     - All categories

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          `;
        }
        
        if (isLost) {
          setHangmanGames(prev => prev + 1);
          setHangmanStreak(0);
          setGameState('idle');
          
          return `
┌─────────────────────────────────────────────────────────────────┐
│              GAME OVER - HANGMAN LOST                            │
└─────────────────────────────────────────────────────────────────┘

The hangman didn't make it...

${drawHangman(6)}

Word was: ${hangmanWord}

Better luck next time!

Updated Stats:
   Wins: ${hangmanWins}/${hangmanGames + 1} (${((hangmanWins/(hangmanGames+1))*100).toFixed(0)}%)
   Streak: 0 (reset)

Play again: hangman

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          `;
        }
        
        // Normal turn result
        const isCorrect = hangmanWord.includes(upperLetter);
        const resultIndicator = isCorrect ? '[OK]' : '[NO]';
        const resultText = alreadyGuessed ? '[!] Already guessed!' : (isCorrect ? 'Correct!' : 'Wrong!');
        
        return `
┌─────────────────────────────────────────────────────────────────┐
│              HANGMAN MASTER                                      │
└─────────────────────────────────────────────────────────────────┘

${resultIndicator} Letter "${upperLetter}" - ${resultText}

${drawHangman(newWrong)}

Word: ${display}
Wrong letters: ${newWrong}/6 ${newGuessed.filter(l => !hangmanWord.includes(l)).join(', ') || '(none)'}

Progress: ${hangmanWord.length - display.split('').filter(c => c === '_').length}/${hangmanWord.length} letters found
   Remaining guesses: ${6 - newWrong}
   Hints available: ${hangmanMaxHints - hangmanHintsUsed}

Keep guessing: hangman [a-z]
Need help? hangman hint

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `;
      }
    },
    cptopics: {
      name: 'cptopics',
      description: 'Competitive programming topics',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│              COMPETITIVE PROGRAMMING TOPICS                       │
└─────────────────────────────────────────────────────────────────┘

Core Topics:
  • Mathematical Algorithms - Number theory, combinatorics, geometry
  • Greedy Algorithms - Making optimal local choices
  • Binary Search - Finding elements in sorted arrays
  • Graph Algorithms - DFS, BFS, shortest paths, MST
  • Segment Trees - Range queries and updates
  • Fenwick Trees - Binary Indexed Trees for prefix sums
  • Binary Lifting - LCA and power queries

Advanced Topics:
  • Dynamic Programming - Memoization and tabulation
  • String Algorithms - KMP, Z-algorithm, suffix arrays
  • Data Structures - Disjoint Set Union, Treaps
  • Flow Algorithms - Max flow, min cost flow
  • Geometry Algorithms - Convex hull, line sweep

Use specific commands to learn more:
  Core:   math, greedy, binarysearch, graphs, segmenttree, fenwick, binarylift
  Advanced: dp, stringalgo, datastructures, flowalgo, geometryalgo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    math: {
      name: 'math',
      description: 'Mathematical algorithms',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│              COMPREHENSIVE MATHEMATICAL ALGORITHMS               │
└─────────────────────────────────────────────────────────────────┘

NUMBER THEORY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Euclidean Algorithm (GCD):
   Time: O(log min(a,b)) | Space: O(1)
   Applications: Simplifying fractions, finding LCM
   
   function gcd(a, b) {
     while (b !== 0) {
       [a, b] = [b, a % b];
     }
     return a;
   }
   
   // Extended Euclidean for ax + by = gcd(a,b)
   function extendedGcd(a, b) {
     if (b === 0) return { gcd: a, x: 1, y: 0 };
     const { gcd, x, y } = extendedGcd(b, a % b);
     return { gcd, x: y, y: x - Math.floor(a / b) * y };
   }

2. Prime Numbers:
   • Sieve of Eratosthenes: O(n log log n)
   • Prime Factorization: O(sqrt(n))
   • Miller-Rabin Test: O(k log³ n) probabilistic
   
   function sieve(n) {
     const isPrime = new Array(n + 1).fill(true);
     isPrime[0] = isPrime[1] = false;
     for (let i = 2; i * i <= n; i++) {
       if (isPrime[i]) {
         for (let j = i * i; j <= n; j += i) {
           isPrime[j] = false;
         }
       }
     }
     return isPrime;
   }

3. Modular Arithmetic:
   • Fast Exponentiation: O(log n)
   • Modular Inverse: Extended Euclidean
   • Chinese Remainder Theorem
   
   function modPow(base, exp, mod) {
     let result = 1;
     base = base % mod;
     while (exp > 0) {
       if (exp & 1) result = (result * base) % mod;
       exp = exp >> 1;
       base = (base * base) % mod;
     }
     return result;
   }

COMBINATORICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Permutations & Combinations:
   nPr = n! / (n-r)! | nCr = n! / (r!(n-r)!)
   
   function nCr(n, r, mod = null) {
     if (r > n) return 0;
     if (r > n - r) r = n - r;
     
     let result = 1;
     for (let i = 1; i <= r; i++) {
       result = result * (n - r + i);
       if (mod) result = result % mod;
       result = result / i;
     }
     return result;
   }

2. Inclusion-Exclusion Principle:
   |A ∪ B ∪ C| = |A| + |B| + |C| - |A∩B| - |A∩C| - |B∩C| + |A∩B∩C|
   
3. Stars and Bars:
   Number of ways to distribute n identical items among k distinct boxes:
   C(n + k - 1, k - 1)

GEOMETRY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Basic Operations:
   • Distance: sqrt((x2-x1)² + (y2-y1)²)
   • Dot Product: a·b = a₁b₁ + a₂b₂
   • Cross Product: a×b = a₁b₂ - a₂b₁
   
2. Line Intersection:
   function linesIntersect(p1, p2, p3, p4) {
     const d1 = direction(p3, p4, p1);
     const d2 = direction(p3, p4, p2);
     const d3 = direction(p1, p2, p3);
     const d4 = direction(p1, p2, p4);
     
     return ((d1 * d2 < 0) && (d3 * d4 < 0));
   }

3. Convex Hull (Graham Scan):
   Time: O(n log n) | Space: O(n)
   
   function convexHull(points) {
     points.sort((a, b) => a.x - b.x || a.y - b.y);
     // Build lower and upper hulls
     // Implementation involves cross product orientation
   }

ADVANCED TOPICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Discrete Logarithm: Baby-step Giant-step O(√n)
2. Fast Fourier Transform: O(n log n) polynomial multiplication
3. Number Theoretic Transform: FFT in finite fields
4. Continued Fractions: Rational approximations

PROBLEM PATTERNS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• GCD problems: Use properties of gcd
• Prime problems: Precompute with sieve
• Mod problems: Watch out for overflow
• Counting problems: Stars and bars, inclusion-exclusion
• Geometry problems: Precision with cross products

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    greedy: {
      name: 'greedy',
      description: 'Greedy algorithms',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│              COMPREHENSIVE GREEDY ALGORITHMS                      │
└─────────────────────────────────────────────────────────────────┘

CORE PRINCIPLE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Make the locally optimal choice at each step to find a global optimum.

GREEDY CHOICE PROPERTY & OPTIMAL SUBSTRUCTURE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Greedy Choice Property: Local optimal leads to global optimal
• Optimal Substructure: Solution contains optimal subsolutions
• Matroid Structure: Independent set system with exchange property

CLASSIC GREEDY PROBLEMS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Activity Selection Problem:
   Time: O(n log n) | Space: O(1)
   Choose maximum number of non-overlapping intervals
   
   function activitySelection(activities) {
     activities.sort((a, b) => a.end - b.end);
     let count = 0;
     let lastEnd = -Infinity;
     
     for (const activity of activities) {
       if (activity.start >= lastEnd) {
         count++;
         lastEnd = activity.end;
       }
     }
     return count;
   }

2. Huffman Coding:
   Time: O(n log n) | Space: O(n)
   Optimal prefix codes for data compression
   
   class HuffmanNode {
     constructor(freq, char = null, left = null, right = null) {
       this.freq = freq;
       this.char = char;
       this.left = left;
       this.right = right;
     }
   }
   
   function huffmanCoding(chars, freq) {
     const heap = new MinPriorityQueue();
     // Build min heap and combine nodes
     // Return optimal codes
   }

3. Fractional Knapsack:
   Time: O(n log n) | Space: O(1)
   Max value with weight constraint (fractions allowed)
   
   function fractionalKnapsack(items, capacity) {
     items.sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
     let totalValue = 0;
     
     for (const item of items) {
       if (capacity >= item.weight) {
         totalValue += item.value;
         capacity -= item.weight;
       } else {
         totalValue += (item.value / item.weight) * capacity;
         break;
       }
     }
     return totalValue;
   }

4. Dijkstra's Algorithm:
   Time: O((V + E) log V) | Space: O(V)
   Shortest path with non-negative weights
   
   function dijkstra(graph, start) {
     const distances = new Map();
     const visited = new Set();
     const pq = new MinPriorityQueue();
     
     // Initialize distances and priority queue
     // Process vertices in order of distance
     
     return distances;
   }

5. Minimum Spanning Tree:
   • Kruskal's: O(E log E) with DSU
   • Prim's: O((V + E) log V) with priority queue
   
   function kruskalMST(edges, vertices) {
     edges.sort((a, b) => a.weight - b.weight);
     const dsu = new DisjointSetUnion(vertices);
     const mst = [];
     
     for (const edge of edges) {
       if (dsu.find(edge.u) !== dsu.find(edge.v)) {
         dsu.union(edge.u, edge.v);
         mst.push(edge);
       }
     }
     return mst;
   }

WHEN GREEDY FAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 0/1 Knapsack Problem:
   [X] Greedy fails: Need DP for exact solution
   [OK] Solution: Dynamic Programming O(nW)
   
2. Longest Path Problem:
   [X] Greedy fails: No optimal substructure
   [OK] Solution: DP with DAG, NP-hard for general graphs
   
3. Graph Coloring:
   [X] Greedy fails: NP-complete problem
   [OK] Solution: Backtracking, heuristics
   
4. Change Making (non-canonical coins):
   [X] Greedy fails: Local optimal ≠ global optimal
   [OK] Solution: DP O(nV)

ADVANCED GREEDY TECHNIQUES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Exchange Argument:
   Prove optimality by showing any optimal solution can be transformed
   into greedy solution without worsening the result.

2. Matroid Theory:
   Framework for proving greedy optimality
   - Independent Set System
   - Exchange Property
   - Rank Function

3. Greedy + Data Structures:
   • Priority Queues: Dijkstra, Prim, Huffman
   • Disjoint Set Union: Kruskal, MST variants
   • Segment Trees: Range greedy updates

PROBLEM IDENTIFICATION PATTERNS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Sorting + Selection: Sort by key, pick optimal prefix
• Interval Problems: Usually sort by start/end time
• Resource Allocation: Maximize/minimize under constraints
• Scheduling: Time-based optimization
• Coding: Frequency-based optimization

PROOF TECHNIQUES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Exchange Argument: Transform optimal to greedy
2. Cut Property: For MST problems
3. Matroid Theory: Abstract greedy framework
4. Induction: Prove greedy maintains optimality

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    binarysearch: {
      name: 'binarysearch',
      description: 'Binary search variations',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│            COMPREHENSIVE BINARY SEARCH VARIATIONS                 │
└─────────────────────────────────────────────────────────────────┘

FUNDAMENTAL BINARY SEARCH:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Standard Binary Search:
   Time: O(log n) | Space: O(1)
   Find exact element in sorted array
   
   function binarySearch(arr, target) {
     let left = 0, right = arr.length - 1;
     while (left <= right) {
       const mid = left + Math.floor((right - left) / 2);
       if (arr[mid] === target) return mid;
       if (arr[mid] < target) left = mid + 1;
       else right = mid - 1;
     }
     return -1;
   }

2. Lower Bound (First ≥ target):
   function lowerBound(arr, target) {
     let left = 0, right = arr.length;
     while (left < right) {
       const mid = left + Math.floor((right - left) / 2);
       if (arr[mid] < target) left = mid + 1;
       else right = mid;
     }
     return left;
   }

3. Upper Bound (First > target):
   function upperBound(arr, target) {
     let left = 0, right = arr.length;
     while (left < right) {
       const mid = left + Math.floor((right - left) / 2);
       if (arr[mid] <= target) left = mid + 1;
       else right = mid;
     }
     return left;
   }

ADVANCED VARIATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Binary Search on Answer:
   When answer is monotonic - search answer space
   
   function minimizeMaximum(arr, k) {
     // Find minimum maximum subarray sum with k subarrays
     let left = Math.max(...arr);
     let right = arr.reduce((sum, val) => sum + val, 0);
     let result = right;
     
     while (left <= right) {
       const mid = left + Math.floor((right - left) / 2);
       if (canDivide(arr, k, mid)) {
         result = mid;
         right = mid - 1;
       } else {
         left = mid + 1;
       }
     }
     return result;
   }

2. Exponential Search:
   Find range then binary search - O(log n)
   
   function exponentialSearch(arr, target) {
     if (arr[0] === target) return 0;
     
     let i = 1;
     while (i < arr.length && arr[i] <= target) {
       i = i * 2;
     }
     
     return binarySearchRange(arr, target, i/2, Math.min(i, arr.length-1));
   }

3. Ternary Search:
   Find maximum/minimum in unimodal function
   
   function ternarySearch(left, right, precision) {
     while (right - left > precision) {
       const mid1 = left + (right - left) / 3;
       const mid2 = right - (right - left) / 3;
       
       if (f(mid1) < f(mid2)) {
         left = mid1;
       } else {
         right = mid2;
       }
     }
     return (left + right) / 2;
   }

CLASSIC PROBLEMS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Aggressive Cows:
   Place cows with maximum minimum distance
   
   function aggressiveCows(stalls, cows) {
     stalls.sort((a, b) => a - b);
     let left = 1, right = stalls[stalls.length - 1] - stalls[0];
     let result = 0;
     
     while (left <= right) {
       const mid = left + Math.floor((right - left) / 2);
       if (canPlaceCows(stalls, cows, mid)) {
         result = mid;
         left = mid + 1;
       } else {
         right = mid - 1;
       }
     }
     return result;
   }

2. Book Allocation:
   Minimize maximum pages per student
   
   function allocateBooks(books, students) {
     let left = Math.max(...books);
     let right = books.reduce((sum, pages) => sum + pages, 0);
     let result = right;
     
     while (left <= right) {
       const mid = left + Math.floor((right - left) / 2);
       if (canAllocate(books, students, mid)) {
         result = mid;
         right = mid - 1;
       } else {
         left = mid + 1;
       }
     }
     return result;
   }

3. Square Root:
   Binary search on answer space
   
   function squareRoot(n, precision = 1e-6) {
     if (n < 2) return n;
     
     let left = 1, right = n;
     while (left <= right) {
       const mid = left + Math.floor((right - left) / 2);
       const square = mid * mid;
       
       if (square === n) return mid;
       if (square < n) left = mid + 1;
       else right = mid - 1;
     }
     
     return right; // Floor of square root
   }

BINARY SEARCH PATTERNS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Predicate Function:
   function predicate(mid) {
     // Return true if condition is satisfied
     // Must be monotonic: TTT...FFF or FFF...TTT
   }

2. Search Template:
   function binarySearchTemplate() {
     let left = MIN_ANSWER, right = MAX_ANSWER;
     while (left <= right) {
       const mid = left + Math.floor((right - left) / 2);
       if (predicate(mid)) {
         // Adjust based on problem requirements
         right = mid - 1; // or left = mid + 1
       } else {
         left = mid + 1; // or right = mid - 1
       }
     }
     return answer;
   }

OPTIMIZATIONS & EDGE CASES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Overflow Prevention: Use left + (right - left) / 2
• Precision: For floating point answers
• Infinite Loops: Ensure proper condition updates
• Boundary Cases: Handle empty arrays, single elements

PERFORMANCE ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Time: O(log n) - logarithmic complexity
• Space: O(1) - constant space for iterative version
• Cache Friendly: Good locality of reference
• Parallelizable: Some variants can be parallelized

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    graphs: {
      name: 'graphs',
      description: 'Graph algorithms',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│              COMPREHENSIVE GRAPH ALGORITHMS                       │
└─────────────────────────────────────────────────────────────────┘

GRAPH REPRESENTATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Adjacency List: O(V + E) space, efficient for sparse graphs
2. Adjacency Matrix: O(V²) space, efficient for dense graphs
3. Edge List: O(E) space, useful for certain algorithms

TRAVERSAL ALGORITHMS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Breadth-First Search (BFS):
   Time: O(V + E) | Space: O(V)
   Level order traversal, shortest path in unweighted graphs
   
   function bfs(graph, start) {
     const visited = new Set();
     const distance = new Map();
     const parent = new Map();
     const queue = [start];
     
     visited.add(start);
     distance.set(start, 0);
     parent.set(start, null);
     
     while (queue.length > 0) {
       const node = queue.shift();
       for (const neighbor of graph[node]) {
         if (!visited.has(neighbor)) {
           visited.add(neighbor);
           distance.set(neighbor, distance.get(node) + 1);
           parent.set(neighbor, node);
           queue.push(neighbor);
         }
       }
     }
     return { visited, distance, parent };
   }

2. Depth-First Search (DFS):
   Time: O(V + E) | Space: O(V)
   Topological sort, connected components, cycle detection
   
   function dfs(graph, start, visited = new Set()) {
     visited.add(start);
     for (const neighbor of graph[start]) {
       if (!visited.has(neighbor)) {
         dfs(graph, neighbor, visited);
       }
     }
     return visited;
   }

SHORTEST PATH ALGORITHMS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Dijkstra's Algorithm:
   Time: O((V + E) log V) | Space: O(V)
   Non-negative edge weights
   
   function dijkstra(graph, start) {
     const distances = new Map();
     const visited = new Set();
     const pq = new MinPriorityQueue();
     
     // Initialize distances
     for (const node of graph.keys()) {
       distances.set(node, node === start ? 0 : Infinity);
     }
     pq.enqueue(start, 0);
     
     while (!pq.isEmpty()) {
       const { element: node, priority: dist } = pq.dequeue();
       if (visited.has(node)) continue;
       visited.add(node);
       
       for (const [neighbor, weight] of graph[node]) {
         const newDist = dist + weight;
         if (newDist < distances.get(neighbor)) {
           distances.set(neighbor, newDist);
           pq.enqueue(neighbor, newDist);
         }
       }
     }
     return distances;
   }

2. Bellman-Ford Algorithm:
   Time: O(VE) | Space: O(V)
   Handles negative weights, detects negative cycles
   
   function bellmanFord(edges, vertices, start) {
     const distances = new Map();
     for (const v of vertices) {
       distances.set(v, v === start ? 0 : Infinity);
     }
     
     // Relax edges V-1 times
     for (let i = 0; i < vertices.length - 1; i++) {
       for (const [u, v, weight] of edges) {
         if (distances.get(u) !== Infinity) {
           distances.set(v, Math.min(distances.get(v), distances.get(u) + weight));
         }
       }
     }
     
     // Check for negative cycles
     for (const [u, v, weight] of edges) {
       if (distances.get(u) !== Infinity && 
           distances.get(u) + weight < distances.get(v)) {
         throw new Error('Negative cycle detected');
       }
     }
     
     return distances;
   }

3. Floyd-Warshall Algorithm:
   Time: O(V³) | Space: O(V²)
   All pairs shortest paths
   
   function floydWarshall(graph) {
     const dist = Array(graph.length).fill().map(() => 
       Array(graph.length).fill(Infinity)
     );
     
     // Initialize distance matrix
     for (let i = 0; i < graph.length; i++) {
       for (let j = 0; j < graph.length; j++) {
         dist[i][j] = i === j ? 0 : graph[i][j] || Infinity;
       }
     }
     
     // Main algorithm
     for (let k = 0; k < graph.length; k++) {
       for (let i = 0; i < graph.length; i++) {
         for (let j = 0; j < graph.length; j++) {
           if (dist[i][k] + dist[k][j] < dist[i][j]) {
             dist[i][j] = dist[i][k] + dist[k][j];
           }
         }
       }
     }
     
     return dist;
   }

MINIMUM SPANNING TREE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Kruskal's Algorithm:
   Time: O(E log E) | Space: O(V)
   
   function kruskalMST(edges, vertices) {
     edges.sort((a, b) => a.weight - b.weight);
     const dsu = new DisjointSetUnion(vertices);
     const mst = [];
     let totalWeight = 0;
     
     for (const edge of edges) {
       if (dsu.find(edge.u) !== dsu.find(edge.v)) {
         dsu.union(edge.u, edge.v);
         mst.push(edge);
         totalWeight += edge.weight;
         
         if (mst.length === vertices.length - 1) break;
       }
     }
     return { mst, totalWeight };
   }

2. Prim's Algorithm:
   Time: O((V + E) log V) | Space: O(V)
   
   function primMST(graph, start) {
     const visited = new Set();
     const mst = [];
     const pq = new MinPriorityQueue();
     let totalWeight = 0;
     
     visited.add(start);
     for (const [neighbor, weight] of graph[start]) {
       pq.enqueue({ u: start, v: neighbor, weight }, weight);
     }
     
     while (!pq.isEmpty() && mst.length < graph.size - 1) {
       const edge = pq.dequeue().element;
       if (visited.has(edge.v)) continue;
       
       visited.add(edge.v);
       mst.push(edge);
       totalWeight += edge.weight;
       
       for (const [neighbor, weight] of graph[edge.v]) {
         if (!visited.has(neighbor)) {
           pq.enqueue({ u: edge.v, v: neighbor, weight }, weight);
         }
       }
     }
     
     return { mst, totalWeight };
   }

ADVANCED ALGORITHMS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Strongly Connected Components (Kosaraju):
   Time: O(V + E) | Space: O(V)
   
2. Bridges and Articulation Points (Tarjan):
   Time: O(V + E) | Space: O(V)
   
3. Maximum Flow (Edmonds-Karp):
   Time: O(VE²) | Space: O(V²)
   
4. Bipartite Matching (Hopcroft-Karp):
   Time: O(E√V) | Space: O(V + E)

GRAPH PROBLEM PATTERNS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Shortest Path: Dijkstra, Bellman-Ford, Floyd-Warshall
• Connectivity: BFS/DFS, Union-Find, Tarjan
• Cycles: DFS with parent tracking, Union-Find
• Topological Sort: DFS-based, Kahn's algorithm
• MST: Kruskal, Prim
• Flow: Ford-Fulkerson, Edmonds-Karp, Dinic's

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    segmenttree: {
      name: 'segmenttree',
      description: 'Segment trees',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│              COMPREHENSIVE SEGMENT TREES                          │
└─────────────────────────────────────────────────────────────────┘

OVERVIEW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Powerful data structure for range queries and updates
• Supports associative operations (sum, min, max, gcd, etc.)
• Time: O(log n) for both queries and updates
• Space: O(4n) for tree storage
• Can be extended with lazy propagation for range updates

BASIC SEGMENT TREE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class SegmentTree {
  constructor(arr, operation = (a, b) => a + b, neutral = 0) {
    this.n = arr.length;
    this.operation = operation;
    this.neutral = neutral;
    this.tree = new Array(4 * this.n);
    this.build(arr, 0, 0, this.n - 1);
  }
  
  build(arr, node, start, end) {
    if (start === end) {
      this.tree[node] = arr[start];
    } else {
      const mid = Math.floor((start + end) / 2);
      this.build(arr, 2 * node + 1, start, mid);
      this.build(arr, 2 * node + 2, mid + 1, end);
      this.tree[node] = this.operation(this.tree[2 * node + 1], this.tree[2 * node + 2]);
    }
  }
  
  query(l, r, node = 0, start = 0, end = this.n - 1) {
    if (r < start || end < l) return this.neutral;
    if (l <= start && end <= r) return this.tree[node];
    
    const mid = Math.floor((start + end) / 2);
    const left = this.query(l, r, 2 * node + 1, start, mid);
    const right = this.query(l, r, 2 * node + 2, mid + 1, end);
    return this.operation(left, right);
  }
  
  update(idx, val, node = 0, start = 0, end = this.n - 1) {
    if (start === end) {
      this.tree[node] = val;
    } else {
      const mid = Math.floor((start + end) / 2);
      if (idx <= mid) {
        this.update(idx, val, 2 * node + 1, start, mid);
      } else {
        this.update(idx, val, 2 * node + 2, mid + 1, end);
      }
      this.tree[node] = this.operation(this.tree[2 * node + 1], this.tree[2 * node + 2]);
    }
  }
}

LAZY PROPAGATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class LazySegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n);
    this.lazy = new Array(4 * this.n).fill(0);
    this.build(arr, 0, 0, this.n - 1);
  }
  
  build(arr, node, start, end) {
    if (start === end) {
      this.tree[node] = arr[start];
    } else {
      const mid = Math.floor((start + end) / 2);
      this.build(arr, 2 * node + 1, start, mid);
      this.build(arr, 2 * node + 2, mid + 1, end);
      this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
    }
  }
  
  updateRange(l, r, val, node = 0, start = 0, end = this.n - 1) {
    if (this.lazy[node] !== 0) {
      this.tree[node] += (end - start + 1) * this.lazy[node];
      if (start !== end) {
        this.lazy[2 * node + 1] += this.lazy[node];
        this.lazy[2 * node + 2] += this.lazy[node];
      }
      this.lazy[node] = 0;
    }
    
    if (start > end || start > r || end < l) return;
    
    if (start >= l && end <= r) {
      this.tree[node] += (end - start + 1) * val;
      if (start !== end) {
        this.lazy[2 * node + 1] += val;
        this.lazy[2 * node + 2] += val;
      }
      return;
    }
    
    const mid = Math.floor((start + end) / 2);
    this.updateRange(l, r, val, 2 * node + 1, start, mid);
    this.updateRange(l, r, val, 2 * node + 2, mid + 1, end);
    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }
  
  queryRange(l, r, node = 0, start = 0, end = this.n - 1) {
    if (this.lazy[node] !== 0) {
      this.tree[node] += (end - start + 1) * this.lazy[node];
      if (start !== end) {
        this.lazy[2 * node + 1] += this.lazy[node];
        this.lazy[2 * node + 2] += this.lazy[node];
      }
      this.lazy[node] = 0;
    }
    
    if (start > end || start > r || end < l) return 0;
    
    if (start >= l && end <= r) return this.tree[node];
    
    const mid = Math.floor((start + end) / 2);
    return this.queryRange(l, r, 2 * node + 1, start, mid) + 
           this.queryRange(l, r, 2 * node + 2, mid + 1, end);
  }
}

COMMON OPERATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Range Sum: operation = (a, b) => a + b, neutral = 0
2. Range Min: operation = Math.min, neutral = Infinity
3. Range Max: operation = Math.max, neutral = -Infinity
4. Range GCD: operation = (a, b) => gcd(a, b), neutral = 0
5. Range XOR: operation = (a, b) => a ^ b, neutral = 0

ADVANCED VARIANTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Persistent Segment Tree:
   • Historical versions of the structure
   • O(log n) per operation, O(n log n) space
   
2. Dynamic Segment Tree:
   • Sparse tree for large ranges
   • O(log range) operations
   
3. Segment Tree with Coordinate Compression:
   • Handle large coordinate ranges efficiently

APPLICATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Range Sum Queries: Standard segment tree
• Range Minimum/Maximum: Min/max operations
• Range GCD Queries: GCD operation
• Inversion Count: With coordinate compression
• Range Updates: Lazy propagation
• Historical Queries: Persistent segment tree

PERFORMANCE ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Build: O(n) time, O(4n) space
• Point Query: O(1) (just access array)
• Range Query: O(log n) time
• Point Update: O(log n) time
• Range Update: O(log n) time (with lazy propagation)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    fenwick: {
      name: 'fenwick',
      description: 'Fenwick trees (Binary Indexed Trees)',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│            COMPREHENSIVE FENWICK TREES (BIT)                     │
└─────────────────────────────────────────────────────────────────┘

OVERVIEW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Efficient data structure for prefix sum queries and point updates
• More memory efficient than segment trees (2n vs 4n)
• Simpler implementation for associative operations
• Time: O(log n) for both operations
• Space: O(n) for tree storage

BIT MANIPULATION FUNDAMENTALS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• LSB (Least Significant Bit): i & (-i)
• Parent: i - LSB(i) - moves to parent in tree
• Next: i + LSB(i) - moves to next responsible node
• Isolate LSB: i & -i
• Clear LSB: i & (i - 1)

BASIC FENWICK TREE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class FenwickTree {
  constructor(size, operation = (a, b) => a + b, inverse = (a, b) => a - b) {
    this.n = size;
    this.operation = operation;
    this.inverse = inverse;
    this.tree = new Array(size + 1).fill(0);
  }
  
  update(index, delta) {
    while (index <= this.n) {
      this.tree[index] = this.operation(this.tree[index], delta);
      index += index & (-index);
    }
  }
  
  query(index) {
    let result = 0;
    while (index > 0) {
      result = this.operation(result, this.tree[index]);
      index -= index & (-index);
    }
    return result;
  }
  
  rangeQuery(l, r) {
    return this.inverse(this.query(r), this.query(l - 1));
  }
  
  // Find first index with prefix sum >= target
  lowerBound(target) {
    let index = 0;
    let bitMask = 1 << Math.floor(Math.log2(this.n));
    
    while (bitMask !== 0) {
      const temp = index + bitMask;
      if (temp <= this.n && this.tree[temp] < target) {
        index = temp;
        target -= this.tree[index];
      }
      bitMask >>= 1;
    }
    
    return index + 1;
  }
}

ADVANCED VARIANTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Range Update Point Query:
   class FenwickTreeRUPQ {
     constructor(size) {
       this.n = size;
       this.tree = new Array(size + 1).fill(0);
     }
     
     rangeUpdate(l, r, delta) {
       this.update(l, delta);
       this.update(r + 1, -delta);
     }
     
     pointQuery(index) {
       return this.query(index);
     }
   }

2. Range Update Range Query:
   class FenwickTreeRURQ {
     constructor(size) {
       this.n = size;
       this.tree1 = new Array(size + 1).fill(0);
       this.tree2 = new Array(size + 1).fill(0);
     }
     
     rangeUpdate(l, r, delta) {
       this._update(this.tree1, l, delta);
       this._update(this.tree1, r + 1, -delta);
       this._update(this.tree2, l, delta * (l - 1));
       this._update(this.tree2, r + 1, -delta * r);
     }
     
     rangeQuery(l, r) {
       return this._prefixSum(r) - this._prefixSum(l - 1);
     }
   }

3. 2D Fenwick Tree:
   class FenwickTree2D {
     constructor(rows, cols) {
       this.rows = rows;
       this.cols = cols;
       this.tree = Array(rows + 1).fill().map(() => Array(cols + 1).fill(0));
     }
     
     update(row, col, delta) {
       for (let i = row; i <= this.rows; i += i & -i) {
         for (let j = col; j <= this.cols; j += j & -j) {
           this.tree[i][j] += delta;
         }
       }
     }
     
     query(row, col) {
       let sum = 0;
       for (let i = row; i > 0; i -= i & -i) {
         for (let j = col; j > 0; j -= j & -j) {
           sum += this.tree[i][j];
         }
       }
       return sum;
     }
     
     rangeQuery(r1, c1, r2, c2) {
       return this.query(r2, c2) - this.query(r1 - 1, c2) 
              - this.query(r2, c1 - 1) + this.query(r1 - 1, c1 - 1);
     }
   }

SOPHISTICATED APPLICATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Inversion Counting:
   function countInversions(arr) {
     const max = Math.max(...arr);
     const bit = new FenwickTree(max);
     let inversions = 0;
     
     for (let i = arr.length - 1; i >= 0; i--) {
       inversions += bit.query(arr[i] - 1);
       bit.update(arr[i], 1);
     }
     
     return inversions;
   }

2. Order Statistics Tree:
   class OrderStatisticsTree {
     constructor(size) {
       this.bit = new FenwickTree(size);
       this.frequencies = new Array(size + 1).fill(0);
     }
     
     insert(value) {
       this.bit.update(value, 1);
       this.frequencies[value]++;
     }
     
     delete(value) {
       this.bit.update(value, -1);
       this.frequencies[value]--;
     }
     
     rank(value) {
       return this.bit.query(value - 1) + 1;
     }
     
     select(k) {
       return this.bit.lowerBound(k);
     }
   }

3. Dynamic Range Sum with Frequencies:
   class FrequencyBIT {
     constructor(maxValue) {
       this.maxValue = maxValue;
       this.bit = new FenwickTree(maxValue);
       this.freqBit = new FenwickTree(maxValue);
     }
     
     add(value, frequency = 1) {
       this.bit.update(value, value * frequency);
       this.freqBit.update(value, frequency);
     }
     
     sumLessThan(value) {
       return {
         sum: this.bit.query(value - 1),
         count: this.freqBit.query(value - 1)
       };
     }
   }

PERFORMANCE COMPARISON:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fenwick Tree vs Segment Tree:
• Space: O(n) vs O(4n) - Fenwick wins
• Implementation: Simpler vs Complex - Fenwick wins
• Operations: Point/Prefix vs Range/Custom - Segment tree wins
• Range Updates: Complex vs Easy - Segment tree wins
• Memory Access: Better vs Worse - Fenwick wins

PROBLEM PATTERNS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Prefix Sum Queries: Standard BIT
• Range Sum Queries: BIT with difference
• Inversion Counting: Process from right to left
• Order Statistics: BIT with frequencies
• 2D Range Queries: 2D BIT
• Dynamic Range Updates: Multiple BITs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    binarylift: {
      name: 'binarylift',
      description: 'Binary lifting and LCA',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│            COMPREHENSIVE BINARY LIFTING & LCA                     │
└─────────────────────────────────────────────────────────────────┘

BINARY LIFTING OVERVIEW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Powerful technique for tree queries and ancestor operations
• Preprocess ancestors at powers of 2 for fast queries
• Answer queries in O(log n) time after O(n log n) preprocessing
• Applications: LCA, path queries, power queries, jump queries

CORE CONCEPT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For any node, we can jump up by 2^k ancestors:
up[node][k] = 2^k-th ancestor of node
up[node][0] = parent[node]
up[node][k] = up[up[node][k-1]][k-1]

BINARY LIFTING IMPLEMENTATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class BinaryLifting {
  constructor(n, root, graph) {
    this.n = n;
    this.LOG = Math.ceil(Math.log2(n)) + 1;
    this.up = Array(n).fill().map(() => Array(this.LOG).fill(-1));
    this.depth = Array(n).fill(0);
    this.root = root;
    
    this.dfs(root, -1);
    this.buildTable();
  }
  
  dfs(node, parent) {
    this.up[node][0] = parent;
    if (parent !== -1) {
      this.depth[node] = this.depth[parent] + 1;
    }
    
    for (const neighbor of graph[node]) {
      if (neighbor !== parent) {
        this.dfs(neighbor, node);
      }
    }
  }
  
  buildTable() {
    for (let k = 1; k < this.LOG; k++) {
      for (let node = 0; node < this.n; node++) {
        if (this.up[node][k-1] !== -1) {
          this.up[node][k] = this.up[this.up[node][k-1]][k-1];
        }
      }
    }
  }
  
  kthAncestor(node, k) {
    for (let i = 0; i < this.LOG; i++) {
      if (k & (1 << i)) {
        node = this.up[node][i];
        if (node === -1) break;
      }
    }
    return node;
  }
  
  lift(node, distance) {
    return this.kthAncestor(node, distance);
  }
}

LOWEST COMMON ANCESTOR (LCA):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

lca(u, v) {
  // Ensure u is deeper
  if (this.depth[u] < this.depth[v]) {
    [u, v] = [v, u];
  }
  
  // Lift u to same depth as v
  const diff = this.depth[u] - this.depth[v];
  for (let i = 0; i < this.LOG; i++) {
    if (diff & (1 << i)) {
      u = this.up[u][i];
    }
  }
  
  if (u === v) return u;
  
  // Lift both until their parents match
  for (let i = this.LOG - 1; i >= 0; i--) {
    if (this.up[u][i] !== this.up[v][i]) {
      u = this.up[u][i];
      v = this.up[v][i];
    }
  }
  
  return this.up[u][0];
}

DISTANCE QUERIES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

distance(u, v) {
  const ancestor = this.lca(u, v);
  return this.depth[u] + this.depth[v] - 2 * this.depth[ancestor];
}

ADVANCED QUERIES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. K-th Ancestor on Path:
   kthAncestorOnPath(u, v, k) {
     const ancestor = this.lca(u, v);
     const distU = this.depth[u] - this.depth[ancestor];
     const distV = this.depth[v] - this.depth[ancestor];
     
     if (k <= distU) {
       return this.kthAncestor(u, k);
     } else {
       return this.kthAncestor(v, distU + distV - k);
     }
   }

2. Jump to Node at Distance:
   jump(u, v, distance) {
     const ancestor = this.lca(u, v);
     const distU = this.depth[u] - this.depth[ancestor];
     
     if (distance <= distU) {
       return this.kthAncestor(u, distance);
     } else {
       const remaining = distance - distU;
       const distV = this.depth[v] - this.depth[ancestor];
       return this.kthAncestor(v, distV - remaining);
     }
   }

3. Number of Nodes on Path:
   nodesOnPath(u, v) {
     return this.distance(u, v) + 1;
   }

ALTERNATIVE LCA METHODS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Euler Tour + RMQ (O(1) queries):
   • Perform Euler tour of tree
   • Record first occurrence of each node
   • Use Sparse Table for RMQ
   • LCA = node with minimum depth in range

2. Heavy-Light Decomposition:
   • Decompose tree into heavy and light paths
   • Answer queries in O(log² n)
   • Supports path updates

PERFORMANCE ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Binary Lifting:
• Preprocessing: O(n log n) time, O(n log n) space
• LCA Query: O(log n) time
• K-th Ancestor: O(log n) time
• Distance Query: O(log n) time

Euler Tour + RMQ:
• Preprocessing: O(n log n) time, O(n log n) space
• LCA Query: O(1) time
• Limited to LCA only

SOPHISTICATED APPLICATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Tree DP with Binary Lifting:
   • Compute values on paths
   • Handle range queries on trees
   • Support dynamic tree operations

2. Centroid Decomposition + Binary Lifting:
   • Handle tree update queries
   • Maintain subtree information
   • Answer path queries efficiently

3. Virtual Trees + Binary Lifting:
   • Optimize queries on subset of nodes
   • Reduce complexity from O(n) to O(k log k)
   • Handle multiple queries efficiently

PROBLEM PATTERNS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• LCA Queries: Standard binary lifting
• Distance Queries: LCA + depths
• K-th Ancestor: Direct binary lifting
• Path Queries: LCA + additional processing
• Tree Jumping: Binary lifting with direction
• Dynamic Trees: Persistent binary lifting

OPTIMIZATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Sparse Table: For O(1) LCA queries
• Memory Optimization: Use arrays instead of objects
• Iterative DFS: Avoid recursion limits
• Precomputation: Cache frequent queries

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    dp: {
      name: 'dp',
      description: 'Dynamic Programming',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│         COMPREHENSIVE DYNAMIC PROGRAMMING                        │
└─────────────────────────────────────────────────────────────────┘

CORE PRINCIPLES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Optimal Substructure:
   - Optimal solution contains optimal solutions to subproblems
   - Problem can be broken down into smaller overlapping subproblems
   
2. Overlapping Subproblems:
   - Subproblems are solved multiple times
   - Store results to avoid recomputation (memoization)

3. State Definition:
   - Define dp[i] or dp[i][j] clearly
   - State represents the answer to a subproblem

DP PATTERNS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 1D DP - Linear Sequences:
   // Fibonacci-style
   function fibonacci(n) {
     const dp = new Array(n + 1);
     dp[0] = 0; dp[1] = 1;
     for (let i = 2; i <= n; i++) {
       dp[i] = dp[i-1] + dp[i-2];
     }
     return dp[n];
   }
   
   // Space optimized
   function fibonacciOptimized(n) {
     if (n <= 1) return n;
     let prev2 = 0, prev1 = 1;
     for (let i = 2; i <= n; i++) {
       const current = prev1 + prev2;
       prev2 = prev1;
       prev1 = current;
     }
     return prev1;
   }

2. 2D DP - Grids & Matrices:
   // Unique Paths (grid traversal)
   function uniquePaths(m, n) {
     const dp = Array(m).fill().map(() => Array(n).fill(1));
     for (let i = 1; i < m; i++) {
       for (let j = 1; j < n; j++) {
         dp[i][j] = dp[i-1][j] + dp[i][j-1];
       }
     }
     return dp[m-1][n-1];
   }
   
   // Longest Common Subsequence
   function LCS(text1, text2) {
     const m = text1.length, n = text2.length;
     const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
     for (let i = 1; i <= m; i++) {
       for (let j = 1; j <= n; j++) {
         if (text1[i-1] === text2[j-1]) {
           dp[i][j] = dp[i-1][j-1] + 1;
         } else {
           dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
         }
       }
     }
     return dp[m][n];
   }

3. Knapsack Pattern:
   // 0/1 Knapsack
   function knapsack(weights, values, capacity) {
     const n = weights.length;
     const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
     for (let i = 1; i <= n; i++) {
       for (let w = 0; w <= capacity; w++) {
         if (weights[i-1] <= w) {
           dp[i][w] = Math.max(
             values[i-1] + dp[i-1][w - weights[i-1]],
             dp[i-1][w]
           );
         } else {
           dp[i][w] = dp[i-1][w];
         }
       }
     }
     return dp[n][capacity];
   }
   
   // Unbounded Knapsack (infinite items)
   function unboundedKnapsack(weights, values, capacity) {
     const dp = Array(capacity + 1).fill(0);
     for (let w = 1; w <= capacity; w++) {
       for (let i = 0; i < weights.length; i++) {
         if (weights[i] <= w) {
           dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
         }
       }
     }
     return dp[capacity];
   }

4. Interval DP:
   // Matrix Chain Multiplication
   function matrixChainOrder(dims) {
     const n = dims.length - 1;
     const dp = Array(n).fill().map(() => Array(n).fill(0));
     for (let len = 2; len <= n; len++) {
       for (let i = 0; i <= n - len; i++) {
         const j = i + len - 1;
         dp[i][j] = Infinity;
         for (let k = i; k < j; k++) {
           const cost = dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1];
           dp[i][j] = Math.min(dp[i][j], cost);
         }
       }
     }
     return dp[0][n-1];
   }

5. State Machine DP:
   // Best Time to Buy/Sell Stock (cooldown)
   function maxProfitWithCooldown(prices) {
     const n = prices.length;
     if (n === 0) return 0;
     // dp[i][0] = max profit on day i with stock
     // dp[i][1] = max profit on day i without stock
     const dp = Array(n).fill().map(() => [0, 0]);
     dp[0][0] = -prices[0];
     dp[0][1] = 0;
     for (let i = 1; i < n; i++) {
       dp[i][0] = Math.max(dp[i-1][0], (i >= 2 ? dp[i-2][1] : 0) - prices[i]);
       dp[i][1] = Math.max(dp[i-1][1], dp[i-1][0] + prices[i]);
     }
     return dp[n-1][1];
   }

ADVANCED TECHNIQUES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Digit DP:
   - Count numbers in range with specific properties
   - State: (position, tight constraint, other properties)
   
   function digitDP(num, target) {
     const digits = num.toString().split('').map(Number);
     const memo = new Map();
     function dfs(pos, tight, count) {
       if (pos === digits.length) return count === target ? 1 : 0;
       const key = \`\${pos},\${tight},\${count}\`;
       if (memo.has(key)) return memo.get(key);
       const limit = tight ? digits[pos] : 9;
       let result = 0;
       for (let d = 0; d <= limit; d++) {
         result += dfs(pos + 1, tight && d === limit, count + (d === 1 ? 1 : 0));
       }
       memo.set(key, result);
       return result;
     }
     return dfs(0, true, 0);
   }

2. Bitmask DP:
   - State represented as bit mask
   - Common in TSP, assignment problems
   
   function tspBitmask(graph) {
     const n = graph.length;
     const dp = Array(1 << n).fill().map(() => Array(n).fill(Infinity));
     dp[1][0] = 0; // Start from city 0
     for (let mask = 1; mask < (1 << n); mask++) {
       for (let last = 0; last < n; last++) {
         if (!(mask & (1 << last))) continue;
         for (let next = 0; next < n; next++) {
           if (mask & (1 << next)) continue;
           const newMask = mask | (1 << next);
           dp[newMask][next] = Math.min(dp[newMask][next], dp[mask][last] + graph[last][next]);
         }
       }
     }
     return dp[(1 << n) - 1];
   }

3. Convex Hull Trick:
   - Optimization for DP with linear functions
   - Maintains lower/upper envelope of lines
   - Reduces O(n²) to O(n log n) or O(n)

4. Divide and Conquer Optimization:
   - dp[i][j] = min(dp[i-1][k] + C[k][j]) where opt[i][j] ≤ opt[i][j+1]
   - Reduces O(kn²) to O(kn log n)

PROBLEM IDENTIFICATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• "Maximum/Minimum" + "choices" → Usually DP
• "Count ways" → DP with combinatorics
• "Optimal" + "substructure" → Classic DP
• "Infinite supply" → Unbounded Knapsack
• "Select without adjacent" → House Robber pattern
• "String transformation" → Edit Distance/LCS
• "Partition" → Interval DP or Linear DP
• "Game theory" → DP with min-max

OPTIMIZATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Space Optimization:
   - Rolling array for 2D → 1D
   - Two variables for Fibonacci

2. Iterative vs Recursive:
   - Bottom-up avoids stack overflow
   - Top-down with memoization is more intuitive

3. Pruning:
   - Skip impossible states
   - Early termination

4. Coordinate Compression:
   - For large state spaces

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    stringalgo: {
      name: 'stringalgo',
      description: 'String Algorithms',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│            COMPREHENSIVE STRING ALGORITHMS                         │
└─────────────────────────────────────────────────────────────────┘

PATTERN MATCHING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. KMP Algorithm (Knuth-Morris-Pratt):
   Time: O(n + m) | Preprocess: O(m)
   
   function KMP(text, pattern) {
     // Build LPS (Longest Prefix Suffix) array
     function buildLPS(pattern) {
       const lps = new Array(pattern.length).fill(0);
       let len = 0, i = 1;
       while (i < pattern.length) {
         if (pattern[i] === pattern[len]) {
           lps[i++] = ++len;
         } else if (len !== 0) {
           len = lps[len - 1];
         } else {
           lps[i++] = 0;
         }
       }
       return lps;
     }
     
     const lps = buildLPS(pattern);
     const matches = [];
     let i = 0, j = 0;
     while (i < text.length) {
       if (text[i] === pattern[j]) {
         i++; j++;
       }
       if (j === pattern.length) {
         matches.push(i - j);
         j = lps[j - 1];
       } else if (i < text.length && text[i] !== pattern[j]) {
         if (j !== 0) j = lps[j - 1];
         else i++;
       }
     }
     return matches;
   }

2. Z-Algorithm:
   Time: O(n) | Linear pattern matching
   
   function zAlgorithm(s) {
     const n = s.length;
     const z = new Array(n).fill(0);
     let l = 0, r = 0;
     for (let i = 1; i < n; i++) {
       if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);
       while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
       if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
     }
     return z;
   }

3. Rabin-Karp (Rolling Hash):
   Time: O(n + m) | Average case
   
   function rabinKarp(text, pattern, base = 256, mod = 1e9 + 7) {
     const n = text.length, m = pattern.length;
     if (m > n) return [];
     let patternHash = 0, textHash = 0, h = 1;
     for (let i = 0; i < m - 1; i++) h = (h * base) % mod;
     for (let i = 0; i < m; i++) {
       patternHash = (base * patternHash + pattern.charCodeAt(i)) % mod;
       textHash = (base * textHash + text.charCodeAt(i)) % mod;
     }
     const matches = [];
     for (let i = 0; i <= n - m; i++) {
       if (patternHash === textHash) {
         let match = true;
         for (let j = 0; j < m; j++) {
           if (text[i + j] !== pattern[j]) { match = false; break; }
         }
         if (match) matches.push(i);
       }
       if (i < n - m) {
         textHash = (base * (textHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % mod;
         if (textHash < 0) textHash += mod;
       }
     }
     return matches;
   }

SUFFIX STRUCTURES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Suffix Array:
   Time: O(n log n) | Sorted suffixes
   
   function buildSuffixArray(s) {
     const n = s.length;
     const sa = Array.from({length: n}, (_, i) => i);
     const rank = s.split('').map(c => c.charCodeAt(0));
     const tmp = new Array(n);
     for (let k = 1; k < n; k *= 2) {
       sa.sort((a, b) => {
         if (rank[a] !== rank[b]) return rank[a] - rank[b];
         const ra = a + k < n ? rank[a + k] : -1;
         const rb = b + k < n ? rank[b + k] : -1;
         return ra - rb;
       });
       tmp[sa[0]] = 0;
       for (let i = 1; i < n; i++) {
         tmp[sa[i]] = tmp[sa[i-1]] + (rank[sa[i-1]] !== rank[sa[i]] || 
           (sa[i-1] + k < n ? rank[sa[i-1] + k] : -1) !== 
           (sa[i] + k < n ? rank[sa[i] + k] : -1) ? 1 : 0);
       }
       for (let i = 0; i < n; i++) rank[i] = tmp[i];
       if (rank[sa[n-1]] === n - 1) break;
     }
     return sa;
   }

2. LCP Array (Longest Common Prefix):
   Time: O(n) | Kasai's algorithm
   
   function buildLCP(s, sa) {
     const n = s.length;
     const rank = new Array(n);
     for (let i = 0; i < n; i++) rank[sa[i]] = i;
     const lcp = new Array(n - 1);
     let k = 0;
     for (let i = 0; i < n; i++) {
       if (rank[i] === n - 1) { k = 0; continue; }
       const j = sa[rank[i] + 1];
       while (i + k < n && j + k < n && s[i + k] === s[j + k]) k++;
       lcp[rank[i]] = k;
       if (k) k--;
     }
     return lcp;
   }

3. Suffix Automaton:
   - Linear construction O(n)
   - Stores all substrings compactly
   - Applications: distinct substrings, occurrences

STRING OPERATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Manacher's Algorithm (Palindromes):
   Time: O(n) | Find all palindromic substrings
   
   function manacher(s) {
     // Transform: "abc" → "#a#b#c#"
     const t = '#' + s.split('').join('#') + '#';
     const n = t.length;
     const p = new Array(n).fill(0);
     let center = 0, right = 0;
     for (let i = 0; i < n; i++) {
       if (i < right) p[i] = Math.min(right - i, p[2 * center - i]);
       while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n && 
              t[i - p[i] - 1] === t[i + p[i] + 1]) p[i]++;
       if (i + p[i] > right) { center = i; right = i + p[i]; }
     }
     return p; // p[i] = radius of palindrome centered at i
   }

2. Edit Distance (Levenshtein):
   Time: O(nm) | Minimum operations to transform
   
   function editDistance(s1, s2) {
     const m = s1.length, n = s2.length;
     const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
     for (let i = 0; i <= m; i++) dp[i][0] = i;
     for (let j = 0; j <= n; j++) dp[0][j] = j;
     for (let i = 1; i <= m; i++) {
       for (let j = 1; j <= n; j++) {
         if (s1[i-1] === s2[j-1]) dp[i][j] = dp[i-1][j-1];
         else {
           dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
         }
       }
     }
     return dp[m][n];
   }

3. Trie (Prefix Tree):
   
   class TrieNode {
     constructor() {
       this.children = new Map();
       this.isEndOfWord = false;
       this.count = 0;
     }
   }
   
   class Trie {
     constructor() {
       this.root = new TrieNode();
     }
     insert(word) {
       let node = this.root;
       for (const char of word) {
         if (!node.children.has(char)) node.children.set(char, new TrieNode());
         node = node.children.get(char);
         node.count++;
       }
       node.isEndOfWord = true;
     }
     search(word) {
       let node = this.root;
       for (const char of word) {
         if (!node.children.has(char)) return false;
         node = node.children.get(char);
       }
       return node.isEndOfWord;
     }
     startsWith(prefix) {
       let node = this.root;
       for (const char of prefix) {
         if (!node.children.has(char)) return false;
         node = node.children.get(char);
       }
       return true;
     }
   }

PROBLEM PATTERNS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Pattern Matching → KMP, Z-algorithm, Rolling Hash
• Multiple Patterns → Aho-Corasick automaton
• Palindromes → Manacher's, expand around center
• Substring Count → Suffix array/automaton
• String Transformation → Edit distance, DP
• Dictionary Problems → Trie, Hash sets
• Repeated Patterns → KMP failure function
• Lexicographical → Suffix array, sorting

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    datastructures: {
      name: 'datastructures',
      description: 'Advanced Data Structures',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│          COMPREHENSIVE ADVANCED DATA STRUCTURES                  │
└─────────────────────────────────────────────────────────────────┘

DISJOINT SET UNION (Union-Find):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Time: O(α(n)) ≈ O(1) per operation | Space: O(n)

class DisjointSetUnion {
  constructor(n) {
    this.parent = Array(n).fill().map((_, i) => i);
    this.rank = new Array(n).fill(0);
    this.size = new Array(n).fill(1);
  }
  
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }
  
  union(x, y) {
    const px = this.find(x), py = this.find(y);
    if (px === py) return false;
    // Union by rank
    if (this.rank[px] < this.rank[py]) {
      this.parent[px] = py;
      this.size[py] += this.size[px];
    } else if (this.rank[px] > this.rank[py]) {
      this.parent[py] = px;
      this.size[px] += this.size[py];
    } else {
      this.parent[py] = px;
      this.rank[px]++;
      this.size[px] += this.size[py];
    }
    return true;
  }
  
  connected(x, y) {
    return this.find(x) === find(y);
  }
  
  getSize(x) {
    return this.size[this.find(x)];
  }
}

BALANCED TREES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Treap (Tree + Heap):
   Time: O(log n) expected for all operations
   
   class TreapNode {
     constructor(key, priority = Math.random()) {
       this.key = key;
       this.priority = priority;
       this.left = null;
       this.right = null;
       this.size = 1;
     }
   }
   
   class Treap {
     rotateRight(y) {
       const x = y.left;
       y.left = x.right;
       x.right = y;
       this.updateSize(y);
       this.updateSize(x);
       return x;
     }
     
     rotateLeft(x) {
       const y = x.right;
       x.right = y.left;
       y.left = x;
       this.updateSize(x);
       this.updateSize(y);
       return y;
     }
     
     updateSize(node) {
       node.size = 1 + this.getSize(node.left) + this.getSize(node.right);
     }
     
     getSize(node) {
       return node ? node.size : 0;
     }
     
     insert(node, key) {
       if (!node) return new TreapNode(key);
       if (key < node.key) {
         node.left = this.insert(node.left, key);
         if (node.left.priority > node.priority) node = this.rotateRight(node);
       } else {
         node.right = this.insert(node.right, key);
         if (node.right.priority > node.priority) node = this.rotateLeft(node);
       }
       this.updateSize(node);
       return node;
     }
     
     // Find kth smallest (order statistics)
     findKth(node, k) {
       const leftSize = this.getSize(node.left);
       if (k <= leftSize) return this.findKth(node.left, k);
       if (k === leftSize + 1) return node.key;
       return this.findKth(node.right, k - leftSize - 1);
     }
   }

2. Cartesian Tree:
   - Heap ordered by priority
   - In-order traversal gives original sequence
   - Used for range minimum queries

ORDERED SET OPERATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Policy-Based Data Structures (PBDS):
   // C++ style - JavaScript equivalent using sorted arrays + binary search
   
   class OrderedSet {
     constructor() {
       this.arr = [];
     }
     insert(x) {
       const pos = this.lowerBound(x);
       if (this.arr[pos] !== x) this.arr.splice(pos, 0, x);
     }
     erase(x) {
       const pos = this.lowerBound(x);
       if (this.arr[pos] === x) this.arr.splice(pos, 1);
     }
     lowerBound(x) {
       let lo = 0, hi = this.arr.length;
       while (lo < hi) {
         const mid = (lo + hi) >> 1;
         if (this.arr[mid] < x) lo = mid + 1;
         else hi = mid;
       }
       return lo;
     }
     findByOrder(k) {
       return this.arr[k] || null;
     }
     orderOfKey(x) {
       return this.lowerBound(x);
     }
   }

ADVANCED HEAPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Fibonacci Heap:
   - insert: O(1) amortized
   - extractMin: O(log n) amortized
   - decreaseKey: O(1) amortized
   - Used in advanced MST and shortest path

2. Pairing Heap:
   - Simple implementation
   - Good practical performance
   - insert: O(1), deleteMin: O(log n) amortized

SPARSE TABLE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Time: O(n log n) build, O(1) query | Space: O(n log n)

class SparseTable {
  constructor(arr, operation = Math.min) {
    this.n = arr.length;
    this.log = new Array(this.n + 1);
    this.operation = operation;
    this.log[1] = 0;
    for (let i = 2; i <= this.n; i++) this.log[i] = this.log[i >> 1] + 1;
    const k = this.log[this.n] + 1;
    this.st = Array(k).fill().map(() => new Array(this.n));
    this.st[0] = [...arr];
    for (let j = 1; j < k; j++) {
      for (let i = 0; i + (1 << j) <= this.n; i++) {
        this.st[j][i] = this.operation(this.st[j-1][i], this.st[j-1][i + (1 << (j-1))]);
      }
    }
  }
  query(l, r) {
    const j = this.log[r - l + 1];
    return this.operation(this.st[j][l], this.st[j][r - (1 << j) + 1]);
  }
}

PERSISTENT DATA STRUCTURES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Persistent Segment Tree:
   - Each update creates O(log n) new nodes
   - Previous versions remain accessible
   - Time: O(log n) per operation, O(n log n) total space

2. Functional Stack/Queue:
   - Immutable operations
   - Share structure between versions

OTHER ADVANCED STRUCTURES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Link-Cut Tree:
   - Dynamic tree operations
   - Path queries and updates
   - Cut and link operations

2. Euler Tour Tree:
   - Forest maintenance
   - Dynamic connectivity

3. Sqrt Decomposition:
   - Block-based processing
   - Mo's algorithm for offline queries
   
   class SqrtDecomposition {
     constructor(arr) {
       this.n = arr.length;
       this.blockSize = Math.floor(Math.sqrt(this.n));
       this.blocks = Math.ceil(this.n / this.blockSize);
       this.arr = [...arr];
       this.blockSum = new Array(this.blocks).fill(0);
       for (let i = 0; i < this.n; i++) {
         this.blockSum[Math.floor(i / this.blockSize)] += arr[i];
       }
     }
     pointUpdate(idx, val) {
       const blockIdx = Math.floor(idx / this.blockSize);
       this.blockSum[blockIdx] += val - this.arr[idx];
       this.arr[idx] = val;
     }
     rangeQuery(l, r) {
       const startBlock = Math.floor(l / this.blockSize);
       const endBlock = Math.floor(r / this.blockSize);
       let sum = 0;
       if (startBlock === endBlock) {
         for (let i = l; i <= r; i++) sum += this.arr[i];
       } else {
         for (let i = l; i < (startBlock + 1) * this.blockSize; i++) sum += this.arr[i];
         for (let i = startBlock + 1; i < endBlock; i++) sum += this.blockSum[i];
         for (let i = endBlock * this.blockSize; i <= r; i++) sum += this.arr[i];
       }
       return sum;
     }
   }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    flowalgo: {
      name: 'flowalgo',
      description: 'Flow Algorithms',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│            COMPREHENSIVE FLOW ALGORITHMS                         │
└─────────────────────────────────────────────────────────────────┘

MAXIMUM FLOW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Ford-Fulkerson Method:
   - Augmenting paths
   - Time: O(E × max_flow) | Edmonds-Karp: O(VE²)
   
   class MaxFlow {
     constructor(n) {
       this.n = n;
       this.graph = Array(n).fill().map(() => []);
     }
     
     addEdge(u, v, capacity) {
       this.graph[u].push({ to: v, capacity, rev: this.graph[v].length });
       this.graph[v].push({ to: u, capacity: 0, rev: this.graph[u].length - 1 });
     }
     
     bfs(s, t, parent) {
       const visited = new Array(this.n).fill(false);
       const queue = [s];
       visited[s] = true;
       while (queue.length > 0) {
         const u = queue.shift();
         for (const edge of this.graph[u]) {
           if (!visited[edge.to] && edge.capacity > 0) {
             parent[edge.to] = { node: u, edge };
             visited[edge.to] = true;
             if (edge.to === t) return true;
             queue.push(edge.to);
           }
         }
       }
       return false;
     }
     
     // Edmonds-Karp
     maxFlow(s, t) {
       let flow = 0;
       const parent = new Array(this.n);
       while (this.bfs(s, t, parent)) {
         let pathFlow = Infinity;
         for (let v = t; v !== s; v = parent[v].node) {
           pathFlow = Math.min(pathFlow, parent[v].edge.capacity);
         }
         for (let v = t; v !== s; v = parent[v].node) {
           const edge = parent[v].edge;
           edge.capacity -= pathFlow;
           this.graph[v][edge.rev].capacity += pathFlow;
         }
         flow += pathFlow;
       }
       return flow;
     }
   }

2. Dinic's Algorithm:
   Time: O(V²E) general, O(E√V) for bipartite matching
   
   class Dinic {
     constructor(n) {
       this.n = n;
       this.graph = Array(n).fill().map(() => []);
       this.level = new Array(n);
       this.ptr = new Array(n);
     }
     
     addEdge(u, v, cap) {
       this.graph[u].push({ to: v, cap, rev: this.graph[v].length });
       this.graph[v].push({ to: u, cap: 0, rev: this.graph[u].length - 1 });
     }
     
     bfs(s, t) {
       this.level.fill(-1);
       this.level[s] = 0;
       const q = [s];
       for (let i = 0; i < q.length; i++) {
         const u = q[i];
         for (const e of this.graph[u]) {
           if (e.cap > 0 && this.level[e.to] < 0) {
             this.level[e.to] = this.level[u] + 1;
             q.push(e.to);
           }
         }
       }
       return this.level[t] >= 0;
     }
     
     dfs(u, t, f) {
       if (u === t) return f;
       for (; this.ptr[u] < this.graph[u].length; this.ptr[u]++) {
         const e = this.graph[u][this.ptr[u]];
         if (e.cap > 0 && this.level[u] < this.level[e.to]) {
           const d = this.dfs(e.to, t, Math.min(f, e.cap));
           if (d > 0) {
             e.cap -= d;
             this.graph[e.to][e.rev].cap += d;
             return d;
           }
         }
       }
       return 0;
     }
     
     maxFlow(s, t) {
       let flow = 0;
       while (this.bfs(s, t)) {
         this.ptr.fill(0);
         while (true) {
           const f = this.dfs(s, t, Infinity);
           if (f === 0) break;
           flow += f;
         }
       }
       return flow;
     }
   }

MINIMUM CUT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Max-Flow Min-Cut Theorem:
- Maximum flow equals capacity of minimum s-t cut
- After max flow, reachable nodes from s form one side of cut

function findMinCut(graph, s, maxFlowResult) {
  // Run BFS on residual graph
  const visited = new Set();
  const queue = [s];
  visited.add(s);
  while (queue.length > 0) {
    const u = queue.shift();
    for (const edge of graph[u]) {
      if (edge.capacity > 0 && !visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push(edge.to);
      }
    }
  }
  return visited; // Minimum cut partition
}

MINIMUM COST MAXIMUM FLOW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Successive Shortest Paths with Bellman-Ford:
Time: O(VE × flow) or O(F × E log V) with Dijkstra + potentials

class MinCostMaxFlow {
  constructor(n) {
    this.n = n;
    this.graph = Array(n).fill().map(() => []);
  }
  
  addEdge(u, v, capacity, cost) {
    this.graph[u].push({ to: v, capacity, cost, rev: this.graph[v].length });
    this.graph[v].push({ to: u, capacity: 0, cost: -cost, rev: this.graph[u].length - 1 });
  }
  
  minCostFlow(s, t, maxf) {
     const n = this.n;
     let res = 0;
     const h = new Array(n).fill(0); // Potential
     const prevv = new Array(n);
     const preve = new Array(n);
     
     while (maxf > 0) {
       // Dijkstra
       const dist = new Array(n).fill(Infinity);
       dist[s] = 0;
       const pq = [[0, s]];
       while (pq.length > 0) {
         const [d, v] = pq.shift();
         if (dist[v] < d) continue;
         for (let i = 0; i < this.graph[v].length; i++) {
           const e = this.graph[v][i];
           if (e.capacity > 0 && dist[e.to] > dist[v] + e.cost + h[v] - h[e.to]) {
             dist[e.to] = dist[v] + e.cost + h[v] - h[e.to];
             prevv[e.to] = v;
             preve[e.to] = i;
             pq.push([dist[e.to], e.to]);
           }
         }
       }
       if (dist[t] === Infinity) return -1; // Cannot flow more
       for (let v = 0; v < n; v++) h[v] += dist[v];
       let d = maxf;
       for (let v = t; v !== s; v = prevv[v]) {
         d = Math.min(d, this.graph[prevv[v]][preve[v]].capacity);
       }
       maxf -= d;
       res += d * h[t];
       for (let v = t; v !== s; v = prevv[v]) {
         const e = this.graph[prevv[v]][preve[v]];
         e.capacity -= d;
         this.graph[v][e.rev].capacity += d;
       }
     }
     return res;
  }
}

BIPARTITE MATCHING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Hopcroft-Karp Algorithm:
   Time: O(E√V) | Faster than standard augmenting path
   
   function hopcroftKarp(graph, U, V) {
     const pairU = new Array(U).fill(-1);
     const pairV = new Array(V).fill(-1);
     const dist = new Array(U);
     
     function bfs() {
       const queue = [];
       for (let u = 0; u < U; u++) {
         if (pairU[u] === -1) {
           dist[u] = 0;
           queue.push(u);
         } else {
           dist[u] = Infinity;
         }
       }
       dist[-1] = Infinity;
       while (queue.length > 0) {
         const u = queue.shift();
         if (dist[u] < dist[-1]) {
           for (const v of graph[u]) {
             if (dist[pairV[v]] === Infinity) {
               dist[pairV[v]] = dist[u] + 1;
               queue.push(pairV[v]);
             }
           }
         }
       }
       return dist[-1] !== Infinity;
     }
     
     function dfs(u) {
       if (u !== -1) {
         for (const v of graph[u]) {
           if (dist[pairV[v]] === dist[u] + 1 && dfs(pairV[v])) {
             pairU[u] = v;
             pairV[v] = u;
             return true;
           }
         }
         dist[u] = Infinity;
         return false;
       }
       return true;
     }
     
     let matching = 0;
     while (bfs()) {
       for (let u = 0; u < U; u++) {
         if (pairU[u] === -1 && dfs(u)) matching++;
       }
     }
     return matching;
   }

FLOW APPLICATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Network Routing
• Bipartite Matching
• Assignment Problems
• Project Selection (Min Cut)
• Image Segmentation
• Baseball Elimination

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    },
    geometryalgo: {
      name: 'geometryalgo',
      description: 'Geometry Algorithms',
      handler: () => {
        return `
┌─────────────────────────────────────────────────────────────────┐
│            COMPREHENSIVE GEOMETRY ALGORITHMS                     │
└─────────────────────────────────────────────────────────────────┘

BASIC OPERATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Point Representation:
   class Point {
     constructor(x, y) {
       this.x = x;
       this.y = y;
     }
   }

2. Distance:
   function distance(p1, p2) {
     return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
   }
   
   function distanceSquared(p1, p2) {
     return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
   }

3. Dot Product & Cross Product:
   function dot(p1, p2) {
     return p1.x * p2.x + p1.y * p2.y;
   }
   
   function cross(p1, p2) {
     return p1.x * p2.y - p1.y * p2.x;
   }
   
   function crossProduct(o, a, b) {
     return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
   }

4. Orientation:
   function orientation(p, q, r) {
     const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
     if (val === 0) return 0;  // Collinear
     return val > 0 ? 1 : 2; // Clockwise or Counterclockwise
   }

LINE OPERATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Line Intersection:
   function lineIntersection(p1, p2, p3, p4) {
     const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
     if (d === 0) return null; // Parallel
     const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / d;
     const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / d;
     return {
       x: p1.x + t * (p2.x - p1.x),
       y: p1.y + t * (p2.y - p1.y),
       onSegment1: t >= 0 && t <= 1,
       onSegment2: u >= 0 && u <= 1
     };
   }

2. Point on Segment:
   function onSegment(p, q, r) {
     return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
   }

3. Segment Intersection:
   function segmentsIntersect(p1, q1, p2, q2) {
     const o1 = orientation(p1, q1, p2);
     const o2 = orientation(p1, q1, q2);
     const o3 = orientation(p2, q2, p1);
     const o4 = orientation(p2, q2, q1);
     if (o1 !== o2 && o3 !== o4) return true;
     if (o1 === 0 && onSegment(p1, p2, q1)) return true;
     if (o2 === 0 && onSegment(p1, q2, q1)) return true;
     if (o3 === 0 && onSegment(p2, p1, q2)) return true;
     if (o4 === 0 && onSegment(p2, q1, q2)) return true;
     return false;
   }

CONVEX HULL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Graham Scan:
   Time: O(n log n)
   
   function convexHullGraham(points) {
     if (points.length < 3) return points;
     
     // Find bottom-most point
     let start = 0;
     for (let i = 1; i < points.length; i++) {
       if (points[i].y < points[start].y || 
           (points[i].y === points[start].y && points[i].x < points[start].x)) {
         start = i;
       }
     }
     [points[0], points[start]] = [points[start], points[0]];
     const pivot = points[0];
     
     // Sort by polar angle
     const sorted = points.slice(1).sort((a, b) => {
       const angleA = Math.atan2(a.y - pivot.y, a.x - pivot.x);
       const angleB = Math.atan2(b.y - pivot.y, b.x - pivot.x);
       if (angleA !== angleB) return angleA - angleB;
       return distanceSquared(pivot, a) - distanceSquared(pivot, b);
     });
     
     const hull = [pivot];
     for (const point of sorted) {
       while (hull.length > 1 && 
              crossProduct(hull[hull.length - 2], hull[hull.length - 1], point) <= 0) {
         hull.pop();
       }
       hull.push(point);
     }
     return hull;
   }

2. Andrew's Monotone Chain:
   Time: O(n log n), more numerically stable
   
   function convexHullMonotone(points) {
     if (points.length < 3) return points;
     points = points.slice().sort((a, b) => a.x - b.x || a.y - b.y);
     const n = points.length;
     const hull = [];
     
     // Lower hull
     for (let i = 0; i < n; i++) {
       while (hull.length >= 2 && 
              crossProduct(hull[hull.length - 2], hull[hull.length - 1], points[i]) <= 0) {
         hull.pop();
       }
       hull.push(points[i]);
     }
     
     // Upper hull
     const lowerSize = hull.length;
     for (let i = n - 2; i >= 0; i--) {
       while (hull.length > lowerSize && 
              crossProduct(hull[hull.length - 2], hull[hull.length - 1], points[i]) <= 0) {
         hull.pop();
       }
       hull.push(points[i]);
     }
     
     hull.pop(); // Remove duplicate of first point
     return hull;
   }

POLYGON OPERATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Area (Shoelace Formula):
   function polygonArea(points) {
     let area = 0;
     const n = points.length;
     for (let i = 0; i < n; i++) {
       const j = (i + 1) % n;
       area += points[i].x * points[j].y;
       area -= points[j].x * points[i].y;
     }
     return Math.abs(area) / 2;
   }

2. Point in Polygon:
   function pointInPolygon(point, polygon) {
     let inside = false;
     for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
       if (((polygon[i].y > point.y) !== (polygon[j].y > point.y)) &&
           (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / 
                      (polygon[j].y - polygon[i].y) + polygon[i].x)) {
         inside = !inside;
       }
     }
     return inside;
   }

3. Convex Polygon Check:
   function isConvex(points) {
     const n = points.length;
     if (n < 3) return false;
     let prevCross = 0;
     for (let i = 0; i < n; i++) {
       const p = points[i];
       const q = points[(i + 1) % n];
       const r = points[(i + 2) % n];
       const cross = crossProduct(p, q, r);
       if (cross !== 0) {
         if (prevCross !== 0 && cross * prevCross < 0) return false;
         prevCross = cross;
       }
     }
     return true;
   }

CLOSEST PAIR OF POINTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Divide and Conquer: O(n log n)

function closestPair(points) {
  function closestUtil(px, py) {
    const n = px.length;
    if (n <= 3) {
      let min = Infinity;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          min = Math.min(min, distanceSquared(px[i], px[j]));
        }
      }
      return min;
    }
    
    const mid = Math.floor(n / 2);
    const midPoint = px[mid];
    
    const pyl = py.filter(p => p.x <= midPoint.x);
    const pyr = py.filter(p => p.x > midPoint.x);
    
    const dl = closestUtil(px.slice(0, mid), pyl);
    const dr = closestUtil(px.slice(mid), pyr);
    let d = Math.min(dl, dr);
    
    // Check strip
    const strip = py.filter(p => (p.x - midPoint.x) ** 2 < d);
    for (let i = 0; i < strip.length; i++) {
      for (let j = i + 1; j < strip.length && (strip[j].y - strip[i].y) ** 2 < d; j++) {
        d = Math.min(d, distanceSquared(strip[i], strip[j]));
      }
    }
    return d;
  }
  
  const px = points.slice().sort((a, b) => a.x - b.x);
  const py = points.slice().sort((a, b) => a.y - b.y);
  return Math.sqrt(closestUtil(px, py));
}

LINE SWEEP ALGORITHMS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Line Segment Intersection (All pairs):
   - Event-based processing
   - Active set maintenance
   - Time: O((n + k) log n) where k = intersections

2. Rectangle Union Area:
   - Sweep line + segment tree
   - Time: O(n log n)

OTHER ADVANCED TOPICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Voronoi Diagrams:
   - Partition plane into regions
   - Fortune's algorithm: O(n log n)

2. Delaunay Triangulation:
   - Dual of Voronoi diagram
   - Maximizes minimum angle

3. Rotating Calipers:
   - Diameter of point set
   - Width of convex polygon
   - Minimum area rectangle

4. KD-Trees:
   - Spatial partitioning
   - Nearest neighbor queries
   - Range searches

PRECISION NOTES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Use integer arithmetic when possible
• Cross product avoids square roots
• Epsilon comparisons for floating point: |a - b| < 1e-9
• Rational number representation for exactness

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      }
    }
  }

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    // Add to history
    setCommandHistory(prev => [...prev, trimmedCmd])
    setHistoryIndex(-1)

    // Add command to output
    setOutput(prev => [...prev, `vishal@portfolio:~$ ${trimmedCmd}`])

    // Parse command and args
    const [command, ...args] = trimmedCmd.split(' ')

    // Execute command
    const cmdHandler = commands[command.toLowerCase()]
    if (cmdHandler) {
      // Handle clear command specially
      if (command.toLowerCase() === 'clear') {
        setOutput([])
        setInput('')
        return
      }
      
      setIsTyping(true)
      
      // Simulate typing effect for longer responses
      const result = cmdHandler.handler(args)
      if (result) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setOutput(prev => [...prev, result])
      }
      setIsTyping(false)
    } else {
      setOutput(prev => [...prev, `Command not found: ${command}. Type "help" for available commands.`])
    }

    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput('')
      }
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={terminalRef}
      className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-16 bg-[var(--color-off-black)] border border-[var(--color-medium-gray)] rounded-lg shadow-2xl z-[var(--z-terminal)] flex flex-col font-mono text-sm sm:text-base"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-dark-gray)] border-b border-[var(--color-medium-gray)]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-[var(--color-accent-gray)] text-xs sm:text-sm">vishal@portfolio</span>
        </div>
        <button
          onClick={() => {
            setIsOpen(false)
            onToggle?.()
          }}
          className="text-[var(--color-accent-gray)] hover:text-[var(--color-white)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Terminal Body */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 text-[var(--color-off-white)] whitespace-pre-wrap scrollbar-thin"
        style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
      >
        {output.map((line, index) => (
          <div key={index} className="mb-1">
            {line}
          </div>
        ))}
        {isTyping && (
          <div className="animate-pulse">Processing...</div>
        )}
      </div>

      {/* Terminal Input */}
      <div className="px-4 py-3 bg-[var(--color-dark-gray)] border-t border-[var(--color-medium-gray)]">
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-accent-gray)]">vishal@portfolio:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-[var(--color-off-white)] font-mono"
            style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
            placeholder="Type a command..."
            autoComplete="off"
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}
