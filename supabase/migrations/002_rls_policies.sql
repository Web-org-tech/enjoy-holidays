-- ═══════════════════════════════════════════════════════════════════════════
-- ENJOY Holidays — Row Level Security Policies
-- Run AFTER 001_initial_schema.sql
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE packages             ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_days         ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_activities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_inclusions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_exclusions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials         ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries            ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings        ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- PACKAGES — Public can read published; Auth can do everything
-- ─────────────────────────────────────────────────────────────────────────────
CREATE POLICY "packages_public_read" ON packages
  FOR SELECT USING (status = 'published');

CREATE POLICY "packages_auth_all" ON packages
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- PACKAGE DAYS — Public can read if package is published
-- ─────────────────────────────────────────────────────────────────────────────
CREATE POLICY "package_days_public_read" ON package_days
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM packages p 
      WHERE p.id = package_days.package_id AND p.status = 'published'
    )
  );

CREATE POLICY "package_days_auth_all" ON package_days
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- DAY ACTIVITIES — Public read (via package_days join)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE POLICY "day_activities_public_read" ON day_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM package_days pd
      JOIN packages p ON p.id = pd.package_id
      WHERE pd.id = day_activities.package_day_id AND p.status = 'published'
    )
  );

CREATE POLICY "day_activities_auth_all" ON day_activities
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- PACKAGE INCLUSIONS / EXCLUSIONS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE POLICY "inclusions_public_read" ON package_inclusions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM packages p WHERE p.id = package_inclusions.package_id AND p.status = 'published')
  );
CREATE POLICY "inclusions_auth_all" ON package_inclusions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "exclusions_public_read" ON package_exclusions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM packages p WHERE p.id = package_exclusions.package_id AND p.status = 'published')
  );
CREATE POLICY "exclusions_auth_all" ON package_exclusions
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- GALLERY ITEMS — Public read all
-- ─────────────────────────────────────────────────────────────────────────────
CREATE POLICY "gallery_public_read" ON gallery_items
  FOR SELECT USING (true);

CREATE POLICY "gallery_auth_all" ON gallery_items
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- TESTIMONIALS — Public reads published only
-- ─────────────────────────────────────────────────────────────────────────────
CREATE POLICY "testimonials_public_read" ON testimonials
  FOR SELECT USING (is_published = true);

CREATE POLICY "testimonials_auth_all" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- ENQUIRIES — Only auth can read; public can INSERT (submit form)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE POLICY "enquiries_public_insert" ON enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "enquiries_auth_all" ON enquiries
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- SITE SETTINGS — Public read; Auth can update
-- ─────────────────────────────────────────────────────────────────────────────
CREATE POLICY "settings_public_read" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "settings_auth_update" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- STORAGE BUCKETS (run in Supabase Dashboard > Storage > New Bucket)
-- Or via SQL:
-- ─────────────────────────────────────────────────────────────────────────────
-- Package hero images + day photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('package-media', 'package-media', true) 
ON CONFLICT DO NOTHING;

-- Gallery images/videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true) 
ON CONFLICT DO NOTHING;

-- Team/testimonial photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true) 
ON CONFLICT DO NOTHING;

-- Storage policies: allow public read, auth upload/delete
CREATE POLICY "package_media_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'package-media');

CREATE POLICY "package_media_auth_write" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'package-media' AND auth.role() = 'authenticated');

CREATE POLICY "package_media_auth_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'package-media' AND auth.role() = 'authenticated');

CREATE POLICY "gallery_public_read_storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "gallery_auth_write" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "gallery_auth_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_auth_write" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
