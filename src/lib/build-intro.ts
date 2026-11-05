/* Figma-style "multiplayer cursors building the page" effect.
 *
 * Mark elements with:
 *   data-build="1"            -> order (lower = earlier). Required.
 *   data-build-tool="text"    -> text | image | shape | frame (default: text)
 * Wrap a group with data-build-section to build it when it scrolls into view.
 */

type Tool = "move" | "frame" | "text" | "image" | "shape" | "pen" | "ruler" | "comment";

const PEOPLE = [
  { name: "Sabarish", color: "#3B82F6" },
  { name: "Claude", color: "#FACC15" },
  { name: "Design", color: "#EC4899" },
  { name: "Dev", color: "#8B5CF6" },
  { name: "SEO", color: "#22D3EE" },
];

const TOOLS: { id: Tool; label: string; svg: string }[] = [
  { id: "move", label: "Move", svg: '<path d="M4 3l7 17 2.5-7.5L21 10z"/>' },
  { id: "frame", label: "Frame", svg: '<path d="M7 3v18M17 3v18M3 7h18M3 17h18"/>' },
  { id: "text", label: "Text", svg: '<path d="M5 5h14M12 5v14"/>' },
  { id: "image", label: "Image", svg: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>' },
  { id: "shape", label: "Shape", svg: '<circle cx="12" cy="12" r="8"/>' },
  { id: "pen", label: "Pen", svg: '<path d="M12 19l7-7 3 3-7 7zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18z"/>' },
  { id: "ruler", label: "Ruler", svg: '<path d="M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2"/>' },
  { id: "comment", label: "Comment", svg: '<path d="M21 12a8 8 0 01-11.6 7.1L4 21l1.9-5.4A8 8 0 1121 12z"/>' },
];

const STYLE_ID = "bc-style";
const CSS = `
.bc-layer{position:absolute;left:0;top:0;width:100%;pointer-events:none;z-index:9990}
.bc-cursor{position:absolute;left:0;top:0;will-change:transform;filter:drop-shadow(0 2px 4px rgba(0,0,0,.5))}
.bc-cursor svg{display:block;width:18px;height:18px}
.bc-tag{position:absolute;left:14px;top:16px;padding:2px 7px;border-radius:5px;font:600 11px/1.4 Inter,system-ui,sans-serif;color:#0a0a0a;white-space:nowrap}
.bc-box{position:absolute;border:1px solid #3B82F6;box-sizing:border-box;transition:opacity .35s}
.bc-box i{position:absolute;width:6px;height:6px;background:#fff;border:1px solid #3B82F6;box-sizing:border-box}
.bc-box i:nth-child(1){left:-3px;top:-3px}.bc-box i:nth-child(2){right:-3px;top:-3px}
.bc-box i:nth-child(3){left:-3px;bottom:-3px}.bc-box i:nth-child(4){right:-3px;bottom:-3px}
.bc-size{position:absolute;left:50%;top:calc(100% + 6px);transform:translateX(-50%);background:#3B82F6;color:#fff;font:600 10px/1 Inter,system-ui,sans-serif;padding:3px 5px;border-radius:3px;white-space:nowrap}
.bc-ruler{position:fixed;z-index:9991;pointer-events:none;background-color:rgba(10,10,12,.85);transition:opacity .5s}
.bc-ruler.top{left:0;right:0;top:0;height:14px;border-bottom:1px solid #1f2937;
  background-image:repeating-linear-gradient(90deg,#4b5563 0 1px,transparent 1px 10px),repeating-linear-gradient(90deg,#9ca3af 0 1px,transparent 1px 100px);
  background-size:100% 5px,100% 10px;background-position:bottom;background-repeat:repeat-x}
.bc-ruler.left{top:0;bottom:0;left:0;width:14px;border-right:1px solid #1f2937;
  background-image:repeating-linear-gradient(0deg,#4b5563 0 1px,transparent 1px 10px),repeating-linear-gradient(0deg,#9ca3af 0 1px,transparent 1px 100px);
  background-size:5px 100%,10px 100%;background-position:right;background-repeat:repeat-y}
.bc-bar{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:9992;display:flex;flex-direction:column;align-items:center;gap:8px;font:500 11px Inter,system-ui,sans-serif;color:#9ca3af;transition:opacity .4s,transform .4s}
.bc-tools{display:flex;gap:2px;padding:5px;background:#141416;border:1px solid #27272a;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.5)}
.bc-tool{display:flex;flex-direction:column;align-items:center;gap:2px;padding:5px 8px;border-radius:8px;color:#a1a1aa;font-size:9px;transition:background .2s,color .2s}
.bc-tool svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.bc-tool.on{background:#3B82F6;color:#fff}
.bc-status{display:flex;align-items:center;gap:10px}
.bc-skip{pointer-events:auto;cursor:pointer;background:#27272a;color:#e4e4e7;border:0;border-radius:6px;padding:3px 9px;font:inherit}
.bc-skip:hover{background:#3f3f46}
.bc-hide{opacity:0!important}
`;

const ARROW = (c: string) =>
  `<svg viewBox="0 0 18 18"><path d="M1.5 1.5l5.2 14 2.1-5.9 5.9-2.1z" fill="${c}" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>`;

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((res, rej) => {
    if (signal.aborted) return rej(new DOMException("skip", "AbortError"));
    const t = setTimeout(res, ms);
    signal.addEventListener("abort", () => { clearTimeout(t); rej(new DOMException("skip", "AbortError")); }, { once: true });
  });

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Global speed. 1 = original; higher = slower. */
const SLOW = 1.2; // hero preloader
const T = (ms: number) => ms * SLOW;
/** Speed for sections built while scrolling (lower = faster). */
const SECTION_SLOW = 0.7;
const TS = (ms: number) => ms * SECTION_SLOW;

/** Bottom toolbar ("Move / Frame / Text …", "Building page X of 6", Skip). */
const SHOW_TOOLBAR = false;

function ensureStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function shouldAnimate() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return true;
}

