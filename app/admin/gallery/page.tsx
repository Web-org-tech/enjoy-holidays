import { getAllGalleryItems } from "@/lib/supabase/queries";
import { createGalleryItemAction, deleteGalleryItemAction } from "@/app/actions/gallery";
import { Image as ImageIcon, Plus, Film } from "lucide-react";
import Image from "next/image";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import ImageUploader from "@/components/ui/ImageUploader";

export default async function AdminGalleryPage() {
  const items = await getAllGalleryItems();

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <ImageIcon className="text-[var(--color-primary)]" size={24} />
          Gallery Management
        </h1>
        <p className="text-white/40 text-sm">
          Upload and manage photos and videos displayed on the public gallery page.
        </p>
      </div>

      {/* Add New Media Form */}
      <div
        className="rounded-2xl p-4 sm:p-6 mb-8"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Plus size={18} className="text-[var(--color-primary)]" /> Add New Media Item
        </h2>

        <form action={createGalleryItemAction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1">
                Destination Tag
              </label>
              <input
                type="text"
                name="destination_tag"
                placeholder="e.g. Kerala, Coorg, Ooty"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1">
                Media Type
              </label>
              <select
                name="media_type"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0f1420] border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">
              Upload Media (File or Direct Image/Video URL) *
            </label>
            <ImageUploader
              name="media_url"
              bucket="gallery"
              allowVideo={true}
              aspectRatio="video"
              placeholder="https://images.unsplash.com/photo-..."
              className="text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">
              Caption / Alt Text
            </label>
            <input
              type="text"
              name="alt_text"
              placeholder="e.g. Houseboat cruising on Alleppey backwaters at sunset"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
            >
              Add to Gallery
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Grid */}
      <h2 className="text-base font-semibold text-white mb-4">
        Gallery Items ({items.length})
      </h2>

      {items.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)" }}
        >
          <ImageIcon className="mx-auto text-white/20 mb-3" size={40} />
          <p className="text-white/50 text-sm">No gallery items yet. Add your first item above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="aspect-video relative bg-black/40">
                {item.media_type === "video" ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                    <Film size={32} />
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
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md">
                    {item.destination_tag}
                  </span>
                )}
              </div>

              <div className="p-3 flex items-center justify-between">
                <p className="text-xs text-white/70 truncate pr-2">
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
  );
}
