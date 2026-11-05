// Edit your projects here.
// image: put a 1600×1000 screenshot at /public/projects/<slug>.jpg — a dark placeholder shows until you do.
// liveUrl / githubUrl: leave "" to hide that button.
// featured: true → big card in the grid, false → "More built" list.

export type ProjectCategory = "Client site" | "Web app" | "Desktop app" | "Landing page" | "Internal tool";

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  tech: string[];
  image: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "windows-charm",
    title: "Windows Charm",
    category: "Desktop app",
    description:
      "PSK Charms — interactive desktop charms for Windows that swing with real rope physics. 73+ charms, a sticker studio and a portable EXE.",
    tech: ["C#", ".NET", "WPF", "HTML", "CSS", "JavaScript"],
    image: "/projects/windows-charm.jpg",
    liveUrl: "https://sabarishcharm.netlify.app/",
    githubUrl: "",
    featured: true,
  },
  {
    slug: "nisha-home-stay",
    title: "Nisha Home Stay",
    category: "Client site",
    description: "Homestay website near Isha Yoga Center, with SEO and Google ranking fixes.",
    tech: ["HTML", "CSS", "JavaScript", "SEO", "Schema"],
    image: "/projects/nisha-home-stay.jpg",
    liveUrl: "https://www.nishahomestay.com/",
    githubUrl: "",
    featured: true,
  },
  {
    slug: "bottle",
    title: "Bottle",
    category: "Landing page",
    description: "Animated product landing page for a sports bottle — colour switcher, story and collection.",
    tech: ["HTML", "CSS", "JavaScript"],
    image: "/projects/bottle.jpg",
    liveUrl: "https://sabarish-bottle-task.netlify.app/",
    githubUrl: "",
    featured: true,
  },
  {
    slug: "resume-builder",
    title: "Resume Builder",
    category: "Web app",
    description: "Fill in a form, see a live resume preview and download it as PDF or JPG.",
    tech: ["HTML", "CSS", "JavaScript", "html2pdf", "html2canvas"],
    image: "/projects/resume-builder.jpg",
    liveUrl: "https://psk-resume-bulider.netlify.app/",
    githubUrl: "",
    featured: false,
  },
];
