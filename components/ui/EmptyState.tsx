import { ReactNode } from "react";
import Link from "next/link";
import { MapPin, Package, Image as ImageIcon } from "lucide-react";

type EmptyStatePreset = "packages" | "gallery" | "enquiries" | "testimonials" | "general";

interface EmptyStateProps {
  preset?: EmptyStatePreset;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: ReactNode;
  className?: string;
}

const presets: Record<EmptyStatePreset, { title: string; description: string; actionLabel: string; actionHref: string; icon: ReactNode }> = {
  packages: {
    title: "No packages found",
    description: "Try adjusting your filters or explore all our available destinations.",
    actionLabel: "Browse All Packages",
    actionHref: "/packages",
    icon: <Package size={40} className="text-[var(--color-primary-light)]" />,
  },
  gallery: {
    title: "No photos yet",
    description: "Our gallery is being curated. Check back soon for stunning travel photos.",
    actionLabel: "Explore Packages",
    actionHref: "/packages",
    icon: <ImageIcon size={40} className="text-[var(--color-primary-light)]" />,
  },
  enquiries: {
    title: "No enquiries yet",
    description: "Enquiries submitted via the contact form will appear here.",
    actionLabel: "View Site Settings",
    actionHref: "/admin/settings",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="var(--color-primary-light)" strokeWidth="1.5" />
        <path d="M14 18 C14 14 26 14 26 18 C26 23 20 22 20 26" stroke="var(--color-primary-light)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="30" r="1.5" fill="var(--color-primary-light)" />
      </svg>
    ),
  },
  testimonials: {
    title: "No testimonials yet",
    description: "Add your first customer review to build trust with future travellers.",
    actionLabel: "Add Testimonial",
    actionHref: "/admin/testimonials",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M8 18 C8 12 16 12 16 18 L16 22 L8 22 Z" stroke="var(--color-primary-light)" strokeWidth="1.5" />
        <path d="M20 18 C20 12 28 12 28 18 L28 22 L20 22 Z" stroke="var(--color-primary-light)" strokeWidth="1.5" />
      </svg>
    ),
  },
  general: {
    title: "This trail doesn't exist",
    description: "The page or content you're looking for couldn't be found.",
    actionLabel: "Go Home",
    actionHref: "/",
    icon: <MapPin size={40} className="text-[var(--color-primary-light)]" />,
  },
};

export default function EmptyState({
  preset = "general",
  title,
  description,
  actionLabel,
  actionHref,
  icon,
  className = "",
}: EmptyStateProps) {
  const config = presets[preset];
  const resolvedTitle = title ?? config.title;
  const resolvedDesc = description ?? config.description;
  const resolvedActionLabel = actionLabel ?? config.actionLabel;
  const resolvedActionHref = actionHref ?? config.actionHref;
  const resolvedIcon = icon ?? config.icon;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-20 px-8 ${className}`}
      role="status"
      aria-label={resolvedTitle}
    >
      {/* Illustrated icon area */}
      <div className="relative mb-6">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: "var(--color-primary)/5", border: "2px dashed var(--color-border)" }}
        >
          {resolvedIcon}
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-[var(--color-secondary)]/40" />
        <div className="absolute -bottom-1 -left-3 w-2 h-2 rounded-full bg-[var(--color-primary)]/30" />
      </div>

      <h3 className="display-md mb-2" style={{ color: "var(--color-text-primary)" }}>
        {resolvedTitle}
      </h3>
      <p className="body-md max-w-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
        {resolvedDesc}
      </p>

      {resolvedActionHref && (
        <Link
          href={resolvedActionHref}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all duration-200 hover:scale-105 shadow-md"
          style={{
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
          }}
        >
          {resolvedActionLabel}
        </Link>
      )}
    </div>
  );
}