export function revealAll(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("[data-build]").forEach((el) => {
    el.style.opacity = "1";
    el.style.clipPath = "";
  });
}

class Cursor {
  el: HTMLDivElement;
  x: number;
  y: number;
  constructor(layer: HTMLElement, p: { name: string; color: string }, x: number, y: number) {
    this.el = document.createElement("div");
    this.el.className = "bc-cursor";
    this.el.innerHTML = `${ARROW(p.color)}<span class="bc-tag" style="background:${p.color}">${p.name}</span>`;
    layer.appendChild(this.el);
    this.x = x;
    this.y = y;
    this.el.style.transform = `translate(${x}px,${y}px)`;
  }
  /** Curved, slightly human move. */
  async move(x: number, y: number, ms: number, signal: AbortSignal) {
    const dx = x - this.x, dy = y - this.y;
    const len = Math.hypot(dx, dy) || 1;
    const bend = rand(-0.18, 0.18) * len;
    const mx = this.x + dx * 0.5 + (-dy / len) * bend;
    const my = this.y + dy * 0.5 + (dx / len) * bend;
    const anim = this.el.animate(
      [
        { transform: `translate(${this.x}px,${this.y}px)` },
        { transform: `translate(${mx}px,${my}px)`, offset: 0.55 },
        { transform: `translate(${x}px,${y}px)` },
      ],
      { duration: ms, easing: "cubic-bezier(.45,0,.2,1)", fill: "forwards" }
    );
    this.x = x;
    this.y = y;
    const stop = () => anim.finish();
    signal.addEventListener("abort", stop, { once: true });
    await anim.finished.catch(() => {});
    signal.removeEventListener("abort", stop);
    if (signal.aborted) throw new DOMException("skip", "AbortError");
  }
}

interface Ctx {
  layer: HTMLElement;
  signal: AbortSignal;
  setTool?: (t: Tool) => void;
  /** Scales every duration (hero vs. section speed). */
  t: (ms: number) => number;
}

