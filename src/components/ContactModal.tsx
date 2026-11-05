"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Clock, Copy, Download, FileText, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { GithubIcon, InstagramIcon, LinkedinIcon, WhatsappIcon } from "./icons";
import Modal from "./Modal";
import { useUI } from "./Providers";

export type ContactView = "info" | "form";

const TITLE_ID = "contact-modal-title";

export default function ContactModal({
  open,
  view,
  onView,
  onClose,
}: {
  open: boolean;
  view: ContactView;
  onView: (v: ContactView) => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} labelledBy={TITLE_ID} panelClassName="max-w-2xl">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          initial={{ opacity: 0, x: view === "form" ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: view === "form" ? -30 : 30 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="p-5 pt-8 sm:p-9"
        >
          {view === "info" ? (
            <InfoView onSend={() => onView("form")} />
          ) : (
            <FormView onBack={() => onView("info")} onDone={onClose} />
          )}
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
}

function Heading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-7 pr-12">
      <p className="label mb-3 flex items-center gap-3">
        <span className="h-px w-6 bg-red" /> {kicker}
      </p>
      <h2 id={TITLE_ID} className="display text-[clamp(2.8rem,8vw,4rem)] text-paper">
        {title}
        <span className="text-red">.</span>
      </h2>
    </div>
  );
}

function Card({ icon, label, value, children }: { icon: React.ReactNode; label: string; value: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red/15 text-red-hot">{icon}</span>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.16em] text-mute">{label}</p>
          <p className="mt-0.5 truncate text-sm text-paper">{value}</p>
        </div>
      </div>
      {children && <div className="mt-4 flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

const chip =
  "inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-paper transition-colors hover:border-red hover:bg-red";

function InfoView({ onSend }: { onSend: () => void }) {
  const { toast } = useUI();
  const time = useClock(site.timezone);

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(`${what} copied`);
    } catch {
      toast("Couldn't copy — please copy it manually");
    }
  };

  return (
    <>
      <Heading kicker="Get in touch" title="Let's talk" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Card icon={<Mail size={16} />} label="Email" value={site.email}>
          <a href={`mailto:${site.email}`} className={chip}>
            <Mail size={13} /> Write email
          </a>
          <button type="button" onClick={() => copy(site.email, "Email")} className={chip}>
            <Copy size={13} /> Copy
          </button>
        </Card>

        <Card icon={<Phone size={16} />} label="Phone / WhatsApp" value={site.phone}>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={chip}>
            <Phone size={13} /> Call
          </a>
          <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className={chip}>
            <WhatsappIcon size={13} /> WhatsApp
          </a>
          <button type="button" onClick={() => copy(site.phone, "Phone number")} className={chip}>
            <Copy size={13} /> Copy
          </button>
        </Card>

        <Card icon={<FileText size={16} />} label="Resume" value="PDF · latest">
          <a href={site.resumeUrl} target="_blank" rel="noopener noreferrer" className={chip}>
            <FileText size={13} /> View
          </a>
          <a href={site.resumeUrl} download className={chip}>
            <Download size={13} /> Download
          </a>
        </Card>

        <Card icon={<GithubIcon size={16} />} label="GitHub" value={site.githubLabel}>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className={chip}>
            <GithubIcon size={13} /> Open GitHub
          </a>
        </Card>

        <Card icon={<LinkedinIcon size={15} />} label="Social" value="Say hi anywhere">
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={chip}>
            <LinkedinIcon size={13} /> LinkedIn
          </a>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className={chip}>
            <InstagramIcon size={13} /> Instagram
          </a>
        </Card>

        <Card icon={<MapPin size={16} />} label="Location" value={site.location}>
          <span className="inline-flex items-center gap-1.5 text-xs text-mute">
            <Clock size={13} className="text-red-hot" />
            <span className="tabular-nums text-paper">{time ?? "--:--:--"}</span> IST · local time
          </span>
        </Card>
      </div>

      <button type="button" onClick={onSend} className="btn btn-red mt-6 w-full py-4 text-base" data-cursor="Write">
        <Send size={17} /> Send a message
      </button>
    </>
  );
}

const topics = ["A job", "A project", "Just hello"] as const;

function FormView({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const { toast } = useUI();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      form.reset();
      setStatus("idle");
      toast("Message sent — I'll reply soon!");
      onDone();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const field =
    "mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-paper placeholder:text-mute/60 transition-colors focus:border-red focus:outline-none";

  return (
    <>
      <Heading kicker="Write to me" title="Send a message" />
      <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-xs uppercase tracking-[0.14em] text-mute">
            Name
            <input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" className={field} />
          </label>
          <label className="block text-xs uppercase tracking-[0.14em] text-mute">
            Email
            <input
              name="email"
              type="email"
              required
              maxLength={200}
              autoComplete="email"
              placeholder="you@example.com"
              className={field}
            />
          </label>
        </div>

        <fieldset>
          <legend className="text-xs uppercase tracking-[0.14em] text-mute">What is it about?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {topics.map((t, i) => (
              <label key={t} className="cursor-pointer">
                <input type="radio" name="topic" value={t} defaultChecked={i === 1} className="peer sr-only" />
                <span className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-mute transition-colors peer-checked:border-red peer-checked:bg-red peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-red-hot hover:text-paper">
                  {t}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block text-xs uppercase tracking-[0.14em] text-mute">
          Message
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={4000}
            rows={5}
            placeholder="Tell me a little about it…"
            className={`${field} resize-none normal-case tracking-normal`}
          />
        </label>

        {/* Honeypot for bots — hidden from people */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        {status === "error" && (
          <p role="alert" className="rounded-lg border border-red/40 bg-red/10 px-4 py-3 text-sm text-red-hot">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onBack} className="btn btn-ghost">
            <ArrowLeft size={16} /> Back
          </button>
          <button type="submit" disabled={status === "sending"} className="btn btn-red flex-1 disabled:opacity-60">
            {status === "sending" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {status === "sending" ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </>
  );
}

function useClock(timeZone: string) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return time;
}
