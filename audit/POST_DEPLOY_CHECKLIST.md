# Post-Deploy Verification Checklist: PADMA TOURS & TRAVELS

**Production Target:** `https://www.padmacabs.in`  
**Deployment Platform:** Vercel  
**Database:** Supabase  

This checklist must be performed immediately after the `seo-implementation` branch is merged into `main` and deployed to production.

---

## 1. Domain & Redirect Integrity

- [ ] **Apex to WWW 301 Redirect:**
  ```bash
  curl -I https://padmacabs.in
  ```
  *Expected:* `HTTP/2 301` or `308` redirecting to `https://www.padmacabs.in/`.

- [ ] **HTTP to HTTPS 301 Redirect:**
  ```bash
  curl -I http://www.padmacabs.in
  ```
  *Expected:* `HTTP/1.1 301 Moved Permanently` redirecting to `https://www.padmacabs.in/`.

- [ ] **Vercel Preview Host Indexing Protection:**
  - Inspect any preview deployment URL (e.g., `*.vercel.app`).
  - Verify `X-Robots-Tag: noindex, nofollow` header is present.

---

## 2. Robots.txt & Sitemap Inspection

- [ ] **Robots.txt Availability (`https://www.padmacabs.in/robots.txt`):**
  - Verify `User-Agent: *` allows `/`.
  - Verify disallows: `/admin`, `/api/`, `/auth/`.
  - Verify sitemap reference: `Sitemap: https://www.padmacabs.in/sitemap.xml`.

- [ ] **Sitemap Accuracy (`https://www.padmacabs.in/sitemap.xml`):**
  - Confirm all URLs begin strictly with `https://www.padmacabs.in/`.
  - Confirm zero occurrences of `localhost`, `127.0.0.1`, or `*.vercel.app`.
  - Confirm all published packages are listed with valid `lastmod` dates.

---

## 3. Google Search Console & Rich Results

- [ ] **Submit Sitemap in Google Search Console (GSC):**
  - Navigate to *GSC > Sitemaps*.
  - Submit `https://www.padmacabs.in/sitemap.xml`.
  - Verify status reports "Success" with all 13 discovered URLs.

- [ ] **Google Rich Results Test (`https://search.google.com/test/rich-results`):**
  - **Homepage (`https://www.padmacabs.in`):**
    - [ ] `TravelAgency` (Valid: name, address, telephone, geo, openingHours, rating).
    - [ ] `FAQPage` (Valid: 6 questions with accepted answers).
    - [ ] `WebSite` (Valid: search action and canonical identity).
  - **About Page (`https://www.padmacabs.in/about`):**
    - [ ] `AboutPage` and `BreadcrumbList`.
  - **Contact Page (`https://www.padmacabs.in/contact`):**
    - [ ] `ContactPage` and `BreadcrumbList`.
  - **Package Pages (`https://www.padmacabs.in/packages/madurai-heritage-temple-tour`):**
    - [ ] `TouristTrip` and `BreadcrumbList`.

- [ ] **Request Indexing:**
  - Run URL Inspection in GSC on `/` and `/packages`.
  - Click "Request Indexing" for rapid crawl prioritization.

---

## 4. Google Business Profile (GBP) Alignment

- [ ] **Website URL:** Ensure GBP listing website field is exactly `https://www.padmacabs.in` (including `https://` and `www`).
- [ ] **Address Match:** Ensure GBP address matches `No: B19/3 Racecourse Colony, Opp. Old Passport Office, Government Quarters, Madurai 625002`.
- [ ] **Phone Match:** Ensure primary phone is `+91 98659 87975`.
- [ ] **Operating Hours:** Confirm 24/7 hours are listed.

---

## 5. Performance & Asset Verification

- [ ] **Favicon & Apple Touch Icon:**
  - Check browser tab displays crisp 48x48 icon (5.9 KB).
  - Test iOS bookmark to ensure apple-touch-icon displays without distortion.

- [ ] **OpenGraph / WhatsApp Social Share Card:**
  - Share `https://www.padmacabs.in` in WhatsApp or test via Facebook Sharing Debugger.
  - Verify 1200x630 branded card appears with logo, "PADMA TOURS & TRAVELS", "Since 2004", and "Madurai".

- [ ] **Mobile Lighthouse Audit:**
  - Run Google PageSpeed Insights on `https://www.padmacabs.in`.
  - Verify Performance score is >= 85 and TTFB is <= 500 ms (leveraging static edge caching).

---

## 6. Uptime & Supabase Keep-Alive Guard

- [ ] **Uptime Monitoring:**
  - Set up free monitor (e.g., UptimeRobot, Better Uptime) targeting `https://www.padmacabs.in/packages` every 5–10 minutes.
  - This guarantees:
    1. Immediate alerts if any downstream service is unreachable.
    2. Continuous keep-alive traffic to prevent free-tier Supabase project auto-pausing.
