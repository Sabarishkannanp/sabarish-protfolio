"use client";

import { useEffect, useRef, useState } from "react";
import { canAnimate, runPreloader, showAll, watchSections } from "@/lib/cursor-preloader";

/**
 * Cursor-swarm preloader. Drop <CursorPreloader /> once into app/layout.tsx (inside <body>).
 * Also add <PreloaderHeadScript /> inside <head> (or at the top of <body>) so the page
 * starts dark instead of flashing before React loads.
 */
export default function CursorPreloader({
  accent = "#3B82F6",
  names = ["Sabarish", "Claude", "Design"],
  agents = 18,
  badge = "SK",
  oncePerSession = true,
}: {
  badge?: string;
  accent?: string;
  names?: string[];
  agents?: number;
  oncePerSession?: boolean;
}) {
  const cancel = useRef<() => void>(() => {});
  const [replay, setReplay] = useState(false);

  const start = () => {
    cancel.current();
    setReplay(false);
    cancel.current = runPreloader({
      accent,
      names,
      agents,
      badge,
      onDone: () => {
        setReplay(canAnimate());
        if (oncePerSession) { try { sessionStorage.setItem("cpSeen", "1"); } catch {} }
      },
    });
  };

  useEffect(() => {
    let seen = false;
    try { seen = oncePerSession && sessionStorage.getItem("cpSeen") === "1"; } catch {}
    const safety = setTimeout(showAll, 12000); // nothing can stay hidden

    if (seen || !canAnimate()) {
      showAll();
      const raf = requestAnimationFrame(() => setReplay(canAnimate()));
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(safety);
      };
    }

    let stopSections = () => {};
    let alive = true;
    // wait until the page has hydrated (Providers sets html[data-app-ready], max 4s)
    const hydrated = new Promise<void>((res) => {
      const t0 = performance.now();
      const tick = () =>
        document.documentElement.dataset.appReady || performance.now() - t0 > 4000 ? res() : requestAnimationFrame(tick);
      tick();
    });
    // measure after fonts are ready (max 1.2s wait)
    Promise.all([hydrated, Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1200))])]).then(() => {
      if (!alive) return;
      start();
      stopSections = watchSections({ accent });
    });
    return () => {
      alive = false;
      clearTimeout(safety);
      cancel.current();
      stopSections();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!replay) return null;
  return (
    <button
      type="button"
      onClick={() => start()}
      aria-label="Replay intro animation"
      style={{ position: "fixed", right: 18, bottom: 18, zIndex: 9993, padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.1)", background: "rgba(24,24,27,.85)", color: "#d4d4d8", font: "500 11px Inter, system-ui, sans-serif", cursor: "pointer" }}
    >
      ↻ Replay
    </button>
  );
}

/** Put inside <head> in app/layout.tsx. Starts the page dark so there is no flash before the intro. */
export function PreloaderHeadScript() {
  const js = `try{var m=matchMedia('(prefers-reduced-motion: reduce)').matches,h=location.hash,ok=['','#top','#hero','#home'].indexOf(h)>-1,s=sessionStorage.getItem('cpSeen')==='1';if(!m&&ok&&!s){document.documentElement.classList.add('cp-pre');setTimeout(function(){document.documentElement.classList.remove('cp-pre')},6000)}}catch(e){}`;
  const css = `html.cp-pre body::after{content:"";position:fixed;inset:0;z-index:9989;background:#050505}html.cp-pre{overflow:hidden}`;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <script dangerouslySetInnerHTML={{ __html: js }} />
    </>
  );
}
