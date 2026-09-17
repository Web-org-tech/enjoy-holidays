"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Package,
  Image,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  Globe,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

interface AdminSidebarProps {
  userEmail?: string;
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClientSupabaseClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const navContent = (
    <>
      {/* Brand */}
      <div className="px-5 py-6 border-b border-white/7 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" fill="white" />
              <path d="M10 2 L10 5 M10 15 L10 18 M2 10 L5 10 M15 10 L18 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-none">ENJOY Holidays</div>
            <div className="text-white/40 text-[10px] mt-0.5">Admin Panel</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-white/50 hover:text-white"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 overflow-y-auto" aria-label="Admin sections">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname?.startsWith(href) && href !== "/admin";
          const strictActive = exact && pathname === href;
          const active = exact ? strictActive : isActive;

          return (
            <Link
              key={href}
              href={href}
              className={`admin-nav-item ${active ? "active" : ""}`}
              aria-current={active ? "page" : undefined}
              id={`admin-nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Icon size={17} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={13} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer: view site + logout */}
      <div className="border-t border-white/7 p-4 flex flex-col gap-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-nav-item text-xs"
        >
          <Globe size={15} />
          View Live Site
        </a>

        {userEmail && (
          <div className="px-4 py-2">
            <div className="text-white/30 text-[10px] truncate">{userEmail}</div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="admin-nav-item text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
          id="admin-logout-btn"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0c101a] border-b border-white/10 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" fill="white" />
              <path d="M10 2 L10 5 M10 15 L10 18 M2 10 L5 10 M15 10 L18 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-bold text-white text-xs">ENJOY Admin</span>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-white/70 hover:text-white"
          aria-label="Toggle admin navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-72 h-full bg-[#0a0d14] flex flex-col shadow-2xl border-r border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside
        className="hidden md:flex admin-sidebar flex-shrink-0 flex-col"
        style={{ width: 260 }}
        aria-label="Admin navigation"
      >
        {navContent}
      </aside>
    </>
  );
}

