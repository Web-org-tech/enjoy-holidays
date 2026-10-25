"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { PackageCardData } from "@/lib/supabase/types";
import PackageCard from "./PackageCard";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  ArrowUpDown,
  Check,
  RotateCcw,
  Sparkles,
  Car,
  Ship,
  Train,
  Bike,
  Utensils,
  Users,
  Compass,
  ArrowRight,
  Filter,
} from "lucide-react";

interface PackagesGridProps {
  packages: PackageCardData[];
}

type SortOption =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "duration-asc"
  | "duration-desc";

type MobileTab =
  | "destinations"
  | "price"
  | "duration"
  | "vehicles"
  | "food"
  | "capacity";

const VEHICLE_META: Record<string, { label: string; icon: typeof Car }> = {
  jeep: { label: "Private Chauffeur / Cab", icon: Car },
  boat: { label: "Houseboat / Cruise", icon: Ship },
  "tuk-tuk": { label: "Heritage Tuk-Tuk", icon: Car },
  train: { label: "Scenic Mountain Train", icon: Train },
  bike: { label: "Motorcycle Expedition", icon: Bike },
};

const POPULAR_SEARCH_KEYWORDS = [
  "Madurai Temple Tour",
  "Kerala Backwaters & Houseboat",
  "Rameswaram Island & Dhanushkodi",
  "Coorg Coffee Trail",
  "Weekend Getaway",
  "Family Holiday",
];

