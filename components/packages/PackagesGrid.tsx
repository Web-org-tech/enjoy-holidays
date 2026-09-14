"use client";

import { useState, useMemo } from "react";
import type { PackageCardData } from "@/lib/supabase/types";
import PackageCard from "./PackageCard";
import EmptyState from "@/components/ui/EmptyState";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface PackagesGridProps {
  packages: PackageCardData[];
}

export default function PackagesGrid({ packages }: PackagesGridProps) {
  const [search, setSearch] = useState("");
  const [selectedDest, setSelectedDest] = useState<string | null>(null);
  const [maxDays, setMaxDays] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // Collect unique destinations
  const allDestinations = useMemo(() => {
    const dests = new Set<string>();
    packages.forEach((p) => p.destinations.forEach((d) => dests.add(d)));
    return Array.from(dests).sort();
  }, [packages]);

  // Max price for slider
  const maxPackagePrice = useMemo(
    () => Math.max(...packages.map((p) => p.price_with_food), 50000),
    [packages]
  );

  const filtered = useMemo(() => {
    return packages.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.destinations.some((d) => d.toLowerCase().includes(search.toLowerCase()))) {
        return false;
      }
      if (selectedDest && !p.destinations.includes(selectedDest)) return false;
      if (maxDays && p.duration_days > maxDays) return false;
      if (maxPrice && p.price_with_food > maxPrice) return false;
      return true;
    });
  }, [packages, search, selectedDest, maxDays, maxPrice]);

  const hasFilters = !!(search || selectedDest || maxDays || maxPrice);

  const clearFilters = () => {
    setSearch("");
    setSelectedDest(null);
    setMaxDays(null);
    setMaxPrice(null);
  };

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-8 flex flex-col gap-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations or packages..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-white text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            aria-label="Search packages"
            id="packages-search"
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium">
            <SlidersHorizontal size={12} />
            Filter:
          </span>

          {/* Destination chips */}
          {allDestinations.map((dest) => (
            <button
              key={dest}
              onClick={() => setSelectedDest(selectedDest === dest ? null : dest)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border ${
                selectedDest === dest
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                  : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              }`}
              aria-pressed={selectedDest === dest}
            >
              {dest}
            </button>
          ))}

          {/* Duration chips */}
          {[3, 5, 7, 10].map((days) => (
            <button
              key={days}
              onClick={() => setMaxDays(maxDays === days ? null : days)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border ${
                maxDays === days
                  ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                  : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              }`}
              aria-pressed={maxDays === days}
            >
              ≤ {days} days
            </button>
          ))}

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
              aria-label="Clear all filters"
            >
              <X size={11} />
              Clear
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-xs text-[var(--color-text-muted)]">
          Showing {filtered.length} of {packages.length} packages
        </p>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Holiday packages">
          {filtered.map((pkg, i) => (
            <div key={pkg.id} role="listitem">
              <PackageCard pkg={pkg} priority={i < 3} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          preset="packages"
          description="No packages match your filters. Try adjusting or clearing the filters."
          actionLabel="Clear Filters"
        />
      )}
    </div>
  );
}
