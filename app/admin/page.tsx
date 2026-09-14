import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Package, MessageSquare, Image, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

async function getDashboardStats() {
  const supabase = await createServerSupabaseClient();

  const [packages, enquiries, gallery, testimonials] = await Promise.all([
    supabase.from("packages").select("id, status", { count: "exact" }),
    supabase.from("enquiries").select("id, status, created_at", { count: "exact" }),
    supabase.from("gallery_items").select("id", { count: "exact" }),
    supabase.from("testimonials").select("id, is_published", { count: "exact" }),
  ]);

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const newEnquiries = enquiries.data?.filter(
    (e) => new Date(e.created_at) > weekAgo
  ).length ?? 0;

  return {
    totalPackages: packages.count ?? 0,
    publishedPackages: packages.data?.filter((p) => p.status === "published").length ?? 0,
    totalEnquiries: enquiries.count ?? 0,
    newEnquiries,
    galleryItems: gallery.count ?? 0,
    publishedTestimonials: testimonials.data?.filter((t) => t.is_published).length ?? 0,
    recentEnquiries: enquiries.data?.slice(0, 5) ?? [],
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      icon: Package,
      label: "Total Packages",
      value: stats.totalPackages,
      sub: `${stats.publishedPackages} published`,
      href: "/admin/packages",
      color: "from-terracotta-600 to-terracotta-500",
    },
    {
      icon: MessageSquare,
      label: "Enquiries This Week",
      value: stats.newEnquiries,
      sub: `${stats.totalEnquiries} total`,
      href: "/admin/enquiries",
      color: "from-teal-700 to-teal-600",
    },
    {
      icon: Image,
      label: "Gallery Items",
      value: stats.galleryItems,
      sub: "Photos & videos",
      href: "/admin/gallery",
      color: "from-amber-600 to-amber-500",
    },
    {
      icon: Star,
      label: "Testimonials",
      value: stats.publishedTestimonials,
      sub: "Published reviews",
      href: "/admin/testimonials",
      color: "from-terracotta-700 to-amber-600",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-white/40 text-sm">Welcome back. Here&apos;s what&apos;s happening with ENJOY Holidays.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map(({ icon: Icon, label, value, sub, href, color }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl p-5 group hover:scale-105 transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-md`}>
              <Icon size={18} className="text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-0.5">{value}</div>
            <div className="text-xs font-semibold text-white/70">{label}</div>
            <div className="text-[11px] text-white/30 mt-0.5">{sub}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-white/50 mb-4 uppercase tracking-wider">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/packages/new"
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)" }}
            id="admin-new-package-btn"
          >
            + New Package
          </Link>
          <Link href="/admin/gallery" className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            Upload to Gallery
          </Link>
          <Link href="/admin/enquiries" className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            View Enquiries
          </Link>
          <Link href="/admin/settings" className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            Site Settings
          </Link>
        </div>
      </div>

      {/* Site preview link */}
      <div className="rounded-2xl p-5 flex items-center justify-between" style={{ background: "rgba(212,92,51,0.06)", border: "1px solid rgba(212,92,51,0.15)" }}>
        <div>
          <div className="text-white font-semibold text-sm mb-0.5">Your website is live ✨</div>
          <div className="text-white/40 text-xs">Changes made here are reflected immediately on the public site.</div>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-all"
        >
          Preview →
        </a>
      </div>
    </div>
  );
}
