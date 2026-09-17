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
DROP POLICY IF EXISTS "packages_public_read" ON packages;
CREATE POLICY "packages_public_read" ON packages
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "packages_auth_all" ON packages;
CREATE POLICY "packages_auth_all" ON packages
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- PACKAGE DAYS — Public can read if package is published
-- ─────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "package_days_public_read" ON package_days;
CREATE POLICY "package_days_public_read" ON package_days
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM packages p 
      WHERE p.id = package_days.package_id AND p.status = 'published'
    )
  );

DROP POLICY IF EXISTS "package_days_auth_all" ON package_days;
CREATE POLICY "package_days_auth_all" ON package_days
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- DAY ACTIVITIES — Public read (via package_days join)
-- ─────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "day_activities_public_read" ON day_activities;
CREATE POLICY "day_activities_public_read" ON day_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM package_days pd
      JOIN packages p ON p.id = pd.package_id
      WHERE pd.id = day_activities.package_day_id AND p.status = 'published'
    )
  );

DROP POLICY IF EXISTS "day_activities_auth_all" ON day_activities;
CREATE POLICY "day_activities_auth_all" ON day_activities
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- PACKAGE INCLUSIONS / EXCLUSIONS
-- ─────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "inclusions_public_read" ON package_inclusions;
CREATE POLICY "inclusions_public_read" ON package_inclusions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM packages p WHERE p.id = package_inclusions.package_id AND p.status = 'published')
  );

DROP POLICY IF EXISTS "inclusions_auth_all" ON package_inclusions;
CREATE POLICY "inclusions_auth_all" ON package_inclusions
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "exclusions_public_read" ON package_exclusions;
CREATE POLICY "exclusions_public_read" ON package_exclusions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM packages p WHERE p.id = package_exclusions.package_id AND p.status = 'published')
  );

DROP POLICY IF EXISTS "exclusions_auth_all" ON package_exclusions;
CREATE POLICY "exclusions_auth_all" ON package_exclusions
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- GALLERY ITEMS — Public read all
-- ─────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "gallery_public_read" ON gallery_items;
CREATE POLICY "gallery_public_read" ON gallery_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "gallery_auth_all" ON gallery_items;
CREATE POLICY "gallery_auth_all" ON gallery_items
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- TESTIMONIALS — Public reads published only
-- ─────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "testimonials_public_read" ON testimonials;
CREATE POLICY "testimonials_public_read" ON testimonials
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "testimonials_auth_all" ON testimonials;
CREATE POLICY "testimonials_auth_all" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- ENQUIRIES — Only auth can read; public can INSERT (submit form)
-- ─────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "enquiries_public_insert" ON enquiries;
CREATE POLICY "enquiries_public_insert" ON enquiries
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "enquiries_auth_all" ON enquiries;
CREATE POLICY "enquiries_auth_all" ON enquiries
  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- SITE SETTINGS — Public read; Auth can update
-- ─────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "settings_public_read" ON site_settings;
CREATE POLICY "settings_public_read" ON site_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "settings_auth_update" ON site_settings;
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
DROP POLICY IF EXISTS "package_media_public_read" ON storage.objects;
CREATE POLICY "package_media_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'package-media');

DROP POLICY IF EXISTS "package_media_auth_write" ON storage.objects;
CREATE POLICY "package_media_auth_write" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'package-media' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "package_media_auth_delete" ON storage.objects;
CREATE POLICY "package_media_auth_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'package-media' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "gallery_public_read_storage" ON storage.objects;
CREATE POLICY "gallery_public_read_storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "gallery_auth_write" ON storage.objects;
CREATE POLICY "gallery_auth_write" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "gallery_auth_delete" ON storage.objects;
CREATE POLICY "gallery_auth_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_auth_write" ON storage.objects;
CREATE POLICY "avatars_auth_write" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
