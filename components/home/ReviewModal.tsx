"use client";

import React, { useState, useTransition } from "react";
import { Star, MessageSquarePlus, X, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { submitReviewAction } from "@/app/actions/submitReview";
import ImageUploader from "@/components/ui/ImageUploader";

export default function ReviewModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("rating", rating.toString());

    startTransition(async () => {
      const result = await submitReviewAction(formData);
      setFeedback(result);
      if (result.success) {
        form.reset();
        setRating(5);
      }
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setFeedback(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-light)] text-[var(--color-text-primary)] font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
        id="write-review-button"
      >
        <MessageSquarePlus size={16} />
        Write a Review
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
        >
          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-[var(--color-border)] p-5 sm:p-7 text-[#0D1F1C] m-2 sm:m-4">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full text-black/40 hover:text-black hover:bg-black/5 transition-colors"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            {feedback?.success ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce-short">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#004741]">
                  Review Submitted!
                </h3>
                <p className="text-xs text-[#60736F] max-w-sm mx-auto leading-relaxed">
                  {feedback.message}
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#004741] text-white text-xs font-bold hover:bg-[#00332E] transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-left">
                  <span className="text-[11px] font-bold text-[#D49B35] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={12} /> Share Your Experience
                  </span>
                  <h2 id="review-modal-title" className="text-2xl font-serif font-bold text-[#004741] mt-1">
                    Write a Guest Review
                  </h2>
                  <p className="text-xs text-[#60736F] mt-1">
                    Tell fellow travellers about your holiday experience with ENJOY Holidays.
                  </p>
                </div>

                {/* Honeypot field for bot spam prevention */}
                <input
                  type="text"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {/* Star Rating Picker */}
                <div className="py-1">
                  <label className="block text-xs font-bold text-[#0D1F1C] mb-1.5">
                    Your Overall Rating *
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating ?? rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 transition-transform hover:scale-125 focus:outline-none"
                          aria-label={`Rate ${star} out of 5 stars`}
                        >
                          <Star
                            size={28}
                            className={`transition-colors ${
                              active ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="ml-2 text-xs font-bold text-[#004741]">
                      {rating === 5 ? "Exceptional (5/5)" : rating === 4 ? "Very Good (4/5)" : `${rating}/5`}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-[#0D1F1C] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    required
                    placeholder="e.g. Rahul & Priya Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DBD4C4] bg-white text-[#0D1F1C] placeholder-[#718096] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#004741] focus:ring-1 focus:ring-[#004741]/20 shadow-xs"
                  />
                </div>

                {/* Review Quote */}
                <div>
                  <label className="block text-xs font-bold text-[#0D1F1C] mb-1">
                    Your Review / Story *
                  </label>
                  <textarea
                    name="quote"
                    required
                    rows={4}
                    placeholder="Describe your tour, chauffeur experience, stays, and favourite highlights..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DBD4C4] bg-white text-[#0D1F1C] placeholder-[#718096] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#004741] focus:ring-1 focus:ring-[#004741]/20 shadow-xs"
                  />
                </div>

                {/* Guest Photo Upload or Direct URL */}
                <ImageUploader
                  name="photo_url"
                  label="Guest Photo (Optional)"
                  description="Upload a picture from your device or paste a web image link"
                  bucket="avatars"
                  aspectRatio="square"
                  isPublic={true}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="text-[#0D1F1C]"
                />

                {feedback && !feedback.success && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {feedback.message}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2.5 rounded-xl border border-[#DBD4C4] text-xs font-semibold text-[#0D1F1C] hover:bg-black/5"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2.5 rounded-xl bg-[#004741] text-white text-xs font-bold hover:bg-[#00332E] transition-all flex items-center gap-2 shadow-sm disabled:opacity-60"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit for Verification"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
