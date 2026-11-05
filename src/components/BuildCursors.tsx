"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { revealAll, runIntro, shouldAnimate, watchSections } from "@/lib/build-intro";
import { lockScroll } from "./SmoothScroll";

/**
 * Figma multiplayer-cursor "page builds itself" effect.
 *
 * Works like a preloader: on every page load the cursors build the hero while
 * scrolling is locked (Skip ends it early). After that, every
 * [data-build-section] gets built by a cursor crew as it scrolls into view.
 *
 *   <section id="hero"> ... <h1 data-build="2"> ... </section>
 *   <section data-build-section data-build-crew="4"> ... <h2 data-build="1"> ... </section>
 */
export default function BuildCursors({ heroId = "hero", pageCount = 6 }: { heroId?: string; pageCount?: number }) {
  const cancelRef = useRef<() => void>(() => {});
  const [showReplay, setShowReplay] = useState(false);

  const start = useCallback(() => {
    const hero = document.getElementById(heroId);
    if (!hero) {
      revealAll();
      return;
    }
    cancelRef.current();
    setShowReplay(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    lockScroll(true);
    cancelRef.current = runIntro({
      root: hero,
      pageCount,
      onDone: () => {
        lockScroll(false);
        setShowReplay(shouldAnimate());
      },
    });
  }, [heroId, pageCount]);

  useEffect(() => {
    // Preloader always starts at the top, even after a reload mid-page
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    // wait one frame so fonts/layout settle before measuring
    const raf = requestAnimationFrame(() => {
      if (!shouldAnimate()) {
        revealAll();
        return;
      }
      start();
    });
    const stopSections = watchSections();
    return () => {
      cancelAnimationFrame(raf);
      cancelRef.current();
      stopSections();
      lockScroll(false);
    };
  }, [start]);

  const replay = () => {
    document.querySelectorAll<HTMLElement>(`#${heroId} [data-build]`).forEach((el) => (el.style.opacity = "0"));
    start();
  };

  if (!showReplay) return null;
  return (
    <button
      type="button"
      onClick={replay}
      data-cursor="Replay"
      className="fixed bottom-5 right-5 z-[9993] rounded-md border border-white/10 bg-zinc-900/80 px-3 py-1.5 text-[11px] font-medium text-zinc-300 backdrop-blur hover:bg-zinc-800"
    >
      ↻ Replay
    </button>
  );
}
