"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Package, Image, Users, Phone } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home, id: "bottom-nav-home" },
  { href: "/packages", label: "Packages", icon: Package, id: "bottom-nav-packages" },
  { href: "/gallery", label: "Gallery", icon: Image, id: "bottom-nav-gallery" },
  { href: "/about", label: "About", icon: Users, id: "bottom-nav-about" },
  { href: "/contact", label: "Enquire", icon: Phone, id: "bottom-nav-contact" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith("/admin");
  if (isAdminRoute) return null;

  return (
    <nav
      className="bottom-nav md:hidden"
      aria-label="Mobile navigation"
      role="navigation"
    >
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map(({ href, label, icon: Icon, id }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname?.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              id={id}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl group relative"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "rgba(212, 92, 51, 0.1)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}

              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -1 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.75}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]"
                  }`}
                />
              </motion.div>

              <span
                className={`text-[10px] font-semibold leading-none transition-colors duration-200 ${
                  isActive
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
