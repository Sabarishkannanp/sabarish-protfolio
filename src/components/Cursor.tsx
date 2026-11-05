"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE = "a, button, [data-cursor], input, textarea, label, select";

/**
 * Red dot that tracks the mouse exactly + a 36px ring that follows with lag.
 * Over links / buttons / cards the ring grows, fills red and can show a label
 * (set with data-cursor="View"). Off on touch devices and reduced motion.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduced.matches);
    update();
    fine.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;
    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let size = 36;
    let targetSize = 36;
    let visible = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        visible = true;
        pos.x = mouse.x;
        pos.y = mouse.y;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };
    const onOver = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null;
      const text = target?.getAttribute("data-cursor") ?? "";
      const isField = target?.matches("input, textarea, select");
      targetSize = target && !isField ? 80 : 36;
      ring.dataset.active = target && !isField ? "true" : "false";
      label.textContent = text;
      label.style.opacity = text ? "1" : "0";
      dot.style.opacity = target && !isField ? "0" : "1";
    };
    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const tick = () => {
      pos.x += (mouse.x - pos.x) * 0.15;
      pos.y += (mouse.y - pos.y) * 0.15;
      size += (targetSize - size) * 0.18;
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      ring.style.width = ring.style.height = `${size}px`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ringRef}
        data-active="false"
        className="fixed left-0 top-0 grid place-items-center rounded-full border border-red-hot opacity-0 mix-blend-difference transition-[background-color,border-color,opacity] duration-300 data-[active=true]:border-transparent data-[active=true]:bg-red/60"
        style={{ width: 36, height: 36 }}
      >
        <span
          ref={labelRef}
          className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white opacity-0 transition-opacity duration-200"
        />
      </div>
      <div ref={dotRef} className="fixed left-0 top-0 h-2 w-2 rounded-full bg-red-hot opacity-0" />
    </div>
  );
}
