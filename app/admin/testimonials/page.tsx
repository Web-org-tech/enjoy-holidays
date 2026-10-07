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

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full text-[#111827] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight mb-1 flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center shrink-0">
              <Star size={22} className="text-[#F59E0B]" />
            </span>
            <span>Customer Testimonials</span>
          </h1>
          <p className="text-[#4B5563] text-sm">
            Approve reviews submitted by visitors or add new positive customer feedback manually.
          </p>
        </div>
      </div>

      {/* Pending Reviews Moderation Queue */}
      {pendingReviews.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-[#FDE68A] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#FEF3C7]">
            <h2 className="text-base font-bold text-[#92400E] flex items-center gap-2">
              <Clock size={18} className="text-[#F59E0B]" /> Pending Guest Reviews ({pendingReviews.length})
            </h2>
            <span className="text-[11px] font-semibold text-[#92400E] bg-[#FFFBEB] border border-[#FDE68A] px-2.5 py-0.5 rounded-full">
              Awaiting verification
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingReviews.map((t) => (
              <div
                key={t.id}
                className="rounded-xl p-5 flex flex-col justify-between bg-[#F8FAFC] border border-[#E5E7EB] shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-[#111827] text-sm">{t.customer_name}</div>
                    <div className="flex items-center text-[#F59E0B] text-xs font-bold">
                      {"★".repeat(t.rating)}
                    </div>
                  </div>
                  <p className="text-[#4B5563] text-xs italic mb-4 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB] gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                    Pending Approval
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
                        className="px-3 py-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <CheckCircle size={13} /> Approve &amp; Show
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
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-5">
        <h2 className="text-base font-bold text-[#111827] flex items-center gap-2 pb-3 border-b border-[#E5E7EB]">
          <Plus size={18} className="text-[#059669]" /> Add New Customer Review
        </h2>

        <form action={createTestimonialAction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
                Customer Name *
              </label>
              <input
                type="text"
                name="customer_name"
                required
                placeholder="e.g. Rahul &amp; Priya Sharma (Bangalore)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
                Star Rating
              </label>
              <select
                name="rating"
                defaultValue="5"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm font-semibold focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                <option value="4">⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                <option value="3">⭐⭐⭐ (3 Stars - Good)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
              Customer Photo (Optional)
            </label>
            <ImageUploader
              name="photo_url"
              bucket="avatars"
              aspectRatio="square"
              placeholder="https://images.unsplash.com/photo-..."
              className="text-[#111827]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
              Review Text *
            </label>
            <textarea
              name="quote"
              required
              rows={3}
              placeholder="What did the customer say about their journey?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#374151]">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked
                className="w-4 h-4 rounded border-[#E5E7EB] text-[#059669] focus:ring-[#A7F3D0]"
              />
              <span>Publish immediately on live website</span>
            </label>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] active:bg-[#065F46] shadow-sm transition-all text-center cursor-pointer"
            >
              Save Review
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div>
        <h2 className="text-base font-bold text-[#111827] mb-4">
          All Customer Reviews ({testimonials.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl p-5 flex flex-col justify-between bg-white border border-[#E5E7EB] shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-[#111827] text-sm">{t.customer_name}</div>
                  <div className="flex items-center text-[#F59E0B] text-xs font-bold">
                    {"★".repeat(t.rating)}
                  </div>
                </div>

                <p className="text-[#4B5563] text-xs italic mb-4 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB] gap-2">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  t.is_published ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]" : "bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]"
                }`}>
                  {t.is_published ? "Published" : "Hidden"}
                </span>

                <div className="flex items-center gap-1.5">
                  <form
                    action={async () => {
                      "use server";
                      await toggleTestimonialPublishAction(t.id, t.is_published);
                    }}
                  >
                    <button
                      type="submit"
                      className="px-2.5 py-1.5 rounded-lg text-[#4B5563] hover:text-[#111827] hover:bg-[#F8FAFC] border border-[#E5E7EB] transition-colors text-xs flex items-center gap-1 font-semibold cursor-pointer"
                      title={t.is_published ? "Hide from website" : "Show on website"}
                    >
                      {t.is_published ? <EyeOff size={13} /> : <Eye size={13} />}
                      <span>{t.is_published ? "Hide" : "Show"}</span>
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
    </div>
  );
}
