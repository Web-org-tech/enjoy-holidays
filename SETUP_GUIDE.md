# 🌴 ENJOY Holidays — Complete Setup & Deployment Guide

Welcome to the **ENJOY Holidays** luxury travel platform. This guide provides step-by-step instructions to configure, run locally, and deploy the application to production.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Environment Configuration](#2-environment-configuration)
3. [Supabase Database Setup](#3-supabase-database-setup)
4. [Supabase Storage Buckets](#4-supabase-storage-buckets)
5. [Creating an Admin Account](#5-creating-an-admin-account)
6. [Running Locally](#6-running-locally)
7. [Building for Production](#7-building-for-production)
8. [Admin Portal Features Guide](#8-admin-portal-features-guide)

---

## 1. Prerequisites

Ensure you have installed:
- **Node.js**: `v18.17.0` or higher (recommended: Node 20 LTS)
- **npm**: `v9.0.0` or higher (or pnpm/yarn)
- **Supabase Account**: Free or Pro project at [supabase.com](https://supabase.com)

---

## 2. Environment Configuration

1. In the project root, create a file named `.env.local` (or copy `.env.example`):

```bash
# Supabase Public Keys
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Supabase Server-Only Secret (Bypasses RLS for protected admin mutations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Admin Configuration
ADMIN_EMAIL=admin@enjoyholidays.in

# Public Website & WhatsApp Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=918531807705
```

> ⚠️ **Security Notice**: Never commit `SUPABASE_SERVICE_ROLE_KEY` to public Git repositories. It is only accessed on the Next.js server side.

---

## 3. Supabase Database Setup

1. Open your Supabase Dashboard: `https://supabase.com/dashboard/project/<your-project-id>`.
2. Navigate to the **SQL Editor** on the left navigation bar.
3. Execute the migration scripts located in `supabase/migrations/` in order:

### A. Initial Schema (`001_initial_schema.sql`)
Creates the core tables:
- `packages` (handcrafted travel itineraries)
- `itinerary_days` (stops, activities, photos)
- `enquiries` (leads with honeypot spam protection)
- `testimonials` (guest reviews & moderation)
- `site_settings` (dynamic hero banner, contact details, social links)
- `gallery_items` (media showcase)

### B. Row Level Security & Policies (`002_rls_policies.sql`)
Sets up row-level security:
- Public visitors can view published packages, published testimonials, and public site settings.
- Only authenticated admins can create, modify, or delete data.

### C. Seed Data (`003_seed_data.sql` - Optional)
Seeds ready-to-use sample packages (Kerala Backwaters, Munnar Hills, Wayanad Wildlife) and authentic starter reviews.

---

## 4. Supabase Storage Buckets

The platform includes a **Dual Image Uploader** that allows uploading files directly from your computer or pasting direct URLs.

Ensure the following 3 storage buckets are created in your Supabase project under **Storage**:

| Bucket ID | Access | Allowed Formats | Description |
| :--- | :--- | :--- | :--- |
| `package-media` | **Public** | Images (JPG, PNG, WEBP, AVIF) | Package hero banners and day photo stops |
| `gallery` | **Public** | Images & Videos (MP4, WEBM) | Homepage hero background media & gallery |
| `avatars` | **Public** | Images (JPG, PNG, WEBP) | Testimonial & guest profile photos |

*Note: Bucket creation SQL statements are included at the end of `002_rls_policies.sql`.*

---

## 5. Creating an Admin Account

1. In your Supabase Dashboard, go to **Authentication** → **Users**.
2. Click **Add User** → **Create User**.
3. Set the email to your `ADMIN_EMAIL` (e.g. `admin@enjoyholidays.in`) and create a secure password.
4. Set **Auto Confirm Email** to checked.
5. In your user metadata, or simply by matching `ADMIN_EMAIL`, you will have full access to `/admin`.
6. Log in at `http://localhost:3000/admin/login`.

---

## 6. Running Locally

Install dependencies:
```bash
npm install
```

Start the Next.js local development server:
```bash
npm run dev
```

Open your browser at:
- **Public Site**: [http://localhost:3000](http://localhost:3000)
- **Tour Packages**: [http://localhost:3000/packages](http://localhost:3000/packages)
- **Guest Reviews**: [http://localhost:3000/testimonials](http://localhost:3000/testimonials)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 7. Building for Production

To test the production build locally or before deploying:

```bash
# 1. Typecheck and lint
npm run lint
npx tsc --noEmit

# 2. Compile production bundle
npm run build

# 3. Start production server
npm run start
```

### Deploying to Vercel
1. Push your repository to GitHub or GitLab.
2. Import the project into **Vercel**.
3. In Project Settings → **Environment Variables**, add the variables from `.env.local`.
4. Deploy!

---

## 8. Admin Portal Features Guide

### 🌟 1. Dynamic Homepage Hero Banner (`/admin/settings`)
- Change the main headline, subtitle, and CTA buttons.
- Upload an image or looping video file or paste a high-resolution URL to dynamically change the homepage hero background.

### 🗺️ 2. Package & Itinerary Builder (`/admin/packages/new` or `/admin/packages/[id]/edit`)
- **Dual Media Uploader**: Upload hero images and day photos directly or input image URLs.
- **Activity Icon Picker**: Choose from 40+ categorized travel icons (Transit, Stays, Dining, Nature, Adventure, Wellness) or type custom keywords.
- **Flexible Pricing**: Configure all-inclusive pricing (with food) and stays-only pricing.

### 💬 3. Customer Reviews Moderation (`/admin/testimonials`)
- **Public Review Submission**: Visitors can click "Write a Review" on `/testimonials`.
- **Pending Verification Queue**: Submitted reviews are held in the admin dashboard until you click **Approve & Publish**.
- **Manual Creation**: Admin can also manually add verified reviews with guest photos.

### 🔒 4. Lead Generation & Enquiries (`/admin/enquiries`)
- Customer enquiries from the contact form or package pages arrive in real-time with status updates (New, Contacted, Quoted, Booked, Closed).
- Protected by invisible bot honeypots and strict phone/email regex validation.
