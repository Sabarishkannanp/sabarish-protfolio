// Edit your timeline here. `year` is the huge red number shown on the left while scrolling.

export type JourneyItem = {
  year: string;
  title: string;
  org: string;
  location?: string;
  period: string;
  summary: string;
  points?: string[];
  tags?: string[];
  meta?: string;
  certificate?: string; // image in /public, opens in a modal
};

export const journey: JourneyItem[] = [
  {
    year: "2026",
    title: "Software Engineer",
    org: "Cloud Dreams",
    location: "Coimbatore",
    period: "6 months",
    summary: "Building and shipping client websites end to end.",
    points: [
      "Client websites with PHP, React/Vite and HTML/CSS/JS",
      "SEO and structured data (Schema.org)",
      "Deployment to cPanel",
      "Internal tools for the team",
    ],
    tags: ["PHP", "React", "Vite", "SEO", "cPanel"],
  },
  {
    year: "2025",
    title: "MERN Stack Development Certification",
    org: "Pumo Technovation",
    location: "Coimbatore",
    period: "23 Jun 2025 — 27 Dec 2025",
    summary: "Full-stack course from design tools to deployment.",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "HTML/CSS/JS",
      "jQuery",
      "PHP/MySQL",
      "Photoshop",
      "Hosting & cPanel",
      "SEO",
    ],
    meta: "Reg No: PT/SP/MERN/037/2026",
    certificate: "/certificate.jpg",
  },
  {
    year: "2026",
    title: "Master of Computer Applications",
    org: "SRMV College of Arts and Science",
    location: "Coimbatore",
    period: "2024 — 2026 · Graduated 2026",
    summary: "Postgraduate degree in computer applications.",
  },
];
