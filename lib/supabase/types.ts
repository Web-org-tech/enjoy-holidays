// ─── Supabase Database Types ────────────────────────────────────────────────
// Generated to match the schema in supabase/migrations/001_initial_schema.sql

export type VehicleType = "jeep" | "tuk-tuk" | "boat" | "bike" | "train";
export type PackageStatus = "draft" | "published" | "archived";
export type EnquiryStatus = "new" | "contacted" | "converted" | "closed";
export type EnquirySource = "form" | "whatsapp_click" | "phone";
export type MediaType = "image" | "video";

export interface Package {
  id: string;
  slug: string;
  name: string;
  summary: string;
  destinations: string[];
  duration_nights: number;
  duration_days: number;
  pax_capacity: number;
  price_with_food: number;
  price_without_food: number | null;
  hero_image_url: string | null;
  hero_video_url: string | null;
  vehicle_type: VehicleType;
  status: PackageStatus;
  seo_title: string | null;
  seo_description: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  // Joined relations (optional)
  package_days?: PackageDay[];
  package_inclusions?: PackageInclusion[];
  package_exclusions?: PackageExclusion[];
  gallery_items?: GalleryItem[];
}

export interface PackageDay {
  id: string;
  package_id: string;
  day_number: number;
  title: string;
  subtitle: string | null;
  photo_url: string | null;
  transition_text: string | null;
  sort_order: number;
  // Joined
  day_activities?: DayActivity[];
}

export interface DayActivity {
  id: string;
  package_day_id: string;
  icon: string; // e.g. "breakfast", "activity", "hotel", "transport", "meal", "sunset"
  label: string;
  sort_order: number;
}

export interface PackageInclusion {
  id: string;
  package_id: string;
  text: string;
  sort_order: number;
}

export interface PackageExclusion {
  id: string;
  package_id: string;
  text: string;
  sort_order: number;
}

export interface GalleryItem {
  id: string;
  package_id: string | null;
  destination_tag: string | null;
  media_url: string;
  media_type: MediaType;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  photo_url: string | null;
  rating: number; // 1-5
  quote: string;
  package_id: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  // Joined
  package?: Pick<Package, "id" | "name" | "slug"> | null;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  package_id: string | null;
  message: string | null;
  source: EnquirySource;
  status: EnquiryStatus;
  created_at: string;
  // Joined
  package?: Pick<Package, "id" | "name" | "slug"> | null;
}

export interface SiteSettings {
  id: string;
  theme_colors: Record<string, string> | null;
  hero_content: {
    headline?: string;
    subtext?: string;
    background_media_url?: string;
    background_media_type?: "image" | "video";
    cta_primary_label?: string;
    cta_secondary_label?: string;
  } | null;
  contact_info: {
    phone?: string;
    email?: string;
    address?: string;
    whatsapp_number?: string;
    gst_number?: string;
  } | null;
  social_links: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  } | null;
  featured_package_ids: string[] | null;
  updated_at: string;
}

// ─── Utility types ───────────────────────────────────────────────────────────

export type PackageWithDays = Package & {
  package_days: (PackageDay & { day_activities: DayActivity[] })[];
  package_inclusions: PackageInclusion[];
  package_exclusions: PackageExclusion[];
  gallery_items: GalleryItem[];
};

export type PackageCardData = Pick<
  Package,
  | "id"
  | "slug"
  | "name"
  | "summary"
  | "destinations"
  | "duration_nights"
  | "duration_days"
  | "pax_capacity"
  | "price_with_food"
  | "price_without_food"
  | "hero_image_url"
  | "vehicle_type"
  | "status"
>;