export default function PackagesGrid({ packages }: PackagesGridProps) {
  // ─── Filter States ──────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [destSearchInput, setDestSearchInput] = useState("");
  const [showAllDests, setShowAllDests] = useState(false);

  const [priceBracket, setPriceBracket] = useState<string | null>(null);
  const [customMinPrice, setCustomMinPrice] = useState<string>("");
  const [customMaxPrice, setCustomMaxPrice] = useState<string>("");

  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [foodOption, setFoodOption] = useState<"all" | "with-food" | "without-food">("all");
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState<SortOption>("relevance");

  // Collapsible Accordion sections (desktop)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    destinations: false,
    price: false,
    duration: false,
    vehicles: false,
    food: false,
    capacity: false,
  });

  // Mobile Filter Drawer & Sort Sheet
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<MobileTab>("destinations");

  // ─── Click Outside handler for search recommendations ────────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent background scroll when mobile filter is open
  useEffect(() => {
    if (mobileFilterOpen || mobileSortOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFilterOpen, mobileSortOpen]);

  // ─── Derived Metadata & Counts ───────────────────────────────────────────
  const allDestinations = useMemo(() => {
    const destMap = new Map<string, number>();
    packages.forEach((pkg) => {
      pkg.destinations.forEach((d) => {
        destMap.set(d, (destMap.get(d) || 0) + 1);
      });
    });
    return Array.from(destMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [packages]);

  const filteredDestinationsList = useMemo(() => {
    if (!destSearchInput.trim()) return allDestinations;
    return allDestinations.filter((d) =>
      d.name.toLowerCase().includes(destSearchInput.toLowerCase())
    );
  }, [allDestinations, destSearchInput]);

  const maxPackagePrice = useMemo(() => {
    if (!packages.length) return 50000;
    return Math.max(...packages.map((p) => p.price_with_food));
  }, [packages]);

  // Count by duration brackets
  const durationCounts = useMemo(() => {
    return {
      "1-2": packages.filter((p) => p.duration_days <= 2).length,
      "3-4": packages.filter((p) => p.duration_days >= 3 && p.duration_days <= 4).length,
      "5-7": packages.filter((p) => p.duration_days >= 5 && p.duration_days <= 7).length,
      "8+": packages.filter((p) => p.duration_days >= 8).length,
    };
  }, [packages]);

  // Count by vehicle types
  const vehicleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    packages.forEach((p) => {
      const v = p.vehicle_type || "jeep";
      counts[v] = (counts[v] || 0) + 1;
    });
    return counts;
  }, [packages]);

  // Count by food options
  const foodCounts = useMemo(() => {
    return {
      all: packages.length,
      "with-food": packages.filter((p) => p.price_with_food > 0).length,
      "without-food": packages.filter(
        (p) => p.price_without_food !== null && p.price_without_food > 0
      ).length,
    };
  }, [packages]);

  // ─── Filter Execution ───────────────────────────────────────────────────
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      // 1. Search Query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = pkg.name.toLowerCase().includes(q);
        const matchesSummary = pkg.summary?.toLowerCase().includes(q);
        const matchesDest = pkg.destinations.some((d) => d.toLowerCase().includes(q));
        if (!matchesName && !matchesSummary && !matchesDest) return false;
      }

      // 2. Destinations (Multi-select)
      if (selectedDestinations.length > 0) {
        const hasMatchingDest = pkg.destinations.some((d) =>
          selectedDestinations.includes(d)
        );
        if (!hasMatchingDest) return false;
      }

      // 3. Price Filter
      const price = pkg.price_with_food;
      if (priceBracket === "under-10k" && price >= 10000) return false;
      if (priceBracket === "10k-20k" && (price < 10000 || price > 20000)) return false;
      if (priceBracket === "20k-35k" && (price < 20000 || price > 35000)) return false;
      if (priceBracket === "above-35k" && price < 35000) return false;
      if (priceBracket === "custom") {
        const min = customMinPrice ? Number(customMinPrice) : 0;
        const max = customMaxPrice ? Number(customMaxPrice) : Infinity;
        if (price < min || price > max) return false;
      }

      // 4. Duration
      if (selectedDurations.length > 0) {
        const days = pkg.duration_days;
        const matchesDuration = selectedDurations.some((bracket) => {
          if (bracket === "1-2") return days <= 2;
          if (bracket === "3-4") return days >= 3 && days <= 4;
          if (bracket === "5-7") return days >= 5 && days <= 7;
          if (bracket === "8+") return days >= 8;
          return false;
        });
        if (!matchesDuration) return false;
      }

      // 5. Vehicle Type
      if (selectedVehicles.length > 0) {
        if (!selectedVehicles.includes(pkg.vehicle_type)) return false;
      }

      // 6. Food Plan
      if (foodOption === "without-food") {
        if (!pkg.price_without_food || pkg.price_without_food <= 0) return false;
      }

      // 7. Group Capacity
      if (selectedCapacities.length > 0) {
        const cap = pkg.pax_capacity || 4;
        const matchesCap = selectedCapacities.some((c) => {
          if (c === "couple") return cap <= 2;
          if (c === "family") return cap >= 3 && cap <= 6;
          if (c === "group") return cap >= 7;
          return false;
        });
        if (!matchesCap) return false;
      }

      return true;
    });
  }, [
    packages,
    search,
    selectedDestinations,
    priceBracket,
    customMinPrice,
    customMaxPrice,
    selectedDurations,
    selectedVehicles,
    foodOption,
    selectedCapacities,
  ]);

  // ─── Sorting Execution ──────────────────────────────────────────────────
  const sortedPackages = useMemo(() => {
    const list = [...filteredPackages];
    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => a.price_with_food - b.price_with_food);
      case "price-desc":
        return list.sort((a, b) => b.price_with_food - a.price_with_food);
      case "duration-asc":
        return list.sort((a, b) => a.duration_days - b.duration_days);
      case "duration-desc":
        return list.sort((a, b) => b.duration_days - a.duration_days);
      case "relevance":
      default:
        return list;
    }
  }, [filteredPackages, sortBy]);

  // ─── Active Filter Chips & Counts ───────────────────────────────────────
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (search.trim()) count++;
    count += selectedDestinations.length;
    if (priceBracket) count++;
    count += selectedDurations.length;
    count += selectedVehicles.length;
    if (foodOption !== "all") count++;
    count += selectedCapacities.length;
    return count;
  }, [
    search,
    selectedDestinations,
    priceBracket,
    selectedDurations,
    selectedVehicles,
    foodOption,
    selectedCapacities,
  ]);

  const clearAllFilters = () => {
    setSearch("");
    setSelectedDestinations([]);
    setPriceBracket(null);
    setCustomMinPrice("");
    setCustomMaxPrice("");
    setSelectedDurations([]);
    setSelectedVehicles([]);
    setFoodOption("all");
    setSelectedCapacities([]);
  };

  const toggleDestination = (dest: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(dest) ? prev.filter((d) => d !== dest) : [...prev, dest]
    );
  };

  const toggleDuration = (bracket: string) => {
    setSelectedDurations((prev) =>
      prev.includes(bracket) ? prev.filter((b) => b !== bracket) : [...prev, bracket]
    );
  };

  const toggleVehicle = (v: string) => {
    setSelectedVehicles((prev) =>
      prev.includes(v) ? prev.filter((item) => item !== v) : [...prev, v]
    );
  };

  const toggleCapacity = (c: string) => {
    setSelectedCapacities((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const toggleSection = (sec: string) => {
    setCollapsedSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  // ─── Autocomplete / Search Recommendation matches ───────────────────────
  const searchMatchingDestinations = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase().trim();
    return allDestinations.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 4);
  }, [search, allDestinations]);

  const searchMatchingPackages = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase().trim();
    return packages
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.summary?.toLowerCase().includes(q) ||
          p.destinations.some((d) => d.toLowerCase().includes(q))
      )
      .slice(0, 3);
  }, [search, packages]);

  return (
    <div className="w-full">
      {/* ───────────────────────────────────────────────────────────────────
          1. FLIPKART-STYLE SEARCH BAR WITH LIVE RECOMMENDATIONS DROPDOWN
          ─────────────────────────────────────────────────────────────────── */}
      <div className="mb-6 relative" ref={searchContainerRef}>
        <div className="relative flex items-center">
          <div className="absolute left-4 text-[#0B4F4A] pointer-events-none">
            <Search size={18} />
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search packages, destinations (e.g. Madurai, Kerala, Coorg, Temple Circuit)..."
            className="w-full pl-11 pr-24 sm:pr-28 py-3.5 sm:py-4 rounded-2xl border-2 border-[#E5E7EB] bg-white text-[#111827] placeholder-[#6B7280] text-sm sm:text-base font-medium shadow-sm hover:border-[#0B4F4A]/40 focus:border-[#0B4F4A] focus:outline-none focus:ring-4 focus:ring-[#0B4F4A]/10 transition-all"
            id="flipkart-packages-search"
            aria-label="Search tour packages"
          />

          <div className="absolute right-3.5 flex items-center gap-1.5">
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="p-1.5 rounded-full text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
                title="Clear search"
                aria-label="Clear search query"
              >
                <X size={16} />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsSearchFocused(false)}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-[#0B4F4A] text-white text-xs font-bold hover:bg-[#073834] transition-colors shadow-xs"
            >
              Search
            </button>
          </div>
        </div>

        {/* ── Search Recommendations Overlay (Flipkart Style) ─────────────── */}
        {isSearchFocused && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 text-[#111827]">
            {/* Header info */}
            <div className="px-4 py-2.5 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
              <span className="font-semibold flex items-center gap-1.5 text-[#0B4F4A]">
                <Sparkles size={14} className="text-[#D45C33]" />
                {search.trim() ? "Search Suggestions & Matches" : "Trending & Popular Searches"}
              </span>
              <button
                type="button"
                onClick={() => setIsSearchFocused(false)}
                className="hover:text-[#111827] text-[11px] font-medium"
              >
                Close (Esc)
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Popular Searches Pills */}
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCH_KEYWORDS.map((keyword) => (
                    <button
                      key={keyword}
                      type="button"
                      onClick={() => {
                        setSearch(keyword);
                        setIsSearchFocused(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F3F4F6] hover:bg-[#ECFDF5] text-[#374151] hover:text-[#0B4F4A] border border-[#E5E7EB] hover:border-[#A7F3D0] transition-colors cursor-pointer"
                    >
                      <Search size={11} className="text-[#9CA3AF]" />
                      <span>{keyword}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Matched Destinations */}
              {searchMatchingDestinations.length > 0 && (
                <div className="pt-2 border-t border-[#F3F4F6]">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">
                    Matching Destinations
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {searchMatchingDestinations.map((d) => (
                      <button
                        key={d.name}
                        type="button"
                        onClick={() => {
                          if (!selectedDestinations.includes(d.name)) {
                            setSelectedDestinations([...selectedDestinations, d.name]);
                          }
                          setSearch("");
                          setIsSearchFocused(false);
                        }}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F8FAFC] text-left border border-transparent hover:border-[#E5E7EB] transition-colors"
                      >
                        <span className="flex items-center gap-2 text-xs font-semibold text-[#111827]">
                          <MapPin size={14} className="text-[#D45C33] shrink-0" />
                          <span>{d.name}</span>
                        </span>
                        <span className="text-[11px] font-medium text-[#6B7280] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
                          {d.count} {d.count === 1 ? "tour" : "tours"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Packages Preview Cards */}
              {searchMatchingPackages.length > 0 && (
                <div className="pt-2 border-t border-[#F3F4F6]">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">
                    Direct Tour Recommendations
                  </span>
                  <div className="space-y-2">
                    {searchMatchingPackages.map((pkg) => (
                      <Link
                        key={pkg.id}
                        href={`/packages/${pkg.slug}`}
                        onClick={() => setIsSearchFocused(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F0FDF4] border border-[#E5E7EB] hover:border-[#86EFAC] transition-all group"
                      >
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          {pkg.hero_image_url ? (
                            <Image
                              src={pkg.hero_image_url}
                              alt={pkg.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#0B4F4A]/10 text-[#0B4F4A]">
                              <Compass size={20} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-[#111827] truncate group-hover:text-[#0B4F4A]">
                            {pkg.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-[#6B7280] mt-0.5">
                            <span className="flex items-center gap-0.5">
                              <Clock size={11} /> {pkg.duration_days}D / {pkg.duration_nights}N
                            </span>
                            <span>•</span>
                            <span className="truncate">{pkg.destinations.join(", ")}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-[#6B7280] block">From</span>
                          <span className="text-xs sm:text-sm font-extrabold text-[#0B4F4A]">
                            ₹{pkg.price_with_food.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────────────
          2. APPLIED FILTER TAGS (FLIPKART CHIPS WITH "✕" AND "CLEAR ALL")
          ─────────────────────────────────────────────────────────────────── */}
      {activeFiltersCount > 0 && (
        <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mr-1">
            Active Filters ({activeFiltersCount}):
          </span>

          {/* Search chip */}
          {search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
              &ldquo;{search}&rdquo;
              <button
                type="button"
                onClick={() => setSearch("")}
                className="hover:text-[#DC2626]"
                title="Remove search filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {/* Destination chips */}
          {selectedDestinations.map((dest) => (
            <span
              key={dest}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]"
            >
              <MapPin size={11} />
              {dest}
              <button
                type="button"
                onClick={() => toggleDestination(dest)}
                className="hover:text-[#DC2626]"
                title={`Remove ${dest}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}

          {/* Price chip */}
          {priceBracket && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
              {priceBracket === "under-10k" && "Under ₹10,000"}
              {priceBracket === "10k-20k" && "₹10,000 - ₹20,000"}
              {priceBracket === "20k-35k" && "₹20,000 - ₹35,000"}
              {priceBracket === "above-35k" && "Above ₹35,000"}
              {priceBracket === "custom" &&
                `₹${customMinPrice || 0} - ₹${customMaxPrice || "Max"}`}
              <button
                type="button"
                onClick={() => {
                  setPriceBracket(null);
                  setCustomMinPrice("");
                  setCustomMaxPrice("");
                }}
                className="hover:text-[#DC2626]"
                title="Remove price filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {/* Duration chips */}
          {selectedDurations.map((dur) => (
            <span
              key={dur}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5F3FF] text-[#6D28D9] border border-[#DDD6FE]"
            >
              <Clock size={11} />
              {dur === "1-2" && "1 - 2 Days"}
              {dur === "3-4" && "3 - 4 Days"}
              {dur === "5-7" && "5 - 7 Days"}
              {dur === "8+" && "8+ Days"}
              <button
                type="button"
                onClick={() => toggleDuration(dur)}
                className="hover:text-[#DC2626]"
                title="Remove duration filter"
              >
                <X size={12} />
              </button>
            </span>
          ))}

          {/* Vehicle chips */}
          {selectedVehicles.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]"
            >
              <Car size={11} />
              {VEHICLE_META[v]?.label || v}
              <button
                type="button"
                onClick={() => toggleVehicle(v)}
                className="hover:text-[#DC2626]"
                title="Remove vehicle filter"
              >
                <X size={12} />
              </button>
            </span>
          ))}

          {/* Food plan chip */}
          {foodOption !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
              <Utensils size={11} />
              {foodOption === "without-food" ? "Flexible / Without Food" : "Food Included"}
              <button
                type="button"
                onClick={() => setFoodOption("all")}
                className="hover:text-[#DC2626]"
                title="Remove food filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {/* Capacity chips */}
          {selectedCapacities.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0]"
            >
              <Users size={11} />
              {c === "couple" && "Couples (≤ 2 Pax)"}
              {c === "family" && "Family (3 - 6 Pax)"}
              {c === "group" && "Group (7+ Pax)"}
              <button
                type="button"
                onClick={() => toggleCapacity(c)}
                className="hover:text-[#DC2626]"
                title="Remove capacity filter"
              >
                <X size={12} />
              </button>
            </span>
          ))}

          {/* Clear all button */}
          <button
            type="button"
            onClick={clearAllFilters}
            className="ml-auto inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] transition-colors"
          >
            <RotateCcw size={11} />
            CLEAR ALL
          </button>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          3. MAIN LAYOUT: FLIPKART DESKTOP SIDEBAR + PACKAGES LIST
          ─────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ── DESKTOP FILTER SIDEBAR (Flipkart Style) ────────────────────── */}
        <aside className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-24 self-start bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-[#0B4F4A]" />
              <h3 className="font-extrabold text-sm text-[#111827] uppercase tracking-wider">
                Filters
              </h3>
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold text-[#0B4F4A] hover:text-[#DC2626] transition-colors uppercase tracking-wider"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="divide-y divide-[#E5E7EB] max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
            {/* 1. Destination Section */}
            <div className="p-4">
              <button
                type="button"
                onClick={() => toggleSection("destinations")}
                className="flex items-center justify-between w-full text-left font-bold text-xs uppercase tracking-wider text-[#111827] mb-2"
              >
                <span>Destinations ({allDestinations.length})</span>
                {collapsedSections.destinations ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
              </button>

              {!collapsedSections.destinations && (
                <div className="space-y-2 mt-2">
                  {/* Search inside destinations if more than 5 */}
                  {allDestinations.length > 5 && (
                    <div className="relative mb-2">
                      <input
                        type="text"
                        placeholder="Search destination..."
                        value={destSearchInput}
                        onChange={(e) => setDestSearchInput(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] focus:outline-none focus:border-[#0B4F4A]"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {(showAllDests ? filteredDestinationsList : filteredDestinationsList.slice(0, 6)).map(
                      (d) => {
                        const isChecked = selectedDestinations.includes(d.name);
                        return (
                          <label
                            key={d.name}
                            className="flex items-center justify-between text-xs text-[#374151] hover:text-[#111827] cursor-pointer py-1 px-1 rounded hover:bg-[#F8FAFC]"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleDestination(d.name)}
                                className="w-4 h-4 rounded text-[#0B4F4A] focus:ring-[#0B4F4A] border-[#D1D5DB]"
                              />
                              <span className="truncate">{d.name}</span>
                            </div>
                            <span className="text-[11px] text-[#9CA3AF] font-medium">({d.count})</span>
                          </label>
                        );
                      }
                    )}
                  </div>

                  {filteredDestinationsList.length > 6 && (
                    <button
                      type="button"
                      onClick={() => setShowAllDests(!showAllDests)}
                      className="text-[11px] font-bold text-[#0B4F4A] hover:underline mt-1 block"
                    >
                      {showAllDests
                        ? "Show Less"
                        : `+ ${filteredDestinationsList.length - 6} more`}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 2. Price Bracket Section */}
            <div className="p-4">
              <button
                type="button"
                onClick={() => toggleSection("price")}
                className="flex items-center justify-between w-full text-left font-bold text-xs uppercase tracking-wider text-[#111827] mb-2"
              >
                <span>Price (₹)</span>
                {collapsedSections.price ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
              </button>

              {!collapsedSections.price && (
                <div className="space-y-2 mt-2">
                  {[
                    { id: "under-10k", label: "Under ₹10,000" },
                    { id: "10k-20k", label: "₹10,000 - ₹20,000" },
                    { id: "20k-35k", label: "₹20,000 - ₹35,000" },
                    { id: "above-35k", label: "Above ₹35,000" },
                  ].map((pOpt) => (
                    <label
                      key={pOpt.id}
                      className="flex items-center gap-2 text-xs text-[#374151] hover:text-[#111827] cursor-pointer py-1"
                    >
                      <input
                        type="radio"
                        name="price_bracket"
                        checked={priceBracket === pOpt.id}
                        onChange={() => setPriceBracket(priceBracket === pOpt.id ? null : pOpt.id)}
                        className="w-4 h-4 text-[#0B4F4A] focus:ring-[#0B4F4A] border-[#D1D5DB]"
                      />
                      <span>{pOpt.label}</span>
                    </label>
                  ))}

                  {/* Custom Min / Max inputs */}
                  <div className="pt-2 border-t border-[#F3F4F6] mt-2">
                    <span className="block text-[11px] font-semibold text-[#6B7280] mb-1.5">
                      Custom Range:
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min ₹"
                        value={customMinPrice}
                        onChange={(e) => {
                          setCustomMinPrice(e.target.value);
                          setPriceBracket("custom");
                        }}
                        className="w-1/2 px-2.5 py-1.5 text-xs rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:border-[#0B4F4A]"
                      />
                      <span className="text-[#9CA3AF] text-xs">to</span>
                      <input
                        type="number"
                        placeholder="Max ₹"
                        value={customMaxPrice}
                        onChange={(e) => {
                          setCustomMaxPrice(e.target.value);
                          setPriceBracket("custom");
                        }}
                        className="w-1/2 px-2.5 py-1.5 text-xs rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:border-[#0B4F4A]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Duration Section */}
            <div className="p-4">
              <button
                type="button"
                onClick={() => toggleSection("duration")}
                className="flex items-center justify-between w-full text-left font-bold text-xs uppercase tracking-wider text-[#111827] mb-2"
              >
                <span>Duration (Days)</span>
                {collapsedSections.duration ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
              </button>

              {!collapsedSections.duration && (
                <div className="space-y-2 mt-2">
                  {[
                    { id: "1-2", label: "1 - 2 Days (Weekend)", count: durationCounts["1-2"] },
                    { id: "3-4", label: "3 - 4 Days (Getaway)", count: durationCounts["3-4"] },
                    { id: "5-7", label: "5 - 7 Days (Week Holiday)", count: durationCounts["5-7"] },
                    { id: "8+", label: "8+ Days (Grand Circuit)", count: durationCounts["8+"] },
                  ].map((dur) => (
                    <label
                      key={dur.id}
                      className="flex items-center justify-between text-xs text-[#374151] hover:text-[#111827] cursor-pointer py-1"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedDurations.includes(dur.id)}
                          onChange={() => toggleDuration(dur.id)}
                          className="w-4 h-4 rounded text-[#0B4F4A] focus:ring-[#0B4F4A] border-[#D1D5DB]"
                        />
                        <span>{dur.label}</span>
                      </div>
                      <span className="text-[11px] text-[#9CA3AF]">({dur.count})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Travel Style / Vehicle Type */}
            <div className="p-4">
              <button
                type="button"
                onClick={() => toggleSection("vehicles")}
                className="flex items-center justify-between w-full text-left font-bold text-xs uppercase tracking-wider text-[#111827] mb-2"
              >
                <span>Experience &amp; Vehicle</span>
                {collapsedSections.vehicles ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
              </button>

              {!collapsedSections.vehicles && (
                <div className="space-y-2 mt-2">
                  {Object.entries(VEHICLE_META).map(([key, meta]) => {
                    const count = vehicleCounts[key] || 0;
                    if (count === 0) return null;
                    const Icon = meta.icon;

                    return (
                      <label
                        key={key}
                        className="flex items-center justify-between text-xs text-[#374151] hover:text-[#111827] cursor-pointer py-1"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedVehicles.includes(key)}
                            onChange={() => toggleVehicle(key)}
                            className="w-4 h-4 rounded text-[#0B4F4A] focus:ring-[#0B4F4A] border-[#D1D5DB]"
                          />
                          <Icon size={13} className="text-[#0B4F4A]" />
                          <span>{meta.label}</span>
                        </div>
                        <span className="text-[11px] text-[#9CA3AF]">({count})</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5. Food & Meal Plans */}
            <div className="p-4">
              <button
                type="button"
                onClick={() => toggleSection("food")}
                className="flex items-center justify-between w-full text-left font-bold text-xs uppercase tracking-wider text-[#111827] mb-2"
              >
                <span>Food &amp; Meal Plan</span>
                {collapsedSections.food ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
              </button>

              {!collapsedSections.food && (
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-xs text-[#374151] hover:text-[#111827] cursor-pointer py-1">
                    <input
                      type="radio"
                      name="food_plan"
                      checked={foodOption === "all"}
                      onChange={() => setFoodOption("all")}
                      className="w-4 h-4 text-[#0B4F4A] focus:ring-[#0B4F4A] border-[#D1D5DB]"
                    />
                    <span>All Tour Packages</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-[#374151] hover:text-[#111827] cursor-pointer py-1">
                    <input
                      type="radio"
                      name="food_plan"
                      checked={foodOption === "without-food"}
                      onChange={() => setFoodOption("without-food")}
                      className="w-4 h-4 text-[#0B4F4A] focus:ring-[#0B4F4A] border-[#D1D5DB]"
                    />
                    <span>Flexible / Without Food Option ({foodCounts["without-food"]})</span>
                  </label>
                </div>
              )}
            </div>

            {/* 6. Group Capacity */}
            <div className="p-4">
              <button
                type="button"
                onClick={() => toggleSection("capacity")}
                className="flex items-center justify-between w-full text-left font-bold text-xs uppercase tracking-wider text-[#111827] mb-2"
              >
                <span>Group Size (Pax)</span>
                {collapsedSections.capacity ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
              </button>

              {!collapsedSections.capacity && (
                <div className="space-y-2 mt-2">
                  {[
                    { id: "couple", label: "Couples / Solo (≤ 2 Pax)" },
                    { id: "family", label: "Family (3 - 6 Pax)" },
                    { id: "group", label: "Large Group (7+ Pax)" },
                  ].map((cap) => (
                    <label
                      key={cap.id}
                      className="flex items-center gap-2 text-xs text-[#374151] hover:text-[#111827] cursor-pointer py-1"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCapacities.includes(cap.id)}
                        onChange={() => toggleCapacity(cap.id)}
                        className="w-4 h-4 rounded text-[#0B4F4A] focus:ring-[#0B4F4A] border-[#D1D5DB]"
                      />
                      <span>{cap.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT AREA (Sort Bar + Packages Grid) ───────────────── */}
        <div className="flex-1 min-w-0 w-full">
          {/* Flipkart Sort Bar (Desktop + Mobile Action Bar) */}
          <div className="mb-6 bg-white p-3 sm:p-4 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Left: Total Count Display */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="text-xs sm:text-sm font-bold text-[#111827]">
                Showing {sortedPackages.length} of {packages.length} Tours
              </span>

              {/* Mobile Filter & Sort Triggers */}
              <div className="flex lg:hidden items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileSortOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#374151] flex items-center gap-1.5 bg-[#F9FAFB]"
                >
                  <ArrowUpDown size={13} className="text-[#0B4F4A]" />
                  Sort
                </button>

                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#0B4F4A] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Filter size={13} />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#D45C33] text-white text-[10px] font-extrabold flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Desktop Sort Options (Flipkart Sorter Tabs) */}
            <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mr-1.5">
                Sort By:
              </span>

              {[
                { id: "relevance", label: "Relevance" },
                { id: "price-asc", label: "Price -- Low to High" },
                { id: "price-desc", label: "Price -- High to Low" },
                { id: "duration-asc", label: "Duration -- Short to Long" },
                { id: "duration-desc", label: "Duration -- Long to Short" },
              ].map((sOpt) => {
                const isActive = sortBy === sOpt.id;
                return (
                  <button
                    key={sOpt.id}
                    type="button"
                    onClick={() => setSortBy(sOpt.id as SortOption)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-[#0B4F4A] text-white shadow-xs"
                        : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]"
                    }`}
                  >
                    {sOpt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Packages Grid ────────────────────────────────────────────── */}
          {sortedPackages.length > 0 ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              role="list"
              aria-label="Holiday packages"
            >
              {sortedPackages.map((pkg, i) => (
                <div key={pkg.id} role="listitem" className="flex flex-col h-full">
                  <PackageCard pkg={pkg} priority={i < 3} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 sm:p-16 border border-[#E5E7EB] text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] text-[#0B4F4A] flex items-center justify-center mx-auto mb-4">
                <Compass size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-2">
                No matching tour packages found
              </h3>
              <p className="text-sm text-[#6B7280] max-w-md mx-auto mb-6">
                We couldn&apos;t find any tour packages matching your current filter selection. Try removing some filters or search for another destination.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B4F4A] text-white font-bold text-xs sm:text-sm hover:bg-[#073834] transition-all shadow-md active:scale-95"
              >
                <RotateCcw size={14} />
                <span>Reset All Filters ({packages.length} Available)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────
          4. FLIPKART MOBILE FILTER DIALOG (2-COLUMN SIGNATURE MODAL)
          ─────────────────────────────────────────────────────────────────── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-bottom duration-200">
          {/* Modal Header */}
          <div className="px-4 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-[#0B4F4A]" />
              <h3 className="font-extrabold text-sm text-[#111827] uppercase tracking-wider">
                Filters
              </h3>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#D45C33] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal 2-Column Body (Flipkart style) */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Category Column */}
            <div className="w-32 sm:w-36 bg-[#F8FAFC] border-r border-[#E5E7EB] overflow-y-auto shrink-0 divide-y divide-[#E5E7EB]">
              {[
                { id: "destinations", label: "Destinations", hasActive: selectedDestinations.length > 0 },
                { id: "price", label: "Price (₹)", hasActive: !!priceBracket },
                { id: "duration", label: "Duration", hasActive: selectedDurations.length > 0 },
                { id: "vehicles", label: "Experience", hasActive: selectedVehicles.length > 0 },
                { id: "food", label: "Food Plan", hasActive: foodOption !== "all" },
                { id: "capacity", label: "Group Size", hasActive: selectedCapacities.length > 0 },
              ].map((tab) => {
                const isSelected = mobileActiveTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setMobileActiveTab(tab.id as MobileTab)}
                    className={`w-full text-left p-3 text-xs font-bold transition-colors relative flex items-center justify-between ${
                      isSelected
                        ? "bg-white text-[#0B4F4A] border-l-4 border-[#0B4F4A]"
                        : "text-[#4B5563] hover:text-[#111827]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.hasActive && (
                      <span className="w-2 h-2 rounded-full bg-[#D45C33] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Options Column */}
            <div className="flex-1 p-4 overflow-y-auto">
              {/* Destinations Tab */}
              {mobileActiveTab === "destinations" && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#111827] block">
                    Choose Destinations ({allDestinations.length}):
                  </span>
                  <div className="space-y-2">
                    {allDestinations.map((d) => (
                      <label
                        key={d.name}
                        className="flex items-center justify-between p-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#111827]"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedDestinations.includes(d.name)}
                            onChange={() => toggleDestination(d.name)}
                            className="w-4 h-4 rounded text-[#0B4F4A] focus:ring-[#0B4F4A]"
                          />
                          <span>{d.name}</span>
                        </div>
                        <span className="text-[#6B7280] text-[11px]">({d.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Tab */}
              {mobileActiveTab === "price" && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#111827] block">
                    Select Price Range:
                  </span>
                  <div className="space-y-2">
                    {[
                      { id: "under-10k", label: "Under ₹10,000" },
                      { id: "10k-20k", label: "₹10,000 - ₹20,000" },
                      { id: "20k-35k", label: "₹20,000 - ₹35,000" },
                      { id: "above-35k", label: "Above ₹35,000" },
                    ].map((pOpt) => (
                      <label
                        key={pOpt.id}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#111827]"
                      >
                        <input
                          type="radio"
                          name="mobile_price"
                          checked={priceBracket === pOpt.id}
                          onChange={() => setPriceBracket(pOpt.id)}
                          className="w-4 h-4 text-[#0B4F4A]"
                        />
                        <span>{pOpt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Duration Tab */}
              {mobileActiveTab === "duration" && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#111827] block">
                    Select Trip Duration:
                  </span>
                  <div className="space-y-2">
                    {[
                      { id: "1-2", label: "1 - 2 Days (Weekend / Short)", count: durationCounts["1-2"] },
                      { id: "3-4", label: "3 - 4 Days (Getaway)", count: durationCounts["3-4"] },
                      { id: "5-7", label: "5 - 7 Days (Week-long Holiday)", count: durationCounts["5-7"] },
                      { id: "8+", label: "8+ Days (Grand Circuit Tour)", count: durationCounts["8+"] },
                    ].map((dur) => (
                      <label
                        key={dur.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#111827]"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedDurations.includes(dur.id)}
                            onChange={() => toggleDuration(dur.id)}
                            className="w-4 h-4 rounded text-[#0B4F4A]"
                          />
                          <span>{dur.label}</span>
                        </div>
                        <span className="text-[#6B7280] text-[11px]">({dur.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Tab */}
              {mobileActiveTab === "vehicles" && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#111827] block">
                    Vehicle &amp; Experience Style:
                  </span>
                  <div className="space-y-2">
                    {Object.entries(VEHICLE_META).map(([key, meta]) => {
                      const count = vehicleCounts[key] || 0;
                      if (count === 0) return null;
                      const Icon = meta.icon;

                      return (
                        <label
                          key={key}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#111827]"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedVehicles.includes(key)}
                              onChange={() => toggleVehicle(key)}
                              className="w-4 h-4 rounded text-[#0B4F4A]"
                            />
                            <Icon size={14} className="text-[#0B4F4A]" />
                            <span>{meta.label}</span>
                          </div>
                          <span className="text-[#6B7280] text-[11px]">({count})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Food Tab */}
              {mobileActiveTab === "food" && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#111827] block">
                    Food &amp; Meal Options:
                  </span>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#111827]">
                      <input
                        type="radio"
                        name="mobile_food"
                        checked={foodOption === "all"}
                        onChange={() => setFoodOption("all")}
                        className="w-4 h-4 text-[#0B4F4A]"
                      />
                      <span>All Tour Packages</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#111827]">
                      <input
                        type="radio"
                        name="mobile_food"
                        checked={foodOption === "without-food"}
                        onChange={() => setFoodOption("without-food")}
                        className="w-4 h-4 text-[#0B4F4A]"
                      />
                      <span>Without Food Option Available</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Capacity Tab */}
              {mobileActiveTab === "capacity" && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#111827] block">
                    Group Capacity:
                  </span>
                  <div className="space-y-2">
                    {[
                      { id: "couple", label: "Couples / Solo (≤ 2 Pax)" },
                      { id: "family", label: "Family (3 - 6 Pax)" },
                      { id: "group", label: "Large Group (7+ Pax)" },
                    ].map((cap) => (
                      <label
                        key={cap.id}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#111827]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCapacities.includes(cap.id)}
                          onChange={() => toggleCapacity(cap.id)}
                          className="w-4 h-4 rounded text-[#0B4F4A]"
                        />
                        <span>{cap.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Bottom Actions */}
          <div className="p-3.5 border-t border-[#E5E7EB] bg-white flex items-center gap-3">
            <button
              type="button"
              onClick={clearAllFilters}
              className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#374151] hover:bg-[#F3F4F6]"
            >
              Clear All
            </button>

            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="flex-1 py-3 rounded-xl bg-[#0B4F4A] text-white text-xs font-bold hover:bg-[#073834] shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Apply Filters</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {sortedPackages.length}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          5. FLIPKART MOBILE SORT SHEET
          ─────────────────────────────────────────────────────────────────── */}
      {mobileSortOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setMobileSortOpen(false)}
          />

          <div className="relative w-full bg-white rounded-t-3xl p-5 shadow-2xl z-10 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-3">
              <span className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                <ArrowUpDown size={14} className="text-[#0B4F4A]" />
                Sort Packages By
              </span>
              <button
                type="button"
                onClick={() => setMobileSortOpen(false)}
                className="p-1 text-[#6B7280]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1">
              {[
                { id: "relevance", label: "Relevance / Recommended" },
                { id: "price-asc", label: "Price -- Low to High" },
                { id: "price-desc", label: "Price -- High to Low" },
                { id: "duration-asc", label: "Duration -- Short to Long" },
                { id: "duration-desc", label: "Duration -- Long to Short" },
              ].map((sOpt) => {
                const isSelected = sortBy === sOpt.id;
                return (
                  <button
                    key={sOpt.id}
                    type="button"
                    onClick={() => {
                      setSortBy(sOpt.id as SortOption);
                      setMobileSortOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-[#ECFDF5] text-[#047857]"
                        : "text-[#374151] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <span>{sOpt.label}</span>
                    {isSelected && <Check size={16} className="text-[#047857]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
