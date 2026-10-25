import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guest Feedback & Reviews — PADMA TOURS & TRAVELS",
  description:
    "Share your travel experience, photos, and star review with PADMA TOURS & TRAVELS (Madurai). Rate your journey and help fellow travellers plan their dream trip.",
  alternates: {
    canonical: "https://padmatoursandtravels.in/feedback",
  },
  openGraph: {
    title: "Submit Guest Review — PADMA TOURS & TRAVELS",
    description:
      "Share your travel experience, photos, and rating with PADMA TOURS & TRAVELS.",
    url: "https://padmatoursandtravels.in/feedback",
    type: "website",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Padma Tours and Travels" }],
  },
  twitter: {
    card: "summary",
    title: "Submit Guest Review — PADMA TOURS & TRAVELS",
    description:
      "Share your travel experience, photos, and rating with PADMA TOURS & TRAVELS.",
    images: ["/logo.png"],
  },
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
