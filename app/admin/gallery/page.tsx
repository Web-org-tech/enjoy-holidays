import { getAllGalleryItems } from "@/lib/supabase/queries";
import { createGalleryItemAction, deleteGalleryItemAction } from "@/app/actions/gallery";
import { Image as ImageIcon, Plus, Film } from "lucide-react";
import Image from "next/image";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import ImageUploader from "@/components/ui/ImageUploader";

export default async function AdminGalleryPage() {
  const items = await getAllGalleryItems();

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full text-[#111827] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight mb-1 flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center shrink-0">
              <ImageIcon size={22} />
            </span>
            <span>Gallery Media</span>
          </h1>
          <p className="text-[#4B5563] text-sm">
            Upload and organize destination photos and video reels shown to website visitors.
          </p>
        </div>
      </div>

      {/* Add New Media Form */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-5">
        <h2 className="text-base font-bold text-[#111827] flex items-center gap-2 pb-3 border-b border-[#E5E7EB]">
          <Plus size={18} className="text-[#059669]" />
          <span>Add New Photo or Video</span>
        </h2>

        <form action={createGalleryItemAction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
                Destination Name / Tag
              </label>
              <input
                type="text"
                name="destination_tag"
                placeholder="e.g. Madurai, Kerala, Ooty, Rameswaram"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
                Media Type
              </label>
              <select
                name="media_type"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm font-medium focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
              >
                <option value="image">Photo / Image</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
              Upload Media (Image or Video) *
            </label>
            <ImageUploader
              name="media_url"
              bucket="gallery"
              allowVideo={true}
              aspectRatio="video"
              placeholder="https://images.unsplash.com/photo-..."
              className="text-[#111827]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
              Caption / Description
            </label>
            <input
              type="text"
              name="alt_text"
              placeholder="e.g. Meenakshi Amman Temple illuminated at night"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] active:bg-[#065F46] shadow-sm transition-all text-center cursor-pointer"
            >
              + Save Media to Gallery
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Grid */}
      <div>
        <h2 className="text-base font-bold text-[#111827] mb-4">
          Uploaded Photos &amp; Videos ({items.length})
        </h2>

        {items.length === 0 ? (
          <div className="rounded-2xl p-12 text-center bg-white border-2 border-dashed border-[#E5E7EB]">
            <ImageIcon className="mx-auto text-[#9CA3AF] mb-3" size={40} />
            <p className="text-[#6B7280] text-sm font-medium">No gallery items yet. Add your first photo above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all"
              >
                <div className="aspect-video relative bg-[#F8FAFC]">
                  {item.media_type === "video" ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#F1F5F9] text-[#059669]">
                      <Film size={28} />
                    </div>
                  ) : (
                    <Image
                      src={item.media_url}
                      alt={item.alt_text || "Gallery item"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {item.destination_tag && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 text-[#111827] border border-[#E5E7EB] backdrop-blur-sm shadow-xs">
                      {item.destination_tag}
                    </span>
                  )}
                </div>

                <div className="p-3.5 flex items-center justify-between gap-2 border-t border-[#E5E7EB]">
                  <p className="text-xs font-semibold text-[#111827] truncate pr-2">
                    {item.alt_text || "No caption"}
                  </p>

                  <ConfirmDeleteButton
                    itemType="Media item"
                    title="Delete media"
                    onConfirm={async () => {
                      "use server";
                      await deleteGalleryItemAction(item.id);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
