"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/feedback", label: "Feedback" },
];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917010111256";

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
          <Link href="/" aria-label="Padma Tours and Travels Home">
            <BrandLogo scrolled={scrolled} />
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Direct Call Button */}
            <a
              href="tel:+919865987975"
              className={`hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 active:scale-95 shadow-sm ${
                scrolled
                  ? "border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                  : "border-2 border-white/80 text-white hover:bg-white hover:text-[#0B4F4A] backdrop-blur-sm"
              }`}
              id="nav-call-cta"
              aria-label="Call Padma Tours"
            >
              <Phone size={14} />
              <span>Call</span>
            </a>

            {/* Desktop WhatsApp Enquiry */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20a%20holiday%20package%21`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)" }}
              id="nav-enquire-cta"
            >
              <MessageCircle size={15} />
              Enquire Now
            </a>

            {/* Mobile Call Button (Always accessible without opening menu) */}
            <a
              href="tel:+919865987975"
              className="md:hidden flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#D45C33] text-white shadow-sm active:scale-95 transition-transform"
              id="mobile-nav-call-cta"
              aria-label="Direct Call"
            >
              <Phone size={12} />
              <span>Call</span>
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
              <div className="pt-2 mt-2 border-t border-[var(--color-border)] flex flex-col gap-2">
                <a
                  href="tel:+919865987975"
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl text-sm font-bold border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/5"
                  id="mobile-drawer-call-btn"
                >
                  <Phone size={15} />
                  Call
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20a%20holiday%20package%21`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl text-sm font-bold text-white shadow-md"
                  style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)" }}
                >
                  <MessageCircle size={15} />
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
