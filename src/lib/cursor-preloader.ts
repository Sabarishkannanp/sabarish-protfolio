/* Cursor-swarm preloader: "AI agents build the page" effect.
 *
 * Phases: scan (dark, cursor cluster) -> scatter (+ markers) -> wireframe (skeleton boxes)
 *         -> build (cursors fill each box: text types in, images go grey -> colour) -> exit.
 * Works with NO markup changes: it finds headings, text, images and buttons by itself.
 * Optional control: data-build="N" (order) and data-build-tool="text|image|shape".
 * Elements with data-build-skip (and their children) are ignored.
 *
 * Additions (marked "+ added"): Esc skips the intro, a click ripple when a cursor
 * starts building, and a red "publish" sweep + "Live ✓ <domain>" at the end.
 */

const COLORS = ["#3B82F6", "#FACC15", "#EC4899", "#8B5CF6", "#22D3EE", "#F97316", "#10B981", "#F43F5E", "#A3E635", "#60A5FA", "#E879F9", "#FB7185", "#2DD4BF", "#FBBF24", "#818CF8", "#F472B6"];
const NAMES = ["Sabarish", "Claude", "Design"];

export interface PreloaderOptions {
  /** Elements to build in the intro. Default: header + #hero / #top / first section. */
  roots?: HTMLElement[];
  agents?: number;
  accent?: string; // selection / caret colour
  names?: string[]; // first few cursors get name tags
  maxTargets?: number;
  /** Initials shown in the centre badge while scanning, e.g. "SK". */
  badge?: string;
  onDone?: () => void;
}

const CSS = `
.cp-layer{position:absolute;left:0;top:0;width:100%;overflow:hidden;pointer-events:none;z-index:9990}
.cp-cover{position:fixed;inset:0;z-index:9989;pointer-events:none;background:radial-gradient(ellipse at 50% 55%,rgba(229,9,20,.10),transparent 60%),#050505;transition:opacity .6s}
.cp-wash{position:fixed;inset:0;z-index:9988;pointer-events:none;background:rgba(128,132,140,.55);opacity:0;transition:opacity .45s}
.cp-cur{position:absolute;left:0;top:0;will-change:transform}
.cp-cur svg{display:block;width:13px;height:13px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))}
.cp-tag{position:absolute;left:11px;top:12px;padding:1px 6px;border-radius:4px;font:600 10px/1.5 Inter,system-ui,sans-serif;color:#0a0a0a;white-space:nowrap}
.cp-plus{position:absolute;width:11px;height:11px;margin:-5px 0 0 -5px;opacity:.9}
.cp-plus:before,.cp-plus:after{content:"";position:absolute;background:currentColor;left:5px;top:0;width:1.5px;height:11px}
.cp-plus:after{left:0;top:5px;width:11px;height:1.5px}
.cp-box{position:absolute;box-sizing:border-box;border:1px solid var(--cp-accent);background:rgba(170,174,186,.16);transition:opacity .35s,background .35s}
.cp-box.filled{background:transparent}
.cp-box i{position:absolute;width:5px;height:5px;background:#fff;border:1px solid var(--cp-accent);box-sizing:border-box}
.cp-box i:nth-child(1){left:-3px;top:-3px}.cp-box i:nth-child(2){right:-3px;top:-3px}.cp-box i:nth-child(3){left:-3px;bottom:-3px}.cp-box i:nth-child(4){right:-3px;bottom:-3px}
.cp-size{position:absolute;left:50%;top:calc(100% + 4px);transform:translateX(-50%);background:var(--cp-accent);color:#fff;font:600 9px/1 Inter,system-ui,sans-serif;padding:2px 4px;border-radius:2px;white-space:nowrap}
.cp-caret{position:absolute;width:2px;background:var(--cp-accent);box-shadow:0 0 6px var(--cp-accent)}
.cp-bar{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9992;display:flex;align-items:center;gap:12px;padding:6px 8px 6px 12px;background:rgba(18,18,22,.92);border:1px solid #27272a;border-radius:12px;font:500 11px Inter,system-ui,sans-serif;color:#a1a1aa;box-shadow:0 10px 30px rgba(0,0,0,.5);transition:opacity .4s,transform .4s}
.cp-av{display:flex}.cp-av b{width:14px;height:14px;border-radius:50%;border:2px solid #121216;margin-left:-5px}.cp-av b:first-child{margin-left:0}
.cp-sep{width:1px;height:16px;background:#27272a}
.cp-status{color:#e4e4e7;min-width:96px}
.cp-skip{pointer-events:auto;cursor:pointer;background:#27272a;color:#e4e4e7;border:0;border-radius:7px;padding:4px 10px;font:inherit}
.cp-skip:hover{background:#3f3f46}
.cp-cover:after{content:"";position:absolute;left:50%;top:0;bottom:0;width:22vw;transform:translateX(-50%);background:linear-gradient(90deg,transparent,rgba(229,9,20,.07),transparent)}
.cp-badge{position:fixed;left:50%;top:50%;z-index:9991;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:12px;background:#26262b;border:1px solid #3a3a40;display:flex;align-items:center;justify-content:center;font:700 13px Inter,system-ui,sans-serif;color:#8e8e96;letter-spacing:.5px;animation:cp-pulse 1.4s ease-in-out infinite;transition:opacity .35s,transform .35s}
@keyframes cp-pulse{50%{box-shadow:0 0 0 8px rgba(255,255,255,.03)}}
.cp-badge.cp-out{transform:scale(.6)}
.cp-prog{width:90px;height:2px;background:#27272a;border-radius:2px;overflow:hidden}.cp-prog i{display:block;height:100%;width:0;background:var(--cp-accent);transition:width .3s}
.cp-ico{display:flex;gap:10px;align-items:center;color:#a1a1aa}.cp-ico svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.cp-out{opacity:0!important}
.cp-bar.cp-out{transform:translate(-50%,20px)}
.cp-ripple{position:absolute;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;border:1.5px solid var(--cp-accent);pointer-events:none}
.cp-sweep{position:fixed;left:0;right:0;top:0;height:2px;z-index:9991;pointer-events:none;background:linear-gradient(90deg,transparent,#ff1e3c 20%,#fff 50%,#ff1e3c 80%,transparent);box-shadow:0 0 24px 6px rgba(229,9,20,.55)}
.cp-live{color:#4ade80}
@media (max-width:767px){.cp-bar{gap:10px;max-width:calc(100vw - 24px);bottom:14px}.cp-av,.cp-ico,.cp-count,.cp-bar .cp-sep{display:none}.cp-status{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:46vw}.cp-prog{width:64px}}
`;

