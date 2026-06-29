export const personalInfo = {
  name: "Buyyarapu Vishal",
  location: "Hyderabad, India",
  contact: {
    phone: "+91-7793905879",
    email: "buyyarapuvishalgaurav616@gmail.com",
    linkedin: "buyyarapuvishal",
    codeforces: "ArminArlert69"
  },
  /** One-line stance under the name — specific beats generic labels */
  tagline: "Algorithmic thinker · Backend engineer — ships calm systems under hard constraints",
  summary: "I enjoy solving hard problems, figuring out what makes things inefficient, and building systems that just work. Whether it’s algorithms or large-scale systems, I like keeping things simple, efficient, and thoughtfully designed.",
  /** Locked spine for copy + layout decisions (“broadcast / signal”) */
  metaphorCue: {
    label: "Broadcast · signal",
    line: "Optimize for SNR under constraint — fewer moving parts, tighter feedback loops."
  },
  /** Chapter: how you work (Experience → Method → Projects on the page) */
  method: {
    eyebrow: "Method",
    title: "How I work",
    blurb:
      "I start with the sharpest constraint in front of me, then simplify until the next move feels obvious.",
    paragraphs: [
      "I like work that stays calm under pressure. That usually means readable traces, clear API contracts, and data models that do not collapse when usage grows.",
      "I ship in small, real slices instead of waiting for a big reveal. A thin vertical cut gets feedback fast, then I harden the parts that people actually touch.",
      "When trade-offs show up, I choose clarity over cleverness: explicit limits, observability from day one, and rollbacks that are boring to execute."
    ]
  }
}

export type PersonalInfo = typeof personalInfo
