"use client";

import { ArrowDownRight, Download } from "lucide-react";
import Image from "next/image";
import { site } from "@/data/site";
import CountUp from "./CountUp";

const stats = [
  { to: 6, suffix: "+", label: "Months at Cloud Dreams" },
  { to: 50, suffix: "+", label: "Projects shipped" },
  { text: "MCA", label: "Graduate" },
] as const;

export default function Hero({ hasPhoto }: { hasPhoto: boolean }) {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex flex-col overflow-hidden pt-24 lg:block lg:h-[100svh] lg:min-h-[680px] lg:max-h-[1080px] lg:pt-0"
    >
        {/* Stage: giant word + photo (behind on desktop, below the text on mobile) */}
        <div className="relative order-2 mt-4 h-[min(125vw,620px)] w-full lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
          <div data-build="1" data-build-tool="text" className="absolute left-1/2 top-[3%] z-0 -translate-x-1/2 lg:top-[13%]">
            <p
              aria-hidden="true"
              className="portfolio-word display select-none whitespace-nowrap text-center text-[22vw] leading-[0.8] tracking-[-0.01em] lg:text-[min(21.5vw,330px)]"
            >
              Portfolio
            </p>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/2 z-[1] h-[85%] w-[90%] max-w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(229,9,20,0.55),rgba(229,9,20,0.12)_55%,transparent)] blur-2xl"
          />

          <div data-build="2" data-build-tool="image" className="absolute bottom-0 left-1/2 z-10 aspect-[1122/1402] h-full -translate-x-1/2 lg:h-[80%] xl:h-[87%]">
            {hasPhoto ? (
              <Image
                src="/hero.png"
                alt={`Portrait of ${site.name}`}
                fill
                preload
                sizes="(min-width: 1280px) 720px, (min-width: 1024px) 560px, 100vw"
                className="object-contain object-bottom"
              />
            ) : (
              <Silhouette />
            )}
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 top-[45%] z-20 hidden w-[55%] bg-gradient-to-r from-ink/80 via-ink/30 to-transparent lg:block xl:w-[38%]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[30%] bg-gradient-to-t from-ink via-ink/80 to-transparent"
          />
        </div>

        {/* Intro text */}
        <div className="container-x relative z-30 order-1 lg:absolute lg:inset-x-0 lg:bottom-[9%]">
          <div className="max-w-[520px] lg:max-w-[440px] xl:max-w-[520px]">
            <div data-build="3" data-build-tool="text" className="w-fit">
              <p className="font-script text-[clamp(1.9rem,4vw,2.6rem)] leading-none text-paper">
                Hello, I&apos;m {site.firstName}
              </p>
            </div>
            <div data-build="4" data-build-tool="text" className="mt-2 w-fit">
              <h1 className="display text-[clamp(3.5rem,9vw,7rem)] text-paper">
                <span className="sr-only">{site.firstName} </span>
                Kannan P<span className="text-red">.</span>
              </h1>
            </div>
            <div data-build="5" data-build-tool="text" className="mt-3 w-fit">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-red-hot sm:text-sm">{site.role}</p>
            </div>
            <div data-build="6" data-build-tool="text" className="mt-5 w-fit">
              <p className="max-w-[40ch] text-base leading-relaxed text-mute sm:text-lg">{site.tagline}</p>
            </div>
            <div data-build="7" data-build-tool="frame" className="mt-7 w-fit">
              <div className="flex flex-wrap gap-3">
                <a href="#work" className="btn btn-red" data-cursor="View">
                  See my work <ArrowDownRight size={16} />
                </a>
                <a href={site.resumeUrl} download className="btn btn-ghost" data-cursor="Open">
                  <Download size={16} /> Download resume
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container-x relative z-30 order-3 -mt-10 pb-10 lg:absolute lg:inset-x-0 lg:bottom-[9%] lg:mt-0 lg:flex lg:justify-end lg:pb-0 lg:pointer-events-none">
          <div data-build="8" data-build-tool="frame" className="lg:pointer-events-auto">
            <dl className="grid grid-cols-3 border-t border-line lg:w-[220px] lg:grid-cols-1 lg:border-t-0">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="flex flex-col border-line py-4 pr-2 lg:border-b lg:py-5 lg:pr-0 lg:text-right [&:not(:first-child)]:border-l [&:not(:first-child)]:pl-3 lg:[&:not(:first-child)]:border-l-0 lg:[&:not(:first-child)]:pl-0"
                >
                  <dt className="order-2 mt-1 text-[11px] uppercase leading-snug tracking-[0.14em] text-mute">{s.label}</dt>
                  <dd className="display order-1 text-[clamp(2rem,5vw,3.25rem)] text-paper">
                    {"text" in s ? (
                      <>
                        {s.text}
                        <span className="text-red">.</span>
                      </>
                    ) : (
                      <>
                        <CountUp to={s.to} delay={0.5 + i * 0.2} />
                        <span className="text-red">{s.suffix}</span>
                      </>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
    </section>
  );
}

function Silhouette() {
  return (
    <svg viewBox="0 0 400 500" className="h-full w-full" role="img" aria-label="Photo placeholder">
      <defs>
        <linearGradient id="sil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1c1c" />
          <stop offset="1" stopColor="#0a0a0a" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="150" r="78" fill="url(#sil)" stroke="#e50914" strokeOpacity=".5" />
      <path
        d="M40 500c0-120 70-210 160-210s160 90 160 210Z"
        fill="url(#sil)"
        stroke="#e50914"
        strokeOpacity=".5"
      />
    </svg>
  );
}
