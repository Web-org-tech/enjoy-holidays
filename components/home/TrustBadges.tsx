"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Award, Users, Star, Clock, MapPin } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const badges = [
  {
    icon: Clock,
    value: "20+",
    label: "Years Experience",
    description: "Serving since 2004",
    color: "from-teal-700 to-teal-600",
  },
  {
    icon: Users,
    value: "10k+",
    label: "Happy Travellers",
    description: "Families & groups",
    color: "from-terracotta-600 to-terracotta-500",
  },
  {
    icon: Star,
    value: "4.9★",
    label: "Average Rating",
    description: "Across all reviews",
    color: "from-amber-600 to-amber-500",
  },
  {
    icon: Shield,
    value: "24/7",
    label: "Available Always",
    description: "Round-the-clock service",
    color: "from-teal-600 to-teal-500",
  },
  {
    icon: MapPin,
    value: "Madurai",
    label: "Local Sightseeing",
    description: "& Daily tour circuits",
    color: "from-terracotta-700 to-terracotta-600",
  },
  {
    icon: Award,
    value: "100%",
    label: "Verified & Safe",
    description: "Expert local drivers",
    color: "from-amber-700 to-amber-600",
  },
];

export default function TrustBadges() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-16"
      style={{ background: "var(--color-deep-teal)" }}
      aria-labelledby="trust-heading"
    >
      {/* Section label */}
      <div className="container-site mb-10 text-center">
        <span className="label text-[var(--color-secondary-light)] mb-2 block">
          ✦ Why Travellers Choose Us
        </span>
        <h2
          id="trust-heading"
          className="display-lg text-white"
        >
          Trusted by Thousands of{" "}
          <span className="italic text-[var(--color-secondary-light)]">Happy Travellers</span>
        </h2>
      </div>

      <div className="container-site grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {badges.map(({ icon: Icon, value, label, description, color }, i) => (
          <motion.div
            key={label}
            className="flex flex-col items-center text-center p-5 rounded-2xl group cursor-default"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon size={20} className="text-white" />
            </div>
            <div
              className="font-serif text-2xl font-bold text-white mb-0.5"
            >
              {value === "Madurai" ? (
                value
              ) : (
                <AnimatedCounter value={value} duration={2000} />
              )}
            </div>
            <div className="text-white/90 text-xs font-semibold leading-tight mb-0.5">
              {label}
            </div>
            <div className="text-white/40 text-[11px] leading-tight">{description}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
