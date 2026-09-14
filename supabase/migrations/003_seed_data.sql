-- ═══════════════════════════════════════════════════════════════════════════
-- ENJOY Holidays — Seed Data (2 complete showcase packages)
-- Run AFTER 001_initial_schema.sql and 002_rls_policies.sql
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- PACKAGE 1: Kerala Coastal Escape (5 Days / 4 Nights)
-- ─────────────────────────────────────────────────────────────────────────────
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
    'Kerala Coastal Escape — 5 Days Backwaters & Beach Holiday | ENJOY Holidays',
    'Experience Kerala''s backwaters, beaches, and culture in our 5-day curated package. Houseboat stay, Varkala beach, Kathakali show & more. Starting ₹18,999/person.',
    'Please carry light cotton clothing. Prices subject to change during peak season (Dec–Jan). GST additional at 5%.'
  ) RETURNING id
),
-- Days for Package 1
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
-- Activities: Day 0
INSERT INTO day_activities (package_day_id, icon, label, sort_order)
SELECT id, 'transport', 'Arrive Kochi International Airport', 0 FROM day1_pkg1
UNION ALL SELECT id, 'hotel', 'Check-in — Fort Kochi Heritage Homestay', 1 FROM day1_pkg1
UNION ALL SELECT id, 'sunset', 'Evening stroll at Fort Kochi beach', 2 FROM day1_pkg1
-- Activities: Day 1
UNION ALL SELECT id, 'breakfast', 'Kerala breakfast: Appam & Stew', 0 FROM day2_pkg1
UNION ALL SELECT id, 'activity', 'Chinese Fishing Nets & Fort Kochi Walk', 1 FROM day2_pkg1
UNION ALL SELECT id, 'activity', 'Kathakali Cultural Show (evening)', 2 FROM day2_pkg1
UNION ALL SELECT id, 'meal', 'Dinner — Traditional Kerala Sadya', 3 FROM day2_pkg1
UNION ALL SELECT id, 'hotel', 'Night stay — Fort Kochi', 4 FROM day2_pkg1
-- Activities: Day 2
UNION ALL SELECT id, 'transport', 'Drive to Alleppey (90 min)', 0 FROM day3_pkg1
UNION ALL SELECT id, 'activity', 'Houseboat check-in & cruise', 1 FROM day3_pkg1
UNION ALL SELECT id, 'meal', 'Lunch served on houseboat', 2 FROM day3_pkg1
UNION ALL SELECT id, 'activity', 'Village walk & sunset on backwaters', 3 FROM day3_pkg1
UNION ALL SELECT id, 'meal', 'Dinner & overnight on houseboat', 4 FROM day3_pkg1
-- Activities: Day 3
UNION ALL SELECT id, 'breakfast', 'Breakfast on houseboat', 0 FROM day4_pkg1
UNION ALL SELECT id, 'transport', 'Drive to Varkala (2 hrs)', 1 FROM day4_pkg1
UNION ALL SELECT id, 'activity', 'Cliff walk & Papanasam Beach swim', 2 FROM day4_pkg1
UNION ALL SELECT id, 'activity', 'Ayurvedic massage session (90 min)', 3 FROM day4_pkg1
UNION ALL SELECT id, 'sunset', 'Sunset from North Cliff', 4 FROM day4_pkg1
UNION ALL SELECT id, 'hotel', 'Night stay — Varkala Cliff Resort', 5 FROM day4_pkg1
-- Activities: Day 4
UNION ALL SELECT id, 'breakfast', 'Breakfast at clifftop café', 0 FROM day5_pkg1
UNION ALL SELECT id, 'transport', 'Drive to Kovalam (45 min)', 1 FROM day5_pkg1
UNION ALL SELECT id, 'activity', 'Lighthouse Beach morning stroll', 2 FROM day5_pkg1
UNION ALL SELECT id, 'meal', 'Fresh seafood lunch', 3 FROM day5_pkg1
UNION ALL SELECT id, 'transport', 'Transfer to Trivandrum Airport', 4 FROM day5_pkg1
-- Activities: Day 5 (Return)
UNION ALL SELECT id, 'transport', 'Fly home with memories to last a lifetime', 0 FROM day6_pkg1;

-- Inclusions for Package 1
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
  ('Professional English-speaking tour guide', 6),
  ('All tolls, parking & driver allowance', 7)
) AS t(text, sort_order);

-- Exclusions for Package 1
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

-- ─────────────────────────────────────────────────────────────────────────────
-- PACKAGE 2: Coorg Highlands (4 Days / 3 Nights)
-- ─────────────────────────────────────────────────────────────────────────────
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
    'Coorg Highlands Retreat — 4 Days Coffee & Waterfall Escape | ENJOY Holidays',
    'Discover Coorg''s misty coffee plantations, Talacauvery source, Abbey Falls, and golden monastery. 4-day premium package starting ₹14,999/person.',
    'Best visited Oct–May. Monsoon season (Jun–Sep) is beautiful but some roads may be slippery. Carry light woollens for evenings.'
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
    'After breakfast, begin the drive back to Bangalore/Mysore. Arrive by evening.', 3
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
UNION ALL SELECT id, 'meal', 'Authentic Coorgi Pandi Curry dinner', 3 FROM d2_p2
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
UNION ALL SELECT id, 'meal', 'Farewell dinner — traditional Coorg feast', 5 FROM d4_p2
UNION ALL SELECT id, 'transport', 'Drive back to Bangalore/Mysore', 0 FROM d5_p2;