const arrow = (c: string) => `<svg viewBox="0 0 18 18"><path d="M1.5 1.5l5.2 14 2.1-5.9 5.9-2.1z" fill="${c}" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/></svg>`;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

class Skip extends Error {}
function sleep(ms: number, s: AbortSignal) {
  return new Promise<void>((res, rej) => {
    if (s.aborted) return rej(new Skip());
    const t = setTimeout(res, ms);
    s.addEventListener("abort", () => { clearTimeout(t); rej(new Skip()); }, { once: true });
  });
}

function ensureStyle(accent: string) {
  document.documentElement.style.setProperty("--cp-accent", accent);
  if (document.getElementById("cp-style")) return;
  const st = document.createElement("style");
  st.id = "cp-style";
  st.textContent = CSS;
  document.head.appendChild(st);
}

export function canAnimate() {
  if (typeof window === "undefined") return false;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (location.hash && !["#top", "#hero", "#home"].includes(location.hash)) return false;
  return true;
}

/* ---------- target discovery ---------- */

const AUTO = "h1,h2,h3,h4,p,img,picture,video,canvas,button,a,li,dt,dd,blockquote,figure,[data-stat],[class*='stat'],[class*='badge'],[class*='chip']";

function visible(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  if (r.width < 6 || r.height < 6) return false;
  const cs = getComputedStyle(el);
  return cs.display !== "none" && cs.visibility !== "hidden" && Number(cs.opacity) > 0.02;
}

export function findTargets(roots: HTMLElement[], max = 40): HTMLElement[] {
  const out: HTMLElement[] = [];
  for (const root of roots) {
    const marked = Array.from(root.querySelectorAll<HTMLElement>("[data-build]"));
    let list = marked.length ? marked : Array.from(root.querySelectorAll<HTMLElement>(AUTO));
    list = list.filter((el) => !el.closest("[data-build-skip]") && visible(el));
    // keep the outermost match only (an <a> around an <img> builds as one block)
    const set = new Set(list);
    list = list.filter((el) => {
      for (let p = el.parentElement; p && p !== root; p = p.parentElement) if (set.has(p)) return false;
      return true;
    });
    if (marked.length) list.sort((a, b) => Number(a.dataset.build) - Number(b.dataset.build));
    else list.sort((a, b) => { const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return ra.top - rb.top || ra.left - rb.left; });
    out.push(...list);
  }
  return out.slice(0, max);
}

