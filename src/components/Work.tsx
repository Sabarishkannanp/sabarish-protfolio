"use client";

import { ArrowUpRight } from "lucide-react";
import { GithubIcon as Github } from "./icons";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { FadeUp, RevealHeading } from "./Reveal";
import TechIcon from "./TechIcon";

export type ProjectWithImage = Project & { hasImage: boolean };

export default function Work({ projects }: { projects: ProjectWithImage[] }) {
  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);

  return (
    <section id="work" data-build-section data-build-crew="5" aria-labelledby="work-title" className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div data-build="1" data-build-tool="text">
            <p className="label mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-red" /> Selected work
            </p>
            <div id="work-title">
              <RevealHeading lines={["Work that", "ships."]} className="text-[clamp(3.5rem,11vw,10rem)]" />
            </div>
          </div>
          <p data-build="2" data-build-tool="text" className="max-w-sm text-mute md:pb-3 md:text-right">
            Client websites, web apps and internal tools — built, deployed and used by real people.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <FadeUp as="li" key={p.slug} index={i}>
              <div data-build={3 + i} data-build-tool="frame" className="h-full">
                <ProjectCard project={p} />
              </div>
            </FadeUp>
          ))}
        </ul>

        {more.length > 0 && (
          <div data-build="10" data-build-tool="frame" className="mt-20">
            <h3 className="label mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-red" /> More built
            </h3>
            <ul className="grid grid-cols-1 border-t border-line md:grid-cols-2">
              {more.map((p, i) => (
                <FadeUp as="li" key={p.slug} index={i % 2} className="min-w-0 border-b border-line md:odd:border-r">
                  <MoreRow project={p} />
                </FadeUp>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project: p }: { project: ProjectWithImage }) {
  return (
    <article
      data-cursor="View"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-2 transition-colors duration-300 hover:border-red/60"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
        {p.hasImage ? (
          <Image
            src={p.image}
            alt={`${p.title} — screenshot`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <Placeholder title={p.title} />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-red px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
          {p.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="display text-[2.4rem] text-paper transition-colors group-hover:text-red-hot">{p.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-mute">{p.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech used">
          {p.tech.map((t) => (
            <li key={t} className="pill">
              <TechIcon name={t} />
                {t}
            </li>
          ))}
        </ul>
        {(p.liveUrl || p.githubUrl) && (
          <div className="mt-auto flex flex-wrap gap-2 pt-6">
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-red btn-sm" data-cursor="Open">
                Live demo <ArrowUpRight size={14} />
                <span className="sr-only"> of {p.title} (opens in new tab)</span>
              </a>
            )}
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" data-cursor="Code">
                <Github size={14} /> Code
                <span className="sr-only"> for {p.title} (opens in new tab)</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function MoreRow({ project: p }: { project: ProjectWithImage }) {
  const href = p.liveUrl || p.githubUrl;
  const content = (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-red transition-transform duration-300 group-hover:scale-y-100"
      />
      <div className="min-w-0">
        <div className="flex items-baseline gap-3">
          <span className="display text-2xl text-paper transition-colors group-hover:text-red-hot md:text-3xl">{p.title}</span>
          <span className="hidden text-[11px] uppercase tracking-[0.14em] text-red sm:inline">{p.category}</span>
        </div>
        <p className="mt-1 truncate text-sm text-mute">{p.description}</p>
      </div>
      <span className="hidden shrink-0 text-xs text-mute lg:block">{p.tech.join(" · ")}</span>
      {href && <ArrowUpRight size={18} className="shrink-0 text-mute transition-colors group-hover:text-red-hot" />}
    </>
  );
  const cls = "group relative flex items-center gap-6 px-5 py-6 transition-colors hover:bg-white/[0.02]";
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls} data-cursor="Open">
      {content}
    </a>
  ) : (
    <div className={cls}>{content}</div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_70%_20%,rgba(229,9,20,0.18),transparent_55%),linear-gradient(#0d0d0d,#070707)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(#ffffff08_1px,transparent_1px),linear-gradient(90deg,#ffffff08_1px,transparent_1px)] bg-[size:28px_28px]" />
      <span className="display text-outline relative text-[5.5rem] transition-transform duration-700 group-hover:scale-110">
        {title.slice(0, 2)}
      </span>
    </div>
  );
}
