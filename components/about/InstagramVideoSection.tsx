"use client";

import { Instagram, ExternalLink, Play } from "lucide-react";

interface InstagramVideoSectionProps {
  url?: string | null;
}

function getInstagramEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(/(?:instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+))/i);
  if (match && match[1]) {
    return `https://www.instagram.com/reel/${match[1]}/embed`;
  }
  if (trimmed.includes("instagram.com") && trimmed.includes("/embed")) {
    return trimmed;
  }
  return null;
}

export default function InstagramVideoSection({ url }: InstagramVideoSectionProps) {
  if (!url || !url.trim()) return null;

  const rawUrl = url.trim();
  const embedUrl = getInstagramEmbedUrl(rawUrl);
  const isDirectVideo = rawUrl.match(/\.(mp4|webm|mov)(\?.*)?$/i);

  return (
    <section
      className="py-16 sm:py-20 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, var(--color-surface-alt) 0%, var(--color-background) 100%)",
      }}
      aria-labelledby="instagram-video-heading"
    >
      <div className="container-site max-w-4xl text-center">
        {/* Header badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-3 bg-[#E1306C]/10 text-[#E1306C] border border-[#E1306C]/20">
          <Instagram size={14} />
          <span>Follow Our Journey</span>
        </div>

        <h2
          id="instagram-video-heading"
          className="display-lg text-[var(--color-text-primary)] mb-3"
        >
          Experiences in <span className="italic text-[#E1306C]">Motion</span>
        </h2>
        <p className="body-md text-[var(--color-text-secondary)] max-w-xl mx-auto mb-10 text-sm sm:text-base">
          Real moments captured on the road — explore authentic highlights, pilgrim trails, and customer stories.
        </p>

        {/* Video Card Container */}
        <div className="max-w-md mx-auto bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-[var(--color-border)] relative">
          {isDirectVideo ? (
            <div className="relative aspect-[9/16] max-h-[600px] w-full rounded-2xl overflow-hidden bg-black shadow-inner">
              <video
                src={rawUrl}
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          ) : embedUrl ? (
            <div className="relative aspect-[9/16] max-h-[580px] w-full rounded-2xl overflow-hidden bg-stone-900 shadow-inner">
              <iframe
                src={embedUrl}
                className="w-full h-full border-0 rounded-2xl"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                title="Padma Tours & Travels Instagram Reel"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="aspect-[9/16] max-h-[480px] w-full rounded-2xl bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex flex-col items-center justify-center p-6 text-white text-center shadow-lg">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                <Play size={32} className="ml-1 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">Watch on Instagram</h3>
              <p className="text-xs text-white/90 mb-6 max-w-xs">
                Tap below to view our featured travel video directly on Instagram.
              </p>
            </div>
          )}

          {/* Action button to open directly on Instagram */}
          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
            <div className="text-left">
              <span className="text-xs font-bold text-[#0D1F1C] block">@padmatoursandtravels</span>
              <span className="text-[11px] text-stone-500">Official Instagram Reel</span>
            </div>

            <a
              href={rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white shadow-md hover:opacity-95 active:scale-95 transition-all"
              style={{
                background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              }}
              id="instagram-reel-external-cta"
            >
              <span>Watch on Instagram</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
