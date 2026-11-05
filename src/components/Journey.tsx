"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Award, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { journey } from "@/data/journey";
import Modal from "./Modal";
import { FadeUp, RevealHeading } from "./Reveal";
import TechIcon from "./TechIcon";

export default function Journey({ hasCertificate }: { hasCertificate: boolean }) {
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [cert, setCert] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 60%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const year = journey[active]?.year ?? "";

  return (
    <section id="journey" data-build-section data-build-crew="4" aria-labelledby="journey-title" className="border-t border-line py-24 md:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Sticky left side */}
        <div className="lg:col-span-5">
          <div data-build="1" data-build-tool="text" className="lg:sticky lg:top-28">
            <p className="label mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-red" /> Journey
            </p>
            <div id="journey-title">
              <RevealHeading
                lines={["The work.", { text: "The journey.", className: "text-red" }]}
                className="text-[clamp(3.2rem,8vw,6.5rem)]"
              />
            </div>
            <div className="relative mt-6 h-[clamp(6rem,15vw,12rem)] overflow-hidden" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={year}
                  className="display absolute inset-x-0 top-0 text-[clamp(6rem,15vw,12rem)] text-red"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {year}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <ol ref={listRef} className="relative lg:col-span-7">
          <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-line" />
          <motion.span
            aria-hidden="true"
            className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-red-hot shadow-[0_0_12px_rgba(229,9,20,0.8)]"
            style={{ scaleY: fill }}
          />
          {journey.map((item, i) => (
            <li
              key={item.title}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-index={i}
              data-build={i + 2}
              data-build-tool="frame"
              className="relative pb-16 pl-12 last:pb-0 md:pl-16"
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 border-red transition-all duration-500 ${
                  i <= active ? "bg-red shadow-[0_0_0_6px_rgba(229,9,20,0.18)]" : "bg-ink"
                }`}
              />
              <FadeUp>
                <p className="text-sm font-semibold tracking-[0.2em] text-red-hot">{item.year}</p>
                <h3 className="display mt-3 text-[clamp(2rem,4.5vw,3.25rem)] text-paper">{item.title}</h3>
                <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-mute">
                  <span className="font-medium text-paper">{item.org}</span>
                  {item.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-red" /> {item.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-red" /> {item.period}
                  </span>
                </p>
                <p className="mt-5 max-w-xl leading-relaxed text-[#bdbdbd]">{item.summary}</p>
                {item.points && (
                  <ul className="mt-4 space-y-2">
                    {item.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-sm text-mute">
                        <span aria-hidden="true" className="mt-[0.6em] h-px w-4 shrink-0 bg-red" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                )}
                {item.tags && (
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Skills">
                    {item.tags.map((t) => (
                      <li key={t} className="pill">
                        <TechIcon name={t} />
                {t}
                      </li>
                    ))}
                  </ul>
                )}
                {item.meta && <p className="mt-5 font-mono text-xs text-mute">{item.meta}</p>}
                {item.certificate && hasCertificate && (
                  <button
                    type="button"
                    onClick={() => setCert(item.certificate!)}
                    className="btn btn-ghost btn-sm mt-6"
                    data-cursor="Open"
                  >
                    <Award size={15} className="text-red-hot" /> View certificate
                  </button>
                )}
              </FadeUp>
            </li>
          ))}
        </ol>
      </div>

      <Modal open={cert !== null} onClose={() => setCert(null)} labelledBy="cert-title" panelClassName="max-w-5xl">
        <div className="p-5 pt-16 sm:p-8 sm:pt-16">
          <h2 id="cert-title" className="display mb-5 text-3xl text-paper">
            MERN Stack Certificate<span className="text-red">.</span>
          </h2>
          {cert && (
            <div className="relative aspect-[1600/1113] w-full overflow-hidden rounded-xl border border-line bg-black">
              <Image
                src={cert}
                alt="MERN Stack Development certificate from Pumo Technovation, awarded to Sabarish Kannan P"
                fill
                sizes="(min-width: 1024px) 960px, 100vw"
                className="object-contain"
              />
            </div>
          )}
        </div>
      </Modal>
    </section>
  );
}
