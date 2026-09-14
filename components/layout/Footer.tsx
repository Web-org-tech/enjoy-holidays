import Link from "next/link";
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin } from "lucide-react";

const footerLinks = {
  Explore: [
    { href: "/packages", label: "All Packages" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "Our Story" },
    { href: "/testimonials", label: "Testimonials" },
  ],
  Support: [
    { href: "/contact", label: "Contact Us" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
};

const socialLinks = [
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
];

export default function Footer() {
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
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center shadow-md">
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="3" fill="white" />
                  <path d="M10 2 L10 5 M10 15 L10 18 M2 10 L5 10 M15 10 L18 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M4.9 4.9 L6.8 6.8 M13.2 13.2 L15.1 15.1 M15.1 4.9 L13.2 6.8 M6.8 13.2 L4.9 15.1" stroke="white" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-white leading-none block">ENJOY</span>
                <span className="label text-[10px] text-[var(--color-secondary-light)] tracking-widest leading-none">HOLIDAYS</span>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              We craft unforgettable journeys across India&apos;s most stunning landscapes. Every trip is a handcrafted story, not a package deal.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={href}
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
                  href="tel:+919999999999"
                  className="flex items-center gap-2.5 text-white/60 text-sm hover:text-white transition-colors"
                >
                  <Phone size={14} className="text-[var(--color-primary-light)] flex-shrink-0" />
                  +91 99999 99999
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@enjoyholidays.in"
                  className="flex items-center gap-2.5 text-white/60 text-sm hover:text-white transition-colors"
                >
                  <Mail size={14} className="text-[var(--color-primary-light)] flex-shrink-0" />
                  hello@enjoyholidays.in
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-white/60 text-sm">
                <MapPin size={14} className="text-[var(--color-primary-light)] flex-shrink-0 mt-0.5" />
                <span>123 Travel Lane, Kochi, Kerala — 682001</span>
              </li>
            </ul>

            {/* GST / Registration */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <p className="text-white/40 text-xs">GST: 29ABCDE1234F1Z5</p>
              <p className="text-white/40 text-xs mt-0.5">IATA Accredited Agent</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} ENJOY Holidays. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Prices include GST unless stated otherwise. Subject to availability.
          </p>
        </div>
      </div>
    </footer>
  );
}
