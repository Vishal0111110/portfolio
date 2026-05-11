export const cpStats = {
  totalSolved: 2500,
  favoriteTopics: [
    "Math",
    "Greedy",
    "DP",
    "Binary Search",
    "Graphs",
    "Segment Trees",
    "Fenwick Trees",
    "Binary Lifting"
  ],
  bestRankings: [
    {
      platform: "Codeforces",
      rank: "Expert",
      rating: 1734,
      url: "https://codeforces.com/profile/ArminArlert69"
    },
    {
      platform: "CodeChef",
      rank: "5★",
      rating: 20235,
      url: "https://www.codechef.com/users/vishal062"
    },
    {
      platform: "LeetCode",
      rank: "Knight",
      rating: 2090,
      url: "https://leetcode.com/u/ReinerBraun71"
    }
  ],
  languages: [
    {
      language: "C++",
      percentage: 95,
      description: "Primary language for competitive programming"
    },
    {
      language: "Python",
      percentage: 5,
      description: "Used for quick prototyping and scripting"
    }
  ],
  recentContests: [
    {
      name: "Codeforces Round 965 (Div. 2)",
      rank: 589,
      date: "Aug 2024"
    },
    {
      name: "Codeforces Round 967 (Div. 2)",
      rank: 606,
      date: "Aug 2024"
    },
    {
      name: "CodeChef Starters 137 (Div. 1)",
      rank: 62,
      date: "Jun 2024"
    },
    {
      name: "Epic Institute Round Summer 2024",
      rank: 983,
      date: "Jun 2024"
    }
  ]
}

export type CPStats = typeof cpStats

// Display helper functions
export function getTopRating() {
  return Math.max(...cpStats.bestRankings.map(r => r.rating))
}

export function getPlatformCount() {
  return cpStats.bestRankings.length
}

export function getPrimaryLanguage() {
  return cpStats.languages[0]?.language || "C++"
}
