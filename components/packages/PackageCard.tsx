import type { PackageCardData } from "@/lib/supabase/types";
import Link from "next/link";
import Image from "next/image";
import { Clock, Users, MapPin, ArrowRight, MessageCircle, Sparkles, Utensils, Car, Ship, Train, Bike } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import Badge from "@/components/ui/Badge";

interface PackageCardProps {
  pkg: PackageCardData;
  priority?: boolean;
}

function getVehicleInfo(type?: string) {
  switch (type?.toLowerCase()) {
    case "boat":
    case "houseboat":
      return { icon: Ship, label: "Houseboat Cruise" };
    case "train":
      return { icon: Train, label: "Scenic Train" };
    case "bike":
      return { icon: Bike, label: "Motorcycle" };
    case "tuk-tuk":
      return { icon: Car, label: "Heritage Tuk-Tuk" };
    case "jeep":
    default:
      return { icon: Car, label: "Private Chauffeur" };
  }
}

export default function PackageCard({ pkg, priority = false }: PackageCardProps) {
  const waUrl = buildWhatsAppUrl({ packageName: pkg.name });
  const vehicle = getVehicleInfo(pkg.vehicle_type);
  const VehicleIcon = vehicle.icon;

  return (
    <article
      className="group relative rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col h-full justify-between border border-[var(--color-border)] text-[#0D1F1C]"
    >
      {/* Hero Image & Overlays */}
      <div className="relative h-56 sm:h-60 overflow-hidden bg-gray-100 flex-shrink-0 w-full">
        {pkg.hero_image_url ? (
          <Image
            src={pkg.hero_image_url}
            alt={`${pkg.name} holiday package`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-108"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#004741]/20 to-[#D49B35]/20 flex items-center justify-center">
            <MapPin size={36} className="text-[#004741]/40" />
          </div>
        )}

        {/* Cinematic gradient vignette - high contrast protection */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/35 pointer-events-none" />

        {/* Top Badges: Handcrafted Badge + Duration Badge (White text on frosted dark pill) */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase text-white bg-black/65 backdrop-blur-md border border-white/25 shadow-sm">
            <Sparkles size={11} className="text-[#FBBF24]" />
            <span className="text-white drop-shadow-sm">Handcrafted</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-white bg-black/65 backdrop-blur-md shadow-sm border border-white/25">
            <Clock size={11} className="text-[#FBBF24]" />
            <span className="text-white drop-shadow-sm">{pkg.duration_days}D / {pkg.duration_nights}N</span>
          </div>
        </div>

        {/* Bottom Destination Chips & Vehicle (White text on dark pills) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="flex flex-wrap gap-1">
            {pkg.destinations.slice(0, 2).map((dest) => (
              <span
                key={dest}
                className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold text-white bg-black/65 backdrop-blur-md border border-white/25 shadow-sm drop-shadow-sm"
              >
                {dest}
              </span>
            ))}
            {pkg.destinations.length > 2 && (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-white bg-black/65 backdrop-blur-md border border-white/25">
                +{pkg.destinations.length - 2}
              </span>
            )}
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-white bg-black/65 backdrop-blur-md border border-white/25 shadow-sm">
            <VehicleIcon size={11} className="text-[#FBBF24]" />
            <span className="text-white">{vehicle.label}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Title - Fixed height container for perfect alignment */}
          <h3 className="font-serif text-lg md:text-xl font-bold text-[#0D1F1C] mb-2 line-clamp-2 min-h-[3.25rem] flex items-start group-hover:text-[var(--color-primary)] transition-colors duration-200">
            <Link href={`/packages/${pkg.slug}`} className="hover:underline">
              {pkg.name}
            </Link>
          </h3>

          {/* Summary - Consistent height */}
          <p className="text-xs text-[#60736F] mb-4 line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {pkg.summary}
          </p>
        </div>

        {/* Capacity & Price Breakdown Box - Consistent min-height for uniform button alignment */}
        <div>
          <div className="bg-[#FAF8F5] rounded-2xl p-3 mb-4 border border-[#DBD4C4]/70 min-h-[88px] flex flex-col justify-center">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-xs text-[#374151] font-semibold">
                <Users size={13} className="text-[var(--color-primary)]" />
                <span>Up to {pkg.pax_capacity} Guests</span>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                  All-Inclusive Package
                </div>
                <div className="font-serif font-bold text-lg text-[var(--color-primary)] leading-none mt-0.5">
                  ₹{pkg.price_with_food.toLocaleString("en-IN")}
                  <span className="text-[11px] font-sans font-normal text-[#6B7280]"> /person</span>
                </div>
              </div>
            </div>

            {pkg.price_without_food ? (
              <div className="pt-2 mt-2 border-t border-[#DBD4C4]/50 flex items-center justify-between text-[11px]">
                <span className="text-[#4B5563] flex items-center gap-1 font-medium">
                  <Utensils size={11} className="text-[#D49B35]" /> Flexible Food Option
                </span>
                <span className="font-bold text-[#0D1F1C]">
                  ₹{pkg.price_without_food.toLocaleString("en-IN")}{" "}
                  <span className="font-normal text-[#6B7280]">(stay only)</span>
                </span>
              </div>
            ) : (
              <div className="pt-2 mt-2 border-t border-[#DBD4C4]/30 flex items-center justify-between text-[11px] text-[#6B7280]">
                <span className="flex items-center gap-1">✦ Complete Sightseeing &amp; Stay Included</span>
                <span className="text-[10px] font-semibold text-[#059669]">Best Price</span>
              </div>
            )}
          </div>

          {/* Action Buttons with Touch Ergonomics */}
          <div className="flex gap-2 pt-1 mt-auto">
            <Link
              href={`/packages/${pkg.slug}`}
              className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition-all duration-200 hover:brightness-110 active:scale-98"
              style={{
                background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
              }}
              id={`pkg-view-${pkg.slug}`}
            >
              View Itinerary
              <ArrowRight size={14} />
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-3.5 flex items-center justify-center rounded-xl bg-[#25d366] text-white shadow-sm transition-all duration-200 hover:bg-[#1da853] active:scale-95"
              aria-label={`Enquire about ${pkg.name} on WhatsApp`}
              id={`pkg-wa-${pkg.slug}`}
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