/** One cursor drags a selection box over el, then reveals el inside it. */
async function buildElement(c: Cursor, el: HTMLElement, ctx: Ctx) {
  const { layer, signal } = ctx;
  const r = el.getBoundingClientRect();
  const lr = layer.getBoundingClientRect();
  const x = r.left - lr.left, y = r.top - lr.top, w = r.width, h = r.height;
  const tool = (el.dataset.buildTool as Tool) || "text";

  await c.move(x, y, ctx.t(rand(650, 900)), signal);
  ctx.setTool?.(tool === "text" || tool === "image" ? tool : "frame");

  const box = document.createElement("div");
  box.className = "bc-box";
  box.style.cssText = `left:${x}px;top:${y}px;width:0;height:0`;
  box.innerHTML = `<i></i><i></i><i></i><i></i><span class="bc-size">0 × 0</span>`;
  layer.appendChild(box);
  const size = box.querySelector(".bc-size") as HTMLElement;

  // drag the box open while the cursor travels to the bottom-right corner
  const drag = ctx.t(Math.min(700, 280 + (w + h) * 0.35));
  const t0 = performance.now();
  const grow = new Promise<void>((res) => {
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / drag);
      const e = 1 - Math.pow(1 - k, 3);
      box.style.width = `${w * e}px`;
      box.style.height = `${h * e}px`;
      size.textContent = `${Math.round(w * e)} × ${Math.round(h * e)}`;
      if (k < 1 && !signal.aborted) requestAnimationFrame(step);
      else res();
    };
    requestAnimationFrame(step);
  });
  await Promise.all([c.move(x + w, y + h, drag, signal), grow]);

  // reveal the real content inside the box
  el.style.opacity = "1";
  const from = tool === "image" ? "inset(0 0 100% 0)" : "inset(0 100% 0 0)";
  const reveal = el.animate([{ clipPath: from }, { clipPath: "inset(0 0 0 0)" }], {
    duration: ctx.t(tool === "image" ? 900 : 550),
    easing: "cubic-bezier(.3,0,.2,1)",
  });
  reveal.finished.then(() => (el.style.clipPath = "")).catch(() => {});
  await sleep(ctx.t(tool === "image" ? 700 : 380), signal);

  box.classList.add("bc-hide");
  setTimeout(() => box.remove(), 400);
}

/** Split elements across cursors in order; each cursor works its own queue. */
async function runCrew(els: HTMLElement[], cursors: Cursor[], ctx: Ctx, stagger = 260) {
  const queues: HTMLElement[][] = cursors.map(() => []);
  els.forEach((el, i) => queues[i % cursors.length].push(el));
  await Promise.all(
    queues.map(async (q, i) => {
      await sleep(ctx.t(i * stagger), ctx.signal);
      for (const el of q) await buildElement(cursors[i], el, ctx);
    })
  );
}

function sortByOrder(els: HTMLElement[]) {
  return els.sort((a, b) => Number(a.dataset.build) - Number(b.dataset.build));
}

function makeLayer() {
  const layer = document.createElement("div");
  layer.className = "bc-layer";
  layer.style.height = `${document.documentElement.scrollHeight}px`;
  document.body.appendChild(layer);
  return layer;
}

export interface IntroOptions {
  /** Element containing the hero. Elements inside with [data-build] are built. */
  root: HTMLElement;
  pageCount?: number;
  onDone?: () => void;
}

