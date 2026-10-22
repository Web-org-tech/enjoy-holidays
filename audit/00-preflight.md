# Phase 0: Preflight Audit Record

**Date & Time:** 2026-10-22 11:02:00 IST  
**Auditor:** Senior Technical SEO Engineer, Next.js 14 Performance Specialist, Local SEO Consultant, Web Security Auditor  
**Workspace:** `c:\Users\tamil\OneDrive\Desktop\FreeLancing\travels\travels website`  
**Target Entity:** PADMA TOURS & TRAVELS  
**Target Live Host:** `https://padmacabs.in` (resolves and redirects to `https://www.padmacabs.in/`)  

---

## 1. Tooling & Environment Availability

| Tool / Capability | Status | Version / Details | Notes |
| :--- | :---: | :--- | :--- |
| **Operating System** | Available | Windows 11 (PowerShell 5.1 / 7) | Host environment verified |
| **Node.js runtime** | Available | `v24.13.0` | Verified via `node -v` |
| **npm package manager**| Available | `11.6.2` | Verified via `npm -v` |
| **cURL execution** | Available | `curl.exe` (Windows built-in) | HTTP/1.1 and HTTP/2 probe capable |
| **Network Egress** | Available | TCP 443 outbound to `216.198.79.1` (Vercel Edge Network) | Live HTTP probe confirmed |
| **Local Dependencies** | Installed | Next 14.2.16, React 18.3.1, Supabase SSR/JS | `node_modules` present and verified |
| **`npm run lint`** | Executable | ESLint 8.57.1 / `next lint` | Exited code 0, 0 warnings/errors |
| **`next build`** | Executable | Next.js 14.2.16 compiler | Compiles successfully; outputs static & dynamic route tables |
| **Live Site Reachability** | Reachable | `https://padmacabs.in` -> `https://www.padmacabs.in/` (200 OK) | Live response inspected |
| **Lighthouse CLI** | Available & Executed | Lighthouse CLI via `npx lighthouse https://www.padmacabs.in --output=json` | Headless Chrome executed; mobile audit completed. Scores: Performance: **76**, Accessibility: **96**, Best Practices: **100**, SEO: **100** |
| **PageSpeed Insights API/Web UI** | Available (External) | Google PageSpeed Insights web interface | External verification URL: `https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.padmacabs.in%2F` |
| **Headless Browser** | Available | `browser_subagent` / Chromium integration | Used for DOM verification |

---

## 2. Early Preliminary Indicators (Status: Suspected — Subject to Phase 2 Proof)

The following three observations were identified during initial discovery and are designated as **Suspected** until verified against Phase 2 live evidence logs:

1. **Suspected: Hardcoded `padmatoursandtravels.in` vs. Live `padmacabs.in`**  
   - *Preliminary observation:* Code inspection indicates references to `padmatoursandtravels.in`, while live traffic resolves to `padmacabs.in`. Full grep and live DOM comparison scheduled in Phase 2.
2. **Suspected: `enjoy-holidays.vercel.app` in `robots.txt` and `sitemap.xml`**  
   - *Preliminary observation:* Initial probe of `https://www.padmacabs.in/robots.txt` surfaced references to a Vercel preview domain. Exact line-by-line evidence and sitemap XML parsing scheduled in Phase 2.
3. **Suspected: Multi-Hop Redirect Chain on Root HTTP**  
   - *Preliminary observation:* `http://padmacabs.in` appears to redirect to `https://padmacabs.in/` before redirecting to `https://www.padmacabs.in/`. Header-by-header chain validation scheduled in Phase 2.

---

## 3. Needs Human Verification (Detailed Step-by-Step Procedures)

The following components cannot be programmatically validated without authenticated client ownership credentials. Exact steps for a human operator to verify each item are provided below:

### A. Google Search Console (GSC) Coverage & Crawl State
- **Why it cannot be verified programmatically:** GSC requires OAuth domain-ownership verification.
- **Exact Human Verification Steps:**
  1. Open [Google Search Console](https://search.google.com/search-console).
  2. Select property `padmacabs.in` (Domain property) or `https://www.padmacabs.in/` (URL-prefix).
  3. Navigate to **Indexing -> Pages**.
  4. Review the "Why pages aren’t indexed" table:
     - Check count for *"Duplicate without user-selected canonical"* (flag if `enjoy-holidays.vercel.app` URLs appear).
     - Check count for *"Soft 404"* (flag if `/packages/[slug]` URLs appear).
     - Check count for *"Alternate page with proper canonical tag"*.
  5. Navigate to **Indexing -> Sitemaps**:
     - Check whether `https://www.padmacabs.in/sitemap.xml` has been submitted and whether its status is "Success" or "Couldn't fetch".

### B. Google Business Profile (GBP) Local Alignment
- **Why it cannot be verified programmatically:** Google Business Profile management dashboard is external and authenticated.
- **Exact Human Verification Steps:**
  1. Open [Google Business Profile Manager](https://business.google.com/) for PADMA TOURS & TRAVELS.
  2. Under **Edit Profile -> Categories**:
     - Verify current primary and secondary business categories; consider adding **Tour Operator**, **Car Rental Agency**, and/or **Taxi Service** only if those services are actively offered by the business (do not assert current state without dashboard access).
  3. Under **Edit Profile -> Contact**:
     - Confirm **Business Name** matches brand operating name: **PADMA TOURS & TRAVELS**.
     - Confirm **Phone Number** is `+91 98659 87975`.
     - Confirm **Website URL** is set to `https://www.padmacabs.in/` (verify it does not point to `padmatoursandtravels.in` or `enjoy-holidays.vercel.app`).
  4. Under **Edit Profile -> Location**:
     - Confirm physical address matches: `No: B19/3 Racecourse Colony, Opp. Old Passport Office, Government Quarters, Madurai - 625002`.
     - Verify pin placement corresponds to latitude `9.9252`, longitude `78.1198`.
  5. Under **Hours**:
     - Confirm business hours match website service statements (e.g. 24 hours service).

### C. Supabase Production Row-Level Security (RLS) State
- **Why it cannot be verified programmatically:** Remote project `[REDACTED].supabase.co` is currently unreachable via API/DNS (project is paused or inactive on free tier) and active remote database toggles require Supabase project dashboard access.
- **Exact Human Verification Steps:**
  1. Log into the Supabase Dashboard for the project.
  2. Check project status (unpause project if paused due to 7 days of inactivity).
  3. Navigate to **Table Editor**.
  4. Select each table: `packages`, `package_days`, `day_activities`, `package_inclusions`, `package_exclusions`, `gallery_items`, `testimonials`, `enquiries`, `site_settings`.
  5. Click on **RLS** at the top right of each table:
     - Confirm that **"Row Level Security (RLS) is enabled"** displays an active green status.
     - Confirm that `enquiries` table permits anonymous `INSERT` (for lead forms) but strictly denies anonymous `SELECT`, `UPDATE`, or `DELETE`.

### D. Social Platform Sharing Scrapers (Cache Invalidation)
- **Why it cannot be verified programmatically:** Facebook and WhatsApp crawl via their own private CDN crawlers and cache link previews.
- **Exact Human Verification Steps:**
  1. Open the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).
  2. Enter `https://www.padmacabs.in/` and click **Debug**.
  3. Check the "Canonical URL" and "og:image" returned. Click **Scrape Again** to purge legacy previews.
  4. Open WhatsApp, paste `https://www.padmacabs.in/`, wait 3 seconds for the card preview to generate, and confirm the title and thumbnail match the brand.
