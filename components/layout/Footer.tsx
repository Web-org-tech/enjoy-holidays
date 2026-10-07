"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Facebook, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

const footerLinks = {
  Explore: [
    { href: "/packages", label: "All Packages" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "Our Story" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/feedback", label: "Guest Feedback / Review" },
  ],
  Support: [
    { href: "/contact", label: "Contact Us" },
    { href: "/feedback", label: "Submit Feedback" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
};

const socialLinks = [
  { href: "https://wa.me/917010111256", icon: MessageCircle, label: "WhatsApp" },
  { href: "https://www.instagram.com/padma_tours_and_travels_?stkn=YTV1bmx2OGpkeXBy", icon: Instagram, label: "Instagram" },
  { href: "https://www.facebook.com/share/1CYGDUN1MB/?mibextid=wwXIfr", icon: Facebook, label: "Facebook" },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "var(--color-deep-teal)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Grain texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "200px",
          }}
        />
      </div>

      {/* Decorative top wave */}
      <div className="w-full overflow-hidden" style={{ height: 60 }}>
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,60 C240,20 480,60 720,30 C960,0 1200,40 1440,20 L1440,0 L0,0 Z"
            fill="#FAF7F2"
          />
        </svg>
      </div>

      <div className="container-site py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4" aria-label="Padma Tours and Travels Home">
              <BrandLogo variant="white" />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              Serving travelers since 2004 from Madurai. Specializing in daily tours, temple pilgrimages, local sightseeing, and customized package tours across South India &amp; beyond.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <Icon size={15} className="text-white/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="label text-[var(--color-secondary-light)] mb-4">{category}</h3>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-white/60 text-sm hover:text-white transition-colors duration-150 hover-underline"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <h3 className="label text-[var(--color-secondary-light)] mb-4">Contact</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="tel:+919865987975"
                  className="flex items-center gap-2.5 text-white/75 text-sm hover:text-white transition-colors"
                >
                  <Phone size={14} className="text-[var(--color-primary-light)] flex-shrink-0" />
                  +91 98659 87975
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/917010111256?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20a%20tour%21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[#25d366] text-sm hover:text-[#3ce87e] transition-colors"
                >
                  <MessageCircle size={14} className="flex-shrink-0" />
                  +91 70101 11256 (WhatsApp)
                </a>
              </li>
              <li>
                <a
                  href="mailto:nirmalharish1980@gmail.com"
                  className="flex items-center gap-2.5 text-white/75 text-sm hover:text-white transition-colors"
                >
                  <Mail size={14} className="text-[var(--color-primary-light)] flex-shrink-0" />
                  nirmalharish1980@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-white/75 text-sm">
                <MapPin size={14} className="text-[var(--color-primary-light)] flex-shrink-0 mt-0.5" />
                <span>No: B19/3 Racecourse Colony, Opp. Old Passport Office, Government Quarters, Madurai - 625002</span>
              </li>
            </ul>

            {/* Business Hours */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <p className="text-[var(--color-secondary-light)] text-xs font-semibold">⏰ 24 Hours Service Available</p>
              <p className="text-white/40 text-xs mt-0.5">Est. 2004 • Madurai, Tamil Nadu</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} PADMA TOURS &amp; TRAVELS. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Handcrafted travel experiences across Madurai, Tamil Nadu &amp; All India.
          </p>
        </div>
      </div>
    </footer>
  );
}
