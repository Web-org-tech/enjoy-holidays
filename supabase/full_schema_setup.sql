-- ═══════════════════════════════════════════════════════════════════════════
-- PADMA TOURS & TRAVELS — Complete All-in-One Database Setup
-- ═══════════════════════════════════════════════════════════════════════════
-- Instructions:
-- 1. Open Supabase Dashboard -> SQL Editor -> New query
-- 2. Paste this entire file and click "Run" (Ctrl+Enter)
-- 3. Everything (tables, triggers, RLS, storage buckets, settings & packages)
--    will be created and configured immediately.
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. TABLES
-- ─────────────────────────────────────────────────────────────────────────────

-- PACKAGES
CREATE TABLE IF NOT EXISTS packages (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                TEXT UNIQUE NOT NULL,
  name                TEXT NOT NULL,
  summary             TEXT NOT NULL DEFAULT '',
  destinations        TEXT[] NOT NULL DEFAULT '{}',
  duration_nights     INTEGER NOT NULL DEFAULT 1,
  duration_days       INTEGER NOT NULL DEFAULT 2,
  pax_capacity        INTEGER NOT NULL DEFAULT 20,
  price_with_food     NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_without_food  NUMERIC(10,2),
  hero_image_url      TEXT,
  hero_video_url      TEXT,
  vehicle_type        TEXT NOT NULL DEFAULT 'jeep'
                      CHECK (vehicle_type IN ('jeep','tuk-tuk','boat','bike','train')),
  status              TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft','published','archived')),
  seo_title           TEXT,
  seo_description     TEXT,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS packages_updated_at ON packages;
CREATE TRIGGER packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- PACKAGE DAYS
CREATE TABLE IF NOT EXISTS package_days (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id      UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  day_number      INTEGER NOT NULL,
  title           TEXT NOT NULL,
  subtitle        TEXT,
  photo_url       TEXT,
  transition_text TEXT,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  UNIQUE(package_id, day_number)
);

CREATE INDEX IF NOT EXISTS idx_package_days_package_id ON package_days(package_id);
CREATE INDEX IF NOT EXISTS idx_package_days_sort ON package_days(package_id, sort_order);

-- DAY ACTIVITIES
CREATE TABLE IF NOT EXISTS day_activities (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_day_id  UUID NOT NULL REFERENCES package_days(id) ON DELETE CASCADE,
  icon            TEXT NOT NULL DEFAULT 'activity',
  label           TEXT NOT NULL,
  sort_order      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_day_activities_day_id ON day_activities(package_day_id);

-- PACKAGE INCLUSIONS
CREATE TABLE IF NOT EXISTS package_inclusions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id  UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_inclusions_package_id ON package_inclusions(package_id);

-- PACKAGE EXCLUSIONS
CREATE TABLE IF NOT EXISTS package_exclusions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id  UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_exclusions_package_id ON package_exclusions(package_id);

-- GALLERY ITEMS
CREATE TABLE IF NOT EXISTS gallery_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id      UUID REFERENCES packages(id) ON DELETE SET NULL,
  destination_tag TEXT,
  media_url       TEXT NOT NULL,
  media_type      TEXT NOT NULL DEFAULT 'image'
                  CHECK (media_type IN ('image','video')),
  alt_text        TEXT,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_package_id ON gallery_items(package_id);
CREATE INDEX IF NOT EXISTS idx_gallery_destination ON gallery_items(destination_tag);

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name   TEXT NOT NULL,
  photo_url       TEXT,
  rating          INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  quote           TEXT NOT NULL,
  package_id      UUID REFERENCES packages(id) ON DELETE SET NULL,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_published    BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(is_published);

-- ENQUIRIES
CREATE TABLE IF NOT EXISTS enquiries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT,
  package_id  UUID REFERENCES packages(id) ON DELETE SET NULL,
  message     TEXT,
  source      TEXT NOT NULL DEFAULT 'form'
              CHECK (source IN ('form','whatsapp_click','phone')),
  status      TEXT NOT NULL DEFAULT 'new'
              CHECK (status IN ('new','contacted','converted','closed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);

-- SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme_colors          JSONB,
  hero_content          JSONB,
  contact_info          JSONB,
  social_links          JSONB,
  featured_package_ids  UUID[],
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure singleton row exists with authentic client data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1) THEN
    INSERT INTO site_settings (
      theme_colors,
      hero_content,
      contact_info,
      social_links,
      featured_package_ids
    ) VALUES (
      '{}',
      '{
        "headline": "Where Will You\nWander Next?",
        "subtext": "Daily tours, Madurai local sightseeing, and customized holiday packages across India since 2004.",
        "cta_primary_label": "Explore Packages",
        "cta_secondary_label": "WhatsApp Us"
      }',
      '{
        "phone": "+91 98659 87975",
        "email": "nirmalharish1980@gmail.com",
        "address": "No: B19/3 Racecourse Colony, Opp. Old Passport Office, Government Quarters, Madurai - 625002",
        "whatsapp_number": "917010111256",
        "business_hours": "24/7 Round-the-Clock Service"
      }',
      '{
        "instagram": "https://instagram.com",
        "facebook": "https://facebook.com",
        "whatsapp": "https://wa.me/917010111256"
      }',
      NULL
    );
  ELSE
    UPDATE site_settings SET
      hero_content = '{
        "headline": "Where Will You\nWander Next?",
        "subtext": "Daily tours, Madurai local sightseeing, and customized holiday packages across India since 2004.",
        "cta_primary_label": "Explore Packages",
        "cta_secondary_label": "WhatsApp Us"
      }',
      contact_info = '{
        "phone": "+91 98659 87975",
        "email": "nirmalharish1980@gmail.com",
        "address": "No: B19/3 Racecourse Colony, Opp. Old Passport Office, Government Quarters, Madurai - 625002",
        "whatsapp_number": "917010111256",
        "business_hours": "24/7 Round-the-Clock Service"
      }'
    WHERE id = (SELECT id FROM site_settings LIMIT 1);
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE packages             ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_days         ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_activities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_inclusions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_exclusions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials         ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries            ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings        ENABLE ROW LEVEL SECURITY;

