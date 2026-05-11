export const projects = [
  {
    name: "AURUM",
    tech: "React 18, TypeScript, Spring Boot 3, MySQL, REST APIs, TailwindCSS, Zustand, Recharts",
    date: "Feb 2026",
    description: [
      "Built AURUM, a full-stack AI-powered portfolio management and research platform supporting live, simulation, and research trading workflows using React 18, TypeScript, Spring Boot 3, MySQL, and REST APIs.",
      "Engineered advanced financial analytics modules including portfolio tracking, AI-driven risk decomposition, stress testing, VaR analysis, behavioral analytics, and decision journaling with real-time market insights integration.",
      "Developed scalable backend architecture with Spring Boot, JPA, Swagger/OpenAPI, ACID-compliant transactions, indexed database queries, and modular Controller–Service–Repository design, ensuring production-ready performance and maintainability.",
      "Designed an interactive trading intelligence UI featuring agent advisory panels, research lab, live market/news dashboards, terminal-style command execution, and dynamic data visualizations using TailwindCSS, Zustand, Recharts, and Axios."
    ],
    link: "https://github.com/Vishal0111110/Aurum"
  },
  {
    name: "Flash-Cascade",
    tech: "React, Node.js, Express.js, C++, Python, Firebase Functions",
    date: "Aug 2025",
    description: [
      "Extreme-scale, ultra-low-latency hybrid search platform achieving billion-scale search with sub-150 ms latency.",
      "Combines sparse search (BM25 + Block-Max WAND) with dense ANN search, orchestrated by learned query budgeter for optimal execution paths.",
      "Features hot-reload mechanism for real-time data freshness within 1-2 seconds and scalable C++ core with horizontal sharding.",
      "Implements sparse-first routing strategy for cost-efficiency and fast sparse queries (≤80 ms) with semantic dense retrieval."
    ],
    link: "https://github.com/Vishal0111110/Flash-Cascade"
  },
  {
    name: "HSBC Banking Chatbot System",
    tech: "FastAPI, Google Gemini LLM, MCP Server, HTML/CSS/JS",
    date: "Jul 2025",
    description: [
      "Developed a modular, web-based banking chatbot using FastAPI, Google Gemini LLM, and a custom MCP server, enabling intelligent, context-aware conversations for simulated banking operations.",
      "Engineered a full-stack architecture with REST and WebSocket APIs, JWT-based authentication, multilingual and accessibility support, and real-time conversational UI built with HTML/CSS/JS.",
      "Implemented multi-turn dialogue management with slot filling, context retention, and intent routing, enabling seamless handling of complex banking flows like loan applications, card blocking, and account queries.",
      "Integrated LLM-driven NLU (Gemini 1.5 Flash) for intent detection and dynamic response generation, achieving robust conversational understanding in a hackathon-ready, extensible banking assistant system."
    ],
    link: "https://github.com/Vishal0111110/hsbc"
  },
  {
    name: "ApplyAsap",
    tech: "Flutter, Node.js, Express.js, Firebase, Machine Learning",
    date: "Apr 2025",
    description: [
      "Fabricated an AI-powered software platform for smart learning and career guidance, with support for 16+ Indian languages.",
      "Integrated Gemini-based AI content generation, user surveys, and personalized job dashboards.",
      "Implemented a Chrome Extension for auto job applications and AI mock interviews, cutting application time by 50% and increasing user interview readiness.",
      "Personalized communities, alumni connect, reward coin system and real-time social feed, fostering 40% higher career networking interactions."
    ],
    link: "https://github.com/Vishal0111110/ApplyAsap"
  },
  {
    name: "Breathe",
    tech: "Flutter, Riverpod 2.0, Routemaster, Firebase",
    date: "Aug 2024",
    description: [
      "Developed a mental wellness software application enabling private health data security and user-centric design, supporting personalized care workflows.",
      "Engineered automated health reminders and doctor-patient chat modules, improving mental health follow-up adherence by 30%.",
      "Introduced community features, daily mental health surveys, and real-time updates backed by natural language sentiment analysis, with a strong focus on security to enhance user experience."
    ],
    link: "https://github.com/Vishal0111110/Breathe"
  },
  {
    name: "AyusKoot",
    tech: "Flutter, Riverpod 2.0, Routemaster, Firebase",
    date: "May 2024",
    description: [
      "Created a real-time ambulance tracking software application that reduced emergency response times by 35% using GPS-based live updates and location sharing with hospitals.",
      "Handled 50+ simultaneous hospital-ambulance connections with stable performance, ensuring data availability even during peak loads.",
      "Used Firestore and efficient data handling to maintain stable performance during peak usage and ensure quick updates across devices.",
      "Integrated features like traffic-aware routing, estimated time of arrival (ETA), and nearest hospital detection to assist in faster decision-making."
    ],
    link: "https://github.com/Vishal0111110/Ayuskoot"
  }
]

export type Projects = typeof projects
