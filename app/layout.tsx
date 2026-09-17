import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/layout/TopNav";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://enjoyholidays.in"),
  title: {
    default: "ENJOY Holidays — Premium Travel Experiences in India",
    template: "%s | ENJOY Holidays",
  },
  description:
    "Discover handcrafted holiday packages across India. From Kerala backwaters to Coorg highlands — we craft journeys, not just trips.",
  keywords: [
    "holiday packages India",
    "Kerala tour packages",
    "Coorg travel",
    "customized tours",
    "ENJOY Holidays",
    "luxury travel India",
  ],
  authors: [{ name: "ENJOY Holidays" }],
  creator: "ENJOY Holidays",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://enjoyholidays.in",
    siteName: "ENJOY Holidays",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ENJOY Holidays — Premium Travel Experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ENJOY Holidays — Premium Travel Experiences in India",
    description:
      "Handcrafted holiday packages across India. We craft journeys, not just trips.",
    images: ["/og-image.jpg"],
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
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

async function getSiteSettings() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("site_settings")
      .select("theme_colors, contact_info")
      .single();
    return data;
  } catch {
    return null;
  }
}

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
      {dynamicTheme && (
        <head>
          <style
            id="dynamic-theme"
            dangerouslySetInnerHTML={{
              __html: `:root { ${dynamicTheme} }`,
            }}
          />
        </head>
      )}
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