-- Packages
DROP POLICY IF EXISTS "packages_public_read" ON packages;
CREATE POLICY "packages_public_read" ON packages FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "packages_auth_all" ON packages;
CREATE POLICY "packages_auth_all" ON packages FOR ALL USING (auth.role() = 'authenticated');

-- Package Days
DROP POLICY IF EXISTS "package_days_public_read" ON package_days;
CREATE POLICY "package_days_public_read" ON package_days FOR SELECT USING (
  EXISTS (SELECT 1 FROM packages p WHERE p.id = package_days.package_id AND p.status = 'published')
);
DROP POLICY IF EXISTS "package_days_auth_all" ON package_days;
CREATE POLICY "package_days_auth_all" ON package_days FOR ALL USING (auth.role() = 'authenticated');

-- Day Activities
DROP POLICY IF EXISTS "day_activities_public_read" ON day_activities;
CREATE POLICY "day_activities_public_read" ON day_activities FOR SELECT USING (
  EXISTS (SELECT 1 FROM package_days pd JOIN packages p ON p.id = pd.package_id WHERE pd.id = day_activities.package_day_id AND p.status = 'published')
);
DROP POLICY IF EXISTS "day_activities_auth_all" ON day_activities;
CREATE POLICY "day_activities_auth_all" ON day_activities FOR ALL USING (auth.role() = 'authenticated');

-- Inclusions / Exclusions
DROP POLICY IF EXISTS "inclusions_public_read" ON package_inclusions;
CREATE POLICY "inclusions_public_read" ON package_inclusions FOR SELECT USING (
  EXISTS (SELECT 1 FROM packages p WHERE p.id = package_inclusions.package_id AND p.status = 'published')
);
DROP POLICY IF EXISTS "inclusions_auth_all" ON package_inclusions;
CREATE POLICY "inclusions_auth_all" ON package_inclusions FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "exclusions_public_read" ON package_exclusions;
CREATE POLICY "exclusions_public_read" ON package_exclusions FOR SELECT USING (
  EXISTS (SELECT 1 FROM packages p WHERE p.id = package_exclusions.package_id AND p.status = 'published')
);
DROP POLICY IF EXISTS "exclusions_auth_all" ON package_exclusions;
CREATE POLICY "exclusions_auth_all" ON package_exclusions FOR ALL USING (auth.role() = 'authenticated');

-- Gallery
DROP POLICY IF EXISTS "gallery_public_read" ON gallery_items;
CREATE POLICY "gallery_public_read" ON gallery_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "gallery_auth_all" ON gallery_items;
CREATE POLICY "gallery_auth_all" ON gallery_items FOR ALL USING (auth.role() = 'authenticated');

