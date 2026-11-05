import { marqueeItems } from "@/data/stack";

export default function Marquee() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {marqueeItems.map((item) => (
        <li key={item} className="display flex items-center whitespace-nowrap text-[clamp(2.5rem,6vw,5rem)] text-white">
          <span className="px-6">{item}</span>
          <span className="text-ink" aria-hidden="true">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="overflow-hidden border-b border-black/20 py-6">
      <p className="sr-only">Skills: {marqueeItems.join(", ")}</p>
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}
