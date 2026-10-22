"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";

import { HOME_FAQS, type FaqItem } from "@/lib/faqs";

export { HOME_FAQS, type FaqItem };

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 sm:py-24 bg-[#FAF7F2] relative overflow-hidden" aria-labelledby="faq-heading">
      <div className="container-site max-w-4xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B4F4A]/10 text-[#0B4F4A] border border-[#0B4F4A]/15 text-xs font-bold tracking-widest uppercase mb-3">
            <HelpCircle size={13} />
            <span>Got Questions? • We Have Answers</span>
          </div>

          <h2 id="faq-heading" className="display-lg text-[#1A202C] mb-4">
            Frequently Asked <span className="italic text-[#0B4F4A]">Questions</span>
          </h2>

          <p className="body-lg text-[#4A5568] max-w-2xl mx-auto text-sm sm:text-base">
            Everything you need to know about planning, booking, and enjoying your journeys across Madurai and South India with PADMA TOURS &amp; TRAVELS.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {HOME_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden transition-all duration-200 hover:border-[#0B4F4A]/30"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-base sm:text-lg text-[#1A202C] hover:text-[#0B4F4A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4F4A]"
                  aria-expanded={isOpen}
                  id={`faq-btn-${index}`}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span>{faq.question}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "bg-[#0B4F4A] text-white rotate-180" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-btn-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-[#4A5568] leading-relaxed border-t border-gray-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Support Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B4F4A] to-[#165B54] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold">Have a specific question or custom route?</h3>
            <p className="text-white/80 text-xs sm:text-sm mt-1">Our Madurai travel desk is ready to help 24/7 with itinerary planning and instant cab quotes.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+919865987975"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0B4F4A] font-bold text-sm shadow hover:bg-gray-100 transition-all active:scale-95"
            >
              <Phone size={15} />
              <span>Call Us</span>
            </a>
            <a
              href="https://wa.me/917010111256?text=Hi%20Padma%20Tours%2C%20I%20have%20a%20question%20about%20your%20tours%20and%20cabs."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-sm shadow hover:bg-[#20ba5c] transition-all active:scale-95"
            >
              <MessageCircle size={15} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
