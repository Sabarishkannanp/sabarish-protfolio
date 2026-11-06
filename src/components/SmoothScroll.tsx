"use client";

import Lenis from "lenis";
import { useEffect } from "react";

let lenisInstance: Lenis | null = null;

/** The active Lenis instance (null on reduced motion / before mount). */
export const getLenis = () => lenisInstance;

/** Pause or resume page scrolling (used by modals and the mobile menu). */
export function lockScroll(locked: boolean) {
  const lenis = getLenis();
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { offset: -64 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -64 } });
    lenisInstance = lenis;

    // The cursor preloader locks the page by setting overflow:hidden on <html>.
    // Lenis scrolls with JS (which ignores overflow), so pause it while that lock is on.
    const root = document.documentElement;
    const sync = () => {
      const locked = root.style.overflow === "hidden" || root.classList.contains("cp-pre");
      if (locked) lenis.stop();
      else lenis.start();
    };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ["style", "class"] });

    return () => {
      mo.disconnect();
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
  return null;
}
