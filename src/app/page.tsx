import fs from "node:fs";
import path from "node:path";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import Stack from "@/components/Stack";
import Work from "@/components/Work";
import { projects } from "@/data/projects";

// Checked at build time so missing images fall back to placeholders.
const exists = (publicPath: string) => fs.existsSync(path.join(process.cwd(), "public", publicPath));

export default function Home() {
  const projectsWithImages = projects.map((p) => ({ ...p, hasImage: exists(p.image) }));

  return (
    <Providers>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-red focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero hasPhoto={exists("hero.png")} />
        <Work projects={projectsWithImages} />
        <Journey hasCertificate={exists("certificate.jpg")} />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </Providers>
  );
}