/** Hero intro: rulers, toolbar, 5 cursors. Returns a cancel/skip function. */
export function runIntro({ root, pageCount = 6, onDone }: IntroOptions): () => void {
  ensureStyle();
  const els = sortByOrder(Array.from(root.querySelectorAll<HTMLElement>("[data-build]")).filter((e) => !e.closest("[data-build-section]")));
  if (!shouldAnimate()) {
    revealAll(root);
    onDone?.();
    return () => {};
  }

  const ac = new AbortController();
  const layer = makeLayer();
  const rulers = ["top", "left"].map((side) => {
    const r = document.createElement("div");
    r.className = `bc-ruler ${side}`;
    document.body.appendChild(r);
    return r;
  });

  const bar = document.createElement("div");
  bar.className = "bc-bar";
  bar.innerHTML = `<div class="bc-tools">${TOOLS.map(
    (t) => `<div class="bc-tool${t.id === "move" ? " on" : ""}" data-t="${t.id}"><svg viewBox="0 0 24 24">${t.svg}</svg>${t.label}</div>`
  ).join("")}</div><div class="bc-status"><span class="bc-page">Building page 1 of ${pageCount}</span><button class="bc-skip" type="button">Skip</button></div>`;
  // Toolbar is built but not shown. Set SHOW_TOOLBAR = true to bring it back.
  if (SHOW_TOOLBAR) document.body.appendChild(bar);
  const setTool = (t: Tool) => bar.querySelectorAll<HTMLElement>(".bc-tool").forEach((n) => n.classList.toggle("on", n.dataset.t === t));
  const pageLbl = bar.querySelector(".bc-page") as HTMLElement;
  bar.querySelector(".bc-skip")!.addEventListener("click", () => ac.abort());

  // cursors start as a loose cluster on the left-middle of the hero
  const hr = root.getBoundingClientRect();
  const cx = hr.left + hr.width * 0.12, cy = hr.top + window.scrollY + hr.height * 0.45;
  const cursors = PEOPLE.map((p) => new Cursor(layer, p, cx + rand(-60, 60), cy + rand(-70, 70)));

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    revealAll(root);
    setTool("move");
    [bar, ...rulers].forEach((n) => n.classList.add("bc-hide"));
    cursors.forEach((c) => c.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" }));
    setTimeout(() => [layer, bar, ...rulers].forEach((n) => n.remove()), 600);
    onDone?.();
  };

  (async () => {
    try {
      await sleep(T(500), ac.signal); // cursors "join" first
      // page counter ticks while building, like the reference
      const total = els.length || 1;
      let built = 0;
      const ctx: Ctx = {
        layer,
        signal: ac.signal,
        setTool,
        t: T,
      };
      const origBuild = ctx.setTool!;
      ctx.setTool = (t) => {
        origBuild(t);
        built++;
        pageLbl.textContent = `Building page ${Math.min(pageCount, 1 + Math.floor((built / total) * pageCount))} of ${pageCount}`;
      };
      await runCrew(els, cursors, ctx);
      // scatter off the hero
      await Promise.all(cursors.map((c) => c.move(c.x + rand(-200, 200), c.y + rand(150, 300), T(700), ac.signal)));
    } catch {
      /* skipped */
    }
    finish();
  })();

  return () => {
    ac.abort();
    finish();
  };
}

/** Sections marked [data-build-section]: 2–3 cursors fly in and build them once. */
export function watchSections(container: ParentNode = document): () => void {
  ensureStyle();
  const sections = Array.from(container.querySelectorAll<HTMLElement>("[data-build-section]"));
  if (!shouldAnimate()) {
    sections.forEach((s) => revealAll(s));
    return () => {};
  }
  const controllers: AbortController[] = [];
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const sec = entry.target as HTMLElement;
        io.unobserve(sec);
        const ac = new AbortController();
        controllers.push(ac);
        const layer = makeLayer();
        const r = sec.getBoundingClientRect();
        const top = r.top + window.scrollY;
        const crew = PEOPLE.slice(0, sec.dataset.buildCrew ? Number(sec.dataset.buildCrew) : 3).sort(() => Math.random() - 0.5);
        const cursors = crew.map((p, i) => new Cursor(layer, p, i % 2 ? window.innerWidth + 40 : -40, top + rand(0, 160)));
        const els = sortByOrder(Array.from(sec.querySelectorAll<HTMLElement>("[data-build]")));
        (async () => {
          try {
            await runCrew(els, cursors, { layer, signal: ac.signal, t: TS }, 180);
            await Promise.all(cursors.map((c, i) => c.move(i % 2 ? window.innerWidth + 60 : -60, c.y + rand(-80, 80), TS(650), ac.signal)));
          } catch {
            /* aborted */
          }
          revealAll(sec);
          layer.remove();
        })();
      });
    },
    { threshold: 0.12 }
  );
  sections.forEach((s) => io.observe(s));
  return () => {
    io.disconnect();
    controllers.forEach((c) => c.abort());
  };
}
