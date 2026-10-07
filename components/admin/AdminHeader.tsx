"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Shield, ExternalLink } from "lucide-react";

interface AdminHeaderProps {
  userEmail?: string;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/admin": {
    title: "Dashboard",
    subtitle: "Overview of bookings, catalog, and performance",
  },
  "/admin/packages": {
    title: "Tour Packages",
    subtitle: "Manage itineraries, pricing, and package visibility",
  },
  "/admin/packages/new": {
    title: "Create Package",
    subtitle: "Build a new handcrafted tour itinerary",
  },
  "/admin/gallery": {
    title: "Media Gallery",
    subtitle: "Upload and organize photos and destination videos",
  },
  "/admin/enquiries": {
    title: "Customer Enquiries",
    subtitle: "Track booking requests and quick-contact travellers",
  },
  "/admin/testimonials": {
    title: "Reviews & Testimonials",
    subtitle: "Moderate feedback and manage customer testimonials",
  },
  "/admin/settings": {
    title: "Site Settings",
    subtitle: "Configure contact numbers, WhatsApp, and hero banner",
  },
};

export default function AdminHeader({ userEmail }: AdminHeaderProps) {
  const pathname = usePathname();

  // Find matching title or default
  let currentMeta = pageTitles[pathname];
  if (!currentMeta) {
    if (pathname.startsWith("/admin/packages/")) {
      currentMeta = {
        title: "Edit Package",
        subtitle: "Modify package itinerary, pricing, and media",
      };
    } else {
      currentMeta = {
        title: "Admin Panel",
        subtitle: "PADMA Tours & Travels Management",
      };
    }
  }

  return (
    <header className="hidden md:flex h-16 bg-white border-b border-[#E5E7EB] px-6 lg:px-8 items-center justify-between sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Left: Section Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xs text-[#6B7280] font-medium">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#059669] font-semibold">{currentMeta.title}</span>
          </div>
          <h1 className="text-base font-bold text-[#111827] leading-tight">
            {currentMeta.title}
          </h1>
        </div>
      </div>

      {/* Right: Quick actions and Admin Profile */}
      <div className="flex items-center gap-3">
        {/* System Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>Live Sync Active</span>
        </div>

        {/* View Live Site Link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] hover:text-[#111827] hover:border-[#D1D5DB] transition-all shadow-sm"
          title="Open live customer website in new tab"
        >
          <Globe size={14} className="text-[#059669]" />
          <span>View Website</span>
          <ExternalLink size={12} className="text-[#9CA3AF]" />
        </a>

        {/* User Pill */}
        {userEmail && (
          <div className="flex items-center gap-2 pl-3 border-l border-[#E5E7EB]">
            <div className="w-8 h-8 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] flex items-center justify-center font-bold text-xs uppercase">
              {userEmail.charAt(0)}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#111827] truncate max-w-[150px]">
                {userEmail}
              </span>
              <span className="text-[10px] text-[#6B7280] font-medium flex items-center gap-1">
                <Shield size={10} className="text-[#059669]" /> Administrator
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
