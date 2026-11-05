"use client";

import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Counts 0 → `to` once in view. Inside a [data-build] element it waits until the build intro reveals it. */
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
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView || !ref.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let controls: ReturnType<typeof animate> | undefined;
    const run = () => {
      controls = animate(0, to, {
        duration: reduced ? 0 : duration,
        delay: reduced ? 0 : delay,
        ease: [0.16, 1, 0.3, 1], // fast start, slow finish on the last numbers
        onUpdate: (v) => setValue(Math.round(v)),
        onComplete: () => setDone(true),
      });
    };

    const host = ref.current.closest<HTMLElement>("[data-build]");
    const visible = () => !host || getComputedStyle(host).opacity !== "0";
    if (visible()) {
      run();
      return () => controls?.stop();
    }
    const mo = new MutationObserver(() => {
      if (visible()) {
        mo.disconnect();
        run();
      }
    });
    mo.observe(host!, { attributes: true, attributeFilter: ["style"] });
    return () => {
      mo.disconnect();
      controls?.stop();
    };
  }, [inView, to, delay, duration]);

  return (
    <motion.span
      ref={ref}
      className="inline-block origin-bottom tabular-nums"
      animate={
        done
          ? { scale: [1, 1.18, 1], textShadow: ["0 0 0px rgba(229,9,20,0)", "0 0 28px rgba(229,9,20,0.9)", "0 0 12px rgba(229,9,20,0.35)"] }
          : undefined
      }
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {value}
      {suffix}
    </motion.span>
  );
}
