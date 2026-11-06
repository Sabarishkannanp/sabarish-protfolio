"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/data/site";
import { useUI } from "./Providers";
import { lockScroll, scrollToId } from "./SmoothScroll";

export default function Navbar() {
  const { openContact } = useUI();
  const [active, setActive] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  // Highlight the section currently in the middle of the screen
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY < window.innerHeight * 0.5) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    // wait for the menu to unlock scrolling before moving
    window.setTimeout(() => scrollToId(id), menuOpen ? 60 : 0);
  };

  return (
    <>
      <motion.div
        data-build-skip
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-red-hot"
        style={{ scaleX: progress }}
      />
      <header
        className={`fixed inset-x-0 top-0 z-[60] border-b transition-colors duration-300 ${
          scrolled ? "border-line bg-ink/80 backdrop-blur-md" : "border-transparent bg-transparent"
        }`}
      >
        <nav aria-label="Main" className="container-x flex h-16 items-center justify-between gap-4">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              scrollToId("top");
            }}
            className="font-display text-lg uppercase tracking-wide text-paper md:text-xl"
          >
            {site.firstName}&apos;s Portfolio<span className="text-red">.</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((l, i) => (
              <li key={l.id} className="flex items-center">
                {i > 0 && <span aria-hidden="true" className="px-1 text-mute/50">·</span>}
                <a
                  href={`#${l.id}`}
                  onClick={go(l.id)}
                  aria-current={active === l.id ? "true" : undefined}
                  className={`relative px-2 py-1 text-sm transition-colors ${
                    active === l.id ? "text-paper" : "text-mute hover:text-paper"
                  }`}
                >
                  {l.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-2 -bottom-0.5 h-[2px] origin-left bg-red transition-transform duration-300 ${
                      active === l.id ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openContact()}
              data-cursor="Talk"
              className="btn btn-red btn-sm hidden sm:inline-flex"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-white/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              Let&apos;s talk
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="relative z-[61] grid h-10 w-10 place-items-center rounded-full border border-line text-paper md:hidden"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            data-build-skip
            className="fixed inset-0 z-[55] flex flex-col bg-ink px-5 pb-10 pt-24 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="flex flex-col border-t border-line">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.id}
                  className="border-b border-line"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                >
                  <a href={`#${l.id}`} onClick={go(l.id)} className="flex items-baseline gap-4 py-4">
                    <span className="text-xs text-red">0{i + 1}</span>
                    <span className="display text-[clamp(3rem,16vw,5rem)] text-paper">
                      {l.label}
                      <span className="text-red">.</span>
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openContact();
              }}
              className="btn btn-red mt-auto w-full py-4 text-base"
            >
              ● Let&apos;s talk
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
