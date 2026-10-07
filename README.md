# 🪷 PADMA TOURS & TRAVELS — Tourism Website & Admin Dashboard

A production-ready tourism platform for **PADMA TOURS & TRAVELS** (Madurai, Tamil Nadu), built with Next.js 14, Supabase, GSAP, and Tailwind CSS.

---

## ✨ Features

- **Signature Scroll Journey** — GSAP-animated journey timeline with vehicle icons following each day's route.
- **Supabase Backend** — Full management of packages, gallery, testimonials, enquiries, and site settings.
- **WhatsApp-First Enquiry Flow** — Pre-filled WhatsApp deep links on every package and call-to-action button (+91 70101 11256).
- **Pure Light-Theme Admin Panel** — Clean emerald-accented SaaS dashboard with package builder, CSV enquiry exports, and drag-and-drop media uploaders.
- **Guest Reviews & Feedback Flow** — Interactive review submission with direct WhatsApp sharing options.
- **Mobile-First Experience** — Bottom navigation bar, responsive drawer menus, sticky booking CTAs.
- **SEO & Structured Data** — Complete schema.org JSON-LD (TravelAgency, TouristTrip, ItemList, BreadcrumbList) optimized for search indexing.

---

## 🚀 Quick Start

### 1. Database Setup (Supabase)

1. Open your Supabase project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** -> Click **New query**.
3. Copy and run the contents of [`supabase/full_schema_setup.sql`](supabase/full_schema_setup.sql).
   *This automatically builds all 9 tables, indexes, RLS policies, storage buckets, and sample packages.*

### 2. Configure Environment

Copy `.env.local.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_WHATSAPP_NUMBER=917010111256
NEXT_PUBLIC_SITE_URL=https://padmatoursandtravels.in
ADMIN_EMAIL=nirmalharish1980@gmail.com
```

### 3. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🚢 Deploying to Vercel

1. Push this repository to GitHub.
2. Import project in [Vercel](https://vercel.com).
3. Set the environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - `NEXT_PUBLIC_SITE_URL`
   - `ADMIN_EMAIL`
4. Click **Deploy**.
5. In Supabase Dashboard → **Authentication → URL Configuration**, add your Vercel URL to Redirect URLs.

---

## 📞 Business Details

- **Business Name**: PADMA TOURS & TRAVELS
- **Tagline**: Crafting Unforgettable Journeys Since 2004
- **Phone**: +91 98659 87975
- **WhatsApp**: +91 70101 11256
- **Email**: nirmalharish1980@gmail.com
- **Office**: No: B19/3 Racecourse Colony, Opp. Old Passport Office, Government Quarters, Madurai - 625002
- **Hours**: 24/7 Round-the-Clock Service
