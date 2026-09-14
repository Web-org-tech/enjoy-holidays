"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryItem } from "@/lib/supabase/types";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PackageGalleryStripProps {
  items: GalleryItem[];
}

export default function PackageGalleryStrip({ items }: PackageGalleryStripProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + items.length) % items.length : 0));
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % items.length : 0));

  return (
    <>
      {/* Grid strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3" role="list" aria-label="Package gallery">
        {items.map((item, i) => (
          <button
            key={item.id}
            className="relative rounded-xl overflow-hidden aspect-square group cursor-zoom-in"
            onClick={() => open(i)}
            aria-label={`View photo ${i + 1}: ${item.alt_text ?? item.destination_tag ?? ""}`}
            role="listitem"
            id={`gallery-item-${i}`}
          >
            <Image
              src={item.media_url}
              alt={item.alt_text ?? item.destination_tag ?? `Package photo ${i + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Photo lightbox"
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 z-10"
              onClick={close}
              aria-label="Close lightbox"
            >
              <X size={20} />
            </button>

            {/* Navigation */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 z-10"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl max-h-[85vh] aspect-video mx-16"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={items[lightboxIndex].media_url}
                alt={items[lightboxIndex].alt_text ?? `Photo ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 z-10"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next photo"
            >
              <ChevronRight size={20} />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {lightboxIndex + 1} / {items.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
