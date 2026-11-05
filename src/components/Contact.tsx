"use client";

import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import Magnetic from "./Magnetic";
import { useUI } from "./Providers";
import { RevealHeading } from "./Reveal";

export default function Contact() {
  const { openContact } = useUI();

  return (
    <section id="contact" data-build-section data-build-crew="3" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line py-24 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(229,9,20,0.22),transparent)] blur-2xl"
      />
      <div className="container-x relative">
        <p className="label mb-5 flex items-center gap-3">
          <span className="h-px w-8 bg-red" /> Contact
        </p>
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          <div id="contact-title" data-build="1" data-build-tool="text">
            <RevealHeading
              lines={["Let's build", { text: "together.", className: "text-red" }]}
              className="text-[clamp(3.8rem,13vw,12rem)]"
            />
            <p className="mt-8 max-w-md text-mute">
              Open to full-time roles, freelance projects and collaborations. Based in {site.location} — working with
              people anywhere.
            </p>
          </div>

          <div data-build="2" data-build-tool="shape" className="self-center lg:self-auto">
            <Magnetic strength={0.4}>
              <button
                type="button"
                onClick={() => openContact()}
                data-cursor="Talk"
                className="group relative grid h-44 w-44 place-items-center rounded-full bg-red text-white shadow-[0_20px_80px_-10px_rgba(229,9,20,0.6)] transition-colors duration-300 hover:bg-red-hot md:h-56 md:w-56"
              >
                <span className="absolute inset-0 animate-ping-slow rounded-full border border-red/60 [animation-duration:2.6s]" />
                <span className="flex flex-col items-center gap-2">
                  <ArrowUpRight size={30} className="transition-transform duration-300 group-hover:rotate-45" />
                  <span className="display text-3xl md:text-4xl">Let&apos;s talk</span>
                </span>
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
