// Hidden CP facts that appear on hover, in terminal, and in console
export const cpFacts = [
  {
    id: 1,
    topic: "Binary Search",
    fact: "Binary search reduces search space by half each iteration. Time complexity: O(log n).",
    detail: "The floor of the last index of the search space is essentially the answer in most binary search problems."
  },
  {
    id: 2,
    topic: "Sorting",
    fact: "O(n log n) is the lower bound for comparison-based sorting algorithms.",
    detail: "This can be proven using decision tree theory - there must be at least n! leaves, giving us Ω(n log n)."
  },
  {
    id: 3,
    topic: "Fenwick Tree",
    fact: "Fenwick Tree (Binary Indexed Tree) enables prefix sum queries in O(log n) with O(n) space.",
    detail: "More efficient than Segment Trees for simple cumulative sum operations. Uses the trick: i += i & -i for updates."
  },
  {
    id: 4,
    topic: "Segment Tree",
    fact: "Segment tree handles range queries with O(log n) updates and queries.",
    detail: "A recursive segment tree uses 4*n memory. Lazy propagation enables range updates in O(log n)."
  },
  {
    id: 5,
    topic: "Graph Theory",
    fact: "Dijkstra's algorithm fails with negative edge weights - use Bellman-Ford instead.",
    detail: "Time complexity: O((V+E) log V) with binary heap, O(E + V log V) with Fibonacci heap."
  },
  {
    id: 6,
    topic: "Dynamic Programming",
    fact: "DP is not about speed, it's about avoiding recomputation.",
    detail: "Key properties: Optimal substructure and overlapping subproblems. Memoization vs Tabulation trade-offs."
  },
  {
    id: 7,
    topic: "KMP Algorithm",
    fact: "Knuth-Morris-Pratt string matching runs in O(n+m) time.",
    detail: "The LPS (Longest Prefix Suffix) array eliminates unnecessary comparisons by skipping ahead."
  },
  {
    id: 8,
    topic: "DSU (Union-Find)",
    fact: "Disjoint Set Union with path compression and union by rank achieves nearly O(1) amortized time.",
    detail: "The inverse Ackermann function α(n) grows so slowly that it's effectively constant for all practical n."
  },
  {
    id: 9,
    topic: "Sieve of Eratosthenes",
    fact: "The classic sieve runs in O(n log log n) time - better than O(n) naive approach.",
    detail: "Linear sieve achieves O(n) by ensuring each number is crossed out only by its smallest prime factor."
  },
  {
    id: 10,
    topic: "Modular Arithmetic",
    fact: "Fermat's Little Theorem: a^(p-1) ≡ 1 (mod p) for prime p and a not divisible by p.",
    detail: "This enables fast modular inverse computation: a^(-1) ≡ a^(p-2) (mod p) using fast exponentiation."
  },
  {
    id: 11,
    topic: "Game Theory",
    fact: "Nim game: XOR of all pile sizes determines winner. If XOR ≠ 0, first player wins.",
    detail: "Sprague-Grundy theorem extends this to impartial games by computing Grundy numbers for each position."
  },
  {
    id: 12,
    topic: "Binary Lifting",
    fact: "Preprocess in O(n log n) to answer LCA queries in O(log n), or O(1) with Euler tour + RMQ.",
    detail: "Up[k][v] stores the 2^k-th ancestor of node v. Jump pointers enable fast ancestor queries."
  },
  {
    id: 13,
    topic: "Convex Hull",
    fact: "Graham scan: O(n log n). Monotone chain (Andrew's algorithm): O(n log n) with simpler code.",
    detail: "Cross product determines orientation. Remove points that create non-left turns (for lower hull)."
  },
  {
    id: 14,
    topic: "Line Sweep",
    fact: "Sweep line algorithms reduce 2D problems to a sequence of 1D problems.",
    detail: "Active set maintains current relevant elements. Event points sorted by coordinate drive the algorithm."
  },
  {
    id: 15,
    topic: "Greedy Algorithms",
    fact: "Greedy works only when local optimal choices lead to global optimum.",
    detail: "Proof techniques: Exchange argument (show greedy stays ahead) or structural analysis."
  },
  {
    id: 16,
    topic: "Sliding Window",
    fact: "Two pointers technique works when the array is monotonic with respect to the condition.",
    detail: "Window maintains valid subarray. Expand/shrink based on problem constraints. O(n) time."
  },
  {
    id: 17,
    topic: "Bit Manipulation",
    fact: "n & (n-1) clears the lowest set bit. Useful for counting set bits (Brian Kernighan's algorithm).",
    detail: "n & -n isolates the lowest set bit. __builtin_popcount() in GCC counts bits in hardware."
  },
  {
    id: 18,
    topic: "Matrix Exponentiation",
    fact: "Compute Fibonacci(n) in O(log n) using matrix exponentiation: [[1,1],[1,0]]^n.",
    detail: "Any linear recurrence can be solved this way. Exponentiation by squaring: O(log n) matrix multiplications."
  },
  {
    id: 19,
    topic: "Trie Data Structure",
    fact: "Trie enables prefix-based string operations in O(length) time.",
    detail: "Memory: O(ALPHABET_SIZE × length × N). Can be optimized with compressed tries (radix/patricia)."
  },
  {
    id: 20,
    topic: "Probability",
    fact: "Linearity of expectation holds even when events are dependent. E[X+Y] = E[X] + E[Y].",
    detail: "Indicator random variables simplify complex expectation calculations."
  },
  {
    id: 21,
    topic: "Number Theory",
    fact: "GCD(a, b) × LCM(a, b) = a × b. Euclidean algorithm: O(log(min(a,b))).",
    detail: "Extended Euclidean finds Bézout coefficients for ax + by = gcd(a,b)."
  },
  {
    id: 22,
    topic: "Combinatorics",
    fact: "nCk = nC(n-k). Pascal's identity: nCk = (n-1)Ck + (n-1)C(k-1).",
    detail: "Precompute factorials and inverse factorials for O(1) nCr queries with mod."
  },
  {
    id: 23,
    topic: "Topological Sort",
    fact: "Kahn's algorithm (BFS) and DFS-based approach both run in O(V+E).",
    detail: "DAG property: No back edges. Indegree array tracks nodes ready to be processed."
  },
  {
    id: 24,
    topic: "MST (Minimum Spanning Tree)",
    fact: "Kruskal's: O(E log E) with union-find. Prim's: O(E log V) with binary heap.",
    detail: "Cut property: Lightest edge crossing any cut belongs to some MST."
  },
  {
    id: 25,
    topic: "Max Flow",
    fact: "Edmonds-Karp: O(V × E²). Dinic's: O(E × V²), O(E × sqrt(V)) for unit networks.",
    detail: "Max-flow min-cut theorem: Value of max flow equals capacity of min cut."
  }
]

// Function to get random CP fact
export function getRandomCPFact() {
  return cpFacts[Math.floor(Math.random() * cpFacts.length)]
}

// Function to get fact by topic
export function getCPFactByTopic(topic: string) {
  return cpFacts.find(fact => fact.topic.toLowerCase() === topic.toLowerCase())
}

// Function to get fact by ID
export function getCPFactById(id: number) {
  return cpFacts.find(fact => fact.id === id)
}

// Console easter egg message
export function printConsoleEasterEgg() {
  console.log(
    `%c🎮 CP Portfolio Easter Egg Activated! 🎮\n%c` +
    `Hey there, curious developer! 👋\n\n` +
    `Try these:\n` +
    `• Type the Konami code (↑↑↓↓←→←→BA) anywhere on the page\n` +
    `• Press Ctrl+\u0060 to open the terminal\n` +
    `• Look for CP facts on hover\n` +
    `• Try the 'secret' and 'matrix' commands in the terminal\n\n` +
    `Happy coding! 🚀`,
    'font-size: 20px; font-weight: bold; color: #4a4a4a;',
    'font-size: 14px; color: #888888;'
  )
}
