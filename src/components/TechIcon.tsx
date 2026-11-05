import {
  Accessibility,
  AppWindow,
  Braces,
  Database,
  FileDown,
  ImageDown,
  LayoutGrid,
  Network,
  Smartphone,
  Sparkles,
  SquareCode,
  type LucideIcon,
} from "lucide-react";
import {
  siClaude,
  siCpanel,
  siCss,
  siDotnet,
  siExpress,
  siFigma,
  siGit,
  siGithub,
  siGooglesearchconsole,
  siHtml5,
  siJavascript,
  siJenkins,
  siJquery,
  siLighthouse,
  siMake,
  siMongodb,
  siMongoose,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siPhp,
  siReact,
  siTailwindcss,
  siTypescript,
  siBootstrap,
  siVercel,
  siVite,
  type SimpleIcon,
} from "simple-icons";

/** Official brand logos (simple-icons). Keys are lower-case tech names. */
const BRANDS: Record<string, SimpleIcon> = {
  react: siReact,
  "next.js": siNextdotjs,
  "tailwind css": siTailwindcss,
  html5: siHtml5,
  html: siHtml5,
  "html/css/js": siHtml5,
  css3: siCss,
  css: siCss,
  javascript: siJavascript,
  typescript: siTypescript,
  bootstrap: siBootstrap,
  jquery: siJquery,
  "node.js": siNodedotjs,
  "express.js": siExpress,
  express: siExpress,
  php: siPhp,
  "php/mysql": siPhp,
  mongodb: siMongodb,
  mysql: siMysql,
  mongoose: siMongoose,
  claude: siClaude,
  "claude code": siClaude,
  "automation (make)": siMake,
  make: siMake,
  git: siGit,
  github: siGithub,
  figma: siFigma,
  cpanel: siCpanel,
  "hosting & cpanel": siCpanel,
  jenkins: siJenkins,
  vercel: siVercel,
  vite: siVite,
  ".net": siDotnet,
  performance: siLighthouse,
  seo: siGooglesearchconsole,
  "seo & schema markup": siGooglesearchconsole,
};

/** Generic icons for skills that are not brands. */
const GENERIC: Record<string, { Icon: LucideIcon; color: string }> = {
  "rest apis": { Icon: Network, color: "#22D3EE" },
  "mobile-first layouts": { Icon: Smartphone, color: "#A3E635" },
  "flexbox / grid": { Icon: LayoutGrid, color: "#F472B6" },
  accessibility: { Icon: Accessibility, color: "#60A5FA" },
  "prompt engineering": { Icon: Sparkles, color: "#D97757" },
  localstorage: { Icon: Database, color: "#FBBF24" },
  schema: { Icon: Braces, color: "#F59E0B" },
  wpf: { Icon: AppWindow, color: "#60A5FA" },
  html2pdf: { Icon: FileDown, color: "#F87171" },
  html2canvas: { Icon: ImageDown, color: "#34D399" },
  "vs code": { Icon: SquareCode, color: "#23A9F2" },
};

/** Logos removed from simple-icons (Adobe / Microsoft) — drawn as small text badges. */
const BADGES: Record<string, { text: string; bg: string; fg: string }> = {
  photoshop: { text: "Ps", bg: "#001E36", fg: "#31A8FF" },
  "c#": { text: "C#", bg: "#68217A", fg: "#FFFFFF" },
};

/** Very dark brand colours (Next.js, Vercel, GitHub…) would vanish on black, so show them light. */
function visible(hex: string) {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum < 0.22 ? "#EDEDED" : `#${hex}`;
}

export default function TechIcon({ name, size = 14 }: { name: string; size?: number }) {
  const key = name.trim().toLowerCase();

  const brand = BRANDS[key];
  if (brand) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill={visible(brand.hex)} aria-hidden="true" className="shrink-0">
        <path d={brand.path} />
      </svg>
    );
  }

  const badge = BADGES[key];
  if (badge) {
    return (
      <span
        aria-hidden="true"
        className="grid shrink-0 place-items-center rounded-[3px] font-sans font-bold leading-none"
        style={{ width: size, height: size, background: badge.bg, color: badge.fg, fontSize: size * 0.55 }}
      >
        {badge.text}
      </span>
    );
  }

  const generic = GENERIC[key];
  if (generic) {
    const { Icon, color } = generic;
    return <Icon size={size} color={color} aria-hidden="true" className="shrink-0" />;
  }

  return null;
}
