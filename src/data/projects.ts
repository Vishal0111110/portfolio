export type CaseStudyContent = {
  headline: string
  problem: string
  constraints: string
  approach: string
  outcome: string
  redo: string
}

export type ProjectEntry = {
  name: string
  role: string
  outcome: string
  tech: string
  date: string
  description: string[]
  link: string
  slug?: string
  caseStudy?: CaseStudyContent
}

export const projects: ProjectEntry[] = [
  {
    name: "AURUM",
    slug: "aurum",
    role: "Full-stack",
    outcome:
      "Production-style portfolio management stack: React + Spring Boot, analytics, and trading-adjacent workflows.",
    tech: "React 18, TypeScript, Spring Boot 3, MySQL, REST APIs, TailwindCSS, Zustand, Recharts",
    date: "Feb 2026",
    description: [
      "Built AURUM, a full-stack AI-powered portfolio management and research platform supporting live, simulation, and research trading workflows using React 18, TypeScript, Spring Boot 3, MySQL, and REST APIs.",
      "Engineered advanced financial analytics modules including portfolio tracking, AI-driven risk decomposition, stress testing, VaR analysis, behavioral analytics, and decision journaling with real-time market insights integration.",
      "Developed scalable backend architecture with Spring Boot, JPA, Swagger/OpenAPI, ACID-compliant transactions, indexed database queries, and modular Controller–Service–Repository design, ensuring production-ready performance and maintainability.",
      "Designed an interactive trading intelligence UI featuring agent advisory panels, research lab, live market/news dashboards, terminal-style command execution, and dynamic data visualizations using TailwindCSS, Zustand, Recharts, and Axios."
    ],
    link: "https://github.com/Vishal0111110/Aurum",
    caseStudy: {
      headline: "A full-stack portfolio lab for research and execution-adjacent workflows",
      problem:
        "Portfolio tooling often splits research, execution, and journaling across disjoint surfaces; users lose context when switching contexts between analytics and narrative decisions.",
      constraints:
        "Strong typing and predictable API contracts across React and Spring Boot; MySQL with transactional guarantees; observability-friendly module seams so analytics could evolve without rewriting core flows.",
      approach:
        "Layered the stack into clear boundaries: REST surfaces documented with OpenAPI, JPA-backed domain services, and a UI organized around workspaces (research lab, dashboards, journaling) with shared client state via Zustand and Axios interceptors for consistent error handling.",
      outcome:
        "A cohesive trading-intelligence UI backed by modular services—analytics modules (risk, stress, VaR), agent-facing panels, and terminal-style commands—without sacrificing ACID semantics where capital-adjacent data moves.",
      redo:
        "Earlier investment in automated contract tests across the API boundary and snapshot-driven UI states for the heaviest dashboards—catch regressions before they reach demo-day nerves."
    }
  },
  {
    name: "Flash-Cascade",
    slug: "flash-cascade",
    role: "Systems / search",
    outcome:
      "Hybrid sparse + dense search at extreme scale with sub-150 ms latency and hot-reload freshness.",
    tech: "React, Node.js, Express.js, C++, Python, Firebase Functions",
    date: "Aug 2025",
    description: [
      "Extreme-scale, ultra-low-latency hybrid search platform achieving billion-scale search with sub-150 ms latency.",
      "Combines sparse search (BM25 + Block-Max WAND) with dense ANN search, orchestrated by learned query budgeter for optimal execution paths.",
      "Features hot-reload mechanism for real-time data freshness within 1-2 seconds and scalable C++ core with horizontal sharding.",
      "Implements sparse-first routing strategy for cost-efficiency and fast sparse queries (≤80 ms) with semantic dense retrieval."
    ],
    link: "https://github.com/Vishal0111110/Flash-Cascade",
    caseStudy: {
      headline: "A hybrid search stack balancing speed, quality, and cost at scale",
      problem:
        "Pure dense retrieval was too expensive for every query, while sparse-only retrieval missed semantic intent for harder long-tail searches.",
      constraints:
        "Strict sub-150 ms latency targets, billion-scale indexing pressure, and near real-time freshness without expensive full re-indexing cycles.",
      approach:
        "Combined BM25 + Block-Max WAND sparse retrieval with ANN dense retrieval and a query-budget router deciding when dense expansion is worth the cost.",
      outcome:
        "Delivered a hybrid pipeline with fast sparse-first paths for most traffic, semantic recovery on difficult queries, and 1-2 second freshness via hot reload mechanisms.",
      redo:
        "Add broader offline relevance benchmarking and query-cluster level dashboards earlier to tune routing thresholds with less manual iteration."
    }
  },
  {
    name: "HSBC Banking Chatbot System",
    slug: "hsbc-banking-chatbot-system",
    role: "Full-stack · AI",
    outcome:
      "Gemini + MCP banking assistant with JWT, WebSockets, and multi-turn flows—hackathon-shippable.",
    tech: "FastAPI, Google Gemini LLM, MCP Server, HTML/CSS/JS",
    date: "Jul 2025",
    description: [
      "Developed a modular, web-based banking chatbot using FastAPI, Google Gemini LLM, and a custom MCP server, enabling intelligent, context-aware conversations for simulated banking operations.",
      "Engineered a full-stack architecture with REST and WebSocket APIs, JWT-based authentication, multilingual and accessibility support, and real-time conversational UI built with HTML/CSS/JS.",
      "Implemented multi-turn dialogue management with slot filling, context retention, and intent routing, enabling seamless handling of complex banking flows like loan applications, card blocking, and account queries.",
      "Integrated LLM-driven NLU (Gemini 1.5 Flash) for intent detection and dynamic response generation, achieving robust conversational understanding in a hackathon-ready, extensible banking assistant system."
    ],
    link: "https://github.com/Vishal0111110/hsbc",
    caseStudy: {
      headline: "A secure multi-turn banking assistant built for real-time interaction",
      problem:
        "Banking workflows need secure, context-aware conversations, but hackathon timelines usually force trade-offs between UX quality and system reliability.",
      constraints:
        "JWT-authenticated flows, real-time updates through WebSockets, and multi-intent conversations that had to remain coherent across turns.",
      approach:
        "Built a modular FastAPI backend with REST + WebSocket surfaces, layered intent routing and slot filling, and integrated Gemini for dynamic NLU and response generation.",
      outcome:
        "Shipped a hackathon-ready assistant handling account queries, card blocking, and loan-style flows with robust session continuity and accessible web UI support.",
      redo:
        "Introduce stricter guardrail evaluation suites and conversation replay tooling earlier to harden failure handling before demo traffic spikes."
    }
  },
  {
    name: "ApplyAsap",
    slug: "applyasap",
    role: "Full-stack · Flutter",
    outcome:
      "Multilingual career platform with Gemini content, Chrome extension, and measurable application-time cuts.",
    tech: "Flutter, Node.js, Express.js, Firebase, Machine Learning",
    date: "Apr 2025",
    description: [
      "Fabricated an AI-powered software platform for smart learning and career guidance, with support for 16+ Indian languages.",
      "Integrated Gemini-based AI content generation, user surveys, and personalized job dashboards.",
      "Implemented a Chrome Extension for auto job applications and AI mock interviews, cutting application time by 50% and increasing user interview readiness.",
      "Personalized communities, alumni connect, reward coin system and real-time social feed, fostering 40% higher career networking interactions."
    ],
    link: "https://github.com/Vishal0111110/ApplyAsap",
    caseStudy: {
      headline: "An AI-enabled career platform optimized for speed to application",
      problem:
        "Students lose momentum between discovering roles, preparing, and actually applying—especially across language and guidance gaps.",
      constraints:
        "Multi-language support, personalized workflows, and low-friction automation while keeping the product useful for first-time job seekers.",
      approach:
        "Combined Gemini-based content generation, survey-driven personalization, job dashboards, and a Chrome extension to automate repetitive application steps.",
      outcome:
        "Reduced application time significantly, improved mock-interview readiness, and increased engagement through community and alumni-powered feedback loops.",
      redo:
        "Ship deeper analytics around funnel drop-off and role-fit quality sooner to prioritize the highest-leverage guidance features."
    }
  },
  {
    name: "Breathe",
    slug: "breathe",
    role: "Mobile",
    outcome:
      "Mental wellness app with secure health flows, reminders, and sentiment-aware community features.",
    tech: "Flutter, Riverpod 2.0, Routemaster, Firebase",
    date: "Aug 2024",
    description: [
      "Developed a mental wellness software application enabling private health data security and user-centric design, supporting personalized care workflows.",
      "Engineered automated health reminders and doctor-patient chat modules, improving mental health follow-up adherence by 30%.",
      "Introduced community features, daily mental health surveys, and real-time updates backed by natural language sentiment analysis, with a strong focus on security to enhance user experience."
    ],
    link: "https://github.com/Vishal0111110/Breathe",
    caseStudy: {
      headline: "A privacy-first wellness app focused on adherence and supportive community",
      problem:
        "Mental wellness journeys often break when follow-ups and supportive interaction are inconsistent or feel unsafe for users.",
      constraints:
        "Strong privacy expectations, emotionally sensitive UX, and real-time coordination across reminders, chat, and sentiment-aware community features.",
      approach:
        "Built secure Flutter flows with structured reminder systems, doctor-patient chat modules, and survey/community layers backed by realtime Firebase updates.",
      outcome:
        "Improved adherence to follow-up routines and created a more continuous support experience through a secure, user-centric mobile product.",
      redo:
        "Invest earlier in longitudinal outcome tracking and clinician-facing analytics to better measure and tune behavior-change impact."
    }
  },
  {
    name: "AyusKoot",
    slug: "ayuskoot",
    role: "Mobile",
    outcome:
      "Real-time ambulance coordination with GPS routing and hospital load—built for speed under pressure.",
    tech: "Flutter, Riverpod 2.0, Routemaster, Firebase",
    date: "May 2024",
    description: [
      "Created a real-time ambulance tracking software application that reduced emergency response times by 35% using GPS-based live updates and location sharing with hospitals.",
      "Handled 50+ simultaneous hospital-ambulance connections with stable performance, ensuring data availability even during peak loads.",
      "Used Firestore and efficient data handling to maintain stable performance during peak usage and ensure quick updates across devices.",
      "Integrated features like traffic-aware routing, estimated time of arrival (ETA), and nearest hospital detection to assist in faster decision-making."
    ],
    link: "https://github.com/Vishal0111110/Ayuskoot",
    caseStudy: {
      headline: "A real-time emergency coordination app designed for high-pressure decisions",
      problem:
        "Emergency routing suffers when ambulance status, hospital load, and route intelligence are fragmented across disconnected systems.",
      constraints:
        "High concurrency, low-latency location updates, and reliable data propagation during peak usage where delays directly affect outcomes.",
      approach:
        "Implemented GPS live tracking, traffic-aware routing, ETA estimation, nearest-hospital selection, and efficient Firestore sync for concurrent sessions.",
      outcome:
        "Reduced response-time friction and enabled better dispatcher and hospital visibility under load with stable, real-time cross-device updates.",
      redo:
        "Add simulation tooling for surge scenarios earlier to validate scaling thresholds and fallback strategies before production-like stress."
    }
  }
]

export function projectSlugs(): string[] {
  return projects.map((p) => p.slug).filter((s): s is string => Boolean(s))
}

export function getProjectCaseStudy(slug: string) {
  const project = projects.find((p) => p.slug === slug)
  if (!project?.slug || !project.caseStudy) return null
  return { slug: project.slug, project, caseStudy: project.caseStudy }
}

export type Projects = typeof projects
