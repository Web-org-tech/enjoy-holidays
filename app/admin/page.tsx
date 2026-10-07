import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  Package,
  MessageSquare,
  Image as ImageIcon,
  Star,
  Plus,
  ArrowRight,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

async function getDashboardStats() {
  const supabase = await createServerSupabaseClient();

  const [packages, enquiries, gallery, testimonials] = await Promise.all([
    supabase.from("packages").select("id, name, status, slug, duration_days", { count: "exact" }),
    supabase.from("enquiries").select("id, name, phone, status, created_at, message, package_id", { count: "exact" }).order("created_at", { ascending: false }).limit(5),
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
    recentEnquiries: enquiries.data ?? [],
    recentPackages: packages.data?.slice(0, 4) ?? [],
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      icon: Package,
      label: "Total Tour Packages",
      value: stats.totalPackages,
      sub: `${stats.publishedPackages} published live`,
      trend: stats.publishedPackages > 0 ? "Active in catalog" : "Drafts only",
      href: "/admin/packages",
    },
    {
      icon: MessageSquare,
      label: "Customer Enquiries",
      value: stats.totalEnquiries,
      sub: `${stats.newEnquiries} received this week`,
      trend: stats.newEnquiries > 0 ? `+${stats.newEnquiries} recent` : "All caught up",
      href: "/admin/enquiries",
    },
    {
      icon: ImageIcon,
      label: "Media Gallery",
      value: stats.galleryItems,
      sub: "Photos & destination media",
      trend: "Visible on website",
      href: "/admin/gallery",
    },
    {
      icon: Star,
      label: "Customer Reviews",
      value: stats.publishedTestimonials,
      sub: "Verified testimonials",
      trend: "Social proof",
      href: "/admin/testimonials",
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight mb-1">
            Welcome back to PADMA Admin
          </h1>
          <p className="text-[#4B5563] text-sm">
            Manage your tour catalog, respond to customer enquiries, and update live website content.
          </p>
        </div>

        <Link
          href="/admin/packages/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] active:bg-[#065F46] shadow-sm transition-all"
          id="admin-new-package-top-btn"
        >
          <Plus size={16} />
          <span>Add New Package</span>
        </Link>
      </div>

      {/* Helpful Hint banner */}
      <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] flex items-center gap-3 shadow-sm">
        <div className="w-8 h-8 rounded-lg bg-[#D1FAE5] flex items-center justify-center shrink-0 text-[#059669]">
          <Sparkles size={16} />
        </div>
        <p className="text-xs sm:text-sm font-medium">
          <strong>Tip:</strong> Any update made in this admin panel reflects immediately on your live website. Click any box below to inspect details.
        </p>
      </div>

      {/* Stat Cards Grid — Minimal, clean white cards with Emerald accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map(({ icon: Icon, label, value, sub, trend, href }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl p-5 bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md hover:border-[#059669] transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Icon size={20} />
              </div>
              <span className="text-[11px] font-semibold text-[#047857] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                {trend}
              </span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#111827] tracking-tight mb-1">
                {value}
              </div>
              <div className="text-sm font-semibold text-[#374151]">{label}</div>
              <div className="text-xs text-[#6B7280] font-medium mt-0.5">{sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/admin/packages/new"
            className="p-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-between"
            id="admin-new-package-btn"
          >
            <span className="flex items-center gap-2">
              <Plus size={18} /> Add New Package
            </span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/admin/enquiries"
            className="p-4 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#059669] text-[#111827] font-semibold text-sm transition-all flex items-center justify-between shadow-sm group"
          >
            <span className="flex items-center gap-2 text-[#374151] group-hover:text-[#059669]">
              <MessageSquare size={18} className="text-[#059669]" /> View Enquiries
            </span>
            <ArrowRight size={16} className="text-[#9CA3AF] group-hover:text-[#059669]" />
          </Link>

          <Link
            href="/admin/gallery"
            className="p-4 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#059669] text-[#111827] font-semibold text-sm transition-all flex items-center justify-between shadow-sm group"
          >
            <span className="flex items-center gap-2 text-[#374151] group-hover:text-[#059669]">
              <ImageIcon size={18} className="text-[#059669]" /> Upload Photos
            </span>
            <ArrowRight size={16} className="text-[#9CA3AF] group-hover:text-[#059669]" />
          </Link>

          <Link
            href="/admin/settings"
            className="p-4 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#059669] text-[#111827] font-semibold text-sm transition-all flex items-center justify-between shadow-sm group"
          >
            <span className="flex items-center gap-2 text-[#374151] group-hover:text-[#059669]">
              <span className="text-[#059669]">⚙️</span> Settings &amp; WhatsApp
            </span>
            <ArrowRight size={16} className="text-[#9CA3AF] group-hover:text-[#059669]" />
          </Link>
        </div>
      </div>

      {/* Two-Column Overview: Recent Enquiries + Live Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enquiries (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#111827]">Recent Customer Enquiries</h2>
              <p className="text-xs text-[#6B7280]">Latest tour inquiries from customers</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-[#059669] hover:text-[#047857] flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-[#E5E7EB] flex-1">
            {stats.recentEnquiries.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#6B7280]">
                No customer enquiries recorded yet.
              </div>
            ) : (
              stats.recentEnquiries.map((enq: any) => (
                <div key={enq.id} className="p-4 sm:px-5 hover:bg-[#F8FAFC] transition-colors flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-[#111827] truncate">
                      {enq.name}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#6B7280] mt-0.5">
                      <span className="flex items-center gap-1">
                        <Phone size={12} className="text-[#059669]" /> {enq.phone}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(enq.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                    {enq.message && (
                      <p className="text-xs text-[#4B5563] truncate max-w-md mt-1">
                        &ldquo;{enq.message}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize border ${
                        enq.status === "new"
                          ? "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]"
                          : enq.status === "contacted"
                          ? "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]"
                          : enq.status === "converted"
                          ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                          : "bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]"
                      }`}
                    >
                      {enq.status}
                    </span>
                    <a
                      href={`tel:${enq.phone}`}
                      className="p-1.5 rounded-lg text-[#059669] hover:bg-[#ECFDF5] transition-colors"
                      title="Call customer"
                    >
                      <Phone size={14} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Website Status & Quick Preview (1 col) */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#059669] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Production Live</span>
            </div>
            <h3 className="text-lg font-bold text-[#111827] mb-1">
              PADMA TOURS &amp; TRAVELS
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Your customer-facing portal is published and accepting bookings. Changes to packages, galleries, and reviews sync in real-time.
            </p>

            <div className="mt-5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#6B7280]">Published Packages:</span>
                <span className="font-semibold text-[#111827]">{stats.publishedPackages} of {stats.totalPackages}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#6B7280]">Total Enquiries:</span>
                <span className="font-semibold text-[#111827]">{stats.totalEnquiries}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#6B7280]">Gallery Media:</span>
                <span className="font-semibold text-[#111827]">{stats.galleryItems} items</span>
              </div>
            </div>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-[#111827] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E5E7EB] hover:border-[#D1D5DB] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Visit Live Website</span>
            <ExternalLink size={14} className="text-[#059669]" />
          </a>
        </div>
      </div>
    </div>
  );
}
