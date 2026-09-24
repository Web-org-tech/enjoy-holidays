import type { Metadata } from "next";
import Image from "next/image";
import { getPublishedTestimonials } from "@/lib/supabase/queries";
import TestimonialsStrip from "@/components/home/TestimonialsStrip";
import { Award, Heart, Compass, Users } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Us — PADMA TOURS & TRAVELS (Est. 2004)",
  description:
    "Founded in 2004 in Madurai, PADMA TOURS & TRAVELS has delivered trusted daily tours, local sightseeing, and customized holiday packages across India for over two decades.",
};

const values = [
  { icon: Heart, title: "Crafted with Care", desc: "Every tour is planned with personal attention. We focus on comfort, safety, and authentic local experiences." },
  { icon: Compass, title: "20+ Years Local Expertise", desc: "Based in Madurai since 2004, our knowledge of temple timings, scenic routes, and local culture is unmatched." },
  { icon: Users, title: "24/7 Round-the-Clock Support", desc: "We are available 24 hours a day. Whether you need immediate vehicle assistance or have queries during your trip, we are a phone call away." },
  { icon: Award, title: "Transparent Pricing", desc: "Honest quotes with no hidden charges. Punctual pickups, clean vehicles, and professional, courteous drivers." },
];

export default async function AboutPage() {
  const testimonials = await getPublishedTestimonials();

  return (
    <>
      {/* Header */}
      <section
        className="pt-36 pb-16 grain-overlay"
        style={{ background: "var(--color-deep-teal)" }}
        aria-labelledby="about-page-heading"
      >
        <div className="container-site max-w-4xl">
          <span className="label text-[var(--color-secondary-light)] mb-3 block">✦ Who We Are</span>
          <h1 id="about-page-heading" className="display-xl text-white mb-5">
            Two Decades of Excellence. <br />
            <span className="italic text-[var(--color-secondary-light)]">Your Trusted Travel Companion.</span>
          </h1>
          <p className="body-lg text-white/70 max-w-2xl">
            PADMA TOURS &amp; TRAVELS was established in 2004 in the temple city of Madurai. Over 20 years, we have guided thousands of families, pilgrims, and explorers across Tamil Nadu and all of India.
          </p>
        </div>
      </section>

      {/* Story section */}
      <section className="py-20" aria-labelledby="story-heading">
        <div className="container-site max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="label text-[var(--color-primary)] mb-3 block">✦ Our Story</span>
              <h2 id="story-heading" className="display-lg text-[var(--color-text-primary)] mb-5">
                Serving Travelers Since 2004 from Madurai
              </h2>
              <div className="flex flex-col gap-4 body-md text-[var(--color-text-secondary)]">
                <p>
                  Founded in 2004 in Madurai, PADMA TOURS &amp; TRAVELS started with a clear commitment: to provide reliable, comfortable, and warm hospitality to every visitor exploring our sacred city and beyond.
                </p>
                <p>
                  From organizing daily departures to Rameswaram, Kanyakumari, and Kodaikanal, to offering detailed Madurai heritage and Meenakshi Amman Temple sightseeing, our services have grown to encompass customized tour packages across South India.
                </p>
                <p>
                  Operating 24 hours a day with an extensive fleet of well-maintained vehicles and experienced, courteous drivers, our mission remains the same: ensuring every journey is memorable, safe, and stress-free.
                </p>
              </div>
            </div>

            {/* Polaroid-style photo grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="polaroid">
                <div className="relative aspect-square overflow-hidden rounded-sm">
                  <Image
                    src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80"
                    alt="Kerala backwaters"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <p className="text-center text-xs text-gray-500 mt-3 font-sans">Alleppey, 2022</p>
              </div>
              <div className="polaroid polaroid-alt mt-8">
                <div className="relative aspect-square overflow-hidden rounded-sm">
                  <Image
                    src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&q=80"
                    alt="Coorg highlands"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <p className="text-center text-xs text-gray-500 mt-3 font-sans">Coorg, 2023</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        className="py-16"
        style={{ background: "var(--color-surface-alt)" }}
        aria-labelledby="values-heading"
      >
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="label text-[var(--color-primary)] mb-2 block">✦ What We Stand For</span>
            <h2 id="values-heading" className="display-lg text-[var(--color-text-primary)]">
              Our <span className="italic text-[var(--color-primary)]">Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-white"
                style={{ border: "1px solid var(--color-border)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(212,92,51,0.08)" }}
                >
                  <Icon size={22} style={{ color: "var(--color-primary)" }} />
                </div>
                <h3 className="font-bold text-[var(--color-text-primary)] mb-2 text-sm">{title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsStrip testimonials={testimonials} />

      <div className="h-20 md:h-0 block md:hidden" aria-hidden="true" />
    </>
  );
}