-- Testimonials
DROP POLICY IF EXISTS "testimonials_public_read" ON testimonials;
CREATE POLICY "testimonials_public_read" ON testimonials FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "testimonials_auth_all" ON testimonials;
CREATE POLICY "testimonials_auth_all" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

-- Enquiries
DROP POLICY IF EXISTS "enquiries_public_insert" ON enquiries;
CREATE POLICY "enquiries_public_insert" ON enquiries FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "enquiries_auth_all" ON enquiries;
CREATE POLICY "enquiries_auth_all" ON enquiries FOR ALL USING (auth.role() = 'authenticated');

-- Settings
DROP POLICY IF EXISTS "settings_public_read" ON site_settings;
CREATE POLICY "settings_public_read" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "settings_auth_update" ON site_settings;
CREATE POLICY "settings_auth_update" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. STORAGE BUCKETS
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public) VALUES ('package-media', 'package-media', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "package_media_public_read" ON storage.objects;
CREATE POLICY "package_media_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'package-media');
DROP POLICY IF EXISTS "package_media_auth_write" ON storage.objects;
CREATE POLICY "package_media_auth_write" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'package-media' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "package_media_auth_delete" ON storage.objects;
CREATE POLICY "package_media_auth_delete" ON storage.objects FOR DELETE USING (bucket_id = 'package-media' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "gallery_public_read_storage" ON storage.objects;
CREATE POLICY "gallery_public_read_storage" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
DROP POLICY IF EXISTS "gallery_auth_write" ON storage.objects;
CREATE POLICY "gallery_auth_write" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "gallery_auth_delete" ON storage.objects;
CREATE POLICY "gallery_auth_delete" ON storage.objects FOR DELETE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
DROP POLICY IF EXISTS "avatars_auth_write" ON storage.objects;
CREATE POLICY "avatars_auth_write" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. SEED DATA (AUTHENTIC PADMA TOURS & TRAVELS SHOWCASE PACKAGES)
-- ─────────────────────────────────────────────────────────────────────────────

DELETE FROM packages WHERE slug IN ('madurai-heritage-temple-tour', 'kerala-coastal-escape', 'coorg-highlands-retreat');
DELETE FROM testimonials WHERE customer_name IN ('Priya Nair', 'Rahul & Deepa Sharma', 'Dr. Anand Venkatesh', 'K. Senthil Nathan');

-- PACKAGE 1: Madurai Heritage & Temple Circuit (2 Days / 1 Night)
WITH pkg_madurai AS (
  INSERT INTO packages (
    slug, name, summary, destinations, duration_nights, duration_days,
    pax_capacity, price_with_food, price_without_food,
    hero_image_url, vehicle_type, status,
    seo_title, seo_description, notes
  ) VALUES (
    'madurai-heritage-temple-tour',
    'Madurai Heritage & Temple Circuit',
    'Immerse yourself in the timeless cultural soul of Madurai — the historic Athens of the East. Visit the legendary Meenakshi Sundareswarar Temple, regal Thirumalai Nayakkar Mahal, Gandhi Memorial Museum, and sacred Alagar Kovil with our 20+ years experienced local chauffeurs.',
    ARRAY['Madurai', 'Alagar Kovil', 'Thiruparankundram'],
    1, 2, 12,
    6499, 4999,
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&q=80',
    'jeep',
    'published',
    'Madurai Heritage & Temple Circuit — 2 Days Tour | PADMA TOURS & TRAVELS',
    'Experience Madurai''s Meenakshi Amman Temple, Thirumalai Nayak Palace light show, Gandhi Museum and sacred Alagar Kovil. 24/7 service by Padma Tours & Travels.',
    'Traditional dress code required for temple entry. Early morning darshan assistance provided by our experienced local team. 24/7 customer helpline available.'
  ) RETURNING id
),
d1_madurai AS (
  INSERT INTO package_days (package_id, day_number, title, subtitle, transition_text, photo_url, sort_order)
  SELECT id, 1, 'Arrival & Historic Temples', 'Meenakshi Amman Temple & Nayakkar Palace',
    'After checking in and refreshing, our chauffeur will escort you to the sacred temple corridor.',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80', 0
  FROM pkg_madurai RETURNING id
),
d2_madurai AS (
  INSERT INTO package_days (package_id, day_number, title, subtitle, transition_text, photo_url, sort_order)
  SELECT id, 2, 'Heritage Trails & Sacred Hills', 'Alagar Kovil & Gandhi Memorial',
    'Morning drive to the scenic foothills of Alagar Kovil and Pazhamudhircholai Murugan Temple.',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', 1
  FROM pkg_madurai RETURNING id
)
INSERT INTO day_activities (package_day_id, icon, label, sort_order)
SELECT id, 'transport', 'Airport / Railway Station pickup & check-in', 0 FROM d1_madurai
UNION ALL SELECT id, 'culture', 'Guided Meenakshi Amman Temple Darshan', 1 FROM d1_madurai
UNION ALL SELECT id, 'meal', 'Traditional South Indian lunch & Famous Jigarthanda stop', 2 FROM d1_madurai
UNION ALL SELECT id, 'activity', 'Thirumalai Nayakkar Mahal & Evening Light and Sound Show', 3 FROM d1_madurai
UNION ALL SELECT id, 'hotel', 'Night stay in comfortable central Madurai hotel', 4 FROM d1_madurai
UNION ALL SELECT id, 'breakfast', 'Authentic Madurai breakfast: Soft Idlis & Vada', 0 FROM d2_madurai
UNION ALL SELECT id, 'activity', 'Scenic drive & visit to Alagar Kovil & Pazhamudhircholai', 1 FROM d2_madurai
UNION ALL SELECT id, 'culture', 'Gandhi Memorial Museum & Heritage Walk', 2 FROM d2_madurai
UNION ALL SELECT id, 'activity', 'Thiruparankundram Rock-cut Temple visit', 3 FROM d2_madurai
UNION ALL SELECT id, 'transport', 'Evening drop at Madurai Airport / Junction', 4 FROM d2_madurai;

-- Inclusions for Madurai Package
WITH pkg_m_id AS (SELECT id FROM packages WHERE slug = 'madurai-heritage-temple-tour')
INSERT INTO package_inclusions (package_id, text, sort_order)
SELECT id, text, sort_order FROM pkg_m_id,
(VALUES
  ('1 night comfortable hotel accommodation in central Madurai', 0),
  ('Dedicated private AC vehicle throughout the tour', 1),
  ('Punctual doorstep pickup and drop (Airport / Railway Station)', 2),
  ('All toll charges, parking fees, and driver allowances included', 3),
  ('Experienced, courteous driver with expert temple route knowledge', 4),
  ('24/7 dedicated helpline support from Padma Tours office', 5)
) AS t(text, sort_order);

-- Exclusions for Madurai Package
WITH pkg_m_id AS (SELECT id FROM packages WHERE slug = 'madurai-heritage-temple-tour')
INSERT INTO package_exclusions (package_id, text, sort_order)
SELECT id, text, sort_order FROM pkg_m_id,
(VALUES
  ('Airfare or train tickets to Madurai', 0),
  ('Special temple quick-darshan passes or pooja tickets', 1),
  ('Personal expenses, souvenirs, tips & camera fees', 2),
  ('Meals not explicitly chosen in the booking option', 3)
) AS t(text, sort_order);

-- PACKAGE 2: Kerala Coastal Escape (5 Days / 4 Nights)
WITH pkg1 AS (
  INSERT INTO packages (
    slug, name, summary, destinations, duration_nights, duration_days,
    pax_capacity, price_with_food, price_without_food,
    hero_image_url, vehicle_type, status,
    seo_title, seo_description, notes
  ) VALUES (
    'kerala-coastal-escape',
    'Kerala Coastal Escape',
    'An immersive journey through Kerala''s legendary backwaters, pristine beaches, and spice-scented hill stations. From the tranquil houseboat corridors of Alleppey to the dramatic clifftops of Varkala — this is the Kerala that stays with you forever.',
    ARRAY['Kochi','Alleppey','Varkala','Kovalam'],
    4, 5, 18,
    18999, 15499,
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=80',
    'boat',
    'published',
    'Kerala Coastal Escape — 5 Days Backwaters & Beach Holiday | PADMA TOURS & TRAVELS',
    'Experience Kerala''s backwaters, beaches, and culture in our 5-day curated package. Houseboat stay, Varkala beach, Kathakali show & more. Starting ₹18,999/person.',
    'Please carry light cotton clothing. Prices subject to change during peak holiday seasons. 24/7 support throughout the journey.'
  ) RETURNING id
),
day1_pkg1 AS (
  INSERT INTO package_days (package_id, day_number, title, subtitle, transition_text, sort_order)
  SELECT id, 0, 'Departure', 'Journey Begins', 'Board your flight or train to Kochi. Our team will be waiting to welcome you.', 0
  FROM pkg1 RETURNING id
),
day2_pkg1 AS (
  INSERT INTO package_days (package_id, day_number, title, subtitle, photo_url, transition_text, sort_order)
  SELECT id, 1, 'Kochi — The Queen of the Arabian Sea', 'Fort Kochi & Cultural Immersion',
    'https://images.unsplash.com/photo-1544806383-534d25e7f6bc?w=800&q=80',
    'Early morning drive south to Alleppey (90 min). The coconut-lined road is an experience in itself.', 1
  FROM pkg1 RETURNING id
),
day3_pkg1 AS (
  INSERT INTO package_days (package_id, day_number, title, subtitle, photo_url, transition_text, sort_order)
  SELECT id, 2, 'Alleppey — Life on the Backwaters', 'Houseboat Day',
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    'Check out and drive to Varkala (2 hrs) — watch the landscape shift from backwaters to sea cliffs.', 2
  FROM pkg1 RETURNING id
),
day4_pkg1 AS (
  INSERT INTO package_days (package_id, day_number, title, subtitle, photo_url, transition_text, sort_order)
  SELECT id, 3, 'Varkala — Clifftop Serenity', 'Beach, Ayurveda & Sunset',
    'https://images.unsplash.com/photo-1621782540344-f01cbf8f1cb8?w=800&q=80',
    'Short drive to Kovalam beach (45 min) for the final coastal chapter.', 3
  FROM pkg1 RETURNING id
),
day5_pkg1 AS (
  INSERT INTO package_days (package_id, day_number, title, subtitle, photo_url, transition_text, sort_order)
  SELECT id, 4, 'Kovalam & Farewell', 'Final Morning Beach Walk',
    'https://images.unsplash.com/photo-1590080876063-22a9cb1f0d78?w=800&q=80',
    'Transfer to Trivandrum airport. Until next time — Kerala awaits your return.', 4
  FROM pkg1 RETURNING id
),
day6_pkg1 AS (
  INSERT INTO package_days (package_id, day_number, title, subtitle, transition_text, sort_order)
  SELECT id, 5, 'Return', 'Safe Travels Home', NULL, 5
  FROM pkg1 RETURNING id
)
INSERT INTO day_activities (package_day_id, icon, label, sort_order)
SELECT id, 'transport', 'Arrive Kochi International Airport', 0 FROM day1_pkg1
UNION ALL SELECT id, 'hotel', 'Check-in — Fort Kochi Heritage Homestay', 1 FROM day1_pkg1
UNION ALL SELECT id, 'sunset', 'Evening stroll at Fort Kochi beach', 2 FROM day1_pkg1
UNION ALL SELECT id, 'breakfast', 'Kerala breakfast: Appam & Stew', 0 FROM day2_pkg1
UNION ALL SELECT id, 'activity', 'Chinese Fishing Nets & Fort Kochi Walk', 1 FROM day2_pkg1
UNION ALL SELECT id, 'activity', 'Kathakali Cultural Show (evening)', 2 FROM day2_pkg1
UNION ALL SELECT id, 'meal', 'Dinner — Traditional Kerala Sadya', 3 FROM day2_pkg1
UNION ALL SELECT id, 'hotel', 'Night stay — Fort Kochi', 4 FROM day2_pkg1
UNION ALL SELECT id, 'transport', 'Drive to Alleppey (90 min)', 0 FROM day3_pkg1
UNION ALL SELECT id, 'activity', 'Houseboat check-in & cruise', 1 FROM day3_pkg1
UNION ALL SELECT id, 'meal', 'Lunch served on houseboat', 2 FROM day3_pkg1
UNION ALL SELECT id, 'activity', 'Village walk & sunset on backwaters', 3 FROM day3_pkg1
UNION ALL SELECT id, 'meal', 'Dinner & overnight on houseboat', 4 FROM day3_pkg1
UNION ALL SELECT id, 'breakfast', 'Breakfast on houseboat', 0 FROM day4_pkg1
UNION ALL SELECT id, 'transport', 'Drive to Varkala (2 hrs)', 1 FROM day4_pkg1
UNION ALL SELECT id, 'activity', 'Cliff walk & Papanasam Beach swim', 2 FROM day4_pkg1
UNION ALL SELECT id, 'activity', 'Ayurvedic massage session (90 min)', 3 FROM day4_pkg1
UNION ALL SELECT id, 'sunset', 'Sunset from North Cliff', 4 FROM day4_pkg1
UNION ALL SELECT id, 'hotel', 'Night stay — Varkala Cliff Resort', 5 FROM day4_pkg1
UNION ALL SELECT id, 'breakfast', 'Breakfast at clifftop café', 0 FROM day5_pkg1
UNION ALL SELECT id, 'transport', 'Drive to Kovalam (45 min)', 1 FROM day5_pkg1
UNION ALL SELECT id, 'activity', 'Lighthouse Beach morning stroll', 2 FROM day5_pkg1
UNION ALL SELECT id, 'meal', 'Fresh seafood lunch', 3 FROM day5_pkg1
UNION ALL SELECT id, 'transport', 'Transfer to Trivandrum Airport', 4 FROM day5_pkg1
UNION ALL SELECT id, 'transport', 'Fly home with memories to last a lifetime', 0 FROM day6_pkg1;

-- Inclusions for Package 2
WITH pkg1_id AS (SELECT id FROM packages WHERE slug = 'kerala-coastal-escape')
INSERT INTO package_inclusions (package_id, text, sort_order)
SELECT id, text, sort_order FROM pkg1_id,
(VALUES
  ('Accommodation: 3 nights hotel + 1 night houseboat', 0),
  ('Daily breakfast + selected meals as per itinerary', 1),
  ('All transfers in private AC vehicle', 2),
  ('Kathakali show tickets', 3),
  ('Houseboat cruise (full day + overnight)', 4),
  ('Ayurvedic massage (1 session)', 5),
  ('Professional English & Tamil speaking driver', 6),
  ('All tolls, parking & driver allowance', 7)
) AS t(text, sort_order);

-- Exclusions for Package 2
WITH pkg1_id AS (SELECT id FROM packages WHERE slug = 'kerala-coastal-escape')
INSERT INTO package_exclusions (package_id, text, sort_order)
SELECT id, text, sort_order FROM pkg1_id,
(VALUES
  ('Airfare / train tickets to/from Kochi', 0),
  ('GST at 5% (applicable on package price)', 1),
  ('Personal expenses, shopping, tips', 2),
  ('Travel insurance', 3),
  ('Any activity not mentioned in the itinerary', 4),
  ('Meals not specified in the itinerary', 5)
) AS t(text, sort_order);

-- PACKAGE 3: Coorg Highlands (4 Days / 3 Nights)
WITH pkg2 AS (
  INSERT INTO packages (
    slug, name, summary, destinations, duration_nights, duration_days,
    pax_capacity, price_with_food, price_without_food,
    hero_image_url, vehicle_type, status,
    seo_title, seo_description, notes
  ) VALUES (
    'coorg-highlands-retreat',
    'Coorg Highlands Retreat',
    'Escape into the misty coffee plantations and roaring waterfalls of Coorg — India''s Scotland. Walk through spice gardens, sip freshly brewed estate coffee, and let the cool highland air refresh your soul.',
    ARRAY['Madikeri','Namdroling','Abbey Falls','Talacauvery'],
    3, 4, 16,
    14999, 12499,
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&q=80',
    'jeep',
    'published',
    'Coorg Highlands Retreat — 4 Days Coffee & Waterfall Escape | PADMA TOURS & TRAVELS',
    'Discover Coorg''s misty coffee plantations, Talacauvery source, Abbey Falls, and golden monastery. 4-day premium package starting ₹14,999/person.',
    'Best visited Oct–May. Carry light woollens for evenings. 24/7 vehicle assistance provided.'
  ) RETURNING id
),
d1_p2 AS (
  INSERT INTO package_days (package_id, day_number, title, subtitle, transition_text, sort_order)
  SELECT id, 0, 'Departure', 'Set Off to the Highlands', 'Drive from Bangalore/Mysore to Madikeri (250 km / ~5 hrs). Coffee stops welcome!', 0
  FROM pkg2 RETURNING id
),
d2_p2 AS (
  INSERT INTO package_days (package_id, day_number, title, subtitle, photo_url, transition_text, sort_order)
  SELECT id, 1, 'Madikeri — Into Coffee Country', 'Plantation Walk & Colonial Town',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    'After breakfast, head to Abbey Falls and the Golden Temple at Namdroling.', 1
  FROM pkg2 RETURNING id
),
d3_p2 AS (
  INSERT INTO package_days (package_id, day_number, title, subtitle, photo_url, transition_text, sort_order)
  SELECT id, 2, 'Abbey Falls & Golden Monastery', 'Waterfalls, Monks & Mountain Views',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80',
    'Morning drive to Talacauvery — the birthplace of river Cauvery at 1276m altitude.', 2
  FROM pkg2 RETURNING id
),
d4_p2 AS (
  INSERT INTO package_days (package_id, day_number, title, subtitle, photo_url, transition_text, sort_order)
  SELECT id, 3, 'Talacauvery & Raja''s Seat', 'Sacred Source & Panoramic Sunset',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'After breakfast, begin the drive back. Arrive by evening.', 3
  FROM pkg2 RETURNING id
),
d5_p2 AS (
  INSERT INTO package_days (package_id, day_number, title, subtitle, transition_text, sort_order)
  SELECT id, 4, 'Return', 'Carry the Highlands Home', NULL, 4
  FROM pkg2 RETURNING id
)
INSERT INTO day_activities (package_day_id, icon, label, sort_order)
SELECT id, 'transport', 'Depart Bangalore by 6 AM (jeep pickup)', 0 FROM d1_p2
UNION ALL SELECT id, 'meal', 'Lunch en-route at Mysore', 1 FROM d1_p2
UNION ALL SELECT id, 'hotel', 'Check-in — Coffee Estate Bungalow', 2 FROM d1_p2
UNION ALL SELECT id, 'sunset', 'Evening at Raja''s Seat viewpoint', 3 FROM d1_p2
UNION ALL SELECT id, 'breakfast', 'Estate coffee breakfast', 0 FROM d2_p2
UNION ALL SELECT id, 'activity', 'Guided Coffee & Spice Plantation Walk', 1 FROM d2_p2
UNION ALL SELECT id, 'activity', 'Madikeri Fort & Raja''s Tomb', 2 FROM d2_p2
UNION ALL SELECT id, 'meal', 'Authentic Coorgi dinner', 3 FROM d2_p2
UNION ALL SELECT id, 'hotel', 'Night stay — Coffee Estate', 4 FROM d2_p2
UNION ALL SELECT id, 'breakfast', 'Breakfast with estate coffee', 0 FROM d3_p2
UNION ALL SELECT id, 'activity', 'Abbey Falls trek & photography', 1 FROM d3_p2
UNION ALL SELECT id, 'activity', 'Namdroling Golden Temple', 2 FROM d3_p2
UNION ALL SELECT id, 'meal', 'Lunch at local restaurant', 3 FROM d3_p2
UNION ALL SELECT id, 'activity', 'Elephant camp visit (optional)', 4 FROM d3_p2
UNION ALL SELECT id, 'hotel', 'Night stay — Estate Bungalow', 5 FROM d3_p2
UNION ALL SELECT id, 'breakfast', 'Packed breakfast for early start', 0 FROM d4_p2
UNION ALL SELECT id, 'transport', 'Drive to Talacauvery (55 km jeep route)', 1 FROM d4_p2
UNION ALL SELECT id, 'activity', 'Bhagamandala — Triveni Sangam', 2 FROM d4_p2
UNION ALL SELECT id, 'activity', 'Talacauvery — Cauvery River source & temple', 3 FROM d4_p2
UNION ALL SELECT id, 'sunset', 'Sunset at Raja''s Seat panoramic point', 4 FROM d4_p2
UNION ALL SELECT id, 'meal', 'Farewell dinner — traditional feast', 5 FROM d4_p2
UNION ALL SELECT id, 'transport', 'Drive back to return point', 0 FROM d5_p2;

-- Inclusions for Package 3
WITH pkg2_id AS (SELECT id FROM packages WHERE slug = 'coorg-highlands-retreat')
INSERT INTO package_inclusions (package_id, text, sort_order)
SELECT id, text, sort_order FROM pkg2_id,
(VALUES
  ('3 nights accommodation in coffee estate bungalow', 0),
  ('All meals: Daily breakfast + 2 lunches + 2 dinners', 1),
  ('Transport in 4WD vehicle throughout', 2),
  ('Coffee plantation guided walk', 3),
  ('Abbey Falls trek with guide', 4),
  ('Talacauvery & Bhagamandala visit', 5),
  ('All local sightseeing as per itinerary', 6),
  ('Driver allowance & fuel', 7)
) AS t(text, sort_order);

-- Exclusions for Package 3
WITH pkg2_id AS (SELECT id FROM packages WHERE slug = 'coorg-highlands-retreat')
INSERT INTO package_exclusions (package_id, text, sort_order)
SELECT id, text, sort_order FROM pkg2_id,
(VALUES
  ('Travel to/from starting point', 0),
  ('GST at 5%', 1),
  ('Entry tickets to paid attractions not mentioned', 2),
  ('Personal purchases and shopping', 3),
  ('Travel insurance', 4)
) AS t(text, sort_order);

-- GALLERY ITEMS
DELETE FROM gallery_items WHERE destination_tag IN ('Madurai', 'Kerala', 'Coorg');

WITH pkg_m_id AS (SELECT id FROM packages WHERE slug = 'madurai-heritage-temple-tour'),
     pkg1_id AS (SELECT id FROM packages WHERE slug = 'kerala-coastal-escape'),
     pkg2_id AS (SELECT id FROM packages WHERE slug = 'coorg-highlands-retreat')
INSERT INTO gallery_items (package_id, destination_tag, media_url, media_type, alt_text, sort_order)
SELECT id, 'Madurai', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80', 'image', 'Madurai Meenakshi Temple Tower Heritage', 0 FROM pkg_m_id
UNION ALL SELECT id, 'Madurai', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', 'image', 'Thirumalai Nayakkar Palace Madurai', 1 FROM pkg_m_id
UNION ALL SELECT id, 'Kerala', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80', 'image', 'Kerala backwaters houseboat', 2 FROM pkg1_id
UNION ALL SELECT id, 'Kerala', 'https://images.unsplash.com/photo-1544806383-534d25e7f6bc?w=800&q=80', 'image', 'Fort Kochi Chinese fishing nets', 3 FROM pkg1_id
UNION ALL SELECT id, 'Kerala', 'https://images.unsplash.com/photo-1621782540344-f01cbf8f1cb8?w=800&q=80', 'image', 'Varkala cliff beach sunset', 4 FROM pkg1_id
UNION ALL SELECT id, 'Kerala', 'https://images.unsplash.com/photo-1590080876063-22a9cb1f0d78?w=800&q=80', 'image', 'Kovalam lighthouse beach', 5 FROM pkg1_id
UNION ALL SELECT id, 'Coorg', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80', 'image', 'Coorg coffee plantation mist', 6 FROM pkg2_id
UNION ALL SELECT id, 'Coorg', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', 'image', 'Mountain sunrise view', 7 FROM pkg2_id;

-- TESTIMONIALS
WITH pkg_m_id AS (SELECT id FROM packages WHERE slug = 'madurai-heritage-temple-tour'),
     pkg1_id AS (SELECT id FROM packages WHERE slug = 'kerala-coastal-escape'),
     pkg2_id AS (SELECT id FROM packages WHERE slug = 'coorg-highlands-retreat')
INSERT INTO testimonials (customer_name, photo_url, rating, quote, package_id, sort_order, is_published)
VALUES
  ('K. Senthil Nathan', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', 5,
   'Booked Madurai sightseeing and Rameswaram daily tour with Padma Tours & Travels. The vehicle was spotlessly clean, and our driver was extremely polite and well-versed with temple darshan timings. 24/7 service was genuine!',
   (SELECT id FROM pkg_m_id), 0, true),
  ('Dr. Anand Venkatesh', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', 5,
   'Best car rental and local sightseeing service in Madurai. Clean vehicle, punctual airport pickup at 5 AM, and courteous driving throughout Meenakshi Amman Temple and Alagar Kovil. Highly recommended for families!',
   (SELECT id FROM pkg_m_id), 1, true),
  ('Priya Nair', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', 5,
   'The houseboat night in Alleppey was magical — stars reflecting on the still water. PADMA TOURS & TRAVELS thought of every detail. We felt like the backwaters were ours alone.',
   (SELECT id FROM pkg1_id), 2, true),
  ('Rahul & Deepa Sharma', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80', 5,
   'Booked the Coorg package for our anniversary. The coffee estate bungalow was stunning — we woke up to mist between the trees and freshly brewed estate coffee. Absolutely seamless!',
   (SELECT id FROM pkg2_id), 3, true);
