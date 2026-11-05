"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { stack } from "@/data/stack";
import { RevealHeading } from "./Reveal";
import TechIcon from "./TechIcon";

export default function Stack() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="stack" data-build-section data-build-crew="5" aria-labelledby="stack-title" className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div data-build="1" data-build-tool="text">
            <p className="label mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-red" /> Stack
            </p>
            <div id="stack-title">
              <RevealHeading lines={["What I", "build with."]} className="text-[clamp(3.5rem,11vw,10rem)]" />
            </div>
          </div>
          <p data-build="2" data-build-tool="text" className="max-w-sm text-mute md:pb-3 md:text-right">Hover a row (or tap it) to see the tools behind it.</p>
        </div>
      </div>

      <ul className="border-t border-line" onMouseLeave={() => setActive(null)}>
        {stack.map((group, i) => {
          const open = active === i;
          const panelId = `stack-panel-${i}`;
          return (
            <li key={group.title} data-build={i + 3} data-build-tool="frame" className="relative overflow-hidden border-b border-line" onMouseEnter={() => setActive(i)}>
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-red via-[#5c0309] to-ink transition-opacity duration-500 ${
                  open ? "opacity-100" : "opacity-0"
                }`}
              />
              <div className="container-x relative">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setActive(open ? null : i)}
                  onFocus={() => setActive(i)}
                  className="flex w-full items-center gap-5 py-5 text-left md:gap-10 md:py-7"
                >
                  <span className={`w-8 shrink-0 text-xs tabular-nums transition-colors ${open ? "text-white" : "text-red"}`}>
                    0{i + 1}
                  </span>
                  <span
                    className={`display flex-1 text-[clamp(2.4rem,8.5vw,7.5rem)] transition-[color,-webkit-text-stroke-color,transform] duration-500 ${
                      open ? "translate-x-2 text-paper [-webkit-text-stroke:1px_transparent]" : "text-outline"
                    }`}
                  >
                    {group.title}
                  </span>
                  <Plus
                    size={26}
                    aria-hidden="true"
                    className={`shrink-0 transition-transform duration-500 ${open ? "rotate-45 text-white" : "text-mute"}`}
                  />
                </button>
                <div
                  id={panelId}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-5 pb-8 pl-[3.25rem] md:flex-row md:items-end md:justify-between md:pl-[4.5rem]">
                      <ul className="flex max-w-3xl flex-wrap gap-2">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-3.5 py-1.5 text-sm text-white backdrop-blur"
                          >
                            <TechIcon name={item} size={15} />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <p className="max-w-xs text-sm text-white/80 md:text-right">{group.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
