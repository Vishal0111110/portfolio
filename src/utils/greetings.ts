// Time-based greetings with CP and personal touches

export interface Greeting {
  text: string
  subtext?: string
  icon?: string
}

// Time-based greetings
export function getTimeBasedGreeting(): Greeting {
  const hour = new Date().getHours()
  const day = new Date().getDay()
  const isWeekend = day === 0 || day === 6

  // Early morning (5-8)
  if (hour >= 5 && hour < 8) {
    return {
      text: "Early bird! 🌅",
      subtext: "Perfect time for some CP practice before the day starts.",
      icon: "🌅"
    }
  }

  // Morning (8-12)
  if (hour >= 8 && hour < 12) {
    return {
      text: "Good morning! ☕",
      subtext: isWeekend 
        ? "Weekend vibes + Codeforces = Perfect combo!"
        : "Let's solve some interesting problems today.",
      icon: "☕"
    }
  }

  // Afternoon (12-17)
  if (hour >= 12 && hour < 17) {
    return {
      text: "Good afternoon! 🌤️",
      subtext: "Afternoon debugging hits different. Stay focused!",
      icon: "🌤️"
    }
  }

  // Evening (17-21)
  if (hour >= 17 && hour < 21) {
    return {
      text: "Good evening! 🌆",
      subtext: "Contest time or chill commits? Either way, enjoy!",
      icon: "🌆"
    }
  }

  // Night (21-5)
  return {
    text: "Burning the midnight oil? 🌙",
    subtext: "Late night coding sessions hit different. Keep grinding!",
    icon: "🌙"
  }
}

// Special date greetings
export function getSpecialDateGreeting(): Greeting | null {
  const now = new Date()
  const month = now.getMonth() + 1 // 1-12
  const date = now.getDate()
  const day = now.getDay()

  // Monday (competitive programming contest day reminder)
  if (day === 1) {
    return {
      text: "Monday grind! 💪",
      subtext: "New week, new problems to solve. Let's go!",
      icon: "💪"
    }
  }

  // Friday
  if (day === 5) {
    return {
      text: "Friday vibes! 🎉",
      subtext: "Weekend is near. Time for some fun projects!",
      icon: "🎉"
    }
  }

  // Saturday (Codeforces rounds often happen here)
  if (day === 6) {
    return {
      text: "Saturday = Codeforces! 🏆",
      subtext: "Check if there's a rated contest today. Good luck!",
      icon: "🏆"
    }
  }

  // Personal special dates (you can customize these)
  // Add your birthday, hackathon wins, etc.
  
  // Example: Hackathon win anniversary (July 26 - HSBC Hackathon)
  if (month === 7 && date === 26) {
    return {
      text: "Hackathon Anniversary! 🏆",
      subtext: "1 year ago: Won the HSBC 2k25 Hackathon!",
      icon: "🏆"
    }
  }

  // Example: Innovasia win anniversary (November 16)
  if (month === 11 && date === 16) {
    return {
      text: "Victory Day! 🥇",
      subtext: "Anniversary of Innovasia 2k24 Hackathon win!",
      icon: "🥇"
    }
  }

  return null
}

// CP-themed random greetings
const cpGreetings: Greeting[] = [
  { text: "while(alive) { code(); }", subtext: "The infinite loop of a programmer's life" },
  { text: "System.out.println('Hello World!');", subtext: "Every great journey starts with Hello World" },
  { text: "Segment Tree > Life", subtext: "Just kidding... maybe" },
  { text: "AC in 1 try! 💯", subtext: "The dream of every competitive programmer" },
  { text: "Time limit exceeded? Never heard of it.", subtext: "Optimization is the key" },
  { text: "Ctrl+Z can't fix everything", subtext: "But git checkout can!" },
  { text: "O(1) person, O(n) ambitions", subtext: "Constant time, infinite dreams" },
  { text: "Eat. Sleep. Code. Repeat.", subtext: "The programmer's lifestyle" },
  { text: "Hello, is it me you're looking for?", subtext: "Maybe Lionel Richie was a recruiter" },
  { text: "Bug free code doesn't exist", subtext: "It just hasn't been tested enough" },
  { text: "Recursion: see Recursion", subtext: "Base case: when you understand it" },
  { text: "There's no place like 127.0.0.1", subtext: "Home sweet localhost" },
  { text: "git commit -m 'fix everything'", subtext: "Famous last words" },
  { text: "printf('Stay hydrated');", subtext: "Important reminder while coding" },
  { text: "npm install happiness", subtext: "If only it was that simple" },
  { text: "It's not a bug, it's a feature", subtext: "The programmer's classic excuse" },
  { text: "Coding is 10% writing code", subtext: "90% wondering why it doesn't work" },
  { text: "May the source be with you", subtext: "And also with you" },
  { text: "Talk is cheap. Show me the code.", subtext: "- Linus Torvalds" },
  { text: "Simplicity is the soul of efficiency", subtext: "- Austin Freeman" },
]

export function getRandomGreeting(): Greeting {
  const randomIndex = Math.floor(Math.random() * cpGreetings.length)
  return cpGreetings[randomIndex]
}

// Get combined greeting (time-based + special date priority)
export function getGreeting(): Greeting {
  // Check for special dates first
  const specialGreeting = getSpecialDateGreeting()
  if (specialGreeting) {
    return specialGreeting
  }

  // 30% chance of random CP greeting, 70% time-based
  if (Math.random() < 0.3) {
    return getRandomGreeting()
  }

  return getTimeBasedGreeting()
}

// Format greeting for display
export function formatGreeting(greeting: Greeting): string {
  if (greeting.subtext) {
    return `${greeting.text}\n${greeting.subtext}`
  }
  return greeting.text
}
