"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface StickyEnquireCTAProps {
  packageName: string;
  waUrl: string;
}

export default function StickyEnquireCTA({ packageName, waUrl }: StickyEnquireCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-[72px] md:bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
          aria-label="Sticky enquiry CTA"
        >
          <div className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl max-w-sm w-full md:w-auto"
            style={{ background: "white", border: "1px solid var(--color-border)" }}
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[var(--color-text-muted)]">Enquiring about</div>
              <div className="font-semibold text-sm text-[var(--color-text-primary)] truncate">{packageName}</div>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25d366] text-white font-bold text-sm whitespace-nowrap hover:bg-[#1da853] transition-colors"
              id="sticky-enquire-cta"
            >
              <MessageCircle size={14} />
              Enquire
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
