// All your personal info lives here. Replace the placeholders marked TODO.

export const site = {
  name: "Sabarish Kannan P",
  firstName: "Sabarish",
  lastName: "Kannan P.",
  role: "MERN Full Stack Developer",
  tagline: "I build fast, responsive websites and web apps for real businesses.",
  description:
    "Sabarish Kannan P — MERN full stack developer from Coimbatore, India. I build fast, responsive websites and web apps for real businesses.",

  // Live domain (used by metadataBase for canonical URL + Open Graph image)
  url: "https://sabarish-protfolio.vercel.app",

  // TODO: contact details
  email: "sabarishkannanp2004@gmail.com",
  phone: "+91 88705 48048",
  whatsapp: "918870548048", // digits only, country code first (no + or spaces)

  github: "https://github.com/Sabarishkannanp",
  githubLabel: "github.com/Sabarishkannanp",
  linkedin: "https://www.linkedin.com/in/sabarish-kannan-p",
  instagram: "https://www.instagram.com/your-handle", // TODO

  resumeUrl: "/resume.pdf", // put resume.pdf in /public
  location: "Coimbatore, India",
  timezone: "Asia/Kolkata",
} as const;

export const navLinks = [
  { id: "work", label: "Work" },
  { id: "journey", label: "Journey" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
] as const;
