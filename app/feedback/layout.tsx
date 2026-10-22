import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guest Feedback & Reviews — PADMA TOURS & TRAVELS",
  description:
    "Share your travel experience, photos, and star review with PADMA TOURS & TRAVELS (Madurai). Rate your journey and help fellow travellers plan their dream trip.",
  alternates: {
    canonical: absoluteUrl("/feedback"),
  },
  openGraph: {
    title: "Submit Guest Review — PADMA TOURS & TRAVELS",
    description:
      "Share your travel experience, photos, and rating with PADMA TOURS & TRAVELS.",
    url: absoluteUrl("/feedback"),
    type: "website",
    images: [{ url: absoluteUrl("/og-image.png"), width: 1200, height: 630, alt: "Padma Tours and Travels Guest Feedback" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Submit Guest Review — PADMA TOURS & TRAVELS",
    description:
      "Share your travel experience, photos, and rating with PADMA TOURS & TRAVELS.",
    images: [absoluteUrl("/og-image.png")],
  },
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
