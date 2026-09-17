import { getSiteSettings } from "@/lib/supabase/queries";
import { updateSiteSettingsAction } from "@/app/actions/settings";
import { Settings, Save, Phone, Globe, Share2 } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  const hero = settings?.hero_content || {
    headline: "Where Will You\nWander Next?",
    subtext: "Handcrafted holiday packages across India — we craft journeys, not just trips.",
    cta_primary_label: "Explore Packages",
    cta_secondary_label: "WhatsApp Us",
    background_media_url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=80",
    background_media_type: "image",
  };

  const contact = settings?.contact_info || {
    phone: "+91 99999 99999",
    email: "hello@enjoyholidays.in",
    address: "123 Travel Lane, Kochi, Kerala 682001",
    whatsapp_number: "918531807705",
    gst_number: "29ABCDE1234F1Z5",
  };

  const social = settings?.social_links || {
    instagram: "https://instagram.com/enjoyholidays",
    facebook: "https://facebook.com/enjoyholidays",
    youtube: "https://youtube.com/@enjoyholidays",
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <Settings className="text-terracotta-500" size={24} />
          Site Settings
        </h1>
        <p className="text-white/40 text-sm">
          Manage website content, contact info, and WhatsApp configuration.
        </p>
      </div>

      <form action={updateSiteSettingsAction} className="space-y-6">
        {/* Contact Details */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
            <Phone size={18} className="text-emerald-400" /> Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1">
                WhatsApp Phone Number (With Country Code)
              </label>
              <input
                type="text"
                name="whatsapp_number"
                defaultValue={contact.whatsapp_number}
                placeholder="918531807705"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1">
                Display Phone
              </label>
              <input
                type="text"
                name="phone"
                defaultValue={contact.phone}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={contact.email}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1">
                GST Number
              </label>
              <input
                type="text"
                name="gst_number"
                defaultValue={contact.gst_number}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">
              Office Address
            </label>
            <input
              type="text"
              name="address"
              defaultValue={contact.address}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
        </div>

        {/* Hero Section Banner Content */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
            <Globe size={18} className="text-sky-400" /> Homepage Hero Content
          </h2>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">
              Main Headline
            </label>
            <input
              type="text"
              name="headline"
              defaultValue={hero.headline}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">
              Subheadline / Description
            </label>
            <textarea
              name="subtext"
              rows={2}
              defaultValue={hero.subtext}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1">
                Primary Button Label
              </label>
              <input
                type="text"
                name="cta_primary_label"
                defaultValue={hero.cta_primary_label}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1">
                Secondary Button Label
              </label>
              <input
                type="text"
                name="cta_secondary_label"
                defaultValue={hero.cta_secondary_label}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-medium text-white/80">
                  Hero Background Media (Image or Video)
                </label>
                <p className="text-[11px] text-white/40">
                  Upload an image/video or paste a high-resolution URL. This dynamically updates the homepage banner.
                </p>
              </div>
              <div className="w-36">
                <select
                  name="background_media_type"
                  defaultValue={hero.background_media_type || "image"}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="image" className="bg-[#0D1F1C] text-white">Image Banner</option>
                  <option value="video" className="bg-[#0D1F1C] text-white">Video Loop</option>
                </select>
              </div>
            </div>

            <ImageUploader
              name="background_media_url"
              defaultValue={hero.background_media_url}
              bucket="gallery"
              allowVideo={true}
              aspectRatio="wide"
              placeholder="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=80"
              className="text-white"
            />
          </div>
        </div>

        {/* Social Links */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
            <Share2 size={18} className="text-pink-400" /> Social Links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagram"
                defaultValue={social.instagram}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                name="facebook"
                defaultValue={social.facebook}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                name="youtube"
                defaultValue={social.youtube}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-sm font-bold text-white shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)" }}
          >
            <Save size={16} /> Update Settings
          </button>
        </div>
      </form>
    </div>
  );
}
