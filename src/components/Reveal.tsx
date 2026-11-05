"use client";

import { motion } from "framer-motion";
import { Fragment } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type Line = string | { text: string; className?: string };

/** Turns a trailing "." into a red full stop. */
export function RedStop({ text }: { text: string }) {
  if (!text.endsWith(".")) return <>{text}</>;
  return (
    <>
      {text.slice(0, -1)}
      <span className="text-red">.</span>
    </>
  );
}

/** Huge heading where each line slides up from behind a mask. */
export function RevealHeading({
  lines,
  as: Tag = "h2",
  className = "",
  delay = 0,
}: {
  lines: Line[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
}) {
  return (
    <Tag className={`display ${className}`}>
      {lines.map((line, i) => {
        const text = typeof line === "string" ? line : line.text;
        const cls = typeof line === "string" ? "" : line.className ?? "";
        return (
          <Fragment key={i}>
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className={`block ${cls}`}
                initial={{ y: "105%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.9, ease, delay: delay + i * 0.08 }}
              >
                <RedStop text={text} />
              </motion.span>
            </span>
            {i < lines.length - 1 && " "}
          </Fragment>
        );
      })}
    </Tag>
  );
}

/** Fade-up on scroll. Pass `index` to stagger siblings. */
export function FadeUp({
  children,
  index = 0,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Comp = as === "li" ? motion.li : as === "article" ? motion.article : motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, ease, delay: index * 0.1 }}
    >
      {children}
    </Comp>
  );
}
