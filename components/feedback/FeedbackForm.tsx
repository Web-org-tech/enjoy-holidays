"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Star,
  Sparkles,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Heart,
  Loader2,
  MapPin,
  Calendar,
} from "lucide-react";
import { submitReviewAction } from "@/app/actions/submitReview";
import ImageUploader from "@/components/ui/ImageUploader";

export default function FeedbackForm() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const ratingDescriptions: Record<number, string> = {
    5: "Exceptional Experience (5/5) — Exceeded All Expectations!",
    4: "Great Experience (4/5) — Very Satisfied & Recommended",
    3: "Good Trip (3/5) — Comfortable Journey",
    2: "Fair (2/5) — Needs Some Improvements",
    1: "Poor (1/5) — Did Not Meet Expectations",
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("rating", rating.toString());
    if (photoUrl) {
      formData.set("photo_url", photoUrl);
    }

    startTransition(async () => {
      const res = await submitReviewAction(formData);
      setResult(res);
      if (res.success) {
        form.reset();
        setPhotoUrl("");
        setRating(5);
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#EBE5D8] relative overflow-hidden">
      {/* Subtle top decoration */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0B4F4A] via-[#D45C33] to-[#F59E0B]" />

      {result?.success ? (
        <div className="py-12 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={44} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B4F4A]">
            Thank You for Your Feedback!
          </h2>
          <p className="text-sm text-[#4B5E59] max-w-md mx-auto leading-relaxed">
            {result.message}
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setResult(null)}
              className="px-6 py-2.5 rounded-full bg-[#0B4F4A] text-white text-xs font-bold hover:bg-[#073633] transition-colors"
            >
              Submit Another Review
            </button>
            <Link
              href="/packages"
              className="px-6 py-2.5 rounded-full border border-[#0B4F4A]/20 text-[#0B4F4A] text-xs font-bold hover:bg-[#0B4F4A]/5 transition-colors inline-flex items-center gap-1.5"
            >
              Explore More Packages <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bot Honeypot */}
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          {/* Star Rating Selection */}
          <div className="text-center pb-5 border-b border-[#EBE5D8]">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0B4F4A] mb-3">
              Your Overall Rating <span className="text-red-500">*</span>
            </label>
            <div
              className="flex items-center justify-center gap-2"
              role="radiogroup"
              aria-label="Star rating"
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const currentRating = hoverRating !== null ? hoverRating : rating;
                const isFilled = star <= currentRating;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 focus:outline-none focus:scale-125 transition-transform hover:scale-125"
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  >
                    <Star
                      size={36}
                      className={`transition-colors duration-150 ${
                        isFilled
                          ? "fill-[#F59E0B] text-[#F59E0B] drop-shadow-md"
                          : "text-[#D1D5DB] fill-transparent"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-semibold text-[#D45C33] mt-2.5 min-h-[1.25rem]">
              {ratingDescriptions[hoverRating !== null ? hoverRating : rating]}
            </p>
          </div>

          {/* Guest Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label
                htmlFor="feedback-name"
                className="block text-xs font-bold text-[#0B4F4A] uppercase tracking-wider mb-2"
              >
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                id="feedback-name"
                name="customer_name"
                type="text"
                required
                minLength={2}
                maxLength={80}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-4 py-3 rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] text-sm text-[#0B4F4A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0B4F4A] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="feedback-city"
                className="block text-xs font-bold text-[#0B4F4A] uppercase tracking-wider mb-2"
              >
                Your City / Town
              </label>
              <div className="relative">
                <input
                  id="feedback-city"
                  name="customer_city"
                  type="text"
                  placeholder="e.g. Chennai, Bangalore, Madurai"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] text-sm text-[#0B4F4A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0B4F4A] focus:bg-white transition-colors"
                />
                <MapPin size={16} className="absolute left-3.5 top-3.5 text-[#9CA3AF]" />
              </div>
            </div>
          </div>

          {/* Tour / Package Traveled */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label
                htmlFor="feedback-tour"
                className="block text-xs font-bold text-[#0B4F4A] uppercase tracking-wider mb-2"
              >
                Tour / Destination Traveled
              </label>
              <input
                id="feedback-tour"
                name="tour_name"
                type="text"
                placeholder="e.g. Madurai Sightseeing, Rameswaram, Kerala"
                className="w-full px-4 py-3 rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] text-sm text-[#0B4F4A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0B4F4A] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="feedback-date"
                className="block text-xs font-bold text-[#0B4F4A] uppercase tracking-wider mb-2"
              >
                Date of Journey (Approx)
              </label>
              <div className="relative">
                <input
                  id="feedback-date"
                  name="travel_date"
                  type="date"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] text-sm text-[#0B4F4A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0B4F4A] focus:bg-white transition-colors"
                />
                <Calendar size={16} className="absolute left-3.5 top-3.5 text-[#9CA3AF]" />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-bold text-[#0B4F4A] uppercase tracking-wider mb-2">
              Upload a Photo from Your Trip (Optional)
            </label>
            <ImageUploader
              name="photo_uploader"
              bucket="avatars"
              isPublic={true}
              aspectRatio="square"
              defaultValue={photoUrl}
              onChange={(url) => setPhotoUrl(url)}
              placeholder="Upload or paste image URL of your happy travel moment..."
            />
          </div>

          {/* Review Testimonial Text */}
          <div>
            <label
              htmlFor="feedback-quote"
              className="block text-xs font-bold text-[#0B4F4A] uppercase tracking-wider mb-2"
            >
              Your Review &amp; Experience <span className="text-red-500">*</span>
            </label>
            <textarea
              id="feedback-quote"
              name="quote"
              required
              rows={5}
              minLength={10}
              maxLength={1500}
              placeholder="Share details about the driver, vehicle punctuality, comfort, sightseeing, and hospitality..."
              className="w-full px-4 py-3.5 rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] text-sm text-[#0B4F4A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0B4F4A] focus:bg-white transition-colors resize-y leading-relaxed"
            />
            <span className="text-[11px] text-[#869692] mt-1.5 block">
              Minimum 10 characters. Your authentic feedback guides other travelers!
            </span>
          </div>

          {/* Error Alert if any */}
          {result && !result.success && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="font-bold">Error:</span> {result.message}
            </div>
          )}

          {/* Submit Button with proper spacing */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0B4F4A] to-[#15803D] hover:from-[#083E3A] hover:to-[#116731] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Submitting Your Review...</span>
                </>
              ) : (
                <>
                  <MessageSquare size={18} />
                  <span>Publish My Review</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-center text-[11px] text-[#71827E] pt-3">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-600" /> Verified Guest Reviews
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Heart size={14} className="text-[#D45C33]" /> Handled with Care Since 2004
            </span>
          </div>
        </form>
      )}
    </div>
  );
}
