"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import ContactModal, { type ContactView } from "./ContactModal";
import SmoothScroll from "./SmoothScroll";

type UI = {
  openContact: (view?: ContactView) => void;
  toast: (message: string) => void;
};

const UIContext = createContext<UI | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <Providers>");
  return ctx;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [contact, setContact] = useState<{ open: boolean; view: ContactView }>({ open: false, view: "info" });
  const [toastMsg, setToastMsg] = useState<{ id: number; text: string } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const openContact = useCallback((view: ContactView = "info") => setContact({ open: true, view }), []);
  const closeContact = useCallback(() => setContact((c) => ({ ...c, open: false })), []);
  const setView = useCallback((view: ContactView) => setContact((c) => ({ ...c, view })), []);

  const toast = useCallback((text: string) => {
    window.clearTimeout(timer.current);
    setToastMsg({ id: Date.now(), text });
    timer.current = window.setTimeout(() => setToastMsg(null), 2800);
  }, []);

  // Tell the cursor preloader the whole page has hydrated, so it never hides
  // elements React is still attaching to (that caused hydration warnings).
  useEffect(() => {
    document.documentElement.dataset.appReady = "1";
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <UIContext.Provider value={{ openContact, toast }}>
        <SmoothScroll />
        {children}
        <ContactModal open={contact.open} view={contact.view} onView={setView} onClose={closeContact} />
        <div data-build-skip aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[95] flex justify-center px-4">
          <AnimatePresence>
            {toastMsg && (
              <motion.div
                key={toastMsg.id}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-[#111]/95 px-5 py-3 text-sm text-paper shadow-2xl backdrop-blur"
              >
                <CheckCircle2 size={16} className="text-red-hot" />
                {toastMsg.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </UIContext.Provider>
    </MotionConfig>
  );
}
