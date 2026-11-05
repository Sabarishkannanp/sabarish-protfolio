export type StackGroup = {
  title: string;
  items: string[];
  description: string;
};

export const stack: StackGroup[] = [
  {
    title: "Interface",
    items: ["React", "Next.js", "Tailwind CSS", "HTML5", "CSS3", "JavaScript", "TypeScript", "Bootstrap", "jQuery"],
    description: "Pixel-perfect, responsive UI from mobile to desktop.",
  },
  {
    title: "Services",
    items: ["Node.js", "Express.js", "REST APIs", "PHP"],
    description: "APIs and backends that keep things running.",
  },
  {
    title: "Data",
    items: ["MongoDB", "MySQL", "Mongoose"],
    description: "Modelling, indexing, CRUD done right.",
  },
  {
    title: "Responsive Design",
    items: ["Mobile-first layouts", "Flexbox / Grid", "Accessibility", "Performance", "SEO & Schema markup"],
    description: "Layouts that feel right on every screen — and rank.",
  },
  {
    title: "AI-Assisted Dev",
    items: ["Claude", "Claude Code", "Prompt engineering", "Automation (Make)"],
    description: "I use AI to ship faster and cleaner code.",
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "VS Code", "Figma", "Photoshop", "cPanel", "Jenkins", "Vercel"],
    description: "The everyday kit, from first commit to deploy.",
  },
];

export const marqueeItems = [
  "MERN Stack",
  "Next.js",
  "React",
  "Node.js",
  "MongoDB",
  "Responsive Web Design",
  "AI-Assisted Dev",
];
