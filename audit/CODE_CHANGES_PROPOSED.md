# PROPOSED CODE CHANGES (NON-DESTRUCTIVE / REVIEW ONLY)

**Target Repository:** PADMA TOURS & TRAVELS (`padmacabs.in`)  
**Audit Reference:** `audit/AUDIT_REPORT.md`  
**Rule Compliance:** None of these changes have been applied. They are presented here with file paths, diff snippets, rationale, risk assessments, and rollback notes for human review and approval.

---

## 1. Issue SEO-01 & SEO-04: Fix Canonical Domain & MetadataBase in Root Layout

- **File Path:** [app/layout.tsx](file:///c:/Users/tamil/OneDrive/Desktop/FreeLancing/travels/travels%20website/app/layout.tsx)
- **Resolves:** `SEO-01` (Dead domain reference) and `SEO-04` (Missing sitewide canonicals)
- **Rationale:** The repository currently defaults `metadataBase` to `https://padmatoursandtravels.in`, a dead domain that fails DNS resolution. Setting `https://www.padmacabs.in` as the fallback and declaring default `alternates: { canonical: "./" }` immediately enables self-referencing canonical URLs across every page in the application, protecting against duplicate parameter indexing.

### Proposed Diff:
```diff
--- a/app/layout.tsx
+++ b/app/layout.tsx
@@ -24,8 +24,11 @@ const manrope = Manrope({
 });
 
 export const metadata: Metadata = {
-  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://padmatoursandtravels.in"),
+  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.padmacabs.in"),
+  alternates: {
+    canonical: "./",
+  },
   title: {
     default: "PADMA TOURS & TRAVELS — Daily Tours, Sightseeing & Packages (Since 2004)",
     template: "%s | PADMA TOURS & TRAVELS",
@@ -46,7 +49,7 @@ export const metadata: Metadata = {
   openGraph: {
     type: "website",
     locale: "en_IN",
-    url: "https://padmatoursandtravels.in",
+    url: "https://www.padmacabs.in",
     siteName: "PADMA TOURS & TRAVELS",
     images: [
```

- **Risk Assessment:** Low. Does not alter runtime logic; establishes canonical tags across all inherited routes.
- **Rollback Note:** Revert `app/layout.tsx` to commit `6638589`.

---

## 2. Issue SEO-02: Fix Sitemap & Robots Domain Sanitization

- **File Paths:** 
  - [app/robots.ts](file:///c:/Users/tamil/OneDrive/Desktop/FreeLancing/travels/travels%20website/app/robots.ts)
  - [app/sitemap.ts](file:///c:/Users/tamil/OneDrive/Desktop/FreeLancing/travels/travels%20website/app/sitemap.ts)
- **Resolves:** `SEO-02` (Preview host exposure and double slashes in sitemap)
- **Rationale:** When `NEXT_PUBLIC_SITE_URL` has a trailing slash (e.g. `https://enjoy-holidays.vercel.app/`), string interpolations like `${SITE_URL}/sitemap.xml` output double slashes `//sitemap.xml`. In addition, the default fallback must be `https://www.padmacabs.in`.

### Proposed Diff (`app/robots.ts`):
```diff
--- a/app/robots.ts
+++ b/app/robots.ts
@@ -1,6 +1,8 @@
 import type { MetadataRoute } from "next";
 
-const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://padmatoursandtravels.in";
+const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.padmacabs.in";
+const SITE_URL = rawUrl.replace(/\/+$/, "");
 
 export default function robots(): MetadataRoute.Robots {
   return {
```

### Proposed Diff (`app/sitemap.ts`):
```diff
--- a/app/sitemap.ts
+++ b/app/sitemap.ts
@@ -2,6 +2,8 @@ import { getAllPackageSlugs } from "@/lib/supabase/queries";
 import type { MetadataRoute } from "next";
 
-const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://padmatoursandtravels.in";
+const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.padmacabs.in";
+const SITE_URL = rawUrl.replace(/\/+$/, "");
 
 export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
   const slugs = await getAllPackageSlugs();
```

- **Risk Assessment:** Low. Ensures URLs in `sitemap.xml` and `robots.txt` are cleanly formatted without double slashes.
- **Rollback Note:** Revert changes to `app/robots.ts` and `app/sitemap.ts`.

---

## 3. Issue SEO-03: Eliminate Soft-404 on Invalid Package Slugs

- **File Path:** [app/packages/[slug]/page.tsx](file:///c:/Users/tamil/OneDrive/Desktop/FreeLancing/travels/travels%20website/app/packages/%5Bslug%5D/page.tsx)
- **Resolves:** `SEO-03` (Soft-404 on non-existent package pages)
- **Rationale:** When `generateMetadata()` returns a metadata object (`{ title: "Package Not Found" }`) instead of invoking `notFound()`, Next.js flushes an `HTTP/1.1 200 OK` header before streaming the not-found component. Calling `notFound()` inside `generateMetadata()` forces Next.js to emit a true `HTTP/1.1 404 Not Found` response.

### Proposed Diff:
```diff
--- a/app/packages/[slug]/page.tsx
+++ b/app/packages/[slug]/page.tsx
@@ -29,9 +29,9 @@ export async function generateStaticParams() {
 export async function generateMetadata({ params }: Params): Promise<Metadata> {
   const { slug } = await params;
   const pkg = await getPackageBySlug(slug);
-  if (!pkg) return { title: "Package Not Found" };
+  if (!pkg) notFound();
 
-  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://padmatoursandtravels.in";
+  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.padmacabs.in";
+  const siteUrl = rawUrl.replace(/\/+$/, "");
 
   return {
     title: pkg.seo_title ?? `${pkg.name} — ${pkg.duration_days}D/${pkg.duration_nights}N | PADMA TOURS & TRAVELS`,
```

- **Risk Assessment:** Low. Ensures search engines never index nonexistent package URLs.
- **Rollback Note:** Revert `app/packages/[slug]/page.tsx`.

---

## 4. Issue PERF-01: Remove Cookie Execution in RootLayout to Restore CDN Edge Caching

- **File Paths:**
  - [app/layout.tsx](file:///c:/Users/tamil/OneDrive/Desktop/FreeLancing/travels/travels%20website/app/layout.tsx)
  - `lib/supabase/public.ts` (New lightweight helper)
- **Resolves:** `PERF-01` (Severe 7.5s–10.5s TTFB across all pages)
- **Rationale:** `RootLayout` reads `cookies()` via `createServerSupabaseClient()`, opting the entire website into dynamic request-time SSR (`ƒ`) and disabling CDN edge caching (`Cache-Control: private, no-cache, no-store`). Public site settings (theme colors, contact info) are publicly readable and should use a simple anonymous client (`createClient(url, anonKey)`) without reading request cookies.

### Proposed Implementation:

**Step 1:** Create `lib/supabase/public.ts`:
```ts
import { createClient } from "@supabase/supabase-js";

// Public anonymous client — strictly for caching public site settings without cookies
export function createPublicSupabaseClient() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co").trim().split(/\s+/)[0];
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-key").trim().split(/\s+/)[0];

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
```

**Step 2:** Update `app/layout.tsx`:
```diff
--- a/app/layout.tsx
+++ b/app/layout.tsx
@@ -5,7 +5,7 @@ import "./globals.css";
 import TopNav from "@/components/layout/TopNav";
 import BottomNav from "@/components/layout/BottomNav";
 import Footer from "@/components/layout/Footer";
-import { createServerSupabaseClient } from "@/lib/supabase/server";
+import { createPublicSupabaseClient } from "@/lib/supabase/public";
 
 const dmSerifDisplay = DM_Serif_Display({
@@ -88,8 +88,8 @@ export const metadata: Metadata = {
 
 async function getSiteSettings() {
   try {
-    const supabase = await createServerSupabaseClient();
+    const supabase = createPublicSupabaseClient();
     const { data } = await supabase
       .from("site_settings")
       .select("theme_colors, contact_info")
       .single();
```

- **Risk Assessment:** Low. Admin actions and authenticated pages will continue using `createServerSupabaseClient()` with session cookies. Public layout will no longer block on request cookies.
- **Rollback Note:** Delete `lib/supabase/public.ts` and revert `app/layout.tsx`.

---

## 5. Issue SEO-01 & SEO-02: Fix Dead Domain in Contact, Feedback & Structured Data

- **File Paths:**
  - [app/contact/page.tsx](file:///c:/Users/tamil/OneDrive/Desktop/FreeLancing/travels/travels%20website/app/contact/page.tsx)
  - [app/feedback/layout.tsx](file:///c:/Users/tamil/OneDrive/Desktop/FreeLancing/travels/travels%20website/app/feedback/layout.tsx)
  - [lib/structured-data.ts](file:///c:/Users/tamil/OneDrive/Desktop/FreeLancing/travels/travels%20website/lib/structured-data.ts)
- **Resolves:** `SEO-01` (Dead domain canonical and schema references)
- **Rationale:** Replaces dead `padmatoursandtravels.in` references with `padmacabs.in` so that structured data and canonical links point to the actual live website.

### Proposed Diff (`app/contact/page.tsx`):
```diff
--- a/app/contact/page.tsx
+++ b/app/contact/page.tsx
@@ -10,13 +10,13 @@ export const metadata: Metadata = {
   description:
     "Get in touch with PADMA TOURS & TRAVELS in Madurai. Available 24 hours a day for daily tours, Madurai local sightseeing, cab bookings, and customized holiday packages across India. Call +91 98659 87975 or WhatsApp +91 70101 11256.",
   alternates: {
-    canonical: "https://padmatoursandtravels.in/contact",
+    canonical: "https://www.padmacabs.in/contact",
   },
   openGraph: {
     title: "Contact PADMA TOURS & TRAVELS (Madurai) — 24/7 Support",
     description:
       "Planning a tour, sightseeing, or car rental? Reach us anytime 24/7 via WhatsApp, Phone, or at our Madurai Racecourse Colony office.",
-    url: "https://padmatoursandtravels.in/contact",
+    url: "https://www.padmacabs.in/contact",
     type: "website",
     images: [{ url: "/logo.png", width: 512, height: 512, alt: "Padma Tours and Travels Madurai" }],
   },
```

### Proposed Diff (`lib/structured-data.ts`):
```diff
--- a/lib/structured-data.ts
+++ b/lib/structured-data.ts
@@ -1,6 +1,8 @@
 import type { Package, PackageWithDays } from "@/lib/supabase/types";
 
-const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://padmatoursandtravels.in";
+const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.padmacabs.in";
+const SITE_URL = rawUrl.replace(/\/+$/, "");
 const SITE_NAME = "PADMA TOURS & TRAVELS";
 
 // ─── LocalBusiness JSON-LD ────────────────────────────────────────────────────
```

- **Risk Assessment:** Low. Ensures Google associates LocalBusiness and ContactPage schemas with `padmacabs.in`.
- **Rollback Note:** Revert the modified files.

---

## 6. Issue SCH-01: Correct Testimonials Schema Rating Discrepancy

- **File Path:** [app/testimonials/page.tsx](file:///c:/Users/tamil/OneDrive/Desktop/FreeLancing/travels/travels%20website/app/testimonials/page.tsx)
- **Resolves:** `SCH-01` (Inaccurate `reviewCount` in AggregateRating schema)
- **Rationale:** Hardcoding `reviewCount: Math.max(testimonials.length, 25).toString()` produces a review count of `"25"` when 0 review objects exist in the schema, triggering schema validation mismatch penalties. The schema must dynamically output `testimonials.length.toString()`, or omit `aggregateRating` when zero published reviews exist.

### Proposed Diff:
```diff
--- a/app/testimonials/page.tsx
+++ b/app/testimonials/page.tsx
@@ -25,7 +25,7 @@ export default async function TestimonialsPage() {
     name: "PADMA TOURS & TRAVELS",
     aggregateRating: {
       "@type": "AggregateRating",
       ratingValue: "4.9",
-      reviewCount: Math.max(testimonials.length, 25).toString(),
+      reviewCount: testimonials.length.toString(),
       bestRating: "5",
       worstRating: "1",
     },
```

- **Risk Assessment:** Low. Accurately reflects published review count in schema.
- **Rollback Note:** Revert `app/testimonials/page.tsx`.

---

## 7. Issue P0-2: Block Vercel Preview Hosts from Search Indexing

- **File Path:** [next.config.mjs](file:///c:/Users/tamil/OneDrive/Desktop/FreeLancing/travels/travels%20website/next.config.mjs)
- **Resolves:** `P0-2` (`enjoy-holidays.vercel.app` indexed as duplicate content)
- **Rationale:** Injects `X-Robots-Tag: noindex, nofollow` on any response served from `vercel.app` hostnames.

### Proposed Diff:
```diff
--- a/next.config.mjs
+++ b/next.config.mjs
@@ -40,6 +40,14 @@ const nextConfig = {
     return [
       {
         source: "/:path*",
+        has: [
+          {
+            type: "host",
+            value: ".*\\.vercel\\.app",
+          },
+        ],
+        headers: [
+          {
+            key: "X-Robots-Tag",
+            value: "noindex, nofollow",
+          },
+        ],
+      },
+      {
+        source: "/:path*",
         headers: [
           {
             key: "X-Frame-Options",
```

- **Risk Assessment:** Low. Targets only preview/staging URLs on `.vercel.app`, leaving custom domains (`padmacabs.in`) indexable.
- **Rollback Note:** Revert `next.config.mjs`.

---

## 8. Issue SEC-02: Guard Privileged Admin Code

- **File Path:** [lib/supabase/admin.ts](file:///c:/Users/tamil/OneDrive/Desktop/FreeLancing/travels/travels%20website/lib/supabase/admin.ts)
- **Resolves:** `SEC-02` (Defense in depth against service role client leaking to browser bundles)
- **Rationale:** Adding `import "server-only";` ensures that if a developer ever accidentally imports `createAdminSupabaseClient` in a `"use client"` component, the build immediately aborts.

### Proposed Diff:
```diff
--- a/lib/supabase/admin.ts
+++ b/lib/supabase/admin.ts
@@ -1,3 +1,4 @@
+import "server-only";
 import { createClient } from "@supabase/supabase-js";
 
 // Service-role client — only for admin Server Actions, never exposed to browser
```

- **Risk Assessment:** Zero risk. Validates at build time.
- **Rollback Note:** Remove `import "server-only";` from `lib/supabase/admin.ts`.

---

## 9. Issue UX-01: Fix Headline Spacing in HeroSection

- **File Path:** [components/home/HeroSection.tsx](file:///c:/Users/tamil/OneDrive/Desktop/FreeLancing/travels/travels%20website/components/home/HeroSection.tsx)
- **Resolves:** `UX-01` (Concatenated text in H1 rendering "Where Will YouWander Next?")
- **Rationale:** When the headline string is split by `\n` and rendered into block elements, text extraction and search crawlers see "Where Will YouWander Next?" without whitespace between lines.

### Proposed Diff:
```diff
--- a/components/home/HeroSection.tsx
+++ b/components/home/HeroSection.tsx
@@ -124,7 +124,7 @@ export default function HeroSection(props: HeroSectionProps) {
               {i === 1 ? (
                 <span className="italic" style={{ color: "var(--color-secondary-light)" }}>
-                  {line}
+                  {" "}{line}
                 </span>
               ) : (
                 line
```

- **Risk Assessment:** Low. Fixes visual and semantic word boundary.
- **Rollback Note:** Revert `components/home/HeroSection.tsx`.

---

## 10. Proposed Metadata for Target Keyword Pages (Keyword Strategy)

- **Reference:** [`audit/KEYWORD_STRATEGY.md`](file:///c:/Users/tamil/OneDrive/Desktop/FreeLancing/travels/travels%20website/audit/KEYWORD_STRATEGY.md)
- **Goal:** Align primary keywords with strict 1:1 page mapping, natural on-page title tags (50–60 chars), meta descriptions (140–160 chars), H1 tags, and semantic H2 subheadings.
- **Rule Compliance:** Strictly proposed; not applied to runtime project files.

### 10.1 Proposed Diff: `app/page.tsx` (Homepage — "madurai travels")
```diff
--- a/app/page.tsx
+++ b/app/page.tsx
@@ -15,5 +15,5 @@
 export const metadata: Metadata = {
-  title: "PADMA TOURS & TRAVELS — Daily Tours, Sightseeing & Packages (Est. 2004)",
+  title: "PADMA TOURS & TRAVELS — Trusted Madurai Travels Since 2004",
   description:
-    "Trusted travel agency in Madurai since 2004. Daily tours, Madurai local sightseeing, temple circuits, and customized holiday packages across South India. Available 24 hours.",
+    "Premier travel agency in Madurai since 2004. Book daily sightseeing tours, outstation cabs, and South India holiday packages. 24/7 helpline: +91 98659 87975.",
 };
```
*Proposed Headings Structure:*
- **H1:** `Trusted Tours, Sightseeing & Travels in Madurai`
- **H2:** `Our Core Travel Services Across South India`
- **H2:** `Why Thousands of Families Trust Padma Tours Since 2004`
- **H2:** `Handcrafted Holiday Packages Departing from Madurai`

---

### 10.2 Proposed Diff: `app/packages/page.tsx` (Packages Catalog — "holiday packages from madurai")
```diff
--- a/app/packages/page.tsx
+++ b/app/packages/page.tsx
@@ -10,8 +10,8 @@
 export const metadata: Metadata = {
-  title: "Holiday Packages — Explore All Destinations",
+  title: "Holiday Packages from Madurai — South India Tour Circuits",
   description:
-    "Browse all handcrafted holiday packages across India. Filter by destination, duration, and budget. Book Kerala backwaters, Coorg coffee trails, Rajasthan safaris and more.",
+    "Handcrafted tour packages departing from Madurai. Explore pilgrimage circuits, hill stations, and coastal holidays across Tamil Nadu, Kerala, and beyond.",
   openGraph: {
-    title: "Holiday Packages | PADMA TOURS & TRAVELS",
+    title: "Holiday Packages from Madurai | PADMA TOURS & TRAVELS",
     description:
-      "Browse all handcrafted holiday packages across India. Filter by destination, duration, and budget.",
+      "Handcrafted tour packages departing from Madurai. Explore pilgrimage circuits, hill stations, and coastal holidays across Tamil Nadu, Kerala, and beyond.",
   },
@@ -58,6 +58,6 @@
           <h1
             id="packages-page-heading"
             className="display-xl text-white mb-3"
           >
-            Find Your Next{" "}
-            <span className="italic text-[var(--color-secondary-light)]">Adventure</span>
+            Handcrafted Tour &amp; Holiday Packages from Madurai
           </h1>
```
*Proposed Headings Structure:*
- **H1:** `Handcrafted Tour & Holiday Packages from Madurai`
- **H2:** `Popular Day Tours & Multi-Day Holiday Circuits`
- **H2:** `Filter by Destination, Duration, and Group Capacity`

---

### 10.3 Proposed Diff: `app/about/page.tsx` (About Us — "padma tours and travels madurai")
```diff
--- a/app/about/page.tsx
+++ b/app/about/page.tsx
@@ -10,5 +10,5 @@
 export const metadata: Metadata = {
-  title: "About Us — PADMA TOURS & TRAVELS (Est. 2004)",
+  title: "About Us — PADMA TOURS & TRAVELS (Madurai Est. 2004)",
   description:
-    "Founded in 2004 in Madurai, PADMA TOURS & TRAVELS has delivered trusted daily tours, local sightseeing, and customized holiday packages across India for over two decades.",
+    "Learn the story of PADMA TOURS & TRAVELS, founded in Madurai in 2004. Over two decades of excellence in daily tours, family holidays, and chauffeur safety.",
 };
@@ -40,3 +40,3 @@
           <h1 id="about-page-heading" className="display-xl text-white mb-5">
-            Two Decades of Excellence. <br />
-            <span className="italic text-[var(--color-secondary-light)]">Your Trusted Travel Companion.</span>
+            Serving Travellers Across India from Madurai Since 2004
           </h1>
```
*Proposed Headings Structure:*
- **H1:** `Serving Travellers Across India from Madurai Since 2004`
- **H2:** `Our Two-Decade Heritage in the Temple City`
- **H2:** `The Padma Standard: Courteous Chauffeurs & Clean Fleet`

---

### 10.4 Proposed Diff: `app/contact/page.tsx` (Contact — "padma travels madurai contact number")
```diff
--- a/app/contact/page.tsx
+++ b/app/contact/page.tsx
@@ -8,19 +8,19 @@
 export const metadata: Metadata = {
-  title: "Contact Us — PADMA TOURS & TRAVELS (Madurai • 24/7 Service)",
+  title: "Contact PADMA TOURS & TRAVELS Madurai — 24/7 Help & Cabs",
   description:
-    "Get in touch with PADMA TOURS & TRAVELS in Madurai. Available 24 hours a day for daily tours, Madurai local sightseeing, cab bookings, and customized holiday packages across India. Call +91 98659 87975 or WhatsApp +91 70101 11256.",
+    "Contact PADMA TOURS & TRAVELS in Madurai. Available 24/7 at Racecourse Colony office, by phone (+91 98659 87975), or on WhatsApp for tour bookings & cabs.",
   alternates: {
-    canonical: "https://padmatoursandtravels.in/contact",
+    canonical: "./",
   },
   openGraph: {
-    title: "Contact PADMA TOURS & TRAVELS (Madurai) — 24/7 Support",
+    title: "Contact PADMA TOURS & TRAVELS Madurai — 24/7 Help & Cabs",
     description:
-      "Planning a tour, sightseeing, or car rental? Reach us anytime 24/7 via WhatsApp, Phone, or at our Madurai Racecourse Colony office.",
-    url: "https://padmatoursandtravels.in/contact",
+      "Contact PADMA TOURS & TRAVELS in Madurai. Available 24/7 at Racecourse Colony office, by phone (+91 98659 87975), or on WhatsApp for tour bookings & cabs.",
+    url: "https://www.padmacabs.in/contact",
     type: "website",
     images: [{ url: "/logo.png", width: 512, height: 512, alt: "Padma Tours and Travels Madurai" }],
   },
 };
@@ -76,3 +76,3 @@
           <h1 id="contact-heading" className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
-            Let&apos;s Plan Your <span className="italic text-[#FBBF24]">Next Journey</span>
+            Get in Touch With PADMA TOURS &amp; TRAVELS (24/7 Support)
           </h1>
```
*Proposed Headings Structure:*
- **H1:** `Get in Touch With PADMA TOURS & TRAVELS (24/7 Support)`
- **H2:** `Visit Our Madurai Racecourse Colony Booking Office`
- **H2:** `Instant WhatsApp & Direct Telephone Reservation Desk`

---

### 10.5 Proposed Metadata for New Landing Pages (When Created)

#### A. `app/packages/madurai-to-rameswaram-one-day-tour/page.tsx`
```typescript
export const metadata: Metadata = {
  title: "Madurai to Rameswaram Tour Package — Daily Day Trip & Taxi", // 57 chars
  description:
    "Book private Madurai to Rameswaram tour package with driver. Visit Ramanathaswamy Temple, Pamban Bridge & Dhanushkodi. All-inclusive tolls & driver bata.", // 152 chars
};
// H1: Madurai to Rameswaram One-Day Tour Package & Cab Service
// H2: Same-Day Rameswaram & Dhanushkodi Tour Itinerary
// H2: Vehicle Fleet Options & Transparent All-Inclusive Fares
// H2: Rameswaram Temple Darshan & Coastal Sightseeing FAQs
```

#### B. `app/packages/madurai-to-kodaikanal-tour-package/page.tsx`
```typescript
export const metadata: Metadata = {
  title: "Madurai to Kodaikanal One Day Trip — Tour Package & Cab Hire", // 59 chars
  description:
    "Explore the Princess of Hill Stations with our Madurai to Kodaikanal one day trip. Visit Kodai Lake, Pillar Rocks & Silver Cascade with hill-expert chauffeurs.", // 155 chars
};
// H1: Madurai to Kodaikanal One-Day Tour & Private Cab Service
// H2: Kodaikanal Day Trip Sightseeing Highlights & Schedule
// H2: Hill-Trained Drivers & Mountain-Ready Fleet Rates
// H2: Planning Your Kodaikanal Day Excursion from Madurai
```

#### C. `app/packages/madurai-to-kanyakumari-tour-package/page.tsx`
```typescript
export const metadata: Metadata = {
  title: "Madurai to Kanyakumari Tour Package — Private Cab & Day Trip", // 58 chars
  description:
    "Private Madurai to Kanyakumari tour package via NH44. Visit Vivekananda Rock Memorial, Suchindram Temple & Sunset Point. Clean AC cabs and 24/7 assistance.", // 156 chars
};
// H1: Madurai to Kanyakumari Tour Package & Chauffeur Cab Hire
// H2: Kanyakumari Day Tour Route & Coastal Attractions
// H2: Dedicated Highway Fleet & Transparent Toll Pricing
// H2: Helpful Travel Advice for Visiting India's Southern Tip
```

#### D. `app/car-rental-madurai/page.tsx`
```typescript
export const metadata: Metadata = {
  title: "Madurai Car Rental with Driver — 24/7 Taxi & Cab Booking", // 56 chars
  description:
    "Reliable car rental in Madurai with professional driver. Hire Swift Dzire, Toyota Innova, and Tempo Traveller for local sightseeing and outstation journeys.", // 154 chars
};
// H1: Madurai Car Rental with Driver & Outstation Taxi Service
// H2: Our Chauffeur-Driven Vehicle Fleet & Seating Capacity
// H2: Transparent Local Hourly Packages & Outstation Tariffs
// H2: Frequently Asked Questions About Hiring Cabs in Madurai
```

#### E. `app/madurai-airport-taxi/page.tsx`
```typescript
export const metadata: Metadata = {
  title: "Madurai Airport Taxi — 24/7 Punctual Airport & Rail Cabs", // 55 chars
  description:
    "Pre-book your Madurai airport taxi (IXM) with flight tracking & zero surge fees. Reliable 24/7 transfers to Madurai city, Meenakshi Temple, and outstation.", // 152 chars
};
// H1: Madurai Airport Taxi Service & 24/7 Pickup Transfers
// H2: Punctual Madurai Airport (IXM) & Railway Station Drop Rates
// H2: Direct Airport-to-Outstation Routes (Rameswaram & Kodaikanal)
// H2: Airport Meet-and-Greet Guarantee & Booking FAQs
```