-- Inclusions for Package 2
WITH pkg2_id AS (SELECT id FROM packages WHERE slug = 'coorg-highlands-retreat')
INSERT INTO package_inclusions (package_id, text, sort_order)
SELECT id, text, sort_order FROM pkg2_id,
(VALUES
  ('3 nights accommodation in coffee estate bungalow', 0),
  ('All meals: Daily breakfast + 2 lunches + 2 dinners', 1),
  ('Transport in 4WD jeep (Bangalore/Mysore pickup available)', 2),
  ('Coffee plantation guided walk', 3),
  ('Abbey Falls trek with guide', 4),
  ('Talacauvery & Bhagamandala visit', 5),
  ('All local sightseeing as per itinerary', 6),
  ('Driver allowance & fuel', 7)
) AS t(text, sort_order);

-- Exclusions for Package 2
WITH pkg2_id AS (SELECT id FROM packages WHERE slug = 'coorg-highlands-retreat')
INSERT INTO package_exclusions (package_id, text, sort_order)
SELECT id, text, sort_order FROM pkg2_id,
(VALUES
  ('Travel to/from starting point (Bangalore/Mysore)', 0),
  ('GST at 5%', 1),
  ('Entry tickets to paid attractions not mentioned', 2),
  ('Elephant camp activity (optional add-on ₹500/person)', 3),
  ('Travel insurance', 4),
  ('Personal purchases and shopping', 5)
) AS t(text, sort_order);

-- ─────────────────────────────────────────────────────────────────────────────
-- GALLERY ITEMS
-- ─────────────────────────────────────────────────────────────────────────────
WITH pkg1_id AS (SELECT id FROM packages WHERE slug = 'kerala-coastal-escape'),
     pkg2_id AS (SELECT id FROM packages WHERE slug = 'coorg-highlands-retreat')
INSERT INTO gallery_items (package_id, destination_tag, media_url, media_type, alt_text, sort_order)
SELECT id, 'Kerala', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80', 'image', 'Kerala backwaters houseboat', 0 FROM pkg1_id
UNION ALL SELECT id, 'Kerala', 'https://images.unsplash.com/photo-1544806383-534d25e7f6bc?w=800&q=80', 'image', 'Fort Kochi Chinese fishing nets', 1 FROM pkg1_id
UNION ALL SELECT id, 'Kerala', 'https://images.unsplash.com/photo-1621782540344-f01cbf8f1cb8?w=800&q=80', 'image', 'Varkala cliff beach sunset', 2 FROM pkg1_id
UNION ALL SELECT id, 'Kerala', 'https://images.unsplash.com/photo-1590080876063-22a9cb1f0d78?w=800&q=80', 'image', 'Kovalam lighthouse beach', 3 FROM pkg1_id
UNION ALL SELECT id, 'Coorg', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80', 'image', 'Coorg coffee plantation mist', 0 FROM pkg2_id
UNION ALL SELECT id, 'Coorg', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', 'image', 'Abbey Falls waterfall Coorg', 1 FROM pkg2_id
UNION ALL SELECT id, 'Coorg', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', 'image', 'Mountain sunrise Coorg', 2 FROM pkg2_id;

-- ─────────────────────────────────────────────────────────────────────────────
-- TESTIMONIALS
-- ─────────────────────────────────────────────────────────────────────────────
WITH pkg1_id AS (SELECT id FROM packages WHERE slug = 'kerala-coastal-escape'),
     pkg2_id AS (SELECT id FROM packages WHERE slug = 'coorg-highlands-retreat')
INSERT INTO testimonials (customer_name, photo_url, rating, quote, package_id, sort_order, is_published)
VALUES
  ('Priya Nair', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', 5,
   'The houseboat night in Alleppey was magical — stars reflecting on the still water, frogs serenading us. ENJOY Holidays thought of every detail. We felt like the backwaters were ours alone.',
   (SELECT id FROM pkg1_id), 0, true),
  ('Rahul & Deepa Sharma', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', 5,
   'Booked the Coorg package for our anniversary. The coffee estate bungalow was stunning — we woke up to mist between the trees and freshly brewed estate coffee. Absolutely perfect.',
   (SELECT id FROM pkg2_id), 1, true),
  ('Anand Krishnamurthy', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', 5,
   'As someone who has traveled extensively, I can say this was genuinely premium. The vehicle was spotless, the guide was knowledgeable, and every meal was authentic. No corners cut.',
   NULL, 2, true),
  ('Meenakshi Iyer', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', 5,
   'The Varkala cliff walk at golden hour — photos do not do it justice. If you want Kerala done right, book with ENJOY Holidays. We are already planning our Coorg trip next.',
   (SELECT id FROM pkg1_id), 3, true);
