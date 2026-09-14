"use client";

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
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClientSupabaseClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <aside
      className="admin-sidebar flex-shrink-0 flex flex-col"
      style={{ width: 260 }}
      aria-label="Admin navigation"
    >
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/7">
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
          className="admin-nav-item text-red-400 hover:bg-red-500/10 hover:text-red-300"
          id="admin-logout-btn"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
