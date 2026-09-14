"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isAdminRoute = pathname?.startsWith("/admin");
  if (isAdminRoute) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-[var(--color-border)]"
            : "bg-transparent"
        }`}
        style={{ height: "var(--nav-height)" }}
      >
        <div className="container-site h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="3" fill="white" />
                <path d="M10 2 L10 5 M10 15 L10 18 M2 10 L5 10 M15 10 L18 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M4.9 4.9 L6.8 6.8 M13.2 13.2 L15.1 15.1 M15.1 4.9 L13.2 6.8 M6.8 13.2 L4.9 15.1" stroke="white" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <span
                className={`font-serif text-xl font-bold leading-none block transition-colors duration-300 ${
                  scrolled ? "text-[var(--color-text-primary)]" : "text-white"
                }`}
              >
                ENJOY
              </span>
              <span
                className={`label text-[10px] tracking-widest leading-none transition-colors duration-300 ${
                  scrolled ? "text-[var(--color-primary)]" : "text-[var(--color-secondary-light)]"
                }`}
              >
                HOLIDAYS
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover-underline ${
                    isActive
                      ? scrolled
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--color-secondary-light)]"
                      : scrolled
                      ? "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA + Mobile menu button */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20a%20holiday%20package%21`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)" }}
              id="nav-enquire-cta"
            >
              <Phone size={14} />
              Enquire Now
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${
                scrolled
                  ? "text-[var(--color-text-primary)] hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              id="mobile-menu-toggle"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-[72px] left-0 right-0 z-40 glass-card mx-4 rounded-2xl overflow-hidden shadow-xl"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-150 ${
                        isActive
                          ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                          : "text-[var(--color-text-secondary)] hover:bg-gray-50 hover:text-[var(--color-primary)]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="pt-2 mt-2 border-t border-[var(--color-border)]">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20a%20holiday%20package%21`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl text-sm font-bold text-white shadow-md"
                  style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)" }}
                >
                  <Phone size={14} />
                  Enquire on WhatsApp
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
