import type { PackageCardData } from "@/lib/supabase/types";
import Link from "next/link";
import Image from "next/image";
import { Clock, Users, MapPin, ArrowRight, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import Badge from "@/components/ui/Badge";

interface PackageCardProps {
  pkg: PackageCardData;
  priority?: boolean;
}

export default function PackageCard({ pkg, priority = false }: PackageCardProps) {
  const waUrl = buildWhatsAppUrl({ packageName: pkg.name });

  return (
    <article
      className="group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
      style={{ border: "1px solid var(--color-border)" }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100 flex-shrink-0">
        {pkg.hero_image_url ? (
          <Image
            src={pkg.hero_image_url}
            alt={`${pkg.name} holiday package`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-terracotta-100 to-amber-100 flex items-center justify-center">
            <MapPin size={32} className="text-terracotta-300" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Duration badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="white" size="sm">
            <Clock size={10} className="mr-0.5" />
            {pkg.duration_days}D/{pkg.duration_nights}N
          </Badge>
        </div>

        {/* Destination pill at bottom-left */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
          {pkg.destinations.slice(0, 2).map((dest) => (
            <Badge key={dest} variant="white" size="sm">
              {dest}
            </Badge>
          ))}
          {pkg.destinations.length > 2 && (
            <Badge variant="white" size="sm">+{pkg.destinations.length - 2}</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={12} className="text-[var(--color-primary)] flex-shrink-0" />
          <span className="text-xs text-[var(--color-text-muted)] font-medium truncate">
            {pkg.destinations.join(" · ")}
          </span>
        </div>

        <h3 className="display-md text-[var(--color-text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors duration-200">
          {pkg.name}
        </h3>

        <p className="body-sm text-[var(--color-text-muted)] mb-4 line-clamp-2 flex-1">
          {pkg.summary}
        </p>

        {/* Pax + price row */}
        <div className="flex items-center justify-between mb-4 pt-3 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <Users size={12} />
            <span>Up to {pkg.pax_capacity} pax</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-[var(--color-text-muted)] leading-none">Starting from</div>
            <div className="font-bold text-lg text-[var(--color-primary)] leading-tight">
              ₹{pkg.price_with_food.toLocaleString("en-IN")}
              <span className="text-xs font-normal text-[var(--color-text-muted)]">/person</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-2">
          <Link
            href={`/packages/${pkg.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:brightness-110 active:brightness-90"
            style={{
              background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            }}
            id={`pkg-view-${pkg.slug}`}
          >
            View Package
            <ArrowRight size={14} />
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2.5 rounded-xl bg-[#25d366] text-white transition-all duration-200 hover:bg-[#1da853] active:scale-95"
            aria-label={`Enquire about ${pkg.name} on WhatsApp`}
            id={`pkg-wa-${pkg.slug}`}
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}
