"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Package,
  Image as ImageIcon,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  Globe,
  ChevronRight,
  Menu,
  X,
  Compass,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
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
    <div className="flex flex-col h-full bg-white select-none">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#059669] text-white flex items-center justify-center shadow-sm group-hover:bg-[#047857] transition-colors">
            <Compass size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[#111827] font-bold text-base tracking-tight leading-tight">
              PADMA Tours
            </div>
            <div className="text-[#6B7280] font-medium text-xs mt-0.5">
              Admin Control Panel
            </div>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
          aria-label="Close navigation menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-1 bg-white" aria-label="Admin Navigation">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
          Navigation
        </div>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact
            ? pathname === href
            : pathname?.startsWith(href) && href !== "/admin";
          const active = isActive;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                active
                  ? "bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] shadow-sm font-bold"
                  : "text-[#4B5563] hover:text-[#047857] hover:bg-[#F0FDF4] border border-transparent"
              }`}
              aria-current={active ? "page" : undefined}
              id={`admin-nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Icon
                size={19}
                className={active ? "text-[#059669]" : "text-[#6B7280] group-hover:text-[#059669]"}
              />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={16} className="text-[#059669]" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer: view site + user + logout */}
      <div className="border-t border-[#E5E7EB] p-4 flex flex-col gap-2.5 bg-[#F8FAFC]">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F0FDF4] hover:text-[#047857] hover:border-[#A7F3D0] transition-colors shadow-sm"
        >
          <Globe size={16} className="text-[#059669]" />
          <span>View Live Website</span>
        </a>

        {userEmail && (
          <div className="px-2 py-1">
            <div className="text-[11px] text-[#6B7280] font-medium truncate">
              Admin: <span className="text-[#111827] font-semibold">{userEmail}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          type="button"
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#FEE2E2] transition-colors cursor-pointer w-full text-left"
          id="admin-logout-btn"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#E5E7EB] px-4 h-16 flex items-center justify-between shadow-sm">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#059669] text-white flex items-center justify-center shadow-sm">
            <Compass size={18} />
          </div>
          <span className="font-bold text-[#111827] text-sm">PADMA Admin</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5E7EB] text-[#111827] bg-[#F8FAFC] hover:bg-[#F1F5F9] active:scale-95 transition-all text-xs font-bold"
          aria-label="Toggle admin navigation menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          <span>Menu</span>
        </button>
      </div>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] h-full bg-white flex flex-col shadow-2xl border-r border-[#E5E7EB]"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside
        className="hidden md:flex flex-shrink-0 flex-col bg-white border-r border-[#E5E7EB] min-h-screen sticky top-0 h-screen"
        style={{ width: 260 }}
        aria-label="Admin navigation"
      >
        {navContent}
      </aside>
    </>
  );
}
