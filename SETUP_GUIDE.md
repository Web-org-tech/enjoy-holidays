# 🪷 PADMA TOURS & TRAVELS — Complete Setup & Deployment Guide

Welcome to the **PADMA TOURS & TRAVELS** website and admin management platform. This guide provides step-by-step instructions to configure, run locally, and deploy the application to Vercel and Supabase.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Environment Configuration](#2-environment-configuration)
3. [Supabase Database Setup](#3-supabase-database-setup)
4. [Supabase Storage Buckets](#4-supabase-storage-buckets)
5. [Creating an Admin Account](#5-creating-an-admin-account)
6. [Running Locally](#6-running-locally)
7. [Deploying to Vercel](#7-deploying-to-vercel)
8. [Admin Portal Features Guide](#8-admin-portal-features-guide)

---

## 1. Prerequisites

Ensure you have installed:
- **Node.js**: `v18.17.0` or higher (recommended: Node 20 LTS)
- **npm**: `v9.0.0` or higher (or pnpm/yarn)
- **Supabase Account**: Free or Pro project at [supabase.com](https://supabase.com)
- **Vercel Account**: [vercel.com](https://vercel.com)

---

## 2. Environment Configuration

1. In the project root, create or edit `.env.local`:

```bash
# Supabase Public Keys
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Supabase Server-Only Secret (Bypasses RLS for protected admin mutations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Admin Configuration
ADMIN_EMAIL=nirmalharish1980@gmail.com

# Public Website & WhatsApp Configuration
NEXT_PUBLIC_SITE_URL=https://padmatoursandtravels.in
NEXT_PUBLIC_WHATSAPP_NUMBER=917010111256
```

> ⚠️ **Security Notice**: Never commit `SUPABASE_SERVICE_ROLE_KEY` to public Git repositories. It is only accessed on the Next.js server side.

---

## 3. Supabase Database Setup

### Fast Setup (One Click):
1. Open your Supabase Dashboard: `https://supabase.com/dashboard/project/<your-project-id>`.
2. Navigate to **SQL Editor** on the left navigation bar.
3. Open `supabase/full_schema_setup.sql`, copy all contents, paste into the SQL Editor, and click **Run**.
   *This automatically sets up all 9 tables, indexes, triggers, Row Level Security policies, storage buckets, and initial packages!*

### Step-by-Step Alternative:
If running migrations sequentially:
1. `supabase/migrations/001_initial_schema.sql` (Creates tables and initial singleton settings)
2. `supabase/migrations/002_rls_policies.sql` (Configures Row Level Security and Storage Buckets)
3. `supabase/migrations/003_seed_data.sql` (Inserts authentic packages, gallery, and reviews)

---

## 4. Supabase Storage Buckets

The platform includes a **Dual Image Uploader** that allows uploading files directly from your computer or pasting direct URLs.

The setup scripts automatically create and set public permissions for these 3 buckets:

| Bucket ID | Access | Allowed Formats | Description |
| :--- | :--- | :--- | :--- |
| `package-media` | **Public** | Images (JPG, PNG, WEBP, AVIF) | Package hero banners and day photo stops |
| `gallery` | **Public** | Images & Videos (MP4, WEBM) | Homepage hero background media & gallery |
| `avatars` | **Public** | Images (JPG, PNG, WEBP) | Testimonial & guest profile photos |

---

## 5. Creating an Admin Account

1. In your Supabase Dashboard, go to **Authentication** → **Users**.
2. Click **Add User** → **Create User**.
3. Set the email to your `ADMIN_EMAIL` (`nirmalharish1980@gmail.com`) and choose a secure password.
4. Check **Auto Confirm Email**.
5. Log in at `https://your-domain.com/admin/login` or `http://localhost:3000/admin/login`.

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

## 7. Deploying to Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** → **Project**.
3. Import this repository.
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` (`917010111256`)
   - `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-domain.vercel.app` or custom domain)
   - `ADMIN_EMAIL` (`nirmalharish1980@gmail.com`)
5. Click **Deploy**.
6. In Supabase Dashboard → **Authentication** → **URL Configuration**:
   - Add your Vercel deployment URL (e.g. `https://*.vercel.app`) to **Redirect URLs**.

---

## 8. Admin Portal Features Guide

The Admin Dashboard provides full control over the website:
- **Packages**: Add, edit, reorder, or archive holiday packages and daily tours with day-by-day stops.
- **Enquiries**: Review incoming customer leads, filter by status (New, Contacted, Converted), and export to CSV.
- **Gallery**: Upload photos or videos with destination tags (Madurai, Kerala, Coorg, etc.).
- **Testimonials**: Moderate and approve customer feedback and ratings.
- **Site Settings**: Customize hero headline, contact phone numbers, WhatsApp, office address, and social links.

---

## 📞 Support & Handover Information

- **Client**: PADMA TOURS & TRAVELS
- **Helpline**: +91 98659 87975
- **WhatsApp**: +91 70101 11256
- **Email**: nirmalharish1980@gmail.com
- **Office**: No: B19/3 Racecourse Colony, Opp. Old Passport Office, Government Quarters, Madurai - 625002
