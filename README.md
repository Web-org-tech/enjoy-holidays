# ENJOY Holidays — Premium Tourism Website

A production-grade, cinematic tourism agency website built with Next.js 14, Supabase, GSAP, and Framer Motion.

## ✨ Features

- **Signature Scroll Journey** — GSAP-animated winding road with a vehicle following the path as you scroll through the itinerary
- **Supabase Backend** — All content (packages, gallery, testimonials, site settings) is fully admin-managed
- **WhatsApp-First Enquiry Flow** — Pre-filled WhatsApp deep links on every CTA
- **Admin Dashboard** — Full CRUD at `/admin` with Supabase Auth
- **Dynamic Theme** — Admin can change brand colors from the dashboard (applied as CSS custom properties at runtime)
- **Mobile-First** — Fixed bottom thumb nav, sticky enquiry CTA, safe-area padding
- **Accessible** — ARIA labels, reduced-motion fallback for all GSAP animations, focus rings, skip-to-content

---

## 🚀 Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Run the SQL Migrations

In Supabase Dashboard → **SQL Editor**, run these files **in order**:

1. `supabase/migrations/001_initial_schema.sql` — Creates all 9 tables
2. `supabase/migrations/002_rls_policies.sql` — Sets up Row Level Security + storage buckets
3. `supabase/migrations/003_seed_data.sql` — Seeds 2 demo packages (Kerala & Coorg)

### 3. Create Admin User

In Supabase Dashboard → **Authentication → Users**, click **Add user** and create your admin email/password. This is used to log into `/admin`.

### 4. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999   # 91 + 10 digit number
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 5. Run Locally

```bash
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, nav, footer)
│   ├── page.tsx                  # Homepage
│   ├── packages/
│   │   ├── page.tsx              # Package listing with filters
│   │   └── [slug]/page.tsx       # Package detail (THE JOURNEY PAGE)
│   ├── gallery/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── admin/                    # Auth-gated admin dashboard
│   ├── actions/                  # Server Actions
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── journey/                  # GSAP road animation components
│   ├── home/                     # Homepage sections
│   ├── packages/                 # Package card, grid, inclusions
│   ├── gallery/                  # Masonry gallery
│   ├── layout/                   # TopNav, BottomNav, Footer
│   ├── admin/                    # Admin sidebar
│   └── ui/                       # Design system (Button, Badge, etc.)
├── lib/
│   ├── supabase/                 # Client, server, admin, queries, types
│   ├── whatsapp.ts               # WhatsApp deep-link builder
│   └── structured-data.ts        # JSON-LD schema generators
├── supabase/
│   └── migrations/               # SQL schema, RLS, seed data
├── middleware.ts                  # Auth session refresh + route protection
└── tailwind.config.ts            # Custom design system tokens
```

---

## 🗄️ Database Schema

| Table | Purpose |
|---|---|
| `packages` | Holiday packages with hero media, pricing, vehicle type |
| `package_days` | Day-by-day itinerary (auto-generates road stops) |
| `day_activities` | Activities per day with icon types |
| `package_inclusions` | What's included in the package |
| `package_exclusions` | What's not included |
| `gallery_items` | Photos/videos per destination or package |
| `testimonials` | Customer reviews with star ratings |
| `enquiries` | Form submissions + WhatsApp click logs |
| `site_settings` | Homepage content, theme colors, contact info, WhatsApp number |

---

## 🎨 Admin Dashboard

Go to `/admin/login` and sign in with your Supabase Auth credentials.

### What you can manage:
- **Packages** — Create/edit packages with the day-by-day builder. Add as many days as you want — the road animation auto-adapts to however many days you define.
- **Gallery** — Upload photos/videos tagged by destination
- **Enquiries** — View all form submissions and WhatsApp clicks
- **Testimonials** — Add customer reviews with photos
- **Site Settings** — Change WhatsApp number, contact info, theme colors, hero content, featured packages

---

## 🚢 Deploying to Vercel

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` in Vercel project settings
4. Deploy — Vercel auto-detects Next.js

Add your production domain to Supabase:
- **Authentication → URL Configuration** → Add your Vercel URL to Allowed Origins

---

## 🔧 Customisation

### Swap Client Branding
1. Update `app/layout.tsx` metadata (site name, description, OG image)
2. Update `components/layout/TopNav.tsx` and `Footer.tsx` (logo SVG, brand name)
3. Update `app/globals.css` CSS custom properties (color palette)
4. Or — use the **Admin → Site Settings** color pickers to change theme colors at runtime

### Add a New Package
1. Go to `/admin/packages/new`
2. Fill in package details, upload hero image
3. Add days using the day builder — activities, photos, transition text
4. Publish → instantly live on the site

---

## ⚡ Performance Notes

- ISR (Incremental Static Regeneration) with `revalidate: 3600` on all data pages
- GSAP journey animation is dynamically imported (`{ ssr: false }`) — never blocks page load
- All images use `next/image` with responsive `sizes` attributes
- `prefers-reduced-motion` fallback: static vertical timeline replaces the GSAP animation

---

## 📞 Support

ENJOY Holidays — [hello@enjoyholidays.in](mailto:hello@enjoyholidays.in)
