"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Calendar, CheckCircle2, MessageCircle, ArrowRight, ShieldCheck } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917010111256";

const services = [
  {
    id: "daily-tours",
    title: "Daily Tours",
    badge: "Daily Departures",
    tagline: "Convenient same-day return circuits & pilgrim day trips",
    description:
      "Comfortable daily scheduled departures connecting Madurai to major spiritual and scenic destinations. Fixed daily timings, punctual pickup, and AC vehicle options.",
    highlights: [
      "Madurai to Rameswaram Day Tour",
      "Madurai to Kodaikanal One-Day Trip",
      "Madurai to Kanyakumari Sunrise/Sunset Tour",
      "Navagraha & Surrounding Temple Circuits",
    ],
    features: ["AC & Non-AC Fleet", "Doorstep Pickup & Drop", "Toll & Parking Included", "Experienced Drivers"],
    gradient: "from-[#0B4F4A] to-[#165B54]",
    accentColor: "#E8A838",
    waMessage: "Hi Padma Tours & Travels, I would like to enquire about your Daily Tour services.",
  },
  {
    id: "local-sightseeing",
    title: "Madurai Local Sightseeing",
    badge: "Heritage City Tour",
    tagline: "Explore the cultural soul of Tamil Nadu's Athens of the East",
    description:
      "Comprehensive guided local tours of historic Madurai. From the awe-inspiring Meenakshi Amman Temple to regal Nayakkar architecture and vibrant night markets.",
    highlights: [
      "Meenakshi Sundareswarar Temple Tour",
      "Thirumalai Nayakkar Mahal Light & Sound",
      "Gandhi Memorial Museum & Heritage Walk",
      "Alagar Kovil & Pazhamudhircholai",
      "Vandiyur Mariamman Teppakulam",
    ],
    features: ["Flexible Half-Day & Full-Day Options", "Local Cultural Insights", "Famous Food & Jigarthanda Stops", "Hassle-Free Parking"],
    gradient: "from-[#8B3A1C] to-[#D45C33]",
    accentColor: "#F4A261",
    waMessage: "Hi Padma Tours & Travels, I'm interested in booking a Madurai Local Sightseeing tour.",
  },
  {
    id: "package-tours",
    title: "Customized Package Tours",
    badge: "Tailor-Made Holidays",
    tagline: "End-to-end multi-day holiday packages across South India & beyond",
    description:
      "Bespoke holiday experiences designed specifically for your family, group, or honeymoon. We handle premium hotel stays, comfortable private transport, and curated itineraries.",
    highlights: [
      "Tamil Nadu Temple & Heritage Circuit (5D/4N)",
      "Kerala God's Own Country Explorer (Munnar, Thekkady, Alleppey)",
      "Ooty, Coonoor & Kodaikanal Hill Stations",
      "South India Grand Pilgrimage & Cultural Tour",
    ],
    features: ["Customized Day-by-Day Itinerary", "Verified Handpicked Hotels", "Dedicated 24/7 Tour Manager", "Transparent Pricing (No Hidden Fees)"],
    gradient: "from-[#0F3834] to-[#1F7A70]",
    accentColor: "#FBBF24",
    waMessage: "Hi Padma Tours & Travels, I would like to plan a Customized Package Tour for my upcoming holiday.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 relative overflow-hidden bg-cream" aria-labelledby="services-heading">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-secondary)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-site relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold tracking-widest uppercase mb-3"
          >
            <Clock size={13} />
            <span>What We Offer • Est. 2004</span>
          </motion.div>

          <motion.h2
            id="services-heading"
            className="display-lg text-[var(--color-text-primary)] mb-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Our Core <span className="italic text-[var(--color-primary)]">Services</span>
          </motion.h2>

          <motion.p
            className="body-lg text-[var(--color-text-secondary)] text-sm sm:text-base max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Over 20 years of delivering smooth, dependable, and memorable journeys from Madurai to all of South India. Available 24 hours every day.
          </motion.p>
        </div>

        {/* 3 Services Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(service.waMessage)}`;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex flex-col bg-white rounded-3xl border border-[var(--color-border)] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden group"
              >
                {/* Top header banner */}
                <div
                  className={`p-6 sm:p-7 text-white bg-gradient-to-br ${service.gradient} relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

                  <span
                    className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-3 bg-white/20 backdrop-blur-sm"
                    style={{ color: service.accentColor }}
                  >
                    {service.badge}
                  </span>

                  <h3 className="font-serif text-2xl font-bold mb-1 leading-tight">{service.title}</h3>
                  <p className="text-white/80 text-xs sm:text-sm font-medium">{service.tagline}</p>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Popular Routes / Highlights */}
                    <div className="mb-6">
                      <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] mb-3 flex items-center gap-1.5">
                        <MapPin size={14} className="text-[var(--color-primary)]" />
                        Popular Highlights:
                      </div>
                      <ul className="space-y-2">
                        {service.highlights.map((item) => (
                          <li key={item} className="text-xs sm:text-sm text-[var(--color-text-primary)] flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] mt-1.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key features */}
                    <div className="pt-4 border-t border-[var(--color-border)]">
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((feat) => (
                          <div key={feat} className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] font-medium">
                            <CheckCircle2 size={12} className="text-emerald-600 flex-shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[var(--color-border)] flex flex-col gap-2.5">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-2xl text-sm font-bold text-white shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                      }}
                      id={`book-${service.id}-cta`}
                    >
                      <MessageCircle size={16} />
                      Enquire / Book on WhatsApp
                    </a>

                    <a
                      href="tel:+919865987975"
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors py-1"
                    >
                      <span>Or call directly: +91 98659 87975</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 24/7 Guarantee Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 p-6 sm:p-8 rounded-3xl border border-[var(--color-border)] bg-gradient-to-r from-white via-[var(--color-surface-alt)] to-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-[var(--color-text-primary)]">
                24/7 Round-the-Clock Booking &amp; On-Road Support
              </h4>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                Need an immediate vehicle in Madurai or planning a family tour? Our coordinators are available 24 hours a day.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="tel:+919865987975"
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-sm"
            >
              Call +91 98659 87975
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Padma Tours & Travels, I need 24/7 travel assistance.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-[#25d366] text-white hover:bg-[#20b857] transition-all shadow-md flex items-center gap-2"
            >
              <MessageCircle size={15} />
              WhatsApp 24/7
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