function toolOf(el: HTMLElement): "text" | "image" | "shape" {
  const t = el.dataset.buildTool;
  if (t === "image" || t === "text" || t === "shape") return t;
  if (el.matches("img,picture,video,canvas,figure") || el.querySelector("img,picture,video")) return "image";
  if (el.matches("button") || (el.matches("a") && !el.textContent?.trim())) return "shape";
  return "text";
}

/* ---------- hide / show (visibility so Framer Motion opacity can't fight it) ---------- */

function hide(el: HTMLElement) {
  el.dataset.cpHidden = "1";
  el.style.visibility = "hidden";
}
function show(el: HTMLElement) {
  if (!el.dataset.cpHidden) return;
  delete el.dataset.cpHidden;
  el.style.visibility = "";
  el.style.clipPath = "";
  el.style.filter = "";
}
export function showAll() {
  document.querySelectorAll<HTMLElement>("[data-cp-hidden]").forEach(show);
  document.documentElement.classList.remove("cp-pre");
}

/* ---------- pieces ---------- */

class Agent {
  el = document.createElement("div");
  x = 0; y = 0;
  constructor(layer: HTMLElement, color: string, name: string | undefined, x: number, y: number) {
    this.el.className = "cp-cur";
    this.el.innerHTML = arrow(color) + (name ? `<span class="cp-tag" style="background:${color}">${name}</span>` : "");
    layer.appendChild(this.el);
    this.place(x, y);
  }
  place(x: number, y: number) { this.x = x; this.y = y; this.el.style.transform = `translate(${x}px,${y}px)`; }
  async move(x: number, y: number, ms: number, s: AbortSignal) {
    const dx = x - this.x, dy = y - this.y, len = Math.hypot(dx, dy) || 1, bend = rand(-0.2, 0.2) * len;
    const mx = this.x + dx / 2 - (dy / len) * bend, my = this.y + dy / 2 + (dx / len) * bend;
    const a = this.el.animate([
      { transform: `translate(${this.x}px,${this.y}px)` },
      { transform: `translate(${mx}px,${my}px)`, offset: 0.55 },
      { transform: `translate(${x}px,${y}px)` },
    ], { duration: ms, easing: "cubic-bezier(.45,0,.2,1)", fill: "forwards" });
    this.x = x; this.y = y;
    const stop = () => a.finish();
    s.addEventListener("abort", stop, { once: true });
    await a.finished.catch(() => {});
    s.removeEventListener("abort", stop);
    if (s.aborted) throw new Skip();
  }
}

function docRect(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
}

function skeleton(layer: HTMLElement, el: HTMLElement) {
  const r = docRect(el);
  const b = document.createElement("div");
  b.className = "cp-box";
  b.style.cssText = `left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px`;
  b.innerHTML = `<i></i><i></i><i></i><i></i><span class="cp-size">${Math.round(r.w)} × ${Math.round(r.h)}</span>`;
  layer.appendChild(b);
  b.animate([{ opacity: 0, transform: "scale(.96)" }, { opacity: 1, transform: "scale(1)" }], { duration: 260, easing: "ease-out" });
  return b;
}

function plus(layer: HTMLElement, x: number, y: number, color: string) {
  const p = document.createElement("div");
  p.className = "cp-plus";
  p.style.cssText = `left:${x}px;top:${y}px;color:${color}`;
  layer.appendChild(p);
  p.animate([{ transform: "scale(0) rotate(-90deg)" }, { transform: "scale(1.3) rotate(0)" , offset: .7}, { transform: "scale(1)" }], { duration: 380, easing: "ease-out" });
  return p;
}

/* + added: a little "click" ring where a cursor starts building */
function ripple(layer: HTMLElement, x: number, y: number) {
  const r = document.createElement("div");
  r.className = "cp-ripple";
  r.style.left = `${x}px`;
  r.style.top = `${y}px`;
  layer.appendChild(r);
  r.animate([{ transform: "scale(.2)", opacity: 0.9 }, { transform: "scale(1.6)", opacity: 0 }], { duration: 480, easing: "ease-out" })
    .finished.then(() => r.remove()).catch(() => r.remove());
}

