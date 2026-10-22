import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/layout/TopNav";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/supabase/queries";
import { SITE_URL } from "@/lib/site";

const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-serif",
});

const manrope = Manrope({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "./",
  },
  title: {
    default: "PADMA TOURS & TRAVELS — Daily Tours, Sightseeing & Packages (Since 2004)",
    template: "%s | PADMA TOURS & TRAVELS",
  },
  description:
    "Trusted travel agency in Madurai since 2004. Offering daily tours, Madurai local sightseeing, temple circuits, and customized holiday packages across South India and Pan-India. 24/7 Service.",
  keywords: [
    "Padma Tours & Travels",
    "Madurai travel agency",
    "Madurai local sightseeing",
    "daily tours Madurai",
    "South India tour packages",
    "Tamil Nadu holiday packages",
    "Kerala tour packages",
    "Madurai car rental with driver",
  ],
  authors: [{ name: "PADMA TOURS & TRAVELS" }],
  creator: "PADMA TOURS & TRAVELS",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "PADMA TOURS & TRAVELS",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "PADMA TOURS & TRAVELS — 20+ Years of Travel Excellence",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "PADMA TOURS & TRAVELS — 20+ Years of Travel Excellence",
    description:
      "Daily tours, Madurai local sightseeing, and customized holiday packages across India. 24/7 service.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const themeColors = settings?.theme_colors as Record<string, string> | null;

  // Build inline CSS for dynamic theme overrides from admin settings
  const dynamicTheme = themeColors
    ? Object.entries(themeColors)
        .map(([key, value]) => `--color-${key}: ${value};`)
        .join(" ")
    : "";

  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${manrope.variable}`}
    >
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        {dynamicTheme && (
          <style
            id="dynamic-theme"
            dangerouslySetInnerHTML={{
              __html: `:root { ${dynamicTheme} }`,
            }}
          />
        )}
      </head>
      <body className="bg-cream font-sans antialiased">
        {/* Accessibility: skip to main content */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        {/* Desktop navigation */}
        <TopNav />

        {/* Main content with safe bottom padding on mobile for bottom navigation */}
        <main id="main-content" className="min-h-screen pb-24 md:pb-0">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Mobile bottom thumb nav */}
        <BottomNav />
      </body>
    </html>
  );
}
