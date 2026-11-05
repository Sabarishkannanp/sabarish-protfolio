import { navLinks, site } from "@/data/site";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "./icons";
import Marquee from "./Marquee";

export default function Footer() {
  const socials = [
    { href: site.github, label: "GitHub", Icon: GithubIcon },
    { href: site.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: site.instagram, label: "Instagram", Icon: InstagramIcon },
  ];

  return (
    <footer data-build-section data-build-crew="2" className="bg-red text-white">
      <Marquee />
      <div className="container-x py-14 md:py-20">
        <p
          data-build="1"
          data-build-tool="text"
          className="text-center font-script text-[clamp(2.6rem,11vw,9.5rem)] font-bold leading-[0.95] md:text-left"
        >
          {site.firstName} <span className="whitespace-nowrap">{site.lastName.replace(/\.$/, "")}</span>
        </p>

        <div data-build="2" data-build-tool="frame" className="mt-10 flex flex-col items-center gap-7 border-t border-white/25 pt-8 md:mt-12 md:flex-row md:justify-between">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium md:justify-start">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="underline-offset-4 hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
                  Email
                </a>
              </li>
            </ul>
          </nav>

          <ul className="flex gap-3">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (opens in new tab)`}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/40 transition-colors hover:bg-white hover:text-red"
                >
                  <Icon size={17} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-center text-sm text-white/80 md:text-left">
          © 2026 {site.name}. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