/** One agent fills one skeleton box with the real element. */
async function fill(agent: Agent, el: HTMLElement, box: HTMLElement, layer: HTMLElement, s: AbortSignal) {
  const r = docRect(el);
  const tool = toolOf(el);
  await agent.move(r.x + rand(2, Math.min(40, r.w / 3)), r.y + r.h / 2, rand(450, 750), s);
  ripple(layer, agent.x, agent.y); // + added
  box.classList.add("filled");
  el.style.visibility = "";

  if (tool === "text") {
    const caret = document.createElement("div");
    caret.className = "cp-caret";
    caret.style.cssText = `left:${r.x}px;top:${r.y}px;height:${r.h}px`;
    layer.appendChild(caret);
    const ms = Math.min(900, 250 + r.w * 0.9);
    el.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: ms, easing: "linear" });
    caret.animate([{ transform: "translateX(0)" }, { transform: `translateX(${r.w}px)` }], { duration: ms, easing: "linear", fill: "forwards" });
    const follow = agent.move(r.x + r.w, r.y + r.h / 2 + 6, ms, s);
    await follow;
    caret.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "forwards" }).finished.then(() => caret.remove());
  } else if (tool === "image") {
    el.style.filter = "grayscale(1) brightness(.75)";
    el.animate([{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 650, easing: "cubic-bezier(.3,0,.2,1)" });
    await agent.move(r.x + r.w - 10, r.y + r.h - 10, 650, s);
    await sleep(250, s);
    el.style.transition = "filter .7s ease";
    el.style.filter = "";
    setTimeout(() => (el.style.transition = ""), 800);
  } else {
    el.animate([{ opacity: 0, transform: "scale(.92)" }, { opacity: 1, transform: "scale(1)" }], { duration: 380, easing: "cubic-bezier(.3,1.4,.5,1)" });
    await agent.move(r.x + r.w - 6, r.y + r.h - 4, 380, s);
  }
  delete el.dataset.cpHidden;
  el.style.clipPath = "";
  setTimeout(() => box.classList.add("cp-out"), 250);
  setTimeout(() => box.remove(), 700);
}

async function crew(agents: Agent[], els: HTMLElement[], boxes: HTMLElement[], layer: HTMLElement, s: AbortSignal, onEach?: () => void) {
  const q: number[][] = agents.map(() => []);
  els.forEach((_, i) => q[i % agents.length].push(i));
  await Promise.all(q.map(async (list, a) => {
    await sleep(a * 70, s);
    for (const i of list) { await fill(agents[a], els[i], boxes[i], layer, s); onEach?.(); }
  }));
}

function newLayer() {
  const l = document.createElement("div");
  l.className = "cp-layer";
  l.style.height = `${document.documentElement.scrollHeight}px`;
  document.body.appendChild(l);
  return l;
}

