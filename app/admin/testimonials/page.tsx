import { getAllTestimonialsAdmin } from "@/lib/supabase/queries";
import {
  createTestimonialAction,
  toggleTestimonialPublishAction,
  deleteTestimonialAction,
} from "@/app/actions/testimonials";
import { Star, Plus, Eye, EyeOff, CheckCircle, Clock } from "lucide-react";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import ImageUploader from "@/components/ui/ImageUploader";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonialsAdmin();
  const pendingReviews = testimonials.filter((t) => !t.is_published);
  const publishedReviews = testimonials.filter((t) => t.is_published);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <Star className="text-amber-400" size={24} />
          Customer Testimonials & Reviews
        </h1>
        <p className="text-white/40 text-sm">
          Review, approve pending guest submissions, publish, or add customer reviews.
        </p>
      </div>

      {/* Pending Reviews Moderation Queue */}
      {pendingReviews.length > 0 && (
        <div
          className="rounded-2xl p-6 mb-8 border border-amber-500/30 bg-amber-500/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <Clock size={18} /> Pending Guest Submissions ({pendingReviews.length})
            </h2>
            <span className="text-xs text-amber-200/70">
              Submitted by website visitors awaiting your verification
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingReviews.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl p-5 flex flex-col justify-between bg-black/40 border border-amber-500/20"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-white text-sm">{t.customer_name}</div>
                    <div className="flex items-center text-amber-400 text-xs">
                      {"★".repeat(t.rating)}
                    </div>
                  </div>
                  <p className="text-white/80 text-xs italic mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Awaiting Approval
                  </span>

                  <div className="flex items-center gap-2">
                    <form
                      action={async () => {
                        "use server";
                        await toggleTestimonialPublishAction(t.id, false);
                      }}
                    >
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle size={14} /> Approve & Publish
                      </button>
                    </form>

                    <ConfirmDeleteButton
                      itemType="Submission"
                      title="Reject and delete review"
                      onConfirm={async () => {
                        "use server";
                        await deleteTestimonialAction(t.id);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Testimonial Form */}
      <div
        className="rounded-2xl p-6 mb-8"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Plus size={18} className="text-[var(--color-primary)]" /> Add New Testimonial Manually
        </h2>

        <form action={createTestimonialAction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                name="customer_name"
                required
                placeholder="e.g. Rahul & Priya Sharma"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1">
                Rating (1 to 5)
              </label>
              <select
                name="rating"
                defaultValue="5"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0f1420] border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                <option value="3">⭐⭐⭐ (3 Stars)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">
              Customer Avatar / Photo (Upload or Paste URL)
            </label>
            <ImageUploader
              name="photo_url"
              bucket="avatars"
              aspectRatio="square"
              placeholder="https://images.unsplash.com/photo-..."
              className="text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">
              Review Quote *
            </label>
            <textarea
              name="quote"
              required
              rows={3}
              placeholder="What did the customer say about their trip with ENJOY Holidays?"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-white/70">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked
                className="rounded bg-white/10 border-white/20 text-[var(--color-primary)] focus:ring-0"
              />
              Publish immediately on website
            </label>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
            >
              Save Testimonial
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <h2 className="text-base font-semibold text-white mb-4">
        All Testimonials ({testimonials.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl p-5 flex flex-col justify-between"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-white text-sm">{t.customer_name}</div>
                <div className="flex items-center text-amber-400 text-xs">
                  {"★".repeat(t.rating)}
                </div>
              </div>

              <p className="text-white/70 text-xs italic mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                t.is_published ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}>
                {t.is_published ? "Published" : "Hidden"}
              </span>

              <div className="flex items-center gap-2">
                <form
                  action={async () => {
                    "use server";
                    await toggleTestimonialPublishAction(t.id, t.is_published);
                  }}
                >
                  <button
                    type="submit"
                    className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors text-xs flex items-center gap-1"
                    title={t.is_published ? "Unpublish" : "Publish"}
                  >
                    {t.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </form>

                <ConfirmDeleteButton
                  itemType="Testimonial"
                  title="Delete testimonial"
                  onConfirm={async () => {
                    "use server";
                    await deleteTestimonialAction(t.id);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
