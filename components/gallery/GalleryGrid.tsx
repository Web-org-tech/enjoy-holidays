"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryItem } from "@/lib/supabase/types";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

interface GalleryGridProps {
  items: GalleryItem[];
}

// Staggered masonry heights for visual variety
const heights = ["h-48", "h-64", "h-56", "h-48", "h-72", "h-52", "h-60", "h-44"];

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const tags = Array.from(new Set(items.map((i) => i.destination_tag).filter(Boolean))) as string[];
  const filtered = selectedTag ? items.filter((i) => i.destination_tag === selectedTag) : items;

  const open = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : 0));
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : 0));

  return (
    <>
      {/* Destination filter chips */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              !selectedTag
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                : "bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]"
            }`}
            aria-pressed={!selectedTag}
            id="gallery-filter-all"
          >
            All Destinations
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                selectedTag === tag
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                  : "bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]"
              }`}
              aria-pressed={selectedTag === tag}
              id={`gallery-filter-${tag.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Masonry grid */}
      {filtered.length > 0 ? (
        <div
          className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3"
          role="list"
          aria-label="Gallery photos"
        >
          {filtered.map((item, i) => (
            <motion.button
              key={item.id}
              className={`relative w-full block rounded-xl overflow-hidden cursor-zoom-in group break-inside-avoid ${heights[i % heights.length]}`}
              onClick={() => open(i)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
              role="listitem"
              aria-label={`View photo: ${item.alt_text ?? item.destination_tag ?? `Photo ${i + 1}`}`}
            >
              <Image
                src={item.media_url}
                alt={item.alt_text ?? item.destination_tag ?? `Gallery photo ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end p-3">
                {item.destination_tag && (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold px-2 py-1 rounded-full bg-black/40">
                    {item.destination_tag}
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <EmptyState preset="gallery" />
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/96"
            onClick={close}
            role="dialog"
            aria-modal="true"
          >
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 z-10" onClick={close} aria-label="Close">
              <X size={20} />
            </button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous">
              <ChevronLeft size={20} />
            </button>
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[85vh] aspect-video mx-16"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={filtered[lightboxIndex].media_url} alt={filtered[lightboxIndex].alt_text ?? ""} fill className="object-contain" sizes="100vw" />
            </motion.div>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next">
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
              {lightboxIndex + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
