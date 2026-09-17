-- ═══════════════════════════════════════════════════════════════════════════
-- ENJOY Holidays — Initial Database Schema
-- Run this in Supabase SQL Editor (Project > SQL Editor > New Query)
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for full-text search on packages

-- ─────────────────────────────────────────────────────────────────────────────
-- PACKAGES
-- ─────────────────────────────────────────────────────────────────────────────
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

-- Auto-update updated_at
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

-- ─────────────────────────────────────────────────────────────────────────────
-- PACKAGE DAYS
-- ─────────────────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────────────────
-- DAY ACTIVITIES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS day_activities (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_day_id  UUID NOT NULL REFERENCES package_days(id) ON DELETE CASCADE,
  icon            TEXT NOT NULL DEFAULT 'activity',
  label           TEXT NOT NULL,
  sort_order      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_day_activities_day_id ON day_activities(package_day_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- PACKAGE INCLUSIONS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS package_inclusions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id  UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_inclusions_package_id ON package_inclusions(package_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- PACKAGE EXCLUSIONS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS package_exclusions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id  UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_exclusions_package_id ON package_exclusions(package_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- GALLERY ITEMS
-- ─────────────────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────────────────
-- TESTIMONIALS
-- ─────────────────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────────────────
-- ENQUIRIES
-- ─────────────────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────────────────
-- SITE SETTINGS (singleton row)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme_colors          JSONB,
  hero_content          JSONB,
  contact_info          JSONB,
  social_links          JSONB,
  featured_package_ids  UUID[],
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default singleton row
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
    "subtext": "Handcrafted holiday packages across India — we craft journeys, not just trips.",
    "cta_primary_label": "Explore Packages",
    "cta_secondary_label": "WhatsApp Us"
  }',
  '{
    "phone": "+91 99999 99999",
    "email": "hello@enjoyholidays.in",
    "address": "123 Travel Lane, Kochi, Kerala 682001",
    "whatsapp_number": "919999999999",
    "gst_number": "29ABCDE1234F1Z5"
  }',
  '{
    "instagram": "https://instagram.com/enjoyholidays",
    "facebook": "https://facebook.com/enjoyholidays",
    "youtube": "https://youtube.com/@enjoyholidays"
  }',
  NULL
) ON CONFLICT DO NOTHING;