/** Flocks of 3 cursors spiral inward around (cx, cy), like agents circling the page. */
function orbit(agents: Agent[], cx: number, cy: number, ms: number, s: AbortSignal, onT?: (t: number) => void) {
  const flocks = Math.ceil(agents.length / 3);
  const k = Math.max(0.5, Math.min(1, innerWidth / 1000)); // smaller ring on phones
  const f = Array.from({ length: flocks }, (_, i) => ({ a0: (i / flocks) * Math.PI * 2 + rand(-0.3, 0.3), r0: rand(240, 380) * k, r1: rand(55, 95) * k, spin: rand(1.6, 2.3) * Math.PI }));
  const offs = [[0, 0], [15, 5], [5, 15]];
  return new Promise<void>((res, rej) => {
    const t0 = performance.now();
    const step = (now: number) => {
      if (s.aborted) return rej(new Skip());
      const t = Math.min(1, (now - t0) / ms);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      agents.forEach((a, i) => {
        const fl = f[Math.floor(i / 3)], o = offs[i % 3];
        const ang = fl.a0 + fl.spin * e, r = fl.r0 + (fl.r1 - fl.r0) * e;
        a.place(cx + Math.cos(ang) * r + o[0] + Math.sin(now / 180 + i) * 2, cy + Math.sin(ang) * r * 0.78 + o[1]);
      });
      onT?.(t);
      if (t < 1) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
}

/* ---------- intro ---------- */

export function runPreloader(opts: PreloaderOptions = {}): () => void {
  const accent = opts.accent ?? "#3B82F6";
  ensureStyle(accent);
  const roots = opts.roots ?? defaultRoots();
  if (!canAnimate() || !roots.length) { showAll(); opts.onDone?.(); return () => {}; }

  const ac = new AbortController(), s = ac.signal;
  const names = opts.names ?? NAMES;
  const nAgents = Math.min(opts.agents ?? 18, innerWidth < 768 ? 10 : 99); // fewer cursors on phones
  scrollTo(0, 0);
  const prevOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";

  const els = findTargets(roots, opts.maxTargets ?? 40);
  els.forEach(hide);
  document.documentElement.classList.remove("cp-pre"); // CSS cover handed over to the JS cover

  const cover = document.createElement("div"); cover.className = "cp-cover";
  const wash = document.createElement("div"); wash.className = "cp-wash";
  const layer = newLayer();
  const bar = document.createElement("div");
  bar.className = "cp-bar";
  bar.innerHTML = `<span class="cp-status">Scanning page…</span><span class="cp-prog"><i></i></span><span class="cp-sep"></span><span class="cp-av">${COLORS.slice(0, 5).map((c) => `<b style="background:${c}"></b>`).join("")}</span><span class="cp-count">${nAgents} agents · 0 / ${els.length} layers</span><span class="cp-sep"></span><span class="cp-ico"><svg viewBox="0 0 24 24"><path d="M5 5h14M12 5v14"/></svg>Text<b style="font-weight:600">1x</b><svg viewBox="0 0 24 24"><path d="M11 5L6 9H3v6h3l5 4zM16 9a4 4 0 010 6M19 6a8 8 0 010 12"/></svg></span><button class="cp-skip" type="button">Skip</button>`;
  document.body.append(wash, cover, bar);
  const status = bar.querySelector(".cp-status") as HTMLElement;
  const count = bar.querySelector(".cp-count") as HTMLElement;
  const prog = bar.querySelector(".cp-prog i") as HTMLElement;
  const badge = document.createElement("div");
  badge.className = "cp-badge";
  badge.textContent = opts.badge ?? "SK";
  document.body.appendChild(badge);
  bar.querySelector(".cp-skip")!.addEventListener("click", () => ac.abort());
  // + added: Esc skips the intro too
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") ac.abort(); };
  addEventListener("keydown", onKey);

  const cx = innerWidth / 2, cy = innerHeight / 2;
  const agents = Array.from({ length: nAgents }, (_, i) => new Agent(layer, COLORS[i % COLORS.length], undefined, cx, cy));
  const marks: HTMLElement[] = [];
  const boxes: HTMLElement[] = [];

  let done = false;
  const finish = () => {
    if (done) return; done = true;
    removeEventListener("keydown", onKey);
    showAll();
    document.documentElement.style.overflow = prevOverflow;
    [cover, wash, bar, layer, badge].forEach((n) => n.classList.add("cp-out"));
    setTimeout(() => [cover, wash, bar, layer, badge].forEach((n) => n.remove()), 650);
    opts.onDone?.();
  };

  (async () => {
    try {
      // 1. scan: flocks of 3 spiral in around the centre badge
      await orbit(agents, cx, cy, 1700, s, (t) => (prog.style.width = `${Math.round(t * 25)}%`));
      // 2. burst: the swarm explodes into "+" markers where the layers will go
      status.textContent = "Placing layers…";
      badge.classList.add("cp-out");
      agents.forEach((a) => a.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" }));
      await Promise.all(agents.map((a, i) => {
        const el = els[i % Math.max(1, els.length)];
        const r = el ? docRect(el) : { x: rand(0, innerWidth), y: rand(0, innerHeight) };
        return a.move(r.x + rand(-10, 10), r.y + rand(-10, 10), 320, s);
      }));
      els.forEach((el, i) => { const r = docRect(el); marks.push(plus(layer, r.x, r.y, COLORS[i % COLORS.length])); });
      for (let i = 0; i < 18; i++) marks.push(plus(layer, rand(20, innerWidth - 20), rand(20, innerHeight - 80), "#e5e7eb"));
      prog.style.width = "35%";
      await sleep(350, s);
      // 3. wireframe: cover lifts, grey skeleton boxes for every element
      status.textContent = "Wireframing…";
      agents.forEach((a, i) => {
        a.el.getAnimations().forEach((an) => an.cancel());
        a.place(a.x, a.y);
        if (names[i]) a.el.insertAdjacentHTML("beforeend", `<span class="cp-tag" style="background:${COLORS[i % COLORS.length]}">${names[i]}</span>`);
        a.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
      });
      cover.classList.add("cp-out");
      wash.style.opacity = "1";
      for (let i = 0; i < els.length; i++) { boxes.push(skeleton(layer, els[i])); await sleep(28, s); }
      marks.forEach((m) => m.remove());
      await sleep(300, s);
      // 4. build
      status.textContent = "Building…";
      wash.style.transition = "opacity 2.2s ease";
      wash.style.opacity = "0";
      let built = 0;
      await crew(agents, els, boxes, layer, s, () => { built++; count.textContent = `${nAgents} agents · ${built} / ${els.length} layers`; prog.style.width = `${35 + Math.round((built / els.length) * 65)}%`; });
      // + added: "publish" — a red light sweeps down the screen, status shows the live domain
      status.innerHTML = `<span class="cp-live">Live ✓</span> ${location.host}`;
      const sweep = document.createElement("div");
      sweep.className = "cp-sweep";
      document.body.appendChild(sweep);
      const swept = sweep.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: `translateY(${innerHeight}px)`, opacity: 0.2 }], { duration: 700, easing: "cubic-bezier(.6,0,.3,1)" });
      swept.finished.then(() => sweep.remove()).catch(() => sweep.remove());
      await Promise.all(agents.map((a, i) => a.move(i % 2 ? innerWidth + 40 : -40, a.y + rand(-100, 100), 600, s)));
    } catch { /* skipped */ }
    finish();
  })();

  return () => { ac.abort(); finish(); };
}

function defaultRoots(): HTMLElement[] {
  const header = document.querySelector<HTMLElement>("header");
  const hero = document.querySelector<HTMLElement>("#hero, #top, #home, main > section:first-of-type, section:first-of-type");
  return [header, hero].filter((x, i, a): x is HTMLElement => !!x && a.indexOf(x) === i && !(i === 1 && a[0]?.contains(x)));
}

/* ---------- sections build when scrolled into view ---------- */

export function watchSections(opts: { selector?: string; agents?: number; accent?: string; skip?: HTMLElement[] } = {}): () => void {
  ensureStyle(opts.accent ?? "#3B82F6");
  if (!canAnimate()) return () => {};
  const skip = new Set(opts.skip ?? defaultRoots());
  const secs = Array.from(document.querySelectorAll<HTMLElement>(opts.selector ?? "main section, [data-build-section]"))
    .filter((sec) => !skip.has(sec) && !Array.from(skip).some((k) => k.contains(sec)));
  const aborts: AbortController[] = [];

  // hide now (below the fold, so nobody sees it happen)
  const plan = new Map<HTMLElement, HTMLElement[]>();
  secs.forEach((sec) => {
    const r = sec.getBoundingClientRect();
    if (r.top < innerHeight) return; // already on screen: leave it alone
    const els = findTargets([sec], 18);
    els.forEach(hide);
    plan.set(sec, els);
  });

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const sec = e.target as HTMLElement;
      io.unobserve(sec);
      const els = plan.get(sec) ?? [];
      if (!els.length) continue;
      const ac = new AbortController(); aborts.push(ac);
      const layer = newLayer();
      const top = docRect(sec).y;
      const n = opts.agents ?? 4;
      const agents = Array.from({ length: n }, (_, i) => new Agent(layer, pick(COLORS), undefined, i % 2 ? innerWidth + 30 : -30, top + rand(0, 200)));
      (async () => {
        try {
          const boxes: HTMLElement[] = [];
          for (const el of els) { boxes.push(skeleton(layer, el)); await sleep(22, ac.signal); }
          await crew(agents, els, boxes, layer, ac.signal);
          await Promise.all(agents.map((a, i) => a.move(i % 2 ? innerWidth + 40 : -40, a.y, 500, ac.signal)));
        } catch { /* aborted */ }
        els.forEach(show);
        layer.remove();
      })();
    }
  }, { threshold: 0, rootMargin: "0px 0px -20% 0px" });
  plan.forEach((_, sec) => io.observe(sec));

  return () => { io.disconnect(); aborts.forEach((a) => a.abort()); plan.forEach((els) => els.forEach(show)); };
}
