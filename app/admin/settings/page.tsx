import { getSiteSettings } from "@/lib/supabase/queries";
import { updateSiteSettingsAction } from "@/app/actions/settings";
import { Settings, Save, Phone, Globe, Share2, Instagram } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  const hero = settings?.hero_content || {
    headline: "Where Will You\nWander Next?",
    subtext: "Daily tours, Madurai local sightseeing, and customized holiday packages across India since 2004.",
    cta_primary_label: "Explore Packages",
    cta_secondary_label: "WhatsApp Us",
    background_media_url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=80",
    background_media_type: "image",
  };

  const contact = settings?.contact_info || {
    phone: "+91 98659 87975",
    email: "nirmalharish1980@gmail.com",
    address: "No: B19/3 Racecourse Colony, Opp. Old Passport Office, Government Quarters, Madurai - 625002",
    whatsapp_number: "917010111256",
    gst_number: "",
  };

  const social = settings?.social_links || {
    instagram: "",
    facebook: "",
    youtube: "",
    instagram_video_url: "",
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full text-[#111827] space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight mb-1 flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center shrink-0">
              <Settings size={22} />
            </span>
            <span>Site Settings &amp; Configuration</span>
          </h1>
          <p className="text-[#4B5563] text-sm">
            Configure contact numbers, WhatsApp routing, homepage hero banner, and Instagram media.
          </p>
        </div>
      </div>

      <form action={updateSiteSettingsAction} className="space-y-6">
        {/* 1. Contact Information Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB]">
            <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center">
              <Phone size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111827]">1. Contact &amp; Booking Numbers</h2>
              <p className="text-xs text-[#6B7280]">Direct telephone &amp; WhatsApp communication channels</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
                WhatsApp Phone Number (With Country Code)
              </label>
              <input
                type="text"
                name="whatsapp_number"
                defaultValue={contact.whatsapp_number}
                placeholder="917010111256"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
              />
              <span className="text-[11px] text-[#6B7280] mt-1 block">e.g. 917010111256 (numbers only, no plus sign)</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
                Display Phone Number
              </label>
              <input
                type="text"
                name="phone"
                defaultValue={contact.phone}
                placeholder="+91 98659 87975"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
              />
              <span className="text-[11px] text-[#6B7280] mt-1 block">Formatted for display on contact banners</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
                Contact Email Address
              </label>
              <input
                type="email"
                name="email"
                defaultValue={contact.email}
                placeholder="contact@padmatours.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
                GST Number (Optional)
              </label>
              <input
                type="text"
                name="gst_number"
                defaultValue={contact.gst_number}
                placeholder="GSTIN..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
              Office Physical Address
            </label>
            <input
              type="text"
              name="address"
              defaultValue={contact.address}
              placeholder="Full office address"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
            />
          </div>
        </div>

        {/* 2. Instagram Video Integration Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB]">
            <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center">
              <Instagram size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111827]">2. Instagram Video for About Section</h2>
              <p className="text-xs text-[#6B7280]">
                Featured Instagram Reel or Video on the website About page
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-[#4B5563] text-xs">
            <strong>How it works:</strong> Paste any Instagram Reel or Post link here (e.g. <code>https://www.instagram.com/reel/Cxxxxxx/</code>). It will only appear on your website&apos;s About page if a URL is provided here. Leave blank to hide the section.
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
              Instagram Reel / Video URL
            </label>
            <input
              type="url"
              name="instagram_video_url"
              defaultValue={social.instagram_video_url || ""}
              placeholder="https://www.instagram.com/reel/DA123456789/"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
            />
          </div>
        </div>

        {/* 3. Homepage Hero Banner Content */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB]">
            <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center">
              <Globe size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111827]">3. Homepage Hero Banner</h2>
              <p className="text-xs text-[#6B7280]">Headline, subtext, and hero background media</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
              Main Headline
            </label>
            <input
              type="text"
              name="headline"
              defaultValue={hero.headline}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
              Subheadline / Description
            </label>
            <textarea
              name="subtext"
              rows={3}
              defaultValue={hero.subtext}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
                Primary Button Label
              </label>
              <input
                type="text"
                name="cta_primary_label"
                defaultValue={hero.cta_primary_label}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
                Secondary Button Label
              </label>
              <input
                type="text"
                name="cta_secondary_label"
                defaultValue={hero.cta_secondary_label}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#E5E7EB] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151]">
                  Hero Background Media (Image or Video)
                </label>
                <p className="text-xs text-[#6B7280]">
                  Upload an image or video to update the main homepage banner
                </p>
              </div>
              <div className="w-40">
                <select
                  name="background_media_type"
                  defaultValue={hero.background_media_type || "image"}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-xs font-semibold focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0]"
                >
                  <option value="image">Image Banner</option>
                  <option value="video">Video Loop</option>
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
              className="text-[#111827]"
            />
          </div>
        </div>

        {/* 4. Social Links */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB]">
            <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center">
              <Share2 size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111827]">4. Social Media Links</h2>
              <p className="text-xs text-[#6B7280]">Links displayed across footer and contact points</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
                Instagram Page URL
              </label>
              <input
                type="url"
                name="instagram"
                defaultValue={social.instagram}
                placeholder="https://instagram.com/padmatours"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
                Facebook Page URL
              </label>
              <input
                type="url"
                name="facebook"
                defaultValue={social.facebook}
                placeholder="https://facebook.com/padmatours"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
                YouTube Channel URL
              </label>
              <input
                type="url"
                name="youtube"
                defaultValue={social.youtube}
                placeholder="https://youtube.com/@padmatours"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="sticky bottom-4 z-20 pt-2">
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E5E7EB] shadow-lg flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">
              Review all changes before saving
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] active:bg-[#065F46] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              id="admin-save-settings-btn"
            >
              <Save size={16} />
              <span>Save All Settings</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
