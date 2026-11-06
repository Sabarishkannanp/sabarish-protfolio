"use client";

import { animate, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Shows the real number in the server HTML (good for SEO / no-JS), then on the
 * client counts 0 → `to` once the number is actually visible on screen — i.e.
 * in view and not hidden by the cursor preloader (html.cp-pre / visibility:hidden).
 */
export default function CountUp({
  to,
  suffix = "",
  delay = 0,
  duration = 2.6,
}: {
  to: number;
  suffix?: string;
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let controls: ReturnType<typeof animate> | undefined;
    let started = false;
    let raf = 0;
    let inView = false;

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(el);

    const shown = () =>
      inView &&
      !document.documentElement.classList.contains("cp-pre") &&
      getComputedStyle(el).visibility === "visible" &&
      !el.closest("[data-cp-hidden]");

    // Check each frame until the number is really on screen, then count from 0.
    const check = () => {
      if (started) return;
      if (shown()) {
        started = true;
        io.disconnect();
        setValue(0);
        controls = animate(0, to, {
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1], // fast start, slow finish on the last numbers
          onUpdate: (v) => setValue(Math.round(v)),
          onComplete: () => setDone(true),
        });
        return;
      }
      raf = requestAnimationFrame(check);
    };
    raf = requestAnimationFrame(check);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      controls?.stop();
    };
  }, [to, delay, duration]);

  return (
    <motion.span
      ref={ref}
      className="inline-block origin-bottom tabular-nums"
      animate={
        done
          ? {
              scale: [1, 1.18, 1],
              textShadow: ["0 0 0px rgba(229,9,20,0)", "0 0 28px rgba(229,9,20,0.9)", "0 0 12px rgba(229,9,20,0.35)"],
            }
          : undefined
      }
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {value}
      {suffix}
    </motion.span>
  );
}
